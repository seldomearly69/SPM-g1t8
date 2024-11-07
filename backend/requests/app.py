from collections import defaultdict
from flask import Flask, jsonify, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_graphql import GraphQLView
from sqlalchemy import or_
import graphene, boto3
from graphene_sqlalchemy import SQLAlchemyObjectType
import os, json, ast, datetime, sys
from flask_cors import CORS
from graphene_file_upload.scalars import Upload
from graphene_file_upload.flask import FileUploadGraphQLView
from amqp_connection import *


days_in_month = {
    1: 31,   # January
    2: 28,   # February
    3: 31,   # March
    4: 30,   # April
    5: 31,   # May
    6: 30,   # June
    7: 31,   # July
    8: 31,   # August
    9: 30,   # September
    10: 31,  # October
    11: 30,  # November
    12: 31   # December
}

app = Flask(__name__)
CORS(app)

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name='ap-southeast-2'  # Replace with your region
)

BUCKET_NAME = 'spmbucket123'  # Replace with your S3 bucket name

POSTGRES_USER=os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD=os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB=os.getenv("POSTGRES_DB")

app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@db:5432/{POSTGRES_DB}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

connection = create_connection()
channel = connection.channel()
#if the exchange is not yet created, exit the program
if not check_exchange(channel, exchangename, exchangetype):
    print("\nCreate the 'Exchange' before running this microservice. \nExiting the program.")
    sys.exit(0)  # Exit with a success status


@app.before_request
def check_amqp_connection():
    global connection, channel
    if connection is None or connection.is_closed:
        connection = create_connection()
        channel = connection.channel()
    return

from models import *
# Custom Scalar for JSON
class JSON(graphene.Scalar):
    """
    Custom scalar to handle JSON objects.
    """
    @staticmethod
    def serialize(value):
        # This is called when returning data from a resolver
        return value

    @staticmethod
    def parse_literal(node):
        if isinstance(node, ast.StringValue):
            return json.loads(node.value)

    @staticmethod
    def parse_value(value):
        # This is called when parsing a literal value
        return value
    
class OwnSchedule(graphene.ObjectType):
    # staff_id = graphene.Int()
    # role = graphene.Int()
    # reporting_manager = graphene.Int()
    month = graphene.Int()
    year = graphene.Int()
    schedule = graphene.Field(JSON)  # Use JSON for flexibility

class Availability(graphene.ObjectType):
    name = graphene.String()
    type = graphene.String()
    department = graphene.String()
    availability = graphene.String()
    is_pending = graphene.String()

class DaySchedule(graphene.ObjectType):
    date = graphene.String()
    type = graphene.String()
    available_count = graphene.Field(JSON)
    availability = graphene.List(Availability)

class TeamSchedule(graphene.ObjectType):
    reporting_manager = graphene.Int()
    team_count = graphene.Int()
    team_schedule = graphene.List(DaySchedule)  # A list of schedules for each team member

class DepartmentSchedule(graphene.ObjectType):
    department_name = graphene.String()
    dept_schedule = graphene.List(TeamSchedule)


class Manager(graphene.ObjectType):
    staff_id = graphene.Int()
    position = graphene.String()
    name = graphene.String()

class ManagerList(graphene.ObjectType):
    director_name = graphene.String()
    manager_list = graphene.List(Manager)

class OverallSchedule(graphene.ObjectType):
    overall_schedule = graphene.List(DaySchedule)

class OverallAvailability(graphene.ObjectType):
    overall_availability = graphene.List(JSON)

class Leave(graphene.ObjectType):
    date = graphene.String()
    availability = graphene.String()
    type = graphene.String()
    is_pending = graphene.Boolean()

