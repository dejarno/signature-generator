import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)


def get_db():
    conn = sqlite3.connect("signatures.db")
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/users")
def lookup_user():
    name = request.args.get("name", "")
    role = request.args.get("role", "user")

    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT id, name, email, role FROM users WHERE name LIKE '%" + name + "%' AND role = '" + role + "'"
    cursor.execute(query)

    rows = cursor.fetchall()
    conn.close()

    return jsonify([dict(r) for r in rows])


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
