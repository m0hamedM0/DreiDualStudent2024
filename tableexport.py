import pandas as pd
import sqlite3
import os

csv_file_path = './data/customers_sales_2021_2022.csv'

try:
    print("Current Working Directory: ", os.getcwd())

    df = pd.read_csv(csv_file_path, delimiter=';')

    print(df.head())

    df['Active'] = 1
    conn = sqlite3.connect('customer_data.db')

    print("Connected to the database successfully.")

    c = conn.cursor()

    c.execute('''
    CREATE TABLE IF NOT EXISTS customers (
        "Index" TEXT,
        CustomerID TEXT,
        FirstName TEXT,
        LastName TEXT,
        Company TEXT,
        City TEXT,
        Country TEXT,
        Phone1 TEXT,
        Phone2 TEXT,
        Email TEXT,
        SubscriptionDate TEXT,
        Website TEXT,
        SALES2021 INTEGER,
        SALES2022 INTEGER,
        Active INTEGER
    )
    ''')

    df.to_sql('customers', conn, if_exists='replace', index=False)

    conn.commit()
    print("Data inserted successfully.")

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    if conn:
        conn.close()
        print("Database connection is closed.")
