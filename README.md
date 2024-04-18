# DreiDualStudent2024

This application is a web-based tool designed to visualize customer sales data. It is built using Python and JavaScript, with Flask as the backend framework and Chart.js for data visualization on the frontend.  
Features
Customer List Retrieval: The application retrieves a list of customers from a SQLite database and displays it on the web page. The list includes customer details and their sales data for the years 2021 and 2022.  
Sorting: Users can sort the customer list by any column in ascending or descending order. The sorting options are provided in a dropdown menu.  
Sales Share Chart: The application calculates the sales share of each customer for the years 2021 and 2022 and displays it in a pie chart.  
Sales Development Chart: The application calculates the sales development of each customer from 2021 to 2022 and displays it in a line chart. 

app.py: This is the main application file. It contains the Flask server code and the API endpoints.  
script.js: This file contains the JavaScript code for fetching data from the server and updating the charts.  
index.html: This file contains the HTML code for the web page.

The application will start a server at http://localhost:5000/.
