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
market_share = Base.classes.market_share

session = Session(engine)

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


# Market Share Service Route
@app.route("/api/market_share")
def market_route():
    data = session.query(market_share.CITY, market_share.STATE, market_share.Latitude, 
                        market_share.Longitude).all()
    
    market_df = []
    for row in data:
        market_dict = {'City': row[0],'State': row[1], 
        'Lat': row[2], 'Lon': row[3]}
        market_df.append(market_dict)
    return jsonify(market_df)


if __name__ == "__main__":
    app.run()

