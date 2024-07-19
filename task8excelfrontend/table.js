import { c } from "./canvas.js";
import { Cell } from "./cell.js";
class Table {
    constructor(
        no_row,
        no_col,
        row_arr = [150, 150, 150],
        col_arr = [50, 50, 50]
    ) {
        this.no_row = no_row;
        this.no_col = no_col;
        this.row_arr = row_arr;
        this.col_arr = col_arr;
        this.table = new Array(no_row);
    }

    drawTable() {
        // INDIVIDIAL INITIAL INDEXING ROW AND COLUMN
        // let tillnowi = this.row_arr[0];
        // for (let j = 0; j <= this.row_arr.length; j++) {
        //     const content = String.fromCharCode(65 + j); // A == 65 ins ascii
        //     this.table[0][j] = new Cell(content, tillnowi, 0, this.row_arr[0], 50, 0, j);
        //     var cell = this.table[0][j];
        //     cell.drawCell();
        //     tillnowi += this.row_arr[0];
        // }

        // let tillnowj = this.col_arr[0];
        // for (let i = 1; i < this.col_arr.length; i++) {
        //     const content = j.toString();
        //     this.table[i][0] = new Cell(content, 0, tillnowj, 150, this.col_arr[0], i, 0);
        //     var cell = this.table[i][0];
        //     cell.drawCell();
        //     tillnowj += this.col_arr[0];
        // }
        c.clearRect(0,0,8000,8000);

        var tillnowi = 0;
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
                        var cellnew = this.table[i][j];
                        cellnew.drawCell();
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
                        var cellnew = this.table[i][j];
                        cellnew.drawCell();
                        tillnowj = tillnowj + this.col_arr[j];
                    }
                }
                else{
                    this.table[i][j] = new Cell(// [i + " " + j]
                        i,
                        tillnowi,
                        tillnowj,
                        this.row_arr[i],
                        this.col_arr[j],
                        i,
                        j
                    );
                    var cellnew = this.table[i][j];
                    cellnew.drawCell();
                    tillnowj = tillnowj + this.col_arr[j];
                }
            }
            tillnowi = tillnowi + this.row_arr[i];
        }
        
        console.log("table done");
    }
}

export { Table };
