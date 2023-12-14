
function xxx(outt)
{
    console.log(outt);
}

function addToTable(tRef, shop, item, weight, colour)
{
    var row = tRef.insertRow(-1);

    var shopCell = row.insertCell(0);
    var itemCell = row.insertCell(1);
    var weightCell = row.insertCell(2);
    var colourCell = row.insertCell(3);

    shopCell.innerHTML = shop;
    itemCell.innerHTML = item;
    weightCell.innerHTML = weight;
    colourCell.innerHTML = colour;
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
    let box = newShopDiv.getElementsByTagName('input')[0];
    let label = newShopDiv.getElementsByTagName('label')[0];
    example.before(newShopDiv);

    newShopDiv.id = shopName;
    box.id = shopName + ' box';
    label.for = box.id;
    label.innerHTML = shopName;

    newShopDiv.hidden = false;

    hashMap.set(shopName, box.id);

    box.addEventListener('change', function()
    {
        // outputTable(filePath, tbodyRef, theadRef, document.getElementById("vehicle2").checked);
        onTick();
    });
}

function outputTable(filePath, theadRef, tbodyRef, shopMap)
{
    console.log("ouputing table");
    fetch(filePath)
        .then(response => response.text())
        .then(csvData => 
        {
            // Parse CSV data
            const rows = csvData.split('\n').map(row => row.split(','));

            resetTable(theadRef, tbodyRef);

            addToTable(theadRef, rows[0][0], rows[0][1], rows[0][2], rows[0][3]);
            
            for(let i = 1; i < rows.length -1; i++)
            {
                const currentRow = rows[i];
                if( document.getElementById(shopMap.get(currentRow[0])).checked )
                {
                    addToTable(tbodyRef, currentRow[0], currentRow[1], currentRow[2], currentRow[3]);
                }
            }
        })
        .catch(error => 
        {
            console.error('Error reading CSV file:', error);
        });
}

function setShops(filePath, shopMap, theadRef, tbodyRef)
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
                    addShop(shopName, shopMap, document.getElementById("Original Shop Div"), function()
                    // { console.log("its working"); });
                    //*
                    {
                        outputTable(filePath, theadRef, tbodyRef, shopMap);
                    });
                    //*/
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

    const filePath = 'assets/ItemsForParty.csv';
    const tableRef = document.getElementById('mainTable');
    const tbodyRef = tableRef.getElementsByTagName('tbody')[0];
    const theadRef = tableRef.getElementsByTagName('thead')[0];
    const shopMap = new Map();

    setShops(filePath, shopMap, theadRef, tbodyRef);
    
    outputTable(filePath, theadRef, tbodyRef, shopMap);
});


