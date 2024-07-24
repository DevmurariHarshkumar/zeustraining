import { Table } from "./table.js";
const delay = ms => new Promise(res => setTimeout(res, ms));

var apidata;

const apiUrl = 'http://localhost:5205/api/v1/user/getdb';
const outputElement = document.getElementById('output');

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


var canvas = document.querySelector("canvas");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
canvas.width = 4000;
canvas.height = 4000;

var c = canvas.getContext("2d");

try{
    await fetchData();
}
catch{
    console.log("internal server error");
}

var rows = new Array(apidata[0].length).fill(130);
var cols = new Array(apidata.length).fill(19);
var table = new Table(rows.length, cols.length, rows, cols, apidata);

table.make2darray();
table.drawTable();


var selected_cell = null;
canvas.addEventListener("click", (event) => {
    let rect = canvas.getBoundingClientRect();
    let x_position = event.clientX - rect.left;
    let y_position = event.clientY - rect.top;
    // console.log("pixel_pos", x_position, y_position);
    var cell = getCellFromClick(x_position, y_position);
    selected_cell = cell;
    drawSelectedCell(cell);
});


function getCellFromClick(x, y) {
    for (let i = 0; i < table.table.length; i++) {
        for (let j = 0; j < table.table[i].length; j++) {
            const cell = table.table[i][j];
            if (
                x >= cell.x_px &&
                x <= cell.x_px + cell.width &&
                y >= cell.y_px &&
                y <= cell.y_px + cell.height
            ) {
                // console.log("cell_pos", cell.x_pos, cell.y_pos);
                return cell;
            }
        }
    }
    return null;
}

function drawSelectedCellMain(cell){
    c.strokeStyle = "rgba(5, 96, 242, 1)";
    c.strokeRect(cell.x_px - 1, cell.y_px - 1, cell.width + 2, cell.height + 2);
    c.fillStyle = "white";
    c.fillRect(cell.x_px + 1, cell.y_px + 1, cell.width - 2, cell.height - 2);
    c.fillStyle = "black";
    c.font = "11px serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.textRendering = "auto";
    c.fillText(
        cell.content,
        cell.x_px + cell.width / 2,
        cell.y_px + cell.height / 2,
        cell.width
    );
    c.beginPath()
    c.arc((cell.x_px+cell.width), (cell.y_px+cell.height), 3, 0, 2 * Math.PI);
    c.fillStyle = "rgba(5, 96, 242, 1)";
    c.fill()
    c.stroke();
}

function drawSelectedCellIndexes(cell){
    
    var headercell = table.table[0][cell.y_pos];
    c. fillStyle = "rgba(0, 120, 215, 0.3)"
    
    c.fillRect(
        headercell.x_px + 1,
        headercell.y_px + 1,
        headercell.width - 2,
        headercell.height - 2
    );
    var indexcell = table.table[cell.x_pos][0];
    c. fillStyle = "rgba(0, 120, 215, 0.3)"
    c.fillRect(
        indexcell.x_px + 1,
        indexcell.y_px + 1,
        indexcell.width - 2,
        indexcell.height - 2
    );
}


function drawSelectedCell(cell) {
    drawSelectedCellMain(cell);
    drawSelectedCellIndexes(table.table[0][cell.y_pos]);
    drawSelectedCellIndexes(table.table[cell.x_pos][0]);



}

canvas.addEventListener("dblclick", (event) => {
    let rect = canvas.getBoundingClientRect();
    let x_position = event.clientX - rect.left;
    let y_position = event.clientY - rect.top;
    var cell = getCellFromClick(x_position, y_position);
    c.fillStyle = "blue";
    c.fillRect(cell.x_px + 1, cell.y_px + 1, cell.width - 2, cell.height - 2);
});

window.addEventListener("keydown", (event) => {
    table.drawTable()
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
        var nextcell = table.table[selected_cell.x_pos + 1][selected_cell.y_pos];
        drawSelectedCell(nextcell);
        selected_cell = nextcell;
    }
});


var selectedCells;
var isMouseDown;
var initialCell;
var finalCell;

function getSelectedCells(initialCell, finalCell) {
	const selectedCells = [];
	const startX = Math.min(initialCell.x_pos, finalCell.x_pos);
	const endX = Math.max(initialCell.x_pos, finalCell.x_pos);
	const startY = Math.min(initialCell.y_pos, finalCell.y_pos);
	const endY = Math.max(initialCell.y_pos, finalCell.y_pos);

	for (let i = startX; i <= endX; i++) {
		for (let j = startY; j <= endY; j++) {
			selectedCells.push(table.table[i][j]);
		}
	}
	return selectedCells;
}

canvas.addEventListener("mousedown", (event) => {
	table.drawTable()
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
		})
    }
});


canvas.addEventListener("mousemove", (event) => {
    var sum = 0
    var average = 0
    var minn = Number.POSITIVE_INFINITY;
    var maxx = Number.NEGATIVE_INFINITY;
    if (isMouseDown) {
		table.drawTable()
        let rect = canvas.getBoundingClientRect();
        let x_position = event.clientX - rect.left;
        let y_position = event.clientY - rect.top;
        finalCell = getCellFromClick(x_position, y_position);
		selectedCells = getSelectedCells(initialCell, finalCell);
		selectedCells.forEach((cell, i) => {
		drawSelectedCell(cell);
		})

        for(var i = 0; i < selectedCells.length; i++){
            sum += selectedCells[i].content;
            average = sum/selectedCells.length;
            minn = Math.min(minn, selectedCells[i].content);
            maxx = Math.max(maxx, selectedCells[i].content);
        }
        console.log("sum", sum, average, minn, maxx);
    }
});

canvas.addEventListener("mouseup", (event) => {
	isMouseDown = false;
});


export { c };
