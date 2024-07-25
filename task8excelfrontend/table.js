import { c } from "./index.js";
import { Cell } from "./cell.js";
class Table {
    constructor(
        no_row,
        no_col,
        row_arr = [150, 150, 150],
        col_arr = [50, 50, 50],
        content = [[4], [5], [6]][[8], [9], [0]]
    ) {
        this.no_row = no_row;
        this.no_col = no_col;
        this.row_arr = row_arr;
        this.col_arr = col_arr;
        this.table = new Array(no_row);
        this.content = content;
    }

    make2darray(){
        var tillnowi = 0;
        console.log("2d array ke andar")
        for (var i = 0; i < this.row_arr.length; i++) {
            this.table[i] = new Array(26);
            var tillnowj = 0;
            for (var j = 0; j < this.col_arr.length; j++) {
                if (i == 0 || j == 0){
                    if (i == 0){
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

    
    drawGrid(){
        var tillnowi = 0
        for(var i = 0; i < this.no_row; i++){
            c.beginPath();
            c.moveTo(tillnowi, 0);
            c.lineTo(tillnowi, 1000);
            c.strokeStyle = "black";
            c.stroke();
            tillnowi += this.row_arr[i];
        }
        var tillnowj = 0
        for(var i = 0; i < this.no_col; i++){
            c.beginPath();
            c.moveTo(0, tillnowj);
            c.lineTo(10000, tillnowj);
            c.strokeStyle = "black";
            c.stroke();
            tillnowj += this.col_arr[i];
        }
    }

    drawTable() {
        c.clearRect(0,0,8000,8000);
        this.drawGrid();

        var tillnowi = 0;
        for (var i = 0; i < this.row_arr.length; i++) {
            var tillnowj = 0;
            for (var j = 0; j < this.col_arr.length; j++) {
                if (i == 0 || j == 0){
                    if (i == 0){
                        const content = (j).toString();
                        var cellnew = this.table[i][j];
                        cellnew.drawCell();
                        tillnowj = tillnowj + this.col_arr[j];
                    }
                    else if(j == 0){
                        const content = String.fromCharCode(65 + i-1); // A == 65 ins ascii
                        var cellnew = this.table[i][j];
                        cellnew.drawCell();
                        tillnowj = tillnowj + this.col_arr[j];
                    }
                }
                else{
                    var cellnew = this.table[i][j];
                    cellnew.drawCell();
                    tillnowj = tillnowj + this.col_arr[j];
                }
            }
            tillnowi = tillnowi + this.row_arr[i];
        }
    }
}

export { Table };