class Query1(graphene.ObjectType):

    own_schedule = graphene.Field(
        OwnSchedule, 
        month=graphene.Int(),
        year=graphene.Int(),
        staff_id = graphene.Int()
    )

    team_schedule = graphene.Field(
        TeamSchedule,
        month=graphene.Int(),
        year=graphene.Int(),
        day=graphene.Int(),
        staff_id = graphene.Int()
    )

    manager_list = graphene.Field(
        ManagerList,
        staff_id = graphene.Int(required=True)
    )

    department_schedule = graphene.Field(
        DepartmentSchedule, 
        month=graphene.Int(), 
        year=graphene.Int(), 
        staff_id=graphene.Int(),
        team_managers = graphene.List(graphene.Int)
    ) # Add department schedule query (Shawn)

    overall_schedule = graphene.Field(
        OverallSchedule,
        month=graphene.Int(), 
        year=graphene.Int(),
        day = graphene.Int()
    )

    overall_availability = graphene.Field(
        OverallAvailability,
        month = graphene.Int(),
        year = graphene.Int()
    )

    own_leaves = graphene.Field(
        graphene.List(Leave),
        staff_id = graphene.Int(),
        month = graphene.Int(),
        year = graphene.Int()
    )
    
    def resolve_own_schedule(self, info, month, year, staff_id):
        # Extract the staff_id from the request context (if the user is authenticated and it's available)
        # Here, we'll assume you pass `staff_id` in the request for simplicity.
        return resolve_own_schedule(month, year, staff_id)

    def resolve_team_schedule(self, info, month, year, day, staff_id):
        return resolve_team_schedule(month, year, day, staff_id)
    
    def resolve_manager_list(self,info,staff_id,):
        return resolve_manager_list(staff_id)

    def resolve_overall_schedule(self,info,month,year,day):
        return resolve_overall_schedule(month,year,day)
    
    def resolve_overall_availability(self,info,month,year):
        return resolve_overall_availability(month,year)
    
    def resolve_own_leaves(self,info,staff_id,month,year):
        return resolve_own_leaves(staff_id,month,year)

    
schedule_schema = graphene.Schema(query=Query1)

### SCHEMA 2 (get_requests)
class Request(graphene.ObjectType):
    request_id = graphene.Int()
    requesting_staff_name = graphene.String()
    department = graphene.String()
    date = graphene.String()
    type = graphene.String()
    status = graphene.String()
    reason = graphene.String()
    remarks = graphene.String()
    files = graphene.List(graphene.String)
    created_at = graphene.String()

class FileType(graphene.ObjectType):
    file_key = graphene.String()
    file_name = graphene.String()

class FileLink(graphene.ObjectType):
    file_key = graphene.String()
    file_link = graphene.String()

class OwnRequests(graphene.ObjectType):
    approving_manager = graphene.String()
    requests = graphene.List(Request)

class TransferRequestGraphene(graphene.ObjectType):
    request_id = graphene.Int()
    requesting_manager_id = graphene.Int()
    requesting_manager_name = graphene.String()
    target_manager_id = graphene.Int()
    target_manager_name = graphene.String()
    status = graphene.String()
    reason = graphene.String()

class DateTypeInput(graphene.InputObjectType):
    date = graphene.String(required=True)
    type = graphene.String(required=True)

class Query2(graphene.ObjectType):
    own_requests = graphene.Field(
        OwnRequests,
        staff_id = graphene.Int()
    )

    request = graphene.Field(
        Request,
        request_id = graphene.Int()
    )

    subordinates_request = graphene.Field(
       graphene.List(Request),
       staff_id = graphene.Int()
    )

    file_link = graphene.Field(
        FileLink,
        file_key = graphene.String()
    )

    transfer_options = graphene.Field(
        graphene.List(Manager),
        staff_id=graphene.Int(required=True)
    )

    transfer_requests = graphene.Field(
        graphene.List(TransferRequestGraphene),
        staff_id = graphene.Int(required=True),
        status = graphene.String(required=False)
    )

    def resolve_own_requests(self, info, staff_id):
        return resolve_own_requests(staff_id)
    
    def resolve_request(self, info, request_id):
        return resolve_request(request_id)
    
    def resolve_subordinates_request(self,info,staff_id):
        return resolve_subordinates_request(staff_id)

    def resolve_file_link(self,info,file_key):
        return resolve_file_link(file_key)
    
    def resolve_transfer_options(self,info,staff_id):
        return resolve_transfer_options(staff_id)
    
    def resolve_transfer_requests(self,info,staff_id, status=None):
        return resolve_transfer_requests(staff_id,status)

