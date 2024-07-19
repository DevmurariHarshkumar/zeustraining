import { Table } from "./table.js";
var canvas = document.querySelector("canvas");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
canvas.width = 4000;
canvas.height = 4000;

var c = canvas.getContext("2d");
console.log(canvas);

var rows = new Array(50).fill(170);
var cols = new Array(50).fill(30);
var table = new Table(rows.length, cols.length, rows, cols);
table.drawTable();


// now not useful as multiple area select can do this too....
var selected_cell = null;
canvas.addEventListener("click", (event) => {
    // rect is for considering movement by canvas moving and not just screen absolute position
    let rect = canvas.getBoundingClientRect();
    let x_position = event.clientX - rect.left;
    let y_position = event.clientY - rect.top;
    console.log("pixel_pos", x_position, y_position);
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
                console.log("cell_pos", cell.x_pos, cell.y_pos);
                return cell;
            }
        }
    }
    return null;
}

function drawSelectedCell(cell) {
    c.strokeStyle = "rgba(5, 96, 242, 1)";
    c.strokeRect(cell.x_px - 1, cell.y_px - 1, cell.width + 2, cell.height + 2);
    c.strokeRect(cell.x_px - 2, cell.y_px - 2, cell.width + 4, cell.height + 4);
    c.strokeRect(cell.x_px - 3, cell.y_px - 3, cell.width + 6, cell.height + 6);
    c.fillStyle = "white";
    c.fillRect(cell.x_px + 1, cell.y_px + 1, cell.width - 2, cell.height - 2);
    c.fillStyle = "black";
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
    c.beginPath()
    c.arc((cell.x_px+cell.width), (cell.y_px+cell.height), 6, 0, 2 * Math.PI);
    c.fillStyle = "rgba(5, 96, 242, 1)";
    c.fill()
    c.stroke();
    

    var headercell = table.table[0][cell.y_pos];
    // c.fillStyle = "red";
    c. fillStyle = "rgba(0, 120, 215, 0.3)"
    
    c.fillRect(
        headercell.x_px + 1,
        headercell.y_px + 1,
        headercell.width - 2,
        headercell.height - 2
    );
    var indexcell = table.table[cell.x_pos][0];
    // c.fillStyle = "yellow";
    c. fillStyle = "rgba(0, 120, 215, 0.3)"
    c.fillRect(
        indexcell.x_px + 1,
        indexcell.y_px + 1,
        indexcell.width - 2,
        indexcell.height - 2
    );
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
    table.drawTable()
    console.log("keydown", event.key);
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


var selectedCells;
var isMouseDown;
var initialCell;
var finalCell;

// implementation 1 with norml pos wala
function getSelectedCells(initialCell, finalCell) {
	// console.log("inn getselcted: initial and final cells: ", initialCell, finalCell);
	const selectedCells = [];
	const startX = Math.min(initialCell.x_pos, finalCell.x_pos);
	const endX = Math.max(initialCell.x_pos, finalCell.x_pos);
	const startY = Math.min(initialCell.y_pos, finalCell.y_pos);
	const endY = Math.max(initialCell.y_pos, finalCell.y_pos);

	for (let i = startX; i <= endX; i++) {
		for (let j = startY; j <= endY; j++) {
			selectedCells.push(table.table[i][j]);
			console.log(table.table[i][j]);
		}
	}
	return selectedCells;
}

// ANOTHER IMPLEMENTATION OF getSelectedCells WITHOUT USING CELL POS, DIRECTLY OPERATING ON CELL PIXELS......
// function getSelectedCells(initialCell, finalCell) {
//     console.log("inn getselected:", initialCell, finalCell);
//     const selectedCells = [];
//     const minX = Math.min(initialCell.x_px, finalCell.x_px);
//     const maxX = Math.max(initialCell.x_px + initialCell.width, finalCell.x_px + finalCell.width);
//     const minY = Math.min(initialCell.y_px, finalCell.y_px);
//     const maxY = Math.max(initialCell.y_px + initialCell.height, finalCell.y_px + finalCell.height);

//     for (let i = 0; i < (table.table.length); i++) {
// 		console.log("table i", table.table.length, i, table.table[i])
//         for (let j = 0; j < (table.table[i]).length; j++) {
//             let cell = table.table[i][j];
//             const cellRight = cell.x_px + cell.width;
//             const cellBottom = cell.y_px + cell.height;

//             if (cell.x_px < maxX && cellRight > minX && cell.y_px < maxY && cellBottom > minY) {
//                 selectedCells.push(cell);
//                 console.log(cell);
//             }
//         }
//     }
//     return selectedCells;
// }

canvas.addEventListener("mousedown", (event) => {
	table.drawTable()
	selectedCells = [];
    let rect = canvas.getBoundingClientRect();
    let x_position = event.clientX - rect.left;
    let y_position = event.clientY - rect.top;
    initialCell = getCellFromClick(x_position, y_position);
    selected_cell = initialCell;
	// console.log("initialCell in mousedown: ", selected_cell, "asdfsdaf")
    console.log("dsfafasdf", initialCell)
    if (initialCell) {
        isMouseDown = true;
        selectedCells = [initialCell];
		console.log("selectedCells: ", selectedCells)
		selectedCells.forEach((cell, i) => {
			drawSelectedCell(cell);
		})
    }
});


canvas.addEventListener("mousemove", (event) => {
    var sum = 0
    var average = 0
    var minn = 0 // to do max and min 
    var maxx = 0
    if (isMouseDown) {
		table.drawTable()
        let rect = canvas.getBoundingClientRect();
        let x_position = event.clientX - rect.left;
        let y_position = event.clientY - rect.top;
        finalCell = getCellFromClick(x_position, y_position);
		console.log("finalcell in mousemove: ", initialCell, finalCell);
		selectedCells = getSelectedCells(initialCell, finalCell);
		console.log("selectedCells: ", selectedCells)
		selectedCells.forEach((cell, i) => {
		drawSelectedCell(cell);
		})

        for(var i = 0; i < selectedCells.length; i++){
            console.log("selectedi ", selectedCells[i])
            sum += selectedCells[i].content;
            average = sum/selectedCells.length;
            minn = Math.min(minn, selectedCells[i]);
            maxx = Math.max(maxx, selectedCells[i]);
            console.log("sum", sum, average, minn, maxx);

        }
    }
});

canvas.addEventListener("mouseup", (event) => {
	isMouseDown = false;
});



export { c };
