/*
  Returns shuffled collection

  @param {collection} arr
*/
export default function shuffle(arr) {
  const len = arr.length
  const result = []

  for (let i = 0; i < len; i++) {
    let rIndex = Math.floor(Math.random() * arr.length)
    result.push(arr[rIndex])
    arr.splice(rIndex, 1)
  }

  return result
}
