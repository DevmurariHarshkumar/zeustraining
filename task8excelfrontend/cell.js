console.log("c")

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
        var canvas = document.querySelector("canvas");
        var c = canvas.getContext("2d");
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

    make_input_field(apidata, table, cell, line_offset, font_size){
        var canvas = document.querySelector("canvas");
        var c = canvas.getContext("2d");
        c.fillStyle = "white";
        c.fillRect(cell.x_px+2, cell.y_px+2, cell.width-5, cell.height-5);
        const input = document.createElement("input");
        input.type = "text";
        input.style.position = "absolute";
        input.style.left = `${cell.x_px + 6}px`; // hardcoded
        input.style.top = `${cell.y_px + 75 - line_offset*19}px`; // hardcoded
        input.style.width = `${cell.width - 10}px`;
        input.style.height = `${cell.height - 8}px`;
        input.style.outline = 'none'
        input.style.border = "0px";
        input.style.fontSize = font_size;
        input.value = cell.content
        document.body.appendChild(input);
        input.focus();
        const saveInput = () => {
            cell.content = input.value;
            apidata[cell.y_pos][cell.x_pos] = input.value;
            document.body.removeChild(input);
            table.drawTable(line_offset);
        };
        input.addEventListener("blur", saveInput);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                saveInput();
            }
        });
    }
}

function getSelectedCells(table, initialCell, finalCell) {
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

function getCellFromClick(table, x, y, line_offset) {
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


function drawSelectedCellMain(table, cell, line_offset){
    var canvas = document.querySelector("canvas");
    var c = canvas.getContext("2d");
    c.strokeStyle = "rgb(35, 116, 72)";
    c.strokeRect(cell.x_px+1, (cell.y_px-line_offset*19)+1, cell.width-1, cell.height-1);
    c.strokeRect(cell.x_px+1, (cell.y_px-line_offset*19)+1, cell.width-1, cell.height-1);
    c.beginPath()
    c.arc((cell.x_px+cell.width), ((cell.y_px-line_offset*19)+cell.height), 3, 0, 2 * Math.PI);
    c.fillStyle = "rgb(35, 116, 72)";
    c.fill()
}


function drawSelectedCellArea(cell){
    var canvas = document.querySelector("canvas");
    var c = canvas.getContext("2d");
    // erase and redraw text
    // c.fillStyle = "white";
    // c.fillRect(cell.x_px, cell.y_px, cell.width, cell.height);
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

    // highlight cell
    c. fillStyle = "rgba(33, 178, 31, 0.3)"
    c.fillRect(
        cell.x_px + 0.25,
        cell.y_px + 0.25,
        cell.width - 1.5,
        cell.height - 1.5
    );
    console.log("cell.x_pos", cell.x_pos)
}

function drawSelectedCellIndexes(table, cell, line_offset){
    // erase and redraw text
    var canvas = document.querySelector("canvas");
    var c = canvas.getContext("2d");
    c.fillStyle = "white";
    c.fillRect(cell.x_px, cell.y_px, cell.width, cell.height);
    c.fillStyle = "black";
    c.font = "10px"; //font_size
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.textRendering = "auto";
    c.fillText(
        cell.content,
        cell.x_px + cell.width / 2,
        cell.y_px + cell.height / 2,
        cell.width
    );

    // highlight cell
    c. fillStyle = "rgba(33, 178, 31, 0.3)"
    c.fillRect(
        cell.x_px + 0.25,
        cell.y_px + 0.25 -line_offset*19,
        cell.width - 1.5,
        cell.height - 1.5
    );

    // highlight line effect
    if (cell.x_pos == 0){
        c.strokeStyle = "rgba(33, 178, 31, 1)"
        c.lineWidth = 2
        c.beginPath();
        c.moveTo(cell.x_px+cell.width, cell.y_px-line_offset*19);
        c.lineTo(cell.x_px+cell.width, cell.y_px+cell.width-line_offset*19);
        c.stroke();
    }
    else{
        c.strokeStyle = "rgba(33, 178, 31, 1)"
        c.lineWidth = 2
        c.beginPath();
        c.moveTo(cell.x_px, cell.y_px+cell.height);
        c.lineTo(cell.x_px+cell.width, cell.y_px+cell.height);
        c.stroke();
    }
}


function selectArea(table, initialCell, finalCell, selectedCells, line_offset){
    var canvas = document.querySelector("canvas");
    var c = canvas.getContext("2d");
    const startX = Math.min(initialCell.x_pos, finalCell.x_pos);
    const endX = Math.max(initialCell.x_pos, finalCell.x_pos);
    const startY = Math.min(initialCell.y_pos, finalCell.y_pos);
    const endY = Math.max(initialCell.y_pos, finalCell.y_pos);
    const top_left = selectedCells.find(cell => cell.x_pos === startX && cell.y_pos === startY);
    const bottom_right = selectedCells.find(cell => cell.x_pos === endX && cell.y_pos === endY);
    c.strokeStyle = "rgba(30, 108, 66, 1)";
    c.fillStyle = "rgba(30, 108, 66, 0.3)"
    c.strokeRect(top_left.x_px+1, (top_left.y_px-line_offset*19)+1, bottom_right.x_px-top_left.x_px+bottom_right.width-1, (bottom_right.y_px-top_left.y_px+bottom_right.height)-1);
    c.fillRect(top_left.x_px+1, (top_left.y_px-line_offset*19)+1, bottom_right.x_px-top_left.x_px+bottom_right.width-1, bottom_right.y_px-top_left.y_px+bottom_right.height-1)
    c.beginPath()
    c.arc((bottom_right.x_px+bottom_right.width), (bottom_right.y_px+bottom_right.height-line_offset*19), 3, 0, 2 * Math.PI);
    c.fillStyle = "rgb(35, 116, 72)";
    c.fill()
    
    selectedCells.forEach(cell => {
        drawSelectedCellIndexes(table, table.table[0][cell.y_pos], line_offset);
        drawSelectedCellIndexes(table, table.table[cell.x_pos][0], line_offset);
    });
}

function selectWholeLine(table, cells){
    cells.forEach((cell) => {
        if (cell.x_pos == 0){
            for (var i = 0; i < table.row_arr.length; i++){
                cell = table.table[i][cell.y_pos];
                if (!cells.includes(cell) && (cell.x_pos != 0 || cell.y_pos != 0)) {
                    cells.push(cell);
                }
                drawSelectedCellArea(cell)
            }
        }
        if (cell.y_pos == 0){
            for (var i = 0; i < table.col_arr.length; i++){
                cell = table.table[cell.x_pos][i];
                if (!cells.includes(cell)) {
                    cells.push(cell);
                }
                drawSelectedCellArea(cell);
            }
        }
    });
}

function drawSelectedCell(table, cell, line_offset) {
    drawSelectedCellMain(table, cell, line_offset);
    drawSelectedCellIndexes(table, table.table[0][cell.y_pos], line_offset);
    drawSelectedCellIndexes(table, table.table[cell.x_pos][0], line_offset);
}




export { Cell, getSelectedCells, getCellFromClick, drawSelectedCellMain, drawSelectedCellIndexes, drawSelectedCell, selectWholeLine, selectArea };