# Define Mutations
class CreateRequest(graphene.Mutation):
    class Arguments:
        staff_id = graphene.Int(required=True)
        reason = graphene.String(required=False)
        remarks = graphene.String(required=False)
        date_type = graphene.List(DateTypeInput, required=True)
        files = graphene.List(Upload, required=False)

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, staff_id, date_type ,files = None, reason=None, remarks=None):

        requesting_staff = User.query.filter(User.staff_id == staff_id).first()
        manager = requesting_staff.reporting_manager
        f_keys = []
        if files:
            
            for f in files:
                filekey = f.filename.split(".")
                filekey.insert(1, str(datetime.datetime.now()))
                filekey = filekey[0] + filekey[1] + "." + filekey[2]

                # Upload the file to S3
                s3_client.upload_fileobj(
                    f,
                    BUCKET_NAME,
                    str(filekey)
                )

                file = File(file_key = filekey, file_name = f.filename)
                db.session.add(file)
                db.session.commit()

                f_keys.append(file.file_key)
            print(f_keys)

        for dt in date_type:    
            d = dt["date"].split("-")
            
            r = RequestModel(
                requesting_staff=staff_id,
                year=d[0],
                month=d[1],
                day=d[2],
                type=dt["type"],
                status="pending",
                approving_manager=manager,
                reason=reason,
                remarks=remarks
            )
    
            db.session.add(r)
            db.session.commit()


            # rid = r.request_id
            for k in f_keys:
                assoc = FileRequestAssoc(file_key = k, request_id = r.request_id)
                db.session.add(assoc)
                db.session.commit()
                

        # except Exception as e:
        #     return CreateRequest(success = False, message = str(e))
        notification = requesting_staff.staff_fname + " " + requesting_staff.staff_lname + " has submitted a wfh request at " + str(datetime.datetime.now())
        publish_to_broker(notification, "New WFH request", User.query.filter(User.staff_id == manager).first().email , channel)

        return CreateRequest(success=True, message="Request created successfully")

class AcceptRejectRequest(graphene.Mutation):
    class Arguments:
        request_id = graphene.Int(required=True)
        new_status = graphene.String(required=True)
        remarks = graphene.String(required = False)

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, request_id, new_status, remarks = None):
        r = RequestModel.query.filter(RequestModel.request_id == request_id).first()
        if not r:
            return AcceptRejectRequest(success = False, message="Request not found")

        type = "WFH request"
        if r.status == "pending_withdrawal":
            type += " withdrawal"

        if r.status == "pending":
            r.status = new_status
        elif r.status == "pending_withdrawal":
            if new_status == "approved":
                r.status = "withdrawn"
            elif new_status == "rejected":
                r.status = "rejected"
        elif r.status == "approved" and new_status == "rejected":
            r.status = "rejected"

        if remarks:
            r.remarks = remarks
        try:
            db.session.commit()
            
            notification = f"Your {type} for {r.year}/{r.month}/{r.day} {r.type} has been {new_status}"
            publish_to_broker(notification, f"{type} {new_status}", User.query.filter(User.staff_id == r.requesting_staff).first().email , channel)

            return AcceptRejectRequest(success = True, message="Request updated successfully")
        except Exception as e:
            db.session.rollback()  # Rollback in case of error
            return AcceptRejectRequest(success = False, message=e)


class WithdrawPendingRequest(graphene.Mutation):
    class Arguments:
        request_id = graphene.Int(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, request_id):
        r = RequestModel.query.filter(RequestModel.request_id == request_id).first()
        if not r:
            return WithdrawPendingRequest(success = False, message="Request not found")
        
        if r.status == "approved" or r.status == "rejected":
            return WithdrawApprovedRequest(success = False, message=f"Request is already {r.status}")

        r.status = "withdrawn"
        try:
            db.session.commit()
            return WithdrawPendingRequest(success = True, message="Request withdrawn successfully")
        except Exception as e:
            db.session.rollback()  # Rollback in case of error
            return WithdrawPendingRequest(success = False, message=e)

