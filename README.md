# Walmart Dashboard Proposal

## Overview
For our project we would like to look into Walmart financial data relating to stocks and sales as they respond to store locations as well as socioeconomic factors that might influence those figures. Visualizing these relationships will be helpful in observing how these factors affect sales by region and each individual store. Our goal is to create a dashboard page with multiple interactive graphs and a map that will respond to inputs relating to location and influencing factors.

## Data Sources
### Data 1
Link: https://www.kaggle.com/naresh31/walmart-recruiting-store-sales-forecasting  <br />
Data Source: Kaggle <br />
Data Type: csv <br />
SQL: Postgres <br />
Description: Store sales from 2010-2012 containing various socio economic variables, dates 
& holidays. <br />
Key Columns: Date (Weekly), Store #, Dept #, Sales, CPI, Fuel Price, Temperature, Is_Holiday <br />

### Data 2
Link: https://www.kaggle.com/aayushkandpal/walmart-inc-stock-data-19722020-latest
Data Source: Kaggle
Data Type: csv
SQL: Postgres
Description: Stock analysis for Walmart from 1972 through 2020
Key Columns: Date (Day), Open Price, Close Price

### Data 3
Link:https://gist.githubusercontent.com/anonymous/83803696b0e3430a52f1/raw/29f2b252981659dfa6ad51922c8155e66ac261b2/walmart.json 
Data Source: reddit.com
Data Type: .json
SQL: Postgres
Description: Store names, timezone, and location
Key Columns: ID, storeType, timeZone, openDate, name, postalCode, address1, city, state, country, latitude, longitude, phoneNumber 

### Data 4
Link: https://ilsr.org/walmarts-monopolization-of-local-grocery-markets/#_edn14 
Data Source: Institute for Local Self-Reliance
Data Type: csv
SQL: Postgres 
Description: Market share percentage of metro or micro region
Key Columns: City, State, Population, Market Share %


## DATA VISUALIZATION
### (1) Candlestick Stock Graph
![Candlestick Graph](images/Candlestick_Sample.PNG)

### (2) Geomap Store Location
#### OPTION 1
![Map Graph](images/Map_Sample.jpg)
#### OPTION 2
![Map Graph](images/Map2_Sample.PNG)

### (3) Weekly Sales Graph Across Years Separated by Store
![Map Graph](images/Sales_Sample.jpg)

### (2) Interactive Graph Sales vs Socioeconomic Variables (Temperature, CPI, Unemployment Rate, Fuel Price)
![Map Graph](images/Sales(2)_Sample.PNG)

## FINAL DESIGN PROPOSAL
![Dashboard Sample](images/Walmart_Sample.png)
