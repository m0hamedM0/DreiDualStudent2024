document.addEventListener('DOMContentLoaded', function() {
    fetchCustomers();
    fetchSalesShareChart();
    fetchSalesDevelopmentChart();
});

function fetchCustomers() {
    const sortSelect = document.getElementById('sortSelect');
    const [sortBy, order] = sortSelect.value.split('_');

    fetch(`/api/customers?sort_by=${sortBy}&order=${order}`)
        .then(response => response.json())
        .then(customers => {
            const tableDiv = document.getElementById('customer-table');
            const table = document.createElement('table');
            table.setAttribute('class', 'customer-table');

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headers = ['Index', 'Customer Id', 'First Name', 'Last Name', 'Company', 'City', 'Country', 'Phone 1', 'Phone 2', 'Email', 'Subscription Date', 'Website', 'SALES 2021', 'SALES 2022'];
            headers.forEach(headerText => {
                const header = document.createElement('th');
                header.textContent = headerText;
                headerRow.appendChild(header);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
customers.forEach((customer, index) => {
    const row = document.createElement('tr');
    headers.forEach(header => {
        const cell = document.createElement('td');
        if (header === 'Index') {
            const displayIndex = order === 'ASC' ? index + 1 : customers.length - index;
            cell.textContent = displayIndex;
        } else {
            cell.textContent = customer[header] || '';
        }
        row.appendChild(cell);
    });
    tbody.appendChild(row);
});

            table.appendChild(tbody);

            tableDiv.innerHTML = '';
            tableDiv.appendChild(table);
        });
}
function fetchSalesShareChart() {
    fetch(`/api/charts/sales_share`)
        .then(response => response.json())
        .then(data => {
            const customerLabels = data.map(item => item['Customer Id']);
            const sales2021Data = data.map(item => item['SALES 2021']);
            const sales2022Data = data.map(item => item['SALES 2022']);

            const totalSales2021 = sales2021Data.reduce((a, b) => a + b, 0);
            const totalSales2022 = sales2022Data.reduce((a, b) => a + b, 0);

            const share2021 = sales2021Data.map(sales => (sales / totalSales2021) * 100);
            const share2022 = sales2022Data.map(sales => (sales / totalSales2022) * 100);

            const ctx = document.getElementById('salesShareChart').getContext('2d');

            if (window.pieChart) window.pieChart.destroy();

            window.pieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: customerLabels,
                    datasets: [
                        {
                            label: 'Sales Share 2021',
                            data: share2021,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Sales Share 2022',
                            data: share2022,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true
                        }
                    }
                }
            });
        });
}


function fetchSalesDevelopmentChart() {
    fetch('/api/charts/sales_development')
        .then(response => response.json())
        .then(data => {
            const customerLabels = data.map(item => item['Customer Id']);
            const salesDevelopmentData = data.map(item => {
                const sales2021 = item['SALES 2021'];
                const sales2022 = item['SALES 2022'];
                return sales2022 - sales2021;
            });

            const ctx = document.getElementById('salesDevelopmentChart').getContext('2d');

            if (window.lineChart) window.lineChart.destroy();

            window.lineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: customerLabels,
                    datasets: [{
                        label: 'Sales Development from 2021 to 2022',
                        data: salesDevelopmentData,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        });
}