class WithdrawApprovedRequest(graphene.Mutation):
    class Arguments:
        request_id = graphene.Int(required=True)
        new_reason = graphene.String(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, request_id, new_reason):
        r = RequestModel.query.filter(RequestModel.request_id == request_id).first()
        if not r:
            return WithdrawApprovedRequest(success = False, message="Request not found")
        
        if r.status == "pending":
            return WithdrawApprovedRequest(success = False, message="Request is still pending")
        
        r.status = "pending_withdrawal"
        r.reason = new_reason
        try:
            db.session.commit()
            requesting_staff = User.query.filter(User.staff_id==r.requesting_staff).first()
            notification = requesting_staff.staff_fname + " " + requesting_staff.staff_lname + " has submitted a wfh request withdrawal at " + str(datetime.datetime.now())
            publish_to_broker(notification, "New WFH request withdrawal", User.query.filter(User.staff_id == r.approving_manager).first().email , channel)
            return WithdrawApprovedRequest(success = True, message="Request withdrawn successfully")
        except Exception as e:
            db.session.rollback()  # Rollback in case of error
            return WithdrawApprovedRequest(success = False, message=e)
        
class RequestForTransfer(graphene.Mutation):
    class Arguments:
        requesting_manager = graphene.Int(required=True)
        target_manager = graphene.Int(required=True)
        reason = graphene.String(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, requesting_manager, target_manager, reason):
        check = User.query.filter(User.reporting_manager==target_manager,User.away_manager!=None).first()

        if check:
            return RequestForTransfer(success = False, message="Target manager already has extra responsiblity")
        check = User.query.filter(User.staff_id==requesting_manager).first().away_manager

        if check:
            return RequestForTransfer(success = False, message="Requesting manager already has extra responsiblity")

        r = TransferRequest(requesting_manager=requesting_manager,target_manager=target_manager,status="pending",reason=reason)

        try:
            db.session.add(r)
            db.session.commit()
            m = User.query.filter(User.staff_id==requesting_manager).first()
            notification = m.staff_fname + " " + m.staff_lname + " has requested to transfer responsibility to you at " + str(datetime.datetime.now())
            publish_to_broker(notification, "Responsibility transfer request", User.query.filter(User.staff_id == target_manager).first().email , channel)
            return RequestForTransfer(success = True, message="Transfer request submitted successfully")
        except Exception as e:
            db.session.rollback()  # Rollback in case of error
            return RequestForTransfer(success = False, message=e)
        
class AcceptRejectTransferRequest(graphene.Mutation):
    class Arguments:
        request_id = graphene.Int(required=True)
        new_status = graphene.String(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, request_id, new_status):
        r = TransferRequest.query.filter(TransferRequest.request_id == request_id).first()

        if not r:
            return AcceptRejectTransferRequest(success = False, message="Request not found")

        if new_status == "accepted":

            subordinates = User.query.filter(User.reporting_manager==r.requesting_manager).all()
            for s in subordinates:
                s.away_manager = s.reporting_manager
                s.reporting_manager = r.target_manager
                db.session.add(s)
            
        r.status = new_status
        db.session.add(r)
        try:
            db.session.commit()
            
            notification = f"Your transfer request has been {new_status}"
            publish_to_broker(notification, f"Transfer request {new_status}", User.query.filter(User.staff_id == r.requesting_manager).first().email , channel)

            return AcceptRejectTransferRequest(success = True, message="Transfer Request updated successfully")
        except Exception as e:
            db.session.rollback()  # Rollback in case of error
            return AcceptRejectTransferRequest(success = False, message=e)

