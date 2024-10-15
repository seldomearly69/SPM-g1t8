
import os
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from app import app, db

with app.app_context():
    current = datetime.now().split()
    if current[1][:2] == "05":
        period = "PM"
    else:
        period = "AM"
    
    