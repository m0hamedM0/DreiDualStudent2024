from flask import Flask, jsonify, request, render_template
from flask import send_from_directory
import sqlite3

app = Flask(__name__)

def query_db(query, args=(), one=False):
    conn = sqlite3.connect('customer_data.db')
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    cur.close()
    conn.close()
    return (rv[0] if rv else None) if one else rv

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/script.js')
def serve_script():
    return send_from_directory('templates', 'script.js')

@app.route('/style.css')
def serve_style():
    return send_from_directory('templates', 'style.css')

@app.route('/api/customers', methods=['GET'])
def get_customers():
    sort_by = request.args.get('sort_by', 'INDEX')
    order = request.args.get('order', 'ASC').upper()

    valid_sort_columns = ['INDEX', 'Customer Id', 'First Name', 'Last Name', 'City', 'Country', 'SALES 2021', 'SALES 2022']
    if sort_by not in valid_sort_columns:
        return jsonify({'error': 'Invalid sort column'}), 400

    valid_order_options = ['ASC', 'DESC']
    if order not in valid_order_options:
        return jsonify({'error': 'Invalid order option'}), 400

    query = 'SELECT * FROM customers'
    query += f' ORDER BY "{sort_by}" {order}'

    customers = query_db(query)
    customer_list = [dict(ix) for ix in customers]
    return jsonify(customer_list)



@app.route('/api/charts/sales_share', methods=['GET'])
def get_sales_share():
    sort_by = request.args.get('sort_by', 'Customer Id')
    order = request.args.get('order', 'ASC').upper()

    valid_sort_columns = ['Customer Id', 'SALES 2021', 'SALES 2022']
    if sort_by not in valid_sort_columns:
        return jsonify({'error': 'Invalid sort column'}), 400

    valid_order_options = ['ASC', 'DESC']
    if order not in valid_order_options:
        return jsonify({'error': 'Invalid order option'}), 400

    query = f'SELECT "Customer Id", "SALES 2021", "SALES 2022" FROM customers ORDER BY "{sort_by}" {order}'
    sales_data = query_db(query)

    total_sales_2021 = sum(item['SALES 2021'] for item in sales_data)
    total_sales_2022 = sum(item['SALES 2022'] for item in sales_data)

    shares = [
        {'Customer Id': item['Customer Id'], 'Share 2021': item['SALES 2021'] / total_sales_2021,
         'Share 2022': item['SALES 2022'] / total_sales_2022}
        for item in sales_data
    ]

    return jsonify(shares)

@app.route('/api/charts/sales_development', methods=['GET'])
def get_sales_development():
    query = 'SELECT "Customer Id", "SALES 2021", "SALES 2022" FROM customers'
    sales_data = query_db(query)

    development = [
        {'Customer Id': item['Customer Id'], 'Sales Over Time': [item['SALES 2021'], item['SALES 2022']]}
        for item in sales_data
    ]

    return jsonify(development)

if __name__ == '__main__':
    app.run(debug=True)