class RevertTransfer(graphene.Mutation):
    class Arguments:
        request_id = graphene.Int(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, request_id):
        r = TransferRequest.query.filter(TransferRequest.request_id == request_id).first()
        if not r:
            return RevertTransfer(success = False, message="Request not found")

        if r.status == "accepted":

            subordinates = User.query.filter(User.away_manager==r.requesting_manager).all()
            for s in subordinates:
                
                s.reporting_manager = s.away_manager
                s.away_manager = None
                db.session.add(s)
            
            r.status = "reverted"
            db.session.add(r)
        
        else:
            return RevertTransfer(success = False, message="Request pending or rejected")

        try:
            db.session.commit()
            requesting_manager = User.query.filter(User.staff_id == r.requesting_manager).first()
            target_manager = User.query.filter(User.staff_id == r.target_manager).first()

            notification = f"Your transfer request has been reverted. Your subordinates' requests are now going to {target_manager.staff_fname} {target_manager.staff_lname}."
            publish_to_broker(notification, f"Transfer request reverted", requesting_manager.email , channel)
            notification = f"Transfer request reverted. You are no longer taking requests from {requesting_manager.staff_fname} {requesting_manager.staff_lname}'s subordinates."
            publish_to_broker(notification, f"Transfer request reverted", target_manager.email , channel)

            return RevertTransfer(success = True, message="Transfer reverted successfully")
        except Exception as e:
            db.session.rollback()  # Rollback in case of error
            return RevertTransfer(success = False, message=e)

class Mutation1(graphene.ObjectType):
    create_request = CreateRequest.Field()
    accept_reject_request = AcceptRejectRequest.Field()
    withdraw_pending_request = WithdrawPendingRequest.Field()
    withdraw_approved_request = WithdrawApprovedRequest.Field()
    request_for_transfer = RequestForTransfer.Field()
    accept_reject_transfer_request = AcceptRejectTransferRequest.Field()
    revert_transfer = RevertTransfer.Field()

# Schema for the second endpoint
requests_schema = graphene.Schema(query=Query2,mutation=Mutation1)

# Set up GraphQL endpoint
app.add_url_rule('/schedule', view_func=GraphQLView.as_view('graphql1', schema=schedule_schema, graphiql=True))

app.add_url_rule('/requests', view_func=FileUploadGraphQLView.as_view('graphql2', schema=requests_schema, graphiql=True))

def resolve_manager_list(staff_id):
    user = User.query.filter(User.staff_id == staff_id).first()
    if user.position != "Director":
        return resolve_manager_list(user.reporting_manager)
    m_list = User.query.filter(User.reporting_manager == staff_id, User.role == 3).all()
    return {
        "director_name": user.staff_fname + " " + user.staff_lname,
        "manager_list": [{"staff_id":m.staff_id, "position": m.position, "name": m.staff_fname + " " + m.staff_lname} for m in m_list]
    }


def resolve_transfer_options(staff_id):
    user = User.query.filter(User.staff_id == staff_id).first()
    if user.position == "Director":
        options = User.query.filter(User.position == "Director",User.staff_id!=user.staff_id).all()
    else:
        options = User.query.filter(User.role == 3, User.dept==user.dept, User.staff_id!=user.staff_id)

    return [{"staff_id":o.staff_id, "position": o.position, "name": o.staff_fname + " " + o.staff_lname} for o in options]

def resolve_overall_availability(month,year):
    total = User.query.count()
    overall_availability = []
    for i in range(1,days_in_month[month]+1):
        for type in ["AM","PM"]:
            overall_availability.append({
                "date": f"{year:04d}-{month:02d}-{i:02d}",
                "availability":total - RequestModel.query.filter(
                    RequestModel.month == month,
                    RequestModel.year == year,
                    RequestModel.day == i,
                    or_(RequestModel.type == type, RequestModel.type=="FULL"),
                    RequestModel.status.in_(['approved', 'pending'])
                ).count(),
                "type":type
            })


    return {"overall_availability": overall_availability}

