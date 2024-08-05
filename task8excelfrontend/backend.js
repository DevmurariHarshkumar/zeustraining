console.log("b")
var apidataa;

async function fetchData(){
    try{
        const response = await fetch('http://localhost:5205/api/v1/user/getdb');
        const data = await response.json();
        apidataa = data;
        apidataa = data.map(data => Object.values(data));
    }
    catch(error)
    {
        console.log(error);
    }
}

try{
    await fetchData();
}
catch{
    console.log("internal server error");
}

export { fetchData, apidataa };