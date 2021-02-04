#################################################
# Import Dependencies
#################################################
import os
from flask import (Flask,
    render_template,
    jsonify,
    request,
    redirect)
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
engine = create_engine("postgres://ofiglsqd:vVojrG9_zzJZCOLXz8rhKWXk6ivvYqAe@otto.db.elephantsql.com:5432/ofiglsqd", echo=False)

Base = automap_base()
Base.prepare(engine, reflect=True)

walmart = Base.classes.walmart

session = Session(engine)

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


# Market Share Service Route
@app.route("/api/market_share")
def market_route():
    data = session.query(walmart.Fuel_Price).all()
    market = []
    
    for x in data:
        market.append(x[0])
    return jsonify(market)


if __name__ == "__main__":
    app.run()

