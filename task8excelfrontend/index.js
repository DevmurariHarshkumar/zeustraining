console.log("i")

import { fetchData, apidataa } from "./backend.js";
import { Table } from "./table.js";
import {
    Cell,
    getSelectedCells,
    getCellFromClick,
    drawSelectedCellMain,
    drawSelectedCellIndexes,
    drawSelectedCell,
    selectWholeLine,
    selectArea
} from "./cell.js";


// constants

var apidata;
var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight-100; // innerheight-(header_height+footer_height)
var c = canvas.getContext("2d");
// canvas.style.cursor = "cell"
var font_size = "10px";
var colour_shades = ["#CAEAD8", "#137E43"]
var isResizeEdge, edge;
var initial_x_position = 0, initial_y_position = 0, initial_width = 0, initial_height = 0, new_x_position = 0, new_y_position = 0;
var mouse_down_cell;
var selected_cell, selectedCells, isMouseDown, initialCell, finalCell;

if(typeof apidata === "undefined") {
    apidata = Array.from({ length: 1000 }, () => 
        Array.from({ length: 20 }, () => '')
    );
    console.log("undefined apidata", apidata)
}
else{
    apidata = apidataa
    console.log("csv apidata", apidataa)
}

var rows = new Array(apidata[0].length).fill(130);
var cols = new Array(apidata.length).fill(19);
rows[0] = 21;
var table = new Table(rows.length, cols.length, rows, cols, apidata);
table.drawTable();


// single click
// canvas.addEventListener("click", (event) => {
//     let rect = canvas.getBoundingClientRect();
//     let x_position = event.clientX - rect.left;
//     let y_position = event.clientY - rect.top;
//     var cell = getCellFromClick(x_position, y_position);
//     drawSelectedCell(cell);
// });


// double click
canvas.addEventListener("dblclick", (event) => {
    let rect = canvas.getBoundingClientRect();
    let x_position = event.clientX - rect.left;
    let y_position = event.clientY - rect.top;
    var cell = getCellFromClick(x_position, y_position, line_offset);
    selected_cell = cell;
    c.fillStyle = "white";
    c.fillRect(cell.x_px+2, cell.y_px+2, cell.width-5, cell.height-5);
    const input = document.createElement("input");
    input.type = "text";
    input.style.position = "absolute";
    input.style.left = `${cell.x_px + 6}px`; // hardcoded
    input.style.top = `${cell.y_px + 75}px`; // hardcoded
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
        table.drawTable();
    };
    input.addEventListener("blur", saveInput);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            saveInput();
        }
    });
});


// keyboard press
window.addEventListener("keydown", (event) => {
    table.drawTable();
    if (event.key == "ArrowUp") {
        var nextcell =
            table.table[selected_cell.x_pos][selected_cell.y_pos - 1];
        drawSelectedCell(nextcell, line_offset);
        selected_cell = nextcell;
    }
    if (event.key == "ArrowDown") {
        var nextcell =
            table.table[selected_cell.x_pos][selected_cell.y_pos + 1];
        drawSelectedCell(nextcell, line_offset);
        selected_cell = nextcell;
    }
    if (event.key == "ArrowLeft") {
        var nextcell =
            table.table[selected_cell.x_pos - 1][selected_cell.y_pos];
        drawSelectedCell(nextcell, line_offset);
        selected_cell = nextcell;
    }
    if (event.key == "ArrowRight") {
        var nextcell =
            table.table[selected_cell.x_pos + 1][selected_cell.y_pos];
        drawSelectedCell(nextcell, line_offset);
        selected_cell = nextcell;
    }
});


function resizeLinex(edge, initial_x_position, initial_y_position, new_x_position, new_y_position){
    var new_width = initial_width + new_x_position - initial_x_position;
    if (new_width > 25){
        rows[edge-1] = new_width;
    }
}
function resizeLiney(edge, initial_x_position, initial_y_position, new_x_position, new_y_position){
    var new_height = initial_height + new_y_position - initial_y_position;
    if (new_height > 15){
        cols[edge-1] = new_height;
    }
}


function nearEdgex(x_position){
    var rowtillnow = 0;
    for (var i=0; i<rows.length; i++){
        if (Math.abs(rowtillnow - x_position) < 5){
            return i;
        }
        rowtillnow += rows[i]
    }
    return 0;
}
function nearEdgey(y_position){
    var coltillnow = 0;
    for (var j=0; j<cols.length; j++){
        if (Math.abs(coltillnow - y_position) < 5){
            return j;
        }
        coltillnow += cols[j]
    }
    return 0;
}


