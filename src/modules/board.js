import shuffle from "../utils/shuffle"
import printInfo from "../utils/printInfo"

export default class Board {
  // returns board with shuffled numbers as DOM element
  static create(rows, cols) {
    const numbersValue = [...Array((rows * cols) / 2 + 1).keys()].slice(1)
    const data = shuffle([...numbersValue, ...numbersValue])
    const board = document.createElement("div")

    board.setAttribute("data-action", "click->game#handleCellClick")
    board.classList.add("board")

    printInfo(data, rows, cols)

    createRows(rows, cols, data).forEach(row => board.appendChild(row))

    return board
  }

  // check flipped cells
  static allCellsFlipped(target) {
    const cells = target.querySelectorAll(".cell")
    const done = target.querySelectorAll(".done")

    return cells.length === done.length
  }
}

// emulate private static methods

// returns array of DOM elements
function createRows(rows, cols, data) {
  let result = []

  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div")
    row.classList.add("d-flex", "gap-1", "mb-1", "justify-content-center")
    createCells(cols, data).forEach(cell => row.appendChild(cell))
    result.push(row)
  }

  return result
}

// returns array of DOM elements
function createCells(cols, data) {
  let cells = []

  for (let j = 0; j < cols; j++) {
    let cell = document.createElement("div")
    cell.classList.add("cell", "shadow")
    cell.textContent = data.shift()
    cells.push(cell)
  }

  return cells
}
