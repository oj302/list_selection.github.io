
function read_file(file, out)
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
}



window.addEventListener('load', function() 
{
    this.alert("page loaded");


    read_file("assets/ItemsForParty.xlsx", data);

    console.log(data);
});