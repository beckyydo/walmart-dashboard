import pandas as pd
from pandas import DataFrame
import os

# get resource folder path
resource_dir = os.getcwd()

# load csv files 
sales = pd.read_csv(os.path.join(resource_dir, 'graph3.2', 'sales-by-stores.csv'))

# group by on store and date (collapse the department) and sum weekly sales
#df_sales_store = df_sales.groupby(['store','date'])['weekly_sales'].sum()
df = DataFrame(sales)

df['YearMonth'] = pd.to_datetime(df['date']).apply(lambda x: '{year}-{month}'.format(year=x.year, month=x.month))

df_sales_store_month = df.groupby(['store','YearMonth'])['weekly_sales'].sum()

# res = df.groupby('YearMonth')['weekly_sales'].sum()

# export dataframe to csv
df_sales_store_month.to_csv(os.path.join(resource_dir, 'graph3.2', 'sales-by-store-summed3.csv'))