def resolve_overall_schedule(month,year,day):
    filters = [
        RequestModel.month == month,
        RequestModel.year == year,
        RequestModel.day == day,
        RequestModel.status.in_(['approved', 'pending'])
    ]
    
    employees = User.query.all()
    # Query the database using the filters
    requests = RequestModel.query.filter(*filters).all()
    print("Reqeusts: " + str(requests))
    # Create a mapping of requests by staff member and day
    schedules_by_staff = {u.staff_id : {"AM": None, "PM": None} for u in employees}
    for request in requests:
        if request.type == "AM" or request.type == "PM":
            schedules_by_staff[request.requesting_staff][request.type] = request
        elif request.type == "FULL":
            schedules_by_staff[request.requesting_staff]["AM"] = request
            schedules_by_staff[request.requesting_staff]["PM"] = request
    print(schedules_by_staff)

    overall_schedule = []
    print(schedules_by_staff)
    for d in range(day,day+1):
        for period in ["AM","PM"]:

            overall_availability = []
            count = len(employees)
            
            for member in employees:
                request = schedules_by_staff[member.staff_id][period]
                if request:
                    count -= 1
                    availability = "wfh"
                    if request.status == "pending":
                        is_pending = True
                    else:
                        
                        is_pending = False
                else:
                    availability = "office"
                    is_pending = False
                    
                overall_availability.append({
                    "name": member.staff_fname + " " + member.staff_lname,
                    "type": period,
                    "department": member.dept,
                    "availability": availability,
                    "is_pending": is_pending
                })

            overall_schedule.append({
                "date": f"{year:04d}-{month:02d}-{d:02d}",
                "type": period,
                "available_count": {"office": count, "wfh": len(employees)-count},
                "availability": overall_availability
            })
    return {
        "overall_schedule": overall_schedule
    }

def resolve_own_schedule(month, year, staff_id):

    # Query all requests for the given month, year, and staff_id
    requests = RequestModel.query.filter( 
        RequestModel.month == month,
        RequestModel.year == year,
        RequestModel.requesting_staff == staff_id,
        RequestModel.status.in_(['approved', 'pending'])
    ).all()
    print(f"Requests for staff_id={staff_id}, month={month}, year={year}: {requests}")
    # Create a mapping of request days to request details, distinguishing between AM, PM, and FULL
    requests_by_day = defaultdict(lambda: {"AM": None, "PM": None, "FULL": None})
    print(requests_by_day)
    for request in requests:
        if request.type == "AM" or request.type == "PM":
            requests_by_day[request.day][request.type] = request
        elif request.type == "FULL":
            requests_by_day[request.day]["FULL"] = request
    print(requests_by_day)
    # Create the schedule based on the number of days in the month
    schedule = []
    days_in_current_month = days_in_month[month]

    # Populate the schedule with requests and handle cases for AM/PM
    for day in range(1, days_in_current_month + 1):
        date_str = f"{year:04d}-{month:02d}-{day:02d}"
        day_requests = requests_by_day[day]
        print(day_requests)
        # If neither AM nor PM requests, add a default "None" for the day
        if not day_requests["AM"] and not day_requests["PM"]:
            schedule.append({
                "date": date_str,
                "availability": "Office",
                "type": "FULL",
                "is_pending": False
            })
        # Handle FULL day request
        elif day_requests["FULL"]:
            schedule.append({
                "date": date_str,
                "availability": "wfh",  # Assuming FULL day means office
                "type": "FULL",
                "is_pending": False if day_requests["FULL"].status == "approved" else True
            })
        else:
            # Handle AM request if it exists
            schedule.append({
                "date": date_str,
                "availability": "wfh" if day_requests["AM"] else "Office",  # Assuming AM request means WFH
                "type": "AM",
                "is_pending": True if day_requests["AM"] and day_requests["AM"].status == "pending" else False
            })
            schedule.append({
                "date": date_str,
                "availability": "wfh" if day_requests["PM"] else "Office",  # Assuming PM request means WFH
                "type": "PM",
                "is_pending": True if day_requests["PM"] and day_requests["PM"].status == "pending" else False
            })
                

            

    # Return the structured JSON as a Python dict (Graphene will handle conversion to JSON)
    return {
        "month": month,
        "year": year,
        "schedule": schedule
    }

