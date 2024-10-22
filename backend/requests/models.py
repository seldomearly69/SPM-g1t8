from app import db
from sqlalchemy import func

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
    reporting_manager = db.Column(db.Integer, db.ForeignKey('users.staff_id'))
    role = db.Column(db.Integer, db.ForeignKey('roles.role_id'))
    password = db.Column(db.String(255), nullable=False)

class RequestModel(db.Model):
    __tablename__ = 'requests'
    request_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    requesting_staff = db.Column(db.Integer, db.ForeignKey('users.staff_id'))
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    day = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(4), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    approving_manager = db.Column(db.Integer, db.ForeignKey('users.staff_id'))
    created_at = db.Column(db.Date, nullable = False, default=func.current_date())
    reason = db.Column(db.String(300),nullable=True)
    remarks = db.Column(db.String(300),nullable=True)

    def __repr__(self):
        return f"<RequestModel(request_id={self.request_id}, requesting_staff={self.requesting_staff}, year={self.year}, month={self.month}, day={self.day}, type='{self.type}', status='{self.status}', approving_manager={self.approving_manager}, remarks='{self.remarks}')>"

class File(db.Model):
    __tablename__ = 'files'
    file_key = db.Column(db.String(100), primary_key = True)
    file_name = db.Column(db.String(100),nullable=False)

class FileRequestAssoc(db.Model):
    __tablename__ = 'file_request_assoc'
    file_key = db.Column(db.String(100), db.ForeignKey('files.file_key'), primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('requests.request_id'), primary_key=True)

class LeaveModel(db.Model):
    __tablename__ = 'leaves'
    leave_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    requesting_staff = db.Column(db.Integer, db.ForeignKey('users.staff_id'))
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    day = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(4), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')