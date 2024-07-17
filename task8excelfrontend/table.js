import {c} from "./canvas.js";
import { Cell } from "./cell.js"
class Table {
    constructor(no_row, no_col, row_arr=[150,150,150], col_arr=[50,50,50]){
        this.no_row = no_row
        this.no_col = no_col
        this.row_arr = row_arr
        this.col_arr = col_arr
    }


    drawTable() {
        let tillnowi = this.row_arr[0];
        for (let i = 1; i <= (this.row_arr).length; i++) {
            const content = i.toString();
            const cell = new Cell(content, tillnowi, 0, this.row_arr[i], 50);
            cell.drawCell();
            tillnowi += this.row_arr[i];
        }

        let tillnowj = this.col_arr[0];
        for (let j = 0; j < (this.col_arr).length; j++) {
            const content = String.fromCharCode(65 + j); // A == 65 ins ascii
            let cell = new Cell(content, 0, tillnowj, 150, (this.col_arr[j]));
            cell.drawCell();
            tillnowj += this.col_arr[j];
        }
        
        tillnowi = 0;
        for (var i = 0; i < (this.row_arr).length; i++){
            tillnowj = 0;
            for (var j = 0; j < (this.col_arr).length; j++){
                let cellnew = new Cell("asdf", tillnowi+150, tillnowj+50, (this.row_arr[i]), (this.col_arr[j]));
                cellnew.drawCell();
                tillnowj = tillnowj + this.col_arr[j];
            }
            tillnowi = tillnowi + this.row_arr[i];
        }
        console.log("table done")
    }
}

export {Table};