const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const level1 = document.getElementById("level1");
const level2 = document.getElementById("level2");
const level3 = document.getElementById("level3");

// セル正方形のサイズ
const cellSize = 20
// 画面縦のセル数
const screenH = canvas.height / cellSize
// 画面横のセル数
const screenW = canvas.width / cellSize
// 蛇クラス
class Snake {
    constructor(row, col) {
        this.row = row
        this.col = col
    }
}
// 蛇配列
let snakeArr
// 方向
let direction
// タイマー停止用
let intervalID
// 餌座標
let food

function init(t) {
    direction = "down"
    ctx.lineWidth = 1
    snakeArr = []
    food = {}

    snakeArr.push(new Snake(5, 5))

    randomFood()

    clearInterval(intervalID)
    intervalID = setInterval(draw, t)
}

function randomFood() {
    const row = Math.floor(Math.random() * screenH)
    const col = Math.floor(Math.random() * screenW)
    food.row = row
    food.col = col
}

function draw() {
    let newHead
    if (direction === "up") {
        newHead = new Snake(snakeArr[0].row - 1, snakeArr[0].col)
    } else if (direction === "left") {
        newHead = new Snake(snakeArr[0].row, snakeArr[0].col - 1)
    } else if (direction === "down") {
        newHead = new Snake(snakeArr[0].row + 1, snakeArr[0].col)
    } else if (direction === "right") {
        newHead = new Snake(snakeArr[0].row, snakeArr[0].col + 1)
    }

    for (const v of snakeArr) {
        if (v.row === newHead.row && v.col === newHead.col) {
            gameOver()
            return
        }
    }

    if (food.row === newHead.row && food.col === newHead.col) {
        snakeArr.unshift(newHead)
        randomFood()
    } else if (newHead.row >= 0 &&
        newHead.col >= 0 &&
        newHead.row < screenH &&
        newHead.col < screenW
    ) {
        snakeArr.unshift(newHead)
        snakeArr.pop()
    } else {
        gameOver()
        return
    }

    // 描画
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let row = 0; row < screenH; row++) {
        for (let col = 0; col < screenW; col++) {

            if (snakeArr[0].row === row && snakeArr[0].col === col) {
                ctx.fillStyle = "green";
                for (const v of snakeArr) {
                    ctx.fillRect(v.col * cellSize, v.row * cellSize, cellSize, cellSize)
                    ctx.strokeStyle = "black"
                    ctx.strokeRect(v.col * cellSize, v.row * cellSize, cellSize, cellSize)
                }
            }

            if (food.row === row && food.col === col) {
                ctx.fillStyle = "red";
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
            }

            ctx.strokeStyle = "black"
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize)
        }
    }

    ctx.fillStyle = "springgreen"
    ctx.font = "bold 30pt sans-serif"
    ctx.strokeText("Score:", 22, 55)
    ctx.strokeText(snakeArr.length - 1, 170, 55)
}

function gameOver() {
    clearInterval(intervalID)
    let text = "Game over"
    ctx.fillStyle = "white"
    ctx.font = "bold 60pt sans-serif"
    let metrics = ctx.measureText(text);
    let center = canvas.width / 2 - metrics.width / 2
    ctx.fillText(text, center, 200)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3
    ctx.strokeText(text, center, 200)
}

document.addEventListener("keydown", (e) => {
    if ((e.keyCode === 87 || e.keyCode === 38) && direction !== "down") {
        // w 上
        direction = "up"
    } else if ((e.keyCode === 65 || e.keyCode === 37) && direction !== "right") {
        // a 左
        direction = "left"
    } else if ((e.keyCode === 83 || e.keyCode === 40) && direction !== "up") {
        // s 下
        direction = "down"
    } else if ((e.keyCode === 68 || e.keyCode === 39) && direction !== "left") {
        // d 右
        direction = "right"
    } else if (e.keyCode === 32) {
        alert(`${food.row}-${food.col}`)
    }
})

level1.addEventListener("click", () => {
    init(200)
})

level2.addEventListener("click", () => {
    init(100)
})

level3.addEventListener("click", () => {
    init(50)
})
