console.log("t")
import { Cell, getSelectedCells, getCellFromClick, drawSelectedCellMain, drawSelectedCellIndexes, drawSelectedCell, selectWholeLine, selectArea } from "./cell.js";

var line_width = 1;
class Table {
    /**
     * @param {number} no_row
     * @param {number} no_col
     * @param {Array<number>} row_arr
     * @param {Array<number>} col_arr
     * @param {Array<Array<Any>>} content
     */
    constructor(
        no_row,
        no_col,
        row_arr = [150, 150, 150],
        col_arr = [50, 50, 50],
        content = [[4], [5], [6]][[8], [9], [0]]
    ) {
        /**
         * @type {number} 
         */
        this.no_row = no_row;
        this.no_col = no_col;
        this.row_arr = row_arr;
        this.col_arr = col_arr;
        this.table = new Array(no_row);
        this.content = content;
    }

    make2darray(){
        var tillnowi = 0;
        for (var i = 0; i < this.row_arr.length; i++) {
            this.table[i] = new Array(26);
            var tillnowj = 0;
            for (var j = 0; j < this.col_arr.length; j++) {
                if (i == 0 || j == 0){
                    if (i == 0 && j == 0){
                        const content = "";
                        this.table[i][j] = new Cell(
                            content,
                            tillnowi,
                            tillnowj,
                            this.row_arr[i],
                            this.col_arr[j],
                            i,
                            j
                        );
                        tillnowj = tillnowj + this.col_arr[j];
                    }
                    else if (i == 0){
                        const content = (j).toString();
                        this.table[i][j] = new Cell(
                            content,
                            tillnowi,
                            tillnowj,
                            this.row_arr[i],
                            this.col_arr[j],
                            i,
                            j
                        );
                        tillnowj = tillnowj + this.col_arr[j];
                    }
                    else if(j == 0){
                        const content = String.fromCharCode(65 + i-1); // A == 65 ins ascii
                        this.table[i][j] = new Cell(
                            content,
                            tillnowi,
                            tillnowj,
                            this.row_arr[i],
                            this.col_arr[j],
                            i,
                            j
                        );
                        tillnowj = tillnowj + this.col_arr[j];
                    }
                }
                else{
                    this.table[i][j] = new Cell(
                        this.content[j][i],
                        tillnowi,
                        tillnowj,
                        this.row_arr[i],
                        this.col_arr[j],
                        i,
                        j
                    );
                    tillnowj = tillnowj + this.col_arr[j];
                }
            }
            tillnowi = tillnowi + this.row_arr[i];
        }
        console.log("2d array done");
    }


    drawGrid(line_offset){
        var canvas = document.querySelector("canvas");
        var c = canvas.getContext("2d");
        var tillnowi = 0
        for(var i = 0; i < this.no_row; i++){
            c.beginPath();
            c.moveTo(tillnowi+0.5, 0);
            c.lineTo(tillnowi+0.5, window.innerHeight);
            c.lineWidth = line_width;
            c.strokeStyle = "#e1e1e1";
            c.stroke();
            tillnowi += this.row_arr[i];
        }
        var tillnowj = 0
        for(var i = 0; i < this.no_col; i++){
            c.beginPath();
            c.moveTo(0, tillnowj+0.5-line_offset*19);
            c.lineTo(window.innerWidth, tillnowj+0.5-line_offset*19);
            c.strokeStyle = "#e1e1e1";
            c.lineWidth = line_width;
            c.stroke();
            tillnowj += this.col_arr[i];
        }
    }

    drawTable(line_offset) {
        var canvas = document.querySelector("canvas");
        var c = canvas.getContext("2d");
        c.clearRect(0,0,8000,8000);
        this.make2darray()
        this.drawGrid(line_offset);
        var tillnowi = 0;
        for (var i=0; i < this.row_arr.length; i++) {
            var tillnowj = 0;
            for (var j = line_offset; j < this.col_arr.length; j++) {
                if (i == 0 || j == 0){
                    if (i == 0 && j == 0){
                        const content = "null";
                        var cellnew = this.table[i][j];
                        cellnew.drawCell(line_offset);
                        tillnowj = tillnowj + this.col_arr[j];
                        continue;
                    }
                    else if (i == 0){
                        var cellnew = this.table[i][j];
                        cellnew.drawCell(line_offset);
                        tillnowj = tillnowj + this.col_arr[j];
                    }
                    else if(j == 0){
                        var cellnew = this.table[i][j];
                        cellnew.drawCell(line_offset);
                        tillnowj = tillnowj + this.col_arr[j];
                    }
                }
                else{
                    var cellnew = this.table[i][j];
                    cellnew.drawCell(line_offset);
                    tillnowj = tillnowj + this.col_arr[j];
                }
            }
            tillnowi = tillnowi + this.row_arr[i];
        }
    }


    findElement(table, element, line_offset) {
        for (var i=0; i < this.table.length; i++) {
            for (var j = 0; j < this.table[0].length; j++) {
                    if(this.table[i][j].content == element){
                        var cell = this.table[i][j]
                        drawSelectedCell(table, cell, line_offset);
                    }
            }
        }
    }


    updateDropdownContent(sum, average, minn, maxx) {
        document.getElementById('sum').textContent = `Sum: ${sum}`;
        document.getElementById('average').textContent = `Average: ${average}`;
        document.getElementById('min').textContent = `Min: ${minn}`;
        document.getElementById('max').textContent = `Max: ${maxx}`;
    }
    
}

export { Table };
