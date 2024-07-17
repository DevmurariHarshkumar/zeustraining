import {Table} from "./table.js";
var canvas = document.querySelector("canvas");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
canvas.width = 8000;
canvas.height = 8000;

var c = canvas.getContext("2d");
console.log(canvas);

var rows = new Array(26).fill(150);
var cols = new Array(100).fill(50);
var table = new Table(3, 3, rows, cols);
table.drawTable();


canvas.addEventListener("click", (event) => {
    let rect = canvas.getBoundingClientRect();
    console.log("rect is :", rect)
    let total_left = event.clientX - rect.left;
    let total_height = event.clientY - rect.top;
    console.log(total_height, total_left, "asdfasf")
})


export {c}