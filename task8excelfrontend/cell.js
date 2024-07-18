import { c } from "./canvas.js";

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
        c.clearRect(this.x_px,this.y_px,this.width,this.height);
        c.strokeStyle = "rgba(153, 151, 151,0.3)";
        c.strokeRect(this.x_px, this.y_px, this.width, this.height);
        c.fillStyle = "black";
        c.font = "18px serif";
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

// would be useful while scrolling ctx.clearRect(10, 10, 120, 100);

export { Cell };
