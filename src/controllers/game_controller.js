import { Controller } from "@hotwired/stimulus"
import shuffle from "../utils/shuffle"

export default class extends Controller {
  static targets = ["board", "finishMessage"]
  static values = { numbers: Array }

  initialize() {
    this.rows = 2
    this.cols = 3
    this.numbersValue = [...Array(this.cellsNumber / 2 + 1).keys()].slice(1)
    this.open = null
  }

  connect() {
    this.boardTarget.appendChild(this.createBoard())
  }

  get cellsNumber() {
    return this.rows * this.cols
  }

  get hasOpenCell() {
    return this.open !== null
  }

  /*
    callbacks
  */

  numbersValueChanged(value, previousValue) {
    // game is over
    if (previousValue && value.length === 0) {
      let messageElem = this.finishMessageTarget
      messageElem.classList.remove("d-none")
    }
  }

  /*
    handlers
  */

  handleClick(e) {
    let elem = e.target

    if (this.wrongTarget(elem)) return

    if (this.hasOpenCell) {
      this.checkGuess(elem)
    } else {
      elem.classList.add("flip")
      this.open = elem
    }
  }

  /*
    private methods
  */

  createBoard() {
    const data = shuffle([...this.numbersValue, ...this.numbersValue])
    const board = document.createElement("div")
    board.setAttribute("data-action", "click->game#handleClick")
    board.classList.add("board")

    console.info(data)

    for (let i = 0; i < this.rows; i++) {
      let row = document.createElement("div")
      row.classList.add("row")

      this.createAndInsertCell(row, data)

      console.info(data)

      board.appendChild(row)
    }

    return board
  }

  createAndInsertCell(row, data) {
    for (let j = 0; j < this.cols; j++) {
      let cell = document.createElement("div")
      cell.classList.add("cell")
      cell.textContent = data.shift()
      row.appendChild(cell)
    }
  }

  wrongTarget(elem) {
    return (
      !elem.classList.contains("cell") ||
      elem.classList.contains("done") ||
      elem.classList.contains("flip")
    )
  }

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
      this.open.classList.remove("flip")
      this.open = null
    }
  }
}
