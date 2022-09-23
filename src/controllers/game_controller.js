import { Controller } from "@hotwired/stimulus"
import shuffle from "../utils/shuffle"
import printInfo from "../utils/printInfo"

const info = `
  Levels:
    easy - numbers from 1 to 6
    medium - numbers from 1 to 10
    hard - numbers from 1 to 15

  Also you can use developer console info tab to see hints`

// game difficulty levels
const levels = {
  easy: { rows: 3, cols: 4 },
  medium: { rows: 4, cols: 5 },
  hard: { rows: 5, cols: 6 }
}

export default class extends Controller {
  static targets = ["board", "reset", "level", "info", "timer"]

  static values = {
    gameStarted: Boolean,
    level: { type: String, default: "medium" },
    numbers: Array
  }

  initialize() {
    this.open = null
    this.timer = null
  }

  get hasOpenCell() {
    return this.open !== null
  }

  /*
    callbacks
  */

  connect() {
    console.debug("connected...")
    this.levelTarget.addEventListener("change", e => {
      this.levelValue = e.target.value
    })
    this.infoTarget.setAttribute("title", info.slice(1))
  }

  disconnect() {
    console.debug("disconnected...")
  }

  gameStartedValueChanged(newValue, prev) {
    // disable difficulty level if game has started
    if (newValue) this.levelTarget.disabled = true

    // reset all if game has started
    if (prev && !newValue) {
      this.levelTarget.disabled = false
      this.render()
    }
  }

  levelValueChanged() {
    this.render()
  }

  numbersValueChanged(value, previousValue) {
    // all cells are open
    if (previousValue && value.length === 0) {
      let spent = (new Date().getTime() - this.timer) / 1000
      this.timerTarget.parentNode.classList.remove("d-none")
      this.timerTarget.textContent = spent.toFixed(2)
    }
  }

  /*
    actions
  */

  // process click on cell elements
  handleCellClick(e) {
    let elem = e.target

    if (this.wrongTarget(elem)) return

    if (this.hasOpenCell) {
      this.checkGuess(elem)
    } else {
      this.checkGameStarted()
      elem.classList.add("flip")
      this.open = elem
    }
  }

  // reset board and start new game
  resetGame(e) {
    e.preventDefault()

    this.initialize()
    this.gameStartedValue = false
    this.resetTarget.classList.add("d-none")
    this.timerTarget.parentNode.classList.add("d-none")
  }

  /*
    private methods
  */

  render() {
    const { rows, cols } = levels[this.levelTarget.value]

    this.boardTarget.innerHTML = ""
    this.boardTarget.appendChild(this.createBoard(rows, cols))
  }

  // returns board with shuffled numbers as DOM element
  createBoard(rows, cols) {
    this.numbersValue = [...Array((rows * cols) / 2 + 1).keys()].slice(1)

    const data = shuffle([...this.numbersValue, ...this.numbersValue])
    const board = document.createElement("div")
    board.setAttribute("data-action", "click->game#handleCellClick")
    board.classList.add("board")

    printInfo(data, rows, cols)

    for (let i = 0; i < rows; i++) {
      const row = document.createElement("div")
      row.classList.add("d-flex", "gap-1", "mb-1", "justify-content-center")
      this.createCells(cols, data).forEach(cell => row.appendChild(cell))
      board.appendChild(row)
    }

    return board
  }

  // returns array of DOM elements
  createCells(cols, data) {
    let cells = []

    for (let j = 0; j < cols; j++) {
      let cell = document.createElement("div")
      cell.classList.add("cell", "shadow")
      cell.textContent = data.shift()
      cells.push(cell)
    }

    return cells
  }

  // returns true if clicked elem isn't correct cell
  wrongTarget(elem) {
    return (
      !elem.classList.contains("cell") ||
      elem.classList.contains("done") ||
      elem.classList.contains("flip")
    )
  }

  // toggle game state and display reset link
  checkGameStarted() {
    if (!this.gameStartedValue) {
      this.timer = new Date().getTime()

      this.gameStartedValue = true
      this.resetTarget.classList.remove("d-none")
    }
  }

  // compare two flipped cells
  checkGuess(elem) {
    if (this.open.textContent === elem.textContent) {
      // success
      elem.classList.add("flip", "done")
      this.open.classList.add("done")
      this.open = null
      this.numbersValue = this.numbersValue.filter(
        n => n !== Number(elem.textContent)
      )
    } else {
      // fail
      elem.classList.add("flip")
      let open = this.open
      setTimeout(() => {
        elem.classList.remove("flip")
        open.classList.remove("flip")
      }, 350)

      this.open = null
    }
  }
}