def resolve_team_schedule(month, year,day, staff_id):
    # Get all approved requests for the team members in the given month and year

    user = User.query.filter(User.staff_id == staff_id).first()
    is_away = (User.query.filter(User.away_manager==staff_id)).first() != None
    if user.role == 3 or user.position == "Director" or user.position == "MD":
        print("staff id: " + str(user.staff_id))
        if is_away:
            team_members = User.query.filter(or_(User.away_manager == user.staff_id, User.staff_id == user.staff_id)).all()
        else:
            team_members = User.query.filter(or_(User.reporting_manager == user.staff_id, User.staff_id == user.staff_id)).all()
    else:
        if is_away:
            team_members = User.query.filter(User.away_manager == user.reporting_manager).all()
        else:
            team_members = User.query.filter(User.reporting_manager == user.reporting_manager).all()

    print(team_members)
    # Conditionally add the `day` filter only if it's provided
    filters = [
        RequestModel.month == month,
        RequestModel.year == year,
        RequestModel.status.in_(['approved', 'pending']),
        or_(
            RequestModel.approving_manager == user.staff_id,
            RequestModel.requesting_staff == user.staff_id
        ) if user.role == 3 or user.position == "Director" or user.position == "MD" else RequestModel.approving_manager == user.reporting_manager
    ]
    
    # Only add the day filter if `day` is provided
    if day:
        filters.append(RequestModel.day == day)

    # Query the database using the filters
    requests = RequestModel.query.filter(*filters).all()
    print("Reqeusts: " + str(requests))
    # Create a mapping of requests by staff member and day
    if day:
        schedules_by_staff = {u.staff_id : {"AM": None, "PM": None} for u in team_members}
        for request in requests:
            if request.type == "AM" or request.type == "PM":
                schedules_by_staff[request.requesting_staff][request.type] = request
            elif request.type == "FULL":
                schedules_by_staff[request.requesting_staff]["AM"] = request
                schedules_by_staff[request.requesting_staff]["PM"] = request
    else:
        schedules_by_staff = {u.staff_id : {d: {"AM": None, "PM": None} for d in range(1,32)} for u in team_members}
    
        for request in requests:
            if request.type == "AM" or request.type == "PM":
                schedules_by_staff[request.requesting_staff][request.day][request.type] = request
            elif request.type == "FULL":
                schedules_by_staff[request.requesting_staff][request.day]["AM"] = request
                schedules_by_staff[request.requesting_staff][request.day]["PM"] = request
    print(schedules_by_staff)
    # Create the team schedule
    team_schedule = []
    print(schedules_by_staff)
    if day:
        r = range(day,day+1)
    else:
        r = range(1,days_in_month[month]+1)
    for d in r:
        for period in ["AM","PM"]:

            team_availability = []
            count = len(team_members)
            
            for member in team_members:
                if day:
                    request = schedules_by_staff[member.staff_id][period]
                else:
                    request = schedules_by_staff[member.staff_id][d][period]
                if request:
                    count -= 1
                    availability = "wfh"
                    if request.status == "pending":
                        is_pending = True
                    else:
                        
                        is_pending = False
                else:
                    availability = "office"
                    is_pending = False
                    
                team_availability.append({
                    "name": member.staff_fname + " " + member.staff_lname,
                    "type": period,
                    "department": member.dept,
                    "availability": availability,
                    "is_pending": is_pending
                })

            team_schedule.append({
                "date": f"{year:04d}-{month:02d}-{d:02d}",
                "type": period,
                "available_count": {"office": count, "wfh": len(team_members)-count},
                "availability": team_availability
            })
    return {
        "reporting_manager" : user.staff_id if user.role ==3 or user.position == "Director" or user.position == "MD" else user.reporting_manager,
        "team_count": len(team_members),
        "team_schedule": team_schedule
    }


