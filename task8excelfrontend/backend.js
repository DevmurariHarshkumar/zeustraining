var apidata;

const apiUrl = 'http://localhost:5205/api/v1/user/getdb';

async function fetchData(){
    try{
    const response = await fetch(apiUrl);
    const data = await response.json();
    apidata = data;
    apidata = data.map(data => Object.values(data));
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

export { apidata };