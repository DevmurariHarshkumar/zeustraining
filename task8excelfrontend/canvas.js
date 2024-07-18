import { Table } from "./table.js";
var canvas = document.querySelector("canvas");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
canvas.width = 8000;
canvas.height = 8000;

var c = canvas.getContext("2d");
// console.log(canvas);

var rows = new Array(26).fill(150);
var cols = new Array(100).fill(50);
var table = new Table(3, 3, rows, cols);
table.drawTable();

canvas.addEventListener("click", (event) => {
	let rect = canvas.getBoundingClientRect();
    // console.log("rect is :", rect);
    let total_left = event.clientX - rect.left;
    let total_height = event.clientY - rect.top;
    console.log("px pos", total_height, total_left);
	var cell = getCellFromClick(total_left, total_height)
	drawSelectedCell(cell)
	



    // var selectedcell = whichcell(total_height, total_left);
	// for(var i = 0; i < 3; i++){
	// 	for(var j = 0; j < 3; j++){
	// 		console.log(table.table[i][j]);
	// 		if(contains(table.table[i][j], total_left, total_height)){
	// 			console.log("this is cell", table.table[i][j])
	// 		}
	// 	}
	// }


    // console.log("selected cell", selectedcell[0], selectedcell[1]);

	// for(var i = 0; i < 1000; i++){
	// 	for(var j = 0; j < 1000; j++){
	// 		if(table.table[i][j].y_pos == selectedcell[0] && table.table[i][j].x_pos == selectedcell[1]){
	// 			console.log(table.table[i][j]);
	// 			drawSelectedCell(table.table[i][j]);
	// 		}
	// 	}
	// }
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





// function contains(cell, x, y) {
// 	return (cell.x_px <= x) && (cell.y_px <= y) && (cell.x_px + cell.width >= x) && (cell.y_px + cell.height >= y)
// }






// function whichcell(total_height, total_left) {
// 	console.log("whichcell");
// 	var heighttillnow = 50;
// 	for (var i = 0; i < rows.length; i++) {
// 		heighttillnow += cols[i];
// 		if (total_height <= heighttillnow) {
// 			break;
// 		}
// 	}

// 	var widthtillnow = 150;
// 	for (var j = 0; j < cols.length; j++) {
// 		widthtillnow += rows[j];
// 		if (total_left <= widthtillnow) {
// 			break;
// 		}
// 	}
// 	// given a i and j return table i and j
// 	return [i, j];
// }






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
