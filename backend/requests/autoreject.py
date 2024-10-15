import os
from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from app import app, db, RequestModel

log_file_path = "/var/log/cron.log"
def log_message(message):
    with open(log_file_path, "a") as log_file:
        log_file.write(f"{datetime.now()}: {message}\n")

with app.app_context():
    try:
        current = datetime.now()
        log_message(f"Starting job at {current.hour} hour.")
        
        if current.hour == 6:
            time_type = "AM"
            current = (current + timedelta(days=1)).date().isoformat().split("-")
        elif current.hour == 23:
            current = (current + timedelta(days=2)).date().isoformat().split("-")
            time_type = "PM"
        else:
            log_message("Invalid time for running the job.")
            exit()
        
        log_message(f"Time type is {time_type}.")
        
        requests = RequestModel.query.filter(
            RequestModel.year == int(current[0]),
            RequestModel.month == int(current[1]),
            RequestModel.day == int(current[2]),
            RequestModel.type == time_type,
            RequestModel.status == "pending"
        ).all()
        
        log_message(f"Found {len(requests)} pending requests to reject.")

        # Reject all pending requests
        for r in requests:
            r.status = "rejected"
            r.remarks = "Auto-rejected"
        
        db.session.commit()
        log_message("Successfully updated all pending requests.")
        
    except Exception as e:
        log_message(f"Error: {str(e)}")
