// window.onload = () => {
//     const tableEditor = new TableEditor();
//     console.log("tableEditor.c", tableEditor.c);
// };

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


class TableEditor{
    constructor() {
        // constants
        // rgb(30, 108, 66)
        var apidata;
        var canvas = document.querySelector("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight-100; // innerheight-(header_height+footer_height)
        var c = canvas.getContext("2d");
        // canvas.style.cursor = "cell"
        var font_size = "10px";
        var isResizeEdge, edge;
        var initial_x_position = 0, initial_y_position = 0, initial_width = 0, initial_height = 0, new_x_position = 0, new_y_position = 0;
        var mouse_down_cell;
        var selected_cell, selectedCells, isMouseDown, initialCell, finalCell;
        var line_offset = 0;
        var find_button = document.getElementById("findelement")
        var csv = document.getElementById("csvUpload")

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
        console.log("adfffdfsa", line_offset)
        table.drawTable(line_offset);



    
    
        // single click
        // canvas.addEventListener("click", (event) => {
        //     let rect = canvas.getBoundingClientRect();
        //     let x_position = event.clientX - rect.left;
        //     let y_position = event.clientY - rect.top;
        //     var cell = getCellFromClick(table, x_position, y_position);
        //     drawSelectedCell(table, cell);
        // });


        // double click
        canvas.addEventListener("dblclick", (event) => {
            let rect = canvas.getBoundingClientRect();
            let x_position = event.clientX - rect.left;
            let y_position = event.clientY - rect.top;
            var cell = getCellFromClick(table, x_position, y_position, line_offset);
            selected_cell = cell;
            if (selected_cell.x_pos != 0 && selected_cell.y_pos != 0){
                selected_cell.make_input_field(apidata, table,cell, line_offset, font_size)
            }
        });


        // keyboard press
        window.addEventListener("keydown", (event) => {
            table.drawTable(line_offset);
            console.log(event.key);
            if (event.key == "ArrowUp") {
                if (selected_cell.y_pos != 0){
                    var nextcell =
                        table.table[selected_cell.x_pos][selected_cell.y_pos - 1];
                    drawSelectedCell(table, nextcell, line_offset);
                    selected_cell = nextcell;
                }
            }
            if (event.key == "ArrowDown") {
                var nextcell =
                    table.table[selected_cell.x_pos][selected_cell.y_pos + 1];
                drawSelectedCell(table, nextcell, line_offset);
                selected_cell = nextcell;
            }
            if (event.key == "ArrowLeft") {
                if (selected_cell.x_pos != 0){
                var nextcell =
                    table.table[selected_cell.x_pos - 1][selected_cell.y_pos];
                drawSelectedCell(table, nextcell, line_offset);
                selected_cell = nextcell;
                }
            }
            if (event.key == "ArrowRight") {
                var nextcell =
                    table.table[selected_cell.x_pos + 1][selected_cell.y_pos];
                drawSelectedCell(table, nextcell, line_offset);
                selected_cell = nextcell;
            }
            if (event.key == "Delete"){
                selectedCells.forEach((cell) => {
                    console.log("inside", cell.content);
                    cell.content = "1234";
                    console.log(cell);
                    console.log("inside", cell.content);
                    table.drawTable(line_offset)
                });
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
            table.drawTable(line_offset);
            selectedCells = [];
            isResizeEdge = false;
            let rect = canvas.getBoundingClientRect();
            let x_position = event.clientX - rect.left;
            let y_position = event.clientY - rect.top;
            initialCell = getCellFromClick(table, x_position, y_position, line_offset);
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
                        selectWholeLine(table, [initialCell]);
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
                        selectWholeLine(table, [initialCell]);
                    }
                }
            }
            selected_cell = initialCell;
            if (initialCell) {
                isMouseDown = true;
                selectedCells = [initialCell];
                selectedCells.forEach((cell) => {
                    drawSelectedCell(table, cell, line_offset);
                });
            }
        });


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
                    initialCell = getCellFromClick(table, new_x_position, new_y_position, line_offset);
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
                    table.drawTable(line_offset);
                }
                else{
                    table.drawTable(line_offset);
                    let rect = canvas.getBoundingClientRect();
                    let x_position = event.clientX - rect.left;
                    let y_position = event.clientY - rect.top;
                    finalCell = getCellFromClick(table, x_position, y_position, line_offset);
                    selectedCells = getSelectedCells(table, initialCell, finalCell);
                    if (finalCell.x_pos == 0 || finalCell.y_pos == 0){
                        selectWholeLine(table, selectedCells);
                    }
                    else{
                        selectArea(table, initialCell, finalCell, selectedCells, line_offset)
                    }
                    
                    var no_of_elements = 0
                    for (var i = 0; i < selectedCells.length; i++) {
                        if (!isNaN(parseFloat(selectedCells[i].content))){
                            sum += parseFloat(selectedCells[i].content)
                            no_of_elements+=1
                        }
                        average = sum / no_of_elements;
                        minn = Math.min(minn, selectedCells[i].content);
                        maxx = Math.max(maxx, selectedCells[i].content);
                    }
                    table.updateDropdownContent(sum, average, minn, maxx);
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


        // scrolling amount for keeping track
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
                getscrollamount(10)
                table.drawGrid(line_offset)
                table.drawTable(line_offset)
            }
            else{
                getscrollamount(-10)
                table.drawGrid(line_offset)
                table.drawTable(line_offset)
            }
        })


        // resing canvas
        window.addEventListener('resize', (event) => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight-100; // innerheight-(header_height+footer_height)
            var c = canvas.getContext("2d");
            table.drawTable(line_offset)
        });


        // finding functionality
        find_button.addEventListener('click', (event) => {
            var element = document.getElementById("textelement").value
            table.findElement(table, element, line_offset)
        })


        // upload csv functionality
        uploadButton.addEventListener('click', async (event) => {
            const file = csv.files[0]; // Get the selected file
            console.log("csv", file);

            if (!file) {
                console.error("No file selected");
                return;
            }

            // Create a FormData object and append the file
            const formData = new FormData();
            formData.append("file", file);

            try {
                // Send the POST request with the FormData
                const response = await fetch(
                    "http://localhost:5205/api/v1/upload/uploadsinglequery",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                // Check if the response is okay
                if (response.ok) {
                    try {
                        await fetchData();
                    } catch {
                        console.log("internal server error");
                    }
                }
                if (!response.ok) {
                    console.log("response not okay!!!!");
                    throw new Error("Network response was not ok");
                }

                // Process the response
                const result = await response.json();
                console.log("Upload successful:", result);
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        })
    }
}
// var tableEditor = window.addEventListener('onload', () =>{
//     var x = new TableEditor();
// });

const tableEditor = window.onload(new TableEditor());
console.log("tableEditor.c", tableEditor.c)



export { tableEditor };
