import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
import os, time, sys
import hashlib
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)


POSTGRES_USER=os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD=os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB=os.getenv("POSTGRES_DB")

print(POSTGRES_USER)
print(POSTGRES_PASSWORD)
print(POSTGRES_DB)

def connect_to_db():
    max_retries = 30
    retries = 0

    while retries < max_retries:
        try:
            conn = psycopg2.connect(
                dbname=POSTGRES_DB,
                user=POSTGRES_USER,
                password=POSTGRES_PASSWORD,
                host="db",
                port=5432
            )
            return conn
        except Exception as e:
            print(f"Database not ready yet. Retrying... ({retries}/{max_retries})")
            retries += 1
            time.sleep(1)
            print(str(e))
    print("Failed to connect to the database after retries. Exiting.")
    sys.exit(1)

conn = connect_to_db()

@app.route('/view_schedule', methods=["POST"])
def view_schedule():
    cur = conn.cursor()

    # Get employee ID and optionally the month from the request
    data = request.get_json()
    staff_id = data["staff_id"]  # Refers to the Staff_ID in the `users` table

    # Validate if the user exists
    user_query = "SELECT Staff_ID FROM users WHERE Staff_ID = %s"
    cur.execute(user_query, (staff_id,))
    user_result = cur.fetchone()

    if not user_result:
        return jsonify({"error": "User does not exist"}), 404

    # If a month is provided, use it; otherwise default to the current month
    month = data.get("month")
    year = data.get("year", datetime.now().year)  # Use current year if not provided

    if not month:
        month = datetime.now().month

    # Calculate the start and end dates for the month
    start_date = datetime(year, month, 1)
    next_month = start_date.replace(day=28) + timedelta(days=4)  # Get the first day of next month
    end_date = next_month - timedelta(days=next_month.day)  # Get the last day of the current month

    # Query to get the employee's schedule for the month (assuming a 'schedules' table exists)
    query = """
    SELECT work_date, status, period 
    FROM schedules 
    WHERE staff_id = %s 
    AND work_date BETWEEN %s AND %s;
    """
    
    cur.execute(query, (staff_id, start_date, end_date))
    result = cur.fetchall()

    # Convert the results into a list of dictionaries
    schedule = []
    for row in result:
        work_date, status, period = row
        schedule.append({
            "date": work_date.strftime('%Y-%m-%d'), #TO-EDIT BASED ON DATABASE
            "status": status,  # 'in office', 'on leave', 'WFH', 'pending'
            "period": period   # 'AM', 'PM', 'Full Day'
        })

    # Return the schedule as JSON
    return jsonify(schedule), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)