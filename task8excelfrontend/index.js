import { Table } from "./table.js";
import { apidata } from "./backend.js";
import {
    Cell,
    getSelectedCells,
    getCellFromClick,
    drawSelectedCellMain,
    drawSelectedCellIndexes,
    drawSelectedCell,
    selectWholeLine
} from "./cell.js";

var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas.width = 4000;
// canvas.height = 4000;

var c = canvas.getContext("2d");

var rows = new Array(apidata[0].length).fill(130);
rows[0] = 21;
var cols = new Array(apidata.length).fill(19);
var table = new Table(rows.length, cols.length, rows, cols, apidata);
var isResizeEdge;
var edge;
var initial_x_position = 0;
var initial_y_position = 0;
var new_x_position = 0;
var new_y_position = 0;
var initial_width = 0;
var initial_height = 0;

table.make2darray();
table.drawTable();

var selected_cell, selectedCells, isMouseDown, initialCell, finalCell;

// canvas.addEventListener("click", (event) => {
//     let rect = canvas.getBoundingClientRect();
//     let x_position = event.clientX - rect.left;
//     let y_position = event.clientY - rect.top;
//     var cell = getCellFromClick(x_position, y_position);
//     drawSelectedCell(cell);
// });

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
    input.style.position = "absolute";
    input.style.left = `${cell.x_px + 3}px`;
    input.style.top = `${cell.y_px + 3}px`;
    input.style.width = `${cell.width - 10}px`;
    input.style.height = `${cell.height - 10}px`;
    input.style.outline = 'none'
    input.style.border = "0px";
    input.value = cell.content
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

function resizeLine(edge, initial_x_position, initial_y_position, new_x_position, new_y_position){
    var new_width = initial_width + new_x_position - initial_x_position;
    rows[edge-1] = new_width;
}
function resizeLiney(edge, initial_x_position, initial_y_position, new_x_position, new_y_position){
    var new_height = initial_height + new_y_position - initial_y_position;
    cols[edge-1] = new_height;
}

function nearEdgex(x_position){
    var rowtillnow = 0;
    for (var i=0; i<rows.length; i++){
        console.log("absolute: ", Math.abs(rowtillnow - x_position),"xpos", x_position);
        if (Math.abs(rowtillnow - x_position) < 5){
            return i;
        }
        rowtillnow += rows[i]
    }
    return 0;
}
function nearEdgey(y_position){
    var coltillnow = 0;
    for (var j=0; j<cols.length; j++){
        console.log("absolute: ", Math.abs(coltillnow - y_position),"ypos", y_position);
        if (Math.abs(coltillnow - y_position) < 5){
            return j;
        }
        coltillnow += cols[j]
    }
    return 0;
}

canvas.addEventListener("mousedown", (event) => {
    table.drawTable();
    selectedCells = [];
    isResizeEdge = false;
    let rect = canvas.getBoundingClientRect();
    let x_position = event.clientX - rect.left;
    let y_position = event.clientY - rect.top;
    initialCell = getCellFromClick(x_position, y_position);

    if (initialCell.x_pos == 0 || initialCell.y_pos == 0){
        if (initialCell.y_pos == 0){
            edge = nearEdgex(x_position)
            if (edge){
                initial_width = rows[edge-1]
                initial_height = cols[edge]-1
                initial_x_position = event.clientX - rect.left;
                initial_y_position = event.clientY - rect.top;
                isResizeEdge = true;
            }
        }
        if (initialCell.x_pos == 0){
            edge = nearEdgey(y_position)
            if (edge){
                initial_width = rows[edge-1]
                initial_height = cols[edge]-1
                initial_x_position = event.clientX - rect.left;
                initial_y_position = event.clientY - rect.top;
                isResizeEdge = true;
            }
        }
        else{
            selectWholeLine([initialCell]);
        }
    }

    selected_cell = initialCell;
    if (initialCell) {
        isMouseDown = true;
        selectedCells = [initialCell];
        selectedCells.forEach((cell) => {
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
        if (isResizeEdge){
            let rect = canvas.getBoundingClientRect();
            let new_x_position = event.clientX - rect.left;
            let new_y_position = event.clientY - rect.top;
            initialCell = getCellFromClick(new_x_position, new_y_position);
            if (initialCell.x_pos == 0 || initialCell.y_pos == 0){
                if (initialCell.y_pos == 0){
                    resizeLine(edge, initial_x_position, initial_y_position, new_x_position, new_y_position);
                }
                if (initialCell.x_pos == 0){
                    resizeLiney(edge, initial_x_position, initial_y_position, new_x_position, new_y_position);
                }
            }
        }
    
        table.drawTable();
        let rect = canvas.getBoundingClientRect();
        let x_position = event.clientX - rect.left;
        let y_position = event.clientY - rect.top;
        finalCell = getCellFromClick(x_position, y_position);

        selectedCells = getSelectedCells(initialCell, finalCell);
        if (finalCell.x_pos == 0 || finalCell.y_pos == 0){
            selectWholeLine(selectedCells);
        }
        selectedCells.forEach((cell) => {
            drawSelectedCellIndexes(cell);
        });
        
        for (var i = 0; i < selectedCells.length; i++) {
            if (!isNaN(parseFloat(selectedCells[i].content))){
                sum += parseFloat(selectedCells[i].content)
            }
            average = sum / selectedCells.length;
            minn = Math.min(minn, selectedCells[i].content);
            maxx = Math.max(maxx, selectedCells[i].content);
        }
        console.log("sum", sum, "average", average, "minn", minn, "maxx", maxx);
    }});

canvas.addEventListener("mouseup", (event) => {
    isMouseDown = false;
    initial_y_position = 0;
    initial_x_position = 0;
    initial_x_position = 0;
    new_x_position = 0;
    new_y_position = 0;
    initial_width = 0;
    initial_height = 0;
    isResizeEdge = false;
});

export { c, table};
