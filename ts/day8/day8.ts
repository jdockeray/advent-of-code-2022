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

const getRightScenicScore = (
  x: number,
  y: number,
  step: number = 0,
  trees: string[]
): number => {
  if (x === trees[y].length - 1) return step
  const current = parseInt(trees[y].charAt(x - step))
  const right = parseInt(trees[y].charAt(x + 1))
  if (current > right) {
    return getRightScenicScore(x + 1, y, step + 1, trees)
  }
  return step + 1
}

const getLeftScenicScore = (
  x: number,
  y: number,
  step: number = 0,
  trees: string[]
): number => {
  if (x === 0) return step
  const current = parseInt(trees[y].charAt(x - step))
  const left = parseInt(trees[y].charAt(x - 1))
  if (current > left) {
    return getLeftScenicScore(x - 1, y, step + 1, trees)
  }
  return step + 1
}

const getTopScenicScore = (
  x: number,
  y: number,
  step: number = 0,
  trees: string[]
): number => {
  if (y === 0) return step
  const current = parseInt(trees[y + step].charAt(x))
  const top = parseInt(trees[y - 1].charAt(x))
  if (current > top) {
    return getTopScenicScore(x, y - 1, step + 1, trees)
  }
  return step + 1
}

const getBottomScenicScore = (
  x: number,
  y: number,
  step: number = 0,
  trees: string[]
): number => {
  if (y === trees.length - 1) return step
  const current = parseInt(trees[y - step].charAt(x))
  const bottom = parseInt(trees[y + 1].charAt(x))
  if (current > bottom) {
    return getBottomScenicScore(x, y + 1, step + 1, trees)
  }
  return step + 1
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

const pos = (n: number): number => {
  if (n === 0) return 1
  return n
}
export const getScenicScore = (
  x: number,
  y: number,
  trees: string[]
): number => {
  const bottom = pos(getBottomScenicScore(x, y, 0, trees))
  const top = pos(getTopScenicScore(x, y, 0, trees))
  const left = pos(getLeftScenicScore(x, y, 0, trees))
  const right = pos(getRightScenicScore(x, y, 0, trees))

  const validScores: number[] = [bottom, top, left, right]
  if (isEdge(x, trees[0].length) || isEdge(y, trees.length)) return 0
  return validScores.reduce((acc, cv) => acc * cv, 1)
}

if (process.env.NODE_ENV !== 'test') {
  const file = new AdventFile(path.resolve(__dirname, 'input.txt'))
  const input = file.readLines().removeBlanks()
  console.log(countVisible(input))
  console.log(getBestScore(input))
}
