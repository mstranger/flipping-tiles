import { Controller } from "@hotwired/stimulus"
import Board from "../modules/board"
import rules from "../utils/rules"
import levels from "../utils/levels"

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
    this.infoTarget.setAttribute("title", rules.slice(1))
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
      this.checkGameState()
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
    other methods
  */

  render() {
    const { rows, cols } = levels[this.levelTarget.value]

    this.boardTarget.innerHTML = ""
    this.boardTarget.appendChild(Board.create(rows, cols))
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
  checkGameState() {
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
      this.checkGameFinish()
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

  // check if the current game is over
  checkGameFinish() {
    if (Board.allCellsFlipped(this.boardTarget)) {
      const spent = (new Date().getTime() - this.timer) / 1000
      this.timerTarget.parentNode.classList.remove("d-none")
      this.timerTarget.textContent = spent.toFixed(2)
    }
  }
}
