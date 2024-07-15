import {Table} from "./table.js";
var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");
console.log(canvas);

// let cell1 = new Cell("Ram", 20,10);
// cell1.drawCell();

var table = new Table(3, 3);
table.drawTable();

export {c}