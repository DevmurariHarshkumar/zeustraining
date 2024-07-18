import { Table } from "./table.js";
var canvas = document.querySelector("canvas");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
canvas.width = 8000;
canvas.height = 8000;

var c = canvas.getContext("2d");
console.log(canvas);

var rows = new Array(50).fill(170);
var cols = new Array(50).fill(30);
var table = new Table(rows.length, cols.length, rows, cols);
table.drawTable();

var selected_cell = null;

canvas.addEventListener("click", (event) => {
	let rect = canvas.getBoundingClientRect();
    let x_position = event.clientX - rect.left;
    let y_position = event.clientY - rect.top;
    console.log("pixel_pos", x_position, y_position);
	var cell = getCellFromClick(x_position, y_position);
	selected_cell = cell;
	drawSelectedCell(cell)
});

function getCellFromClick(x, y) {
	for (let i = 0; i < table.table.length; i++) {
		for (let j = 0; j < table.table[i].length; j++) {
			const cell = table.table[i][j];
			if (x >= cell.x_px && x <= cell.x_px + cell.width &&
				y >= cell.y_px && y <= cell.y_px + cell.height) {
				console.log("cell_pos", cell.x_pos, cell.y_pos)
				return cell;
			}
		}
	}
	return null;
}

function drawSelectedCell(cell) {
	table.drawTable()
	console.log("cell incokming")
	c.strokeStyle = "rgba(5, 96, 242, 1)";
    c.strokeRect(cell.x_px-1, cell.y_px-1, cell.width+2, cell.height+2);
	c.strokeRect(cell.x_px-2, cell.y_px-2, cell.width+4, cell.height+4);
	c.strokeRect(cell.x_px-3, cell.y_px-3, cell.width+6, cell.height+6);
    c.fillStyle = "white";
    c.fillRect(cell.x_px + 1, cell.y_px + 1, cell.width - 2, cell.height - 2);
	c.fillStyle="black";
    c.font = "18px serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.textRendering = "auto";
    c.fillText(
        cell.content,
        cell.x_px + cell.width / 2,
        cell.y_px + cell.height / 2,
        cell.width
    );
	
	var headercell = table.table[0][cell.y_pos]
	c.fillStyle = "red";
    c.fillRect(headercell.x_px + 1, headercell.y_px + 1, headercell.width - 2, headercell.height - 2);
	var indexcell = table.table[cell.x_pos][0]
	c.fillStyle = "yellow";
    c.fillRect(indexcell.x_px + 1, indexcell.y_px + 1, indexcell.width - 2, indexcell.height - 2);
}


canvas.addEventListener("dblclick", (event) => {
	console.log("dblclick");
	let rect = canvas.getBoundingClientRect();
    let x_position = event.clientX - rect.left;
    let y_position = event.clientY - rect.top;
	var cell = getCellFromClick(x_position, y_position);
	c.fillStyle = "blue";
    c.fillRect(cell.x_px + 1, cell.y_px + 1, cell.width - 2, cell.height - 2);
});


window.addEventListener("keydown", (event) => {
	console.log("keydown", event.key);
	if (event.key == "ArrowUp"){
		console.log("selectedcell", selected_cell);
		var nextcell = table.table[(selected_cell.x_pos)][(selected_cell.y_pos)-1];
		console.log("nextcell",nextcell)
		drawSelectedCell(nextcell);
		selected_cell = nextcell;
	}
	if (event.key == "ArrowDown"){
		console.log("selectedcell", selected_cell);
		var nextcell = table.table[(selected_cell.x_pos)][(selected_cell.y_pos)+1];
		console.log("nextcell",nextcell)
		drawSelectedCell(nextcell);
		selected_cell = nextcell;
	}
	if (event.key == "ArrowLeft"){
		console.log("selectedcell", selected_cell);
		var nextcell = table.table[(selected_cell.x_pos-1)][(selected_cell.y_pos)];
		console.log("nextcell",nextcell)
		drawSelectedCell(nextcell);
		selected_cell = nextcell;
	}
	if (event.key == "ArrowRight"){
		console.log("selectedcell", selected_cell);
		var nextcell = table.table[(selected_cell.x_pos+1)][(selected_cell.y_pos)];
		console.log("nextcell",nextcell)
		drawSelectedCell(nextcell);
		selected_cell = nextcell;
	}
});



export { c };