import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
# from flask_sqlalchemy import SQLAlchemy
import psycopg2

# import sqlalchemy
# from sqlalchemy import create_engine
# from sqlalchemy import func
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import session


app = Flask(__name__)

@app.route('/data')
def send_data():
    # using psycopg2...
    # local test database
    conn = psycopg2.connect(host='localhost', port='5432', dbname='test', user='postgres', password='postgres')

    # team elephantSQL
    # conn = psycopg2.connect("host='otto.db.elephantsql.com' dbname='ofiglsqd' user='ofiglsqd' password='vVojrG9_zzJZCOLXz8rhKWXk6ivvYqAe'")  

    cur = conn.cursor()
    cur.execute("select year, month, sales::float from public.sales_by_period_by_year;")
    
    # row_headers=[x[0] for x in cur.description]

    # using SQLAlchemy
    # engine = create_engine("postgres://ofiglsqd:vVojrG9_zzJZCOLXz8rhKWXk6ivvYqAe@otto.db.elephantsql.com:5432/ofiglsqd", echo=False)
    # Base = automap_base()
    # Base.prepare(engine, reflect=True)

    # graph3 = Base.classes.graph3
    # session = Session(engine)

    # tmp_data = [col for col in cur]
    
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