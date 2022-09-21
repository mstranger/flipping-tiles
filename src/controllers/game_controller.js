import { Controller } from "@hotwired/stimulus"
import shuffle from "../utils/shuffle"

export default class extends Controller {
  static targets = ["finishMessage"]
  static values = { numbers: Array }

  initialize() {
    this.rows = 3
    this.cols = 4
    this.numbersValue = [...Array(this.cellsNumber / 2 + 1).keys()].slice(1)
  }

  connect() {
    this.element.appendChild(this.createBoard())
  }

  get cellsNumber() {
    return this.rows * this.cols
  }

  numbersValueChanged(value, previousValue) {
    if (previousValue && value.length === 0) {
      const t = this.finishMessageTarget
      t.classList.remove("d-none")
      t.remove()
      this.element.querySelector(".board").appendChild(t)
    }
  }

  /*
    handlers
  */

  handleClick(e) {
    let elem = e.target

    if (
      !elem.classList.contains("cell") ||
      elem.classList.contains("done") ||
      elem.classList.contains("flip")
    )
      return

    if (this.open) {
      // has open cell
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
    } else {
      // no open
      elem.classList.add("flip")
      this.open = elem
    }
  }

  /*
    methods
  */

  createBoard() {
    const data = shuffle([...this.numbersValue, ...this.numbersValue])
    const board = document.createElement("div")
    board.setAttribute("data-action", "click->game#handleClick")
    board.classList.add("board")

    for (let i = 0; i < this.rows; i++) {
      let row = document.createElement("div")
      row.classList.add("row")

      for (let j = 0; j < this.cols; j++) {
        let cell = document.createElement("div")
        cell.classList.add("cell")
        cell.textContent = data.shift()
        row.appendChild(cell)
      }

      board.appendChild(row)
    }

    return board
  }
}
