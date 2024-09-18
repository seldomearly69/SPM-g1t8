from collections import defaultdict
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_graphql import GraphQLView
import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
import os

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


class ScheduleType(graphene.ObjectType):
    staff_id = graphene.Int()
    role = graphene.Int()
    reporting_manager = graphene.Int()
    month = graphene.Int()
    year = graphene.Int()
    schedule = graphene.Field(graphene.JSONString)  # Use JSON for flexibility

class Query(graphene.ObjectType):
    own_schedule = graphene.Field(ScheduleType, month=graphene.Int(), year=graphene.Int(), staff_id = graphene.Int())

    def resolve_own_schedule(self, info, month, year, staff_id):
        # Extract the staff_id from the request context (if the user is authenticated and it's available)
        # Here, we'll assume you pass `staff_id` in the request for simplicity.
        return resolve_own_schedule(month, year, staff_id)

schema = graphene.Schema(query=Query)

# Set up GraphQL endpoint
app.add_url_rule('/get_schedule', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

def resolve_own_schedule(month, year, staff_id):

    # Query all requests for the given month, year, and staff_id
    requests = RequestModel.query.filter( 
        RequestModel.month == month,
        RequestModel.year == year,
        RequestModel.requesting_staff == staff_id,
        RequestModel.status == 'approved'
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
                "type": "FULL"
            })
        # Handle FULL day request
        elif day_requests["FULL"]:
            schedule.append({
                "date": date_str,
                "availability": "office",  # Assuming FULL day means office
                "type": "FULL"
            })
        else:
            # Handle AM request if it exists
            schedule.append({
                "date": date_str,
                "availability": "wfh" if day_requests["AM"] else "Office",  # Assuming AM request means WFH
                "type": "AM"
            })
            schedule.append({
                "date": date_str,
                "availability": "wfh" if day_requests["PM"] else "Office",  # Assuming PM request means WFH
                "type": "PM"
            })
                

            

    # Return the structured JSON as a Python dict (Graphene will handle conversion to JSON)
    return {
        "month": month,
        "year": year,
        "schedule": schedule
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)