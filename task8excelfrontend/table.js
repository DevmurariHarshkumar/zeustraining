import {c} from "./canvas.js";
import { Cell } from "./cell.js"
class Table {
    constructor(no_row, no_col, row_arr=[150,350,50], col_arr=[150,100,500]){
        this.no_row = no_row
        this.no_col = no_col
        this.row_arr = row_arr
        this.col_arr = col_arr
    }


    drawTable() {
        var tillnowi = 0;
        for (var i = 0; i < (this.row_arr).length; i++){
            var tillnowj = 0;
            for (var j = 0; j < (this.col_arr).length; j++){
                let cellnew = new Cell("asdf", tillnowi, tillnowj, (this.row_arr[i]), (this.col_arr[j]));
                cellnew.drawCell();
                tillnowj = tillnowj + this.col_arr[j];
            }
            tillnowi = tillnowi + this.row_arr[i];
        }
        console.log("table done")
    }
}


export {Table};