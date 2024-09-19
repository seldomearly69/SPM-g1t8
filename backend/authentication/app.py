import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
import os, time, sys
import hashlib

app = Flask(__name__)
CORS(app)


POSTGRES_USER=os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD=os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB=os.getenv("POSTGRES_DB")

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

@app.route('/authenticate', methods = ["POST"])
def authenticate():
    cur = conn.cursor()
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    sha256_hash = hashlib.sha256()
    sha256_hash.update(password.encode('utf-8'))

    cur.execute("SELECT password FROM users WHERE email = %s", (email,))
    result = cur.fetchone()

    if result and sha256_hash.hexdigest() == result[0]:
        return "Ok", 200
    elif result:
        return "Wrong password", 401
    else:
        return "Email does not exist", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)