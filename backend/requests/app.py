from collections import defaultdict
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_graphql import GraphQLView
from sqlalchemy import or_
import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
import os, json, ast
from flask_cors import CORS

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

POSTGRES_USER=os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD=os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB=os.getenv("POSTGRES_DB")

app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@db:5432/{POSTGRES_DB}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Role(db.Model):
    __tablename__ = 'roles'
    role_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)

class User(db.Model):
    __tablename__ = 'users'
    staff_id = db.Column(db.Integer, primary_key=True)
    staff_fname = db.Column(db.String(50), nullable=False)
    staff_lname = db.Column(db.String(50), nullable=False)
    dept = db.Column(db.String(50), nullable=False)
    position = db.Column(db.String(50), nullable=False)
    country = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    reporting_manager = db.Column(db.Integer, db.ForeignKey('users.Staff_ID'))
    role = db.Column(db.Integer, db.ForeignKey('roles.role_id'))
    password = db.Column(db.String(255), nullable=False)

class RequestModel(db.Model):
    __tablename__ = 'requests'
    request_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    requesting_staff = db.Column(db.Integer, db.ForeignKey('users.Staff_ID'))
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    day = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(4), nullable=False)
    status = db.Column(db.String(8), nullable=False, default='pending')
    approving_manager = db.Column(db.Integer, db.ForeignKey('users.Staff_ID'))
    remarks = db.Column(db.String(300))

class Request(SQLAlchemyObjectType):
    class Meta:
        model = RequestModel

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

class Query(graphene.ObjectType):

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
        director_id = graphene.Int(),
    )

    department_schedule = graphene.Field(
        DepartmentSchedule, 
        month=graphene.Int(), 
        year=graphene.Int(), 
        staff_id=graphene.Int(),
        team_managers = graphene.List(graphene.Int)
    ) # Add department schedule query (Shawn)

    # Add resolver for department schedule (Shawn)
    def resolve_department_schedule(self, info, month, year, staff_id, team_managers=None):
        return resolve_department_schedule(month, year, staff_id, team_managers)
    
    def resolve_own_schedule(self, info, month, year, staff_id):
        # Extract the staff_id from the request context (if the user is authenticated and it's available)
        # Here, we'll assume you pass `staff_id` in the request for simplicity.
        return resolve_own_schedule(month, year, staff_id)

    def resolve_team_schedule(self, info, month, year, day, staff_id):
        return resolve_team_schedule(month, year, day, staff_id)
    
    def resolve_manager_list(self,info,director_id):
        return resolve_manager_list(director_id)

schema = graphene.Schema(query=Query)

# Set up GraphQL endpoint
app.add_url_rule('/get_schedule', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

def resolve_manager_list(director_id):
    user = User.query.filter(User.staff_id == director_id).first()
    if user.position != "Director":
        raise Exception("User is not a director. This endpoint is for directors only")
    m_list = User.query.filter(User.reporting_manager == director_id, User.role == 3).all()
    return {
        "director_name": user.staff_fname + " " + user.staff_lname,
        "manager_list": [{"staff_id":m.staff_id, "position": m.position, "name": m.staff_fname + " " + m.staff_lname} for m in m_list]
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
    return retrieve_team_schedule(user,month,year,day)
   

def retrieve_team_schedule(user,month,year,day):
    if user.role == 3 or user.position == "Director" or user.position == "MD":
        print("staff id: " + str(user.staff_id))
        team_members = User.query.filter(or_(User.reporting_manager == user.staff_id, User.staff_id == user.staff_id)).all()
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

def resolve_department_schedule(month, year, staff_id, team_managers=None):
    user = User.query.filter(User.staff_id == staff_id).first()
    if user.position != "Director":
        raise Exception("User is not a director. This endpoint is for directors only")

    if not team_managers:
        team_managers = User.query.filter(User.reporting_manager==staff_id).all()
    else:
        team_managers = User.query.filter(User.staff_id.in_(team_managers)).all()
        print("team_managers:" +  str(team_managers))


    return {
        "department_name": user.dept,
        "dept_schedule": [retrieve_team_schedule(m,month,year) for m in team_managers]
    }



if __name__ == '__main__':

    app.run(host='0.0.0.0', port=5002, debug=True)