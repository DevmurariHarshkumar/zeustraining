import { Table } from "./table.js";
import { apidata } from "./backend.js";
import {
    Cell,
    getSelectedCells,
    getCellFromClick,
    drawSelectedCellMain,
    drawSelectedCellIndexes,
    drawSelectedCell,
} from "./cell.js";

var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas.width = 4000;
// canvas.height = 4000;

var c = canvas.getContext("2d");

var rows = new Array(apidata[0].length).fill(130);
var cols = new Array(apidata.length).fill(19);
var table = new Table(rows.length, cols.length, rows, cols, apidata);

table.make2darray();
table.drawTable();

var selected_cell, selectedCells, isMouseDown, initialCell, finalCell;

canvas.addEventListener("click", (event) => {
    let rect = canvas.getBoundingClientRect();
    let x_position = event.clientX - rect.left;
    let y_position = event.clientY - rect.top;
    var cell = getCellFromClick(x_position, y_position);
    drawSelectedCell(cell);
});

canvas.addEventListener("dblclick", (event) => {
    let rect = canvas.getBoundingClientRect();
    let x_position = event.clientX - rect.left;
    let y_position = event.clientY - rect.top;
    var cell = getCellFromClick(x_position, y_position);
    selected_cell = cell;
    c.fillStyle = "white";
    c.fillRect(cell.x_px+2, cell.y_px+2, cell.width-5, cell.height-5);
    const input = document.createElement("input");
    input.type = "text";
    input.defaultValue = "asdfdfsdafasdfdsf";
    input.style.position = "absolute";
    input.style.left = `${cell.x_px + 3}px`; // + this.canvas.offsetLeft+1
    input.style.top = `${cell.y_px + 3}px`; //  + this.canvas.offsetTop+1
    input.style.width = `${cell.width - 10}px`;
    input.style.height = `${cell.height - 10}px`;
    console.log("cell info", cell.x_px, cell.y_px, cell.width, cell.height);
    input.style.outline = 'none'
    input.style.border = "0px";

    input.value = cell.content[`${cell.x_pos},${cell.y_pos}`] || "";
    document.body.appendChild(input);
    input.focus();
    const saveInput = () => {
        cell.content = input.value;
        document.body.removeChild(input);
        table.drawTable();
    };

    input.addEventListener("blur", saveInput);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            saveInput();
        }
    });
});

window.addEventListener("keydown", (event) => {
    table.drawTable();
    if (event.key == "ArrowUp") {
        var nextcell =
            table.table[selected_cell.x_pos][selected_cell.y_pos - 1];
        drawSelectedCell(nextcell);
        selected_cell = nextcell;
    }
    if (event.key == "ArrowDown") {
        var nextcell =
            table.table[selected_cell.x_pos][selected_cell.y_pos + 1];
        drawSelectedCell(nextcell);
        selected_cell = nextcell;
    }
    if (event.key == "ArrowLeft") {
        var nextcell =
            table.table[selected_cell.x_pos - 1][selected_cell.y_pos];
        drawSelectedCell(nextcell);
        selected_cell = nextcell;
    }
    if (event.key == "ArrowRight") {
        var nextcell =
            table.table[selected_cell.x_pos + 1][selected_cell.y_pos];
        drawSelectedCell(nextcell);
        selected_cell = nextcell;
    }
});

canvas.addEventListener("mousedown", (event) => {
    table.drawTable();
    selectedCells = [];
    let rect = canvas.getBoundingClientRect();
    let x_position = event.clientX - rect.left;
    let y_position = event.clientY - rect.top;
    initialCell = getCellFromClick(x_position, y_position);
    selected_cell = initialCell;
    if (initialCell) {
        isMouseDown = true;
        selectedCells = [initialCell];
        selectedCells.forEach((cell, i) => {
            drawSelectedCell(cell);
        });
    }
});

canvas.addEventListener("mousemove", (event) => {
    var sum = 0;
    var average = 0;
    var minn = Number.POSITIVE_INFINITY;
    var maxx = Number.NEGATIVE_INFINITY;
    if (isMouseDown) {
        table.drawTable();
        let rect = canvas.getBoundingClientRect();
        let x_position = event.clientX - rect.left;
        let y_position = event.clientY - rect.top;
        finalCell = getCellFromClick(x_position, y_position);
        selectedCells = getSelectedCells(initialCell, finalCell);
        selectedCells.forEach((cell, i) => {
            drawSelectedCellIndexes(cell);
        });

        for (var i = 0; i < selectedCells.length; i++) {
            sum += selectedCells[i].content;
            average = sum / selectedCells.length;
            minn = Math.min(minn, selectedCells[i].content);
            maxx = Math.max(maxx, selectedCells[i].content);
        }
        console.log("sum", sum, average, minn, maxx);
    }
});

canvas.addEventListener("mouseup", (event) => {
    isMouseDown = false;
});

export { c, table };
