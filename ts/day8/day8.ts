import path from 'path'
import { AdventFile } from '../lib/AdventFile'

const isEdge = (idx: number, end: number): boolean => {
  if (idx === 0) {
    return true
  }
  if (idx === end) {
    return true
  }
  return false
}

const isTopVisible = (
  x: number,
  y: number,
  step: number = 0,
  trees: string[]
): boolean => {
  if (y === 0) return true
  const current = parseInt(trees[y + step].charAt(x))
  const top = parseInt(trees[y - 1].charAt(x))
  if (current > top) {
    return isTopVisible(x, y - 1, step + 1, trees)
  }
  return false
}

const isBottomVisible = (
  x: number,
  y: number,
  step: number = 0,
  trees: string[]
): boolean => {
  if (y === trees.length - 1) return true
  const current = parseInt(trees[y - step].charAt(x))
  const bottom = parseInt(trees[y + 1].charAt(x))
  if (current > bottom) {
    return isBottomVisible(x, y + 1, step + 1, trees)
  }
  return false
}

const isLeftVisisble = (
  x: number,
  y: number,
  step: number = 0,
  trees: string[]
): boolean => {
  if (x === 0) return true
  const current = parseInt(trees[y].charAt(x + step))
  const left = parseInt(trees[y].charAt(x - 1))
  if (current > left) {
    return isLeftVisisble(x - 1, y, step + 1, trees)
  }
  return false
}

const isRightVisisble = (
  x: number,
  y: number,
  step: number = 0,
  trees: string[]
): boolean => {
  if (x === trees[y].length - 1) return true
  const current = parseInt(trees[y].charAt(x - step))
  const right = parseInt(trees[y].charAt(x + 1))
  if (current > right) {
    return isRightVisisble(x + 1, y, step + 1, trees)
  }
  return false
}

const isVisible = (x: number, y: number, trees: string[]): boolean => {
  return (
    isTopVisible(x, y, 0, trees) ||
    isBottomVisible(x, y, 0, trees) ||
    isLeftVisisble(x, y, 0, trees) ||
    isRightVisisble(x, y, 0, trees)
  )
}

export const countVisible = (trees: string[]): number => {
  let countOfTrees = 0
  trees.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (isEdge(y, trees.length - 1)) {
        countOfTrees = countOfTrees + 1
      } else if (isEdge(x, row.length - 1)) {
        countOfTrees = countOfTrees + 1
      } else if (isVisible(x, y, trees)) {
        countOfTrees = countOfTrees + 1
      }
    }
  })
  return countOfTrees
}

export const getBestScore = (trees: string[]): number => {
  let bestScore = 0
  trees.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const candidate = getScenicScore(x, y, trees)
      if (candidate > bestScore) {
        //  console.log(`x: ${x}, y: ${y} score is ${candidate}`)
        bestScore = candidate
      }
    }
  })
  return bestScore
}

export const getScenicScore = (
  x: number,
  y: number,
  trees: string[]
): number => {
  const current = trees[y][x]

  // count down
  let countDown = 0
  let countDownEnded = false
  for (let down = y + 1; down < trees.length; down++) {
    if (!countDownEnded) {
      const compare = trees[down][x]
      countDown = countDown + 1

      if (current <= compare) {
        countDownEnded = true
      }
    }
  }
  // count up
  let countUp = 0
  let countUpEnded = false
  for (let up = y - 1; up >= 0; up--) {
    if (!countUpEnded) {
      const compare = trees[up][x]
      countUp = countUp + 1

      if (current <= compare) {
        countUpEnded = true
      }
    }
  }

  // count left
  let countLeft = 0
  let countLeftEnded = false
  for (let left = x - 1; left >= 0; left--) {
    if (!countLeftEnded) {
      const compare = trees[y][left]
      countLeft = countLeft + 1

      if (current <= compare) {
        countLeftEnded = true
      }
    }
  }

  // count right
  let countRight = 0
  let countRightEnded = false
  for (let right = x + 1; right < trees[0].length; right++) {
    if (!countRightEnded) {
      const compare = trees[y][right]
      countRight = countRight + 1

      if (current <= compare) {
        countRightEnded = true
      }
    }
  }
  return countDown * countUp * countLeft * countRight
}

if (process.env.NODE_ENV !== 'test') {
  const file = new AdventFile(path.resolve(__dirname, 'input.txt'))
  const input = file.readLines().removeBlanks()
  console.log(countVisible(input))
  console.log(getBestScore(input))
}
