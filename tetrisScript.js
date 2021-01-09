let ctx;
let canvas;
let gBAarrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1;
let winOrLose = "Playing";
let tetrisLogo;
let coordinateArray = [...Array(gBAarrayHeight)].map(e => Array(gBArrayWidth).fill(0));
let curTetromino = [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1]
];
let tetrominos = [];
let tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];
let curTetrominoColor;
let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));
let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

document.addEventListener('DOMContentLoaded', SetupCanvas);

function CreateCoordArray() {
    let i = 0,
        j = 0;
    for (let y = 9; y <= 446; y += 23) {
        for (let x = 11; x <= 264; x += 23) {
            coordinateArray[i][j] = new Coordinates(x, y);
            i++;
        }
        j++
        i = 0
    }
}

function SetupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 6550;

    ctx.scale(1, 1);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'white';
    ctx.strokeRect(8, 8, 280, 462);

    tetrisLogo = new Image(161, 54);
    tetrisLogo.onload = DrawTetrisLogo;
    tetrisLogo.src = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/756ac3cf-5cef-4bfe-a74e-43e4d713903a/d8h1sf0-7c3dd7bd-a7de-474f-b577-37ef8ec354f6.png/v1/fill/w_1024,h_341,strp/tetris_logo_by_jmk_prime_d8h1sf0-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD0zNDEiLCJwYXRoIjoiXC9mXC83NTZhYzNjZi01Y2VmLTRiZmUtYTc0ZS00M2U0ZDcxMzkwM2FcL2Q4aDFzZjAtN2MzZGQ3YmQtYTdkZS00NzRmLWI1NzctMzdlZjhlYzM1NGY2LnBuZyIsIndpZHRoIjoiPD0xMDI0In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.wIpdSQOMD6PReqpfkGSrhRU-rLVuiT9FDyxXxAdATEA";

    ctx.fillStyle = 'white';
    ctx.font = '21px Arial';
    ctx.fillText("Score", 300, 98);

    ctx.strokeRect(300, 107, 161, 24);
    ctx.fillText(score.toString(), 310, 127);

    ctx.fillText("Level", 300, 157);
    ctx.strokeRect(300, 171, 161, 24);
    ctx.fillText(level.toString(), 310, 190);

    ctx.fillText("Win/Lose", 300, 221);
    ctx.fillText(winOrLose, 306, 255);
    ctx.strokeRect(300, 232, 161, 30);



    ctx.fillText("Controls", 300, 354);
    ctx.strokeRect(300, 366, 161, 104);
    ctx.font = '18px Arial';
    ctx.fillText("A: Move Left", 305, 388);
    ctx.fillText("D: Move Right", 305, 413);
    ctx.fillText("S: Move Down", 305, 438);
    ctx.fillText("W: Rotate Rigth", 305, 463);

    document.addEventListener('keydown', HandleKeyPress);
    CreateTetrominos();
    CreateTetromino();

    CreateCoordArray();
    DrawTetromino();
}

function DrawTetrisLogo() {
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}

function DrawTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function HandleKeyPress(key) {
    if (winOrLose != "Game Over") {
        if (key.keyCode == 65) {
            direction = DIRECTION.LEFT;
            if (!HittingTheWall() && !CheckForHorizontalCollision()) {
                DeleteTetromino();
                startX--;
                DrawTetromino();
            }
        } else if (key.keyCode == 68) {
            direction = DIRECTION.RIGHT;
            if (!HittingTheWall() && !CheckForHorizontalCollision()) {
                DeleteTetromino();
                startX++;
                DrawTetromino();
            }
        } else if (key.keyCode == 83) {
            MoveTetrominoDown();
        } else if (key.keyCode === 87) {
            RotateTetromino();
        }
    }

}

function MoveTetrominoDown() {
    direction = DIRECTION.DOWN;
    if (!CheckForVerticalCollision()) {
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}

window.setInterval(function() {
    if (winOrLose != "Game Over") {
        MoveTetrominoDown();
    }
}, 1000);

function DeleteTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 0;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'black';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function CreateTetrominos() {
    //Push T
    tetrominos.push([
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1]
    ]);
    //Push I
    tetrominos.push([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0]
    ]);
    //Push J
    tetrominos.push([
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1]
    ]);
    //Push square
    tetrominos.push([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1]
    ]);
    //Push L
    tetrominos.push([
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1]
    ]);
    //Push S
    tetrominos.push([
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1]
    ]);
    //Push Z
    tetrominos.push([
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1]
    ]);
}

function CreateTetromino() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    curTetromino = tetrominos[randomTetromino];
    curTetrominoColor = tetrominoColors[randomTetromino];
}

function HittingTheWall() {
    for (let i = 0; i < curTetromino.length; i++) {
        let newX = curTetromino[i][0] + startX;
        if (newX <= 0 && direction === DIRECTION.LEFT) {
            return true;
        } else if (newX >= 11 && direction === DIRECTION.RIGHT) {
            return true;
        }
    }
    return false;
}

function CheckForVerticalCollision() {
    let tetrominoCopy = curTetromino;
    let collision = false;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if (direction === DIRECTION.DOWN) {
            y++;
        }
        if (typeof stoppedShapeArray[x][y + 1] === 'string') {
            DeleteTetromino();
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if (y >= 20) {
            collision = true;
            break;
        }
    }
    if (collision) {
        if (startY <= 2) {
            winOrLose = "Game Over";
            ctx.fillStyle = "black";
            ctx.fillRect(306, 235, 130, 25);
            ctx.fillStyle = 'white';
            ctx.fillText(winOrLose, 305, 255);
        } else {
            for (let i = 0; i < tetrominoCopy.length; i++) {
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                stoppedShapeArray[x][y] = curTetrominoColor;
            }
            CheckForCompletedRows();
            CreateTetromino();
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }
    }
}

function CheckForHorizontalCollision() {
    let tetrominoCopy = curTetromino;
    let collision = false;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;

        if (direction === DIRECTION.LEFT) {
            x--;
        } else if (direction === DIRECTION.RIGHT) {
            x++;
        }
        var stoppedShapeVal = stoppedShapeArray[x][y];
        if (typeof stoppedShapeVal === 'string') {
            collision = true;
            break;
        }
    }
    return collision;
}

function CheckForCompletedRows() {
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    for (let y = 0; y < gBAarrayHeight; y++) {
        let completed = true;
        for (let x = 0; x < gBArrayWidth; x++) {
            let square = stoppedShapeArray[x][y];
            if (square === 0 || (typeof square === 'undefined')) {
                completed = false;
                break;
            }
        }
        if (completed) {
            if (startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            for (let i = 0; i < gBArrayWidth; i++) {
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                ctx.fillStyle = 'black';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if (rowsToDelete > 0) {
        score += 10;
        ctx.fillStyle = 'black';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'white';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);

    }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
    for (var i = startOfDeletion - 1; i >= 0; i--) {
        for (var x = 0; x < gBArrayWidth; x++) {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];
            if (typeof square === 'string') {
                nextSquare = square;
                gameBoardArray[x][y2] = 1;
                stoppedShapeArray[x][y2] = square;
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0;
                stoppedShapeArray[x][i] = 0;
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'black';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

function RotateTetromino() {
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        curTetrominoBU = [...curTetrominoColor];
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();
    try {
        curTetromino = newRotation;
        DrawTetromino();
    } catch (e) {
        if (e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

function GetLastSquareX() {
    let lastX = 0;
    for (let i = 0; i < curTetromino.length; i++) {
        let square = curTetromino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX
}