// mouse press
canvas.addEventListener("mousedown", (event) => {
    table.drawTable();
    selectedCells = [];
    isResizeEdge = false;
    let rect = canvas.getBoundingClientRect();
    let x_position = event.clientX - rect.left;
    let y_position = event.clientY - rect.top;
    initialCell = getCellFromClick(x_position, y_position, line_offset);
    mouse_down_cell = initialCell;

    if (initialCell.x_pos == 0 || initialCell.y_pos == 0){
        if (initialCell.y_pos == 0){
            edge = nearEdgex(x_position)
            if (edge){
                initial_width = rows[edge-1]
                initial_height = cols[edge]-1
                initial_x_position = event.clientX - rect.left;
                initial_y_position = event.clientY - rect.top;
                isResizeEdge = true;
            }
            else{
                selectWholeLine([initialCell]);
            }
        }
        if (initialCell.x_pos == 0){
            edge = nearEdgey(y_position)
            if (edge){
                initial_width = rows[edge-1]
                initial_height = cols[edge]-1
                initial_x_position = event.clientX - rect.left;
                initial_y_position = event.clientY - rect.top;
                isResizeEdge = true;
            }
            else{
                selectWholeLine([initialCell]);
            }
        }
    }
    selected_cell = initialCell;
    if (initialCell) {
        isMouseDown = true;
        selectedCells = [initialCell];
        selectedCells.forEach((cell) => {
            drawSelectedCell(cell, line_offset);
        });
    }
});


function updateDropdownContent(sum, average, minn, maxx) {
    document.getElementById('sum').textContent = `Sum: ${sum}`;
    document.getElementById('average').textContent = `Average: ${average}`;
    document.getElementById('min').textContent = `Min: ${minn}`;
    document.getElementById('max').textContent = `Max: ${maxx}`;
}


// mouse move
canvas.addEventListener("mousemove", (event) => {
    var sum = 0;
    var average = 0;
    var minn = Number.POSITIVE_INFINITY;
    var maxx = Number.NEGATIVE_INFINITY;
    if (isMouseDown) {
        if (isResizeEdge){
            let rect = canvas.getBoundingClientRect();
            let new_x_position = event.clientX - rect.left;
            let new_y_position = event.clientY - rect.top;
            initialCell = getCellFromClick(new_x_position, new_y_position, line_offset);
            if (mouse_down_cell.x_pos == 0 || mouse_down_cell.y_pos == 0){
                if (mouse_down_cell.y_pos == 0){
                    document.body.style.cursor = "col-resize"
                    resizeLinex(edge, initial_x_position, initial_y_position, new_x_position, new_y_position);
                }
                if (mouse_down_cell.x_pos == 0){
                    document.body.style.cursor = "row-resize"
                    resizeLiney(edge, initial_x_position, initial_y_position, new_x_position, new_y_position);
                }
            }
            table.drawTable();
        }
        else{
            table.drawTable();
            let rect = canvas.getBoundingClientRect();
            let x_position = event.clientX - rect.left;
            let y_position = event.clientY - rect.top;
            finalCell = getCellFromClick(x_position, y_position, line_offset);
            selectedCells = getSelectedCells(initialCell, finalCell);
            if (finalCell.x_pos == 0 || finalCell.y_pos == 0){
                selectWholeLine(selectedCells);
            }
            else{
                selectedCells.forEach((cell) => {
                drawSelectedCellIndexes(cell);
                });
                selectArea(initialCell, finalCell, selectedCells)
            }
            
            for (var i = 0; i < selectedCells.length; i++) {
                if (!isNaN(parseFloat(selectedCells[i].content))){
                    sum += parseFloat(selectedCells[i].content)
                }
                average = sum / selectedCells.length;
                minn = Math.min(minn, selectedCells[i].content);
                maxx = Math.max(maxx, selectedCells[i].content);
            }
            updateDropdownContent(sum, average, minn, maxx);
        }
    }});


    // mouse release
canvas.addEventListener("mouseup", (event) => {
    if(isMouseDown){
        isMouseDown = false;
    }
    if(isResizeEdge){
        initial_y_position = 0;
        initial_x_position = 0;
        initial_x_position = 0;
        new_x_position = 0;
        new_y_position = 0;
        initial_width = 0;
        initial_height = 0;
        isResizeEdge = false;
        document.body.style.cursor = "auto"
    }
});

var line_offset = 0;
function getscrollamount(rowstart){
    if (line_offset == 0 && rowstart < 0){
        line_offset = 0
        rowstart = 0
    }
    line_offset += rowstart;
}


// scrolling
canvas.addEventListener("wheel", (event) => {
    if (event.deltaY > 0){
        getscrollamount(20)
        table.drawGrid()
        table.drawTable()
    }
    else{
        getscrollamount(-20)
        table.drawGrid()
        table.drawTable()
    }
})


// resing canvas
window.addEventListener('resize', (event) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight-100; // innerheight-(header_height+footer_height)
    var c = canvas.getContext("2d");
    table.drawTable()
});


var find_button = document.getElementById("findelement")
find_button.addEventListener('click', (event) => {
    var element = document.getElementById("textelement").value
    table.findElement(element)
})

var csv = document.getElementById("csvUpload")
uploadButton.addEventListener('click', async (event) => {
    
    const file = csv.files[0]; // Get the selected file
    console.log("csv", file)
    
    if (!file) {
        console.error('No file selected');
        return;
    }

    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append('file', file);

    try {
        // Send the POST request with the FormData
        const response = await fetch('http://localhost:5205/api/v1/upload/uploadsinglequery', {
            method: 'POST',
            body: formData,
        });

        // Check if the response is okay
        if(response.ok)
        {
            try{
                await fetchData();
            }
            catch{
                console.log("internal server error");
            }
        }
        if (!response.ok) {
            console.log("response not okay!!!!");
            throw new Error('Network response was not ok');
        }

        // Process the response
        const result = await response.json();
        console.log('Upload successful:', result);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
})


export { c, table, line_offset };
