import psycopg2
from unittest.mock import MagicMock
from flask import Flask, request, jsonify
from flask_cors import CORS
import os, time, sys
import hashlib

app = Flask(__name__)
CORS(app)


POSTGRES_USER=os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD=os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB=os.getenv("POSTGRES_DB")
FLASK_ENV = os.getenv("FLASK_ENV", "development")

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

# Only connect to the real database if not in testing mode
if FLASK_ENV != "testing":
    conn = connect_to_db()
else:
    conn = None  # conn will be mocked in unit tests

@app.route('/authenticate', methods = ["POST"])
def authenticate():
    try:
        cur = conn.cursor()
        
        try:
            data = request.get_json()
            email = data["email"]
            password = data["password"]
        except:
            return jsonify({"Error": "Missing required fields"}), 400

        sha256_hash = hashlib.sha256()
        sha256_hash.update(password.encode('utf-8'))

        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        result = cur.fetchone()
        if result and sha256_hash.hexdigest() == result[10]:
            return jsonify({
                "staff_id": result[0],
                "position": result[4],
                "name": result[1] + " " + result[2],
                "email": result[6],
                "reporting_manager": result[7],
                "role": result[9]
            }), 200
        elif result:
            return jsonify({"Error": "Wrong password"}), 403
        else:
            return jsonify({"Error": "Email does not exist"}), 404
    except:
        return jsonify({"Error": "An error occurred during authentication."}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)