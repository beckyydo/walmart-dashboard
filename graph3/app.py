import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
import psycopg2

app = Flask(__name__)

@app.route('/data')
def send_data():
    conn = psycopg2.connect(host='otto.db.elephantsql.com', port='5432', dbname='ofiglsqd', user='ofiglsqd', password='vVojrG9_zzJZCOLXz8rhKWXk6ivvYqAe')

    cur = conn.cursor()
    cur.execute("select year, month, sales::float from public.sales_by_period;")
        
    tmp_data = cur.fetchall()
    payload = []
    content = {}
    for result in tmp_data:
        content = {'year': result[0], 'month': result[1], 'sales': result[2]}
        payload.append(content)
        content = {}

    cur.close()

    return jsonify(payload)


@app.route("/")
def home():

    return render_template("index.html")

if __name__ == "__main__":
    app.run()