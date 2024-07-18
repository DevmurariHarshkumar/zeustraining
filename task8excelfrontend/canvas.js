import { Table } from "./table.js";
var canvas = document.querySelector("canvas");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
canvas.width = 8000;
canvas.height = 8000;

var c = canvas.getContext("2d");
console.log(canvas);

var rows = new Array(50).fill(150);
var cols = new Array(50).fill(50);
var table = new Table(rows.length, cols.length, rows, cols);
table.drawTable();

canvas.addEventListener("click", (event) => {
	let rect = canvas.getBoundingClientRect();
    // console.log("rect is :", rect);
    let total_left = event.clientX - rect.left;
    let total_height = event.clientY - rect.top;
    console.log("px pos", total_height, total_left);
	var cell = getCellFromClick(total_left, total_height)
	drawSelectedCell(cell)
});

function getCellFromClick(x, y) {
	for (let i = 0; i < table.table.length; i++) {
		for (let j = 0; j < table.table[i].length; j++) {
			const cell = table.table[i][j];
			if (x >= cell.x_px && x <= cell.x_px + cell.width &&
				y >= cell.y_px && y <= cell.y_px + cell.height) {
				console.log(cell.x_pos, cell.y_pos)
				return cell;
			}
		}
	}
	return null;
}


function drawSelectedCell(cell) {
	table.drawTable()
    c.strokeRect(cell.x_px+1, cell.y_px+1, cell.width+1, cell.height+1);
    c.fillStyle = "yellow";
    c.fillRect(cell.x_px + 1, cell.y_px + 1, cell.width - 2, cell.height - 2);
	c.fillStyle="black";
    c.font = "30px serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.textRendering = "auto";
    c.fillText(
        cell.content,
        cell.x_px + cell.width / 2,
        cell.y_px + cell.height / 2,
        cell.width
    );
}

export { c };
