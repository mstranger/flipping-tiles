/*
  Displays given collection in the console with <info> label

  @param {collection} data
  @param {number} rows
  @param {number} cols
*/
export default function printInfo(data, rows, cols) {
  let result = []

  for (let i = 0; i < rows; i++) {
    let line = []
    for (let j = 0; j < cols; j++) line.push(data[i * cols + j])
    result.push(line.join(",\t"))
  }

  console.info(result.join("\n"))
}
