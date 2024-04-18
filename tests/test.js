describe('Customer List Retrieval', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:5000/');
  });

  it('should display the customer list on page load', async () => {
    const customerTable = await page.waitForSelector('#customer-table');
    const rowCount = await customerTable.$$eval('tr', rows => rows.length);
    expect(rowCount).toBeGreaterThan(0);
  });
});


describe('Sorting Test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:5000/');
  });

  it('should sort the customer list by name when sort button is clicked', async () => {
    await page.click('#sortByNameButton');
    await page.waitForFunction(() =>
      document.querySelector('#customer-table') && document.querySelector('#customer-table').innerText.includes('Sorted'), 5000);

    const names = await page.$$eval('#customer-table td:nth-child(2)', cells => cells.map(cell => cell.textContent));
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });
});
