import pandas as pd
import os

# get resource folder path
resource_dir = os.getcwd()

# load csv files 
df_sales = pd.read_csv(os.path.join(resource_dir, 'graph3.1', 'sales-by-stores.csv'))

# group by on store and date (collapse the department) and sum weekly sales
df_sales_store = df_sales.groupby(['store','date'])['weekly_sales'].sum()

# export dataframe to csv
df_sales_store.to_csv(os.path.join(resource_dir, 'graph3.1', 'sales-by-store-summed.csv'))