def resolve_own_requests(staff_id):
    requests = RequestModel.query.filter(RequestModel.requesting_staff == staff_id).all()
    manager = User.query.filter(User.staff_id == User.query.filter(User.staff_id == staff_id).first().reporting_manager).first()
    manager = manager.staff_fname + " " + manager.staff_lname
    ret = []
    for r in requests:
        files = FileRequestAssoc.query.filter(FileRequestAssoc.request_id == r.request_id).all()
        files = [f.file_key for f in files]
        
        u = User.query.filter(User.staff_id == r.requesting_staff).first()
        ret.append({
            "request_id": r.request_id,
            "date": f"{r.year:04d}-{r.month:02d}-{r.day:02d}",
            "requesting_staff_name": u.staff_fname + " " + u.staff_lname,
            "department": u.dept,
            "type": r.type,
            "status": r.status,
            "reason": r.reason,
            "remarks": r.remarks,
            "files" : files,
            "created_at": r.created_at
        })

    return {
        "approving_manager": manager,
        "requests": ret
    }
    
def resolve_request(request_id):
    r = RequestModel.query.filter(RequestModel.request_id == request_id).first()
    if r:
        files = FileRequestAssoc.query.filter(FileRequestAssoc.request_id == r.request_id).all()
        files = [f.file_key for f in files]
        return {
            "request_id": r.request_id,
            "date": f"{r.year:04d}-{r.month:02d}-{r.day:02d}",
            "created_at": r.created_at,
            "type": r.type,
            "status": r.status,
            "reason": r.reason,
            "remarks": r.remarks,
            "files": files
        }
    
    return None

def resolve_subordinates_request(staff_id):
    requests = RequestModel.query.filter(RequestModel.approving_manager == staff_id).all()
    ret = []
    for r in requests:
        files = FileRequestAssoc.query.filter(FileRequestAssoc.request_id == r.request_id).all()
        files = [f.file_key for f in files]
        requesting_staff = User.query.filter(User.staff_id == r.requesting_staff).first()
        ret.append({
        "request_id": r.request_id,
        "requesting_staff_name": requesting_staff.staff_fname + " " + requesting_staff.staff_lname,
        "department": requesting_staff.dept,
        "date": f"{r.year:04d}-{r.month:02d}-{r.day:02d}",
        "created_at" : r.created_at,
        "type": r.type,
        "status": r.status,
        "reason": r.reason,
        "remarks": r.remarks,
        "files": files
    })

    return ret

def resolve_file_link(file_key):
    return {"file_key": file_key, "file_link": 
                s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': BUCKET_NAME, 'Key': file_key},
                ExpiresIn=3600
            )}

def resolve_own_leaves(staff_id,month,year):
    print(type(Leave))
    leaves = LeaveModel.query.filter(LeaveModel.requesting_staff==staff_id,LeaveModel.month==month,LeaveModel.year==year).all()
    leaves = [{"date": f"{l.year}-{l.month}-{l.day}", "availability": "Leave", "type": l.type, "is_pending": l.status == "pending"} for l in leaves]

    return leaves

def resolve_transfer_requests(staff_id, status=None):
    r_list = []
    # Add transfer requests where the requesting manager is the specified staff
    names = {}
    filters = [
        or_(TransferRequest.requesting_manager == staff_id,TransferRequest.target_manager == staff_id)
    ]
    if status:
        filters.append(TransferRequest.status==status)
    for r in TransferRequest.query.filter(*filters).all():
        if r.requesting_manager not in names:
            u = User.query.filter(User.staff_id==r.requesting_manager).first()
            names[r.requesting_manager] = u.staff_fname + " " + u.staff_lname
        if r.target_manager not in names:
            u = User.query.filter(User.staff_id==r.target_manager).first()
            names[r.target_manager] = u.staff_fname + " " + u.staff_lname

        r_list.append(
            {
                "request_id": r.request_id,
                "requesting_manager_id": r.requesting_manager,
                "requesting_manager_name": names[r.requesting_manager],
                "target_manager_id": r.target_manager,
                "target_manager_name": names[r.target_manager],
                "status": r.status,
                "reason": r.reason
            }
            
        )


    return r_list

@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()  # This removes the session, releasing the connection

if __name__ == '__main__':

    app.run(host='0.0.0.0', port=5002, debug=True)