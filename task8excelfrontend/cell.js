console.log("c")
import { c, table, line_offset } from "./index.js";

class Cell {
    constructor(content, x_px, y_px, width = 150, height = 50, x_pos, y_pos) {
        this.content = content;
        this.x_px = x_px;
        this.y_px = y_px;
        this.width = width;
        this.height = height;
        this.x_pos = x_pos;
        this.y_pos = y_pos;
    }

    drawCell(line_offset) { // offset minus
        // console.log("offset ", offset)
        var pixel_offset = line_offset*19 //line_offset*line_height
        c.fillStyle = "black";
        c.font = "11px serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.textRendering = "auto";
        c.fillText(
            this.content,
            (this.x_px) + this.width / 2,
            (this.y_px-pixel_offset) + this.height / 2,
            this.width
        );
    }
}

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

function getCellFromClick(x, y, line_offset) {
    for (let i = 0; i < table.table.length; i++) {
        for (let j = 0; j < table.table[i].length; j++) {
            const cell = table.table[i][j];
            if (
                x >= cell.x_px &&
                x <= cell.x_px + cell.width &&
                y >= -line_offset*19 + cell.y_px &&
                y <= -line_offset*19 + cell.y_px + cell.height
            ) {
                return cell;
            }
        }
    }
    return null;
}

function drawSelectedCellMain(cell, line_offset){
    c.strokeStyle = "rgb(35, 116, 72)";
    console.log("lineoffset in drawscmain", line_offset);
    c.strokeRect(cell.x_px+1, (cell.y_px-line_offset*19)+1, cell.width-1, cell.height-1);
    c.strokeRect(cell.x_px+1, (cell.y_px-line_offset*19)+1, cell.width-1, cell.height-1);
    c.beginPath()
    c.arc((cell.x_px+cell.width), ((cell.y_px-line_offset*19)+cell.height), 3, 0, 2 * Math.PI);
    c.fillStyle = "rgb(35, 116, 72)";
    c.fill()
}

function drawSelectedCellIndexes(cell){
    // c.fillStyle = "white";
    // c.fillRect(cell.x_px+2, cell.y_px+2, cell.width-2, cell.height-2);
    // c.fillStyle = "black";
    // c.font = "10px"; //font_size
    // c.textAlign = "center";
    // c.textBaseline = "middle";
    // c.textRendering = "auto";
    // c.fillText(
    //     cell.content,
    //     cell.x_px + cell.width / 2,
    //     cell.y_px + cell.height / 2,
    //     cell.width
    // );
    c. fillStyle = "rgba(33, 178, 31, 0.3)"
    c.fillRect(
        cell.x_px + 0.25,
        cell.y_px + 0.25,
        cell.width - 1.5,
        cell.height - 1.5
    );
}


function selectArea(initialCell, finalCell, selectedCells, line_offset){
    const startX = Math.min(initialCell.x_pos, finalCell.x_pos);
    const endX = Math.max(initialCell.x_pos, finalCell.x_pos);
    const startY = Math.min(initialCell.y_pos, finalCell.y_pos);
    const endY = Math.max(initialCell.y_pos, finalCell.y_pos);
    const top_left = selectedCells.find(cell => cell.x_pos === startX && cell.y_pos === startY);
    const bottom_right = selectedCells.find(cell => cell.x_pos === endX && cell.y_pos === endY);
    // console.log('Extreme Top-Left Cell:', top_left);
    // console.log('Extreme Bottom-Right Cell:', bottom_right);
    c.strokeStyle = "#137E43";
    c.fillStyle = "#CAEAD8"
    c.strokeRect(top_left.x_px+1, top_left.y_px+1, bottom_right.x_px-top_left.x_px+bottom_right.width-1, bottom_right.y_px-top_left.y_px+bottom_right.height-1);
    c.fillRect(top_left.x_px+1, top_left.y_px+1, bottom_right.x_px-top_left.x_px+bottom_right.width-1, bottom_right.y_px-top_left.y_px+bottom_right.height-1)
    c.beginPath()
    c.arc((bottom_right.x_px+bottom_right.width), (bottom_right.y_px+bottom_right.height), 3, 0, 2 * Math.PI);
    c.fillStyle = "blue";
    c.fill()
}

function selectWholeLine(cells){
    cells.forEach((cell) => {
        if (cell.x_pos == 0){
            for (var i = 0; i < table.row_arr.length; i++){
                cell = table.table[i][cell.y_pos];
                if (!cells.includes(cell) && (cell.x_pos != 0 || cell.y_pos != 0)) {
                    cells.push(cell);
                }
                drawSelectedCellIndexes(cell)
            }
        }
        if (cell.y_pos == 0){
            for (var i = 0; i < table.col_arr.length; i++){
                cell = table.table[cell.x_pos][i];
                if (!cells.includes(cell)) {
                    cells.push(cell);
                }
                drawSelectedCellIndexes(cell);
            }
        }
    });
}

function drawSelectedCell(cell, line_offset) {
    drawSelectedCellMain(cell, line_offset);
    drawSelectedCellIndexes(table.table[0][cell.y_pos]);
    drawSelectedCellIndexes(table.table[cell.x_pos][0]);
}




export { Cell, getSelectedCells, getCellFromClick, drawSelectedCellMain, drawSelectedCellIndexes, drawSelectedCell, selectWholeLine, selectArea };
