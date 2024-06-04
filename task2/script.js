document.querySelector("#submit").addEventListener("click", xyz)



function xyz(){
    n = document.querySelector("#name").value
    c = document.querySelector("#comments").value
    r = document.querySelectorAll("input[name=g]")

    // alert(n + c + r)

    if(n.length == 0 || c.length == 0){
        alert("something missing")
    }

    
}



console.log("hii")