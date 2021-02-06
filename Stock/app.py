
# Import Dependencies
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func

# Flask Setup
app = Flask(__name__)


# Database Setup
from flask_sqlalchemy import SQLAlchemy
engine = create_engine("postgres://ofiglsqd:vVojrG9_zzJZCOLXz8rhKWXk6ivvYqAe@otto.db.elephantsql.com:5432/ofiglsqd", echo=False)

Base = automap_base()
Base.prepare(engine, reflect=True)
print(Base.classes.keys())
stock = Base.classes.stock
session = Session(engine)


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# create route that jasonify data from elephantSql database
@app.route("/api/stock")
def stock_route():

    data= session.query(stock.Date, stock.Open , stock.High,stock.Low,stock.Close,stock.Volume,stock.Color,stock.MovingAvg).all()
 
    stock_df=[]
    for row in data:
        output = {
            "dates" : row[0],
            "openingPrices":row[1],
            "highPrices": row[2],
            "lowPrices": row[3],
            "closingPrices": row[4],
            "volume":row[5],
            "colors": row[6],
            "movingAvg": row[7]}
        stock_df.append(output)
        
    return jsonify(stock_df)

if __name__ == "__main__":
    app.run()

