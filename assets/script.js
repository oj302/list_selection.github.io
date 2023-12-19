

function addToTable(tRef, shop, item, weight, colour, odd, itemMap)
{
    let row = tRef.insertRow(-1);
    row.className = "tableRow";
    if(odd) {  row.className += " odd"; }

    const values = [shop, item, weight, colour];

    itemMap.set(item + weight + colour, "filled");

    for(let i = 0; i < 4; i++)
    {
        let cell = row.insertCell(i);
        cell.innerHTML = values[i];
        cell.className = "cell";
    }

}

function resetTable(theadRef, tbodyRef)
{
    while(theadRef.lastElementChild)
    {
        theadRef.removeChild(theadRef.lastElementChild);
    }

    while(tbodyRef.lastElementChild)
    {
        tbodyRef.removeChild(tbodyRef.lastElementChild);
    }
}

function addShop(shopName, hashMap, example, onTick)
{
    let newShopDiv = example.cloneNode(true);
    let label = newShopDiv.getElementsByTagName('label')[0];
    let box = label.getElementsByTagName('input')[0];
    example.before(newShopDiv);

    newShopDiv.id = shopName;
    box.id = shopName + ' box';
    label.for = box.id;
    console.log(label.innerHTML);
    label.innerHTML += shopName;

    newShopDiv.hidden = false;

    hashMap.set(shopName, box.id);

    label.addEventListener('change', function()
    {
        onTick();
    });
}

function outputTable(filePath, theadRef, tbodyRef, shopMap, itemMap)
{
    fetch(filePath)
        .then(response => response.text())
        .then(csvData => 
        {
            // Parse CSV data
            const rows = csvData.split('\n').map(row => row.split(','));

            resetTable(theadRef, tbodyRef);

            // set the table head based on the first row from file
            let row = theadRef.insertRow(-1);
            row.className = "tableRow header";

            for(let i = 0; i < 4; i++)
            {
                let cell = row.insertCell(i);
                cell.innerHTML = rows[0][i];
                cell.className = "headCell";
            }

            // for colouring
            odd = true;
            itemMap.clear();

            // set the rest of the table rows
            for(let i = 1; i < rows.length -1; i++)
            {
                const currentRow = rows[i];
                
                if( document.getElementById(shopMap.get(currentRow[0])).checked && 
                    itemMap.get(currentRow[1] + currentRow[2] + currentRow[3]) != "filled")
                {
                    addToTable(tbodyRef, currentRow[0], currentRow[1], currentRow[2], currentRow[3], odd, itemMap);
                    odd = !odd;
                }
            }
        })
        .catch(error => 
        {
            console.error('Error reading CSV file:', error);
        });
}

function setShops(filePath, theadRef, tbodyRef, shopMap, itemMap)
{
    fetch(filePath)
        .then(response => response.text())
        .then(csvData => 
        {
            // Parse CSV data
            const rows = csvData.split('\n').map(row => row.split(','));
            
            for(let i = 1; i < rows.length -1; i++)
            {
                const shopName = rows[i][0];
                if(shopMap.get(shopName) == undefined)
                {
                    addShop(shopName, shopMap, document.getElementById("OriginalShopDiv"), function()
                    {
                        outputTable(filePath, theadRef, tbodyRef, shopMap, itemMap);
                    });
                }
            }
        })
        .catch(error => 
        {
            console.error('Error reading CSV file:', error);
        });
}


window.addEventListener('load', function()
{
    this.alert("page loaded");

    // const exampleBox = document.getElementById("Original Shop Div");

    const filePath = 'assets/ItemsForParty2.csv';
    const tableRef = document.getElementById('mainTable');
    const tbodyRef = tableRef.getElementsByTagName('tbody')[0];
    const theadRef = tableRef.getElementsByTagName('thead')[0];
    const shopMap = new Map();
    const itemMap = new Map();

    setShops(filePath, theadRef, tbodyRef, shopMap, itemMap);
    
    outputTable(filePath, theadRef, tbodyRef, shopMap, itemMap);
});


