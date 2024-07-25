import { c } from "./index.js";
import { table } from "./index.js";

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

    drawCell() {
        c.fillStyle = "black";
        c.font = "11px serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.textRendering = "auto";
        c.fillText(
            this.content,
            this.x_px + this.width / 2,
            this.y_px + this.height / 2,
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
    drawSelectedCellIndexes(cell);
}

function drawSelectedCellIndexes(cell){
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
    c. fillStyle = "rgba(0, 120, 215, 0.3)"
    c.fillRect(
        cell.x_px + 1,
        cell.y_px + 1,
        cell.width - 2,
        cell.height - 2
    );
}

function drawSelectedCell(cell) {
    drawSelectedCellMain(cell);
    drawSelectedCellIndexes(table.table[0][cell.y_pos]);
    drawSelectedCellIndexes(table.table[cell.x_pos][0]);
}


export { Cell, getSelectedCells, getCellFromClick, drawSelectedCellMain, drawSelectedCellIndexes, drawSelectedCell };
