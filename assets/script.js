
function read_file(file, callback)
{
    const reader = new FileReader();

    reader.onload = function(e)
    {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet);

        out(null, jsonData);
    }

    reader.readAsArrayBuffer(file);

    callback(out);
}



window.addEventListener('load', function() 
{
    this.alert("page loaded");

    const filePath = 'assets/ItemsForParty.xlsx';

    /*
    function handleData(data)
    {
        console.log(data);
    }

    read_file("assets/ItemsForParty.xlsx", handleData);
    */

    fetch(filePath)
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                // Process the 'data' read from the file
                console.log(data); // Or perform any other operations
            };
            reader.readAsArrayBuffer(blob);
        })
        .catch(error => {
            console.error('Error fetching the file:', error);
        });
});