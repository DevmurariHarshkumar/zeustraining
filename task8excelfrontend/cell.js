import {c} from "./canvas.js";

class Cell {
    constructor(content, x, y, width=150, height=50) {
        this.content = content;
        this.x = x;
        this.y = y;
        this.width = width; 
        this.height = height;
    }

    drawCell() {
        c.strokeRect(this.x, this.y, this.width, this.height);
        c.fillStyle = "black";
        c.font = "50px serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(this.content, this.x+(this.width/2), this.y+(this.height/2), this.width);
    }
}


export {Cell};