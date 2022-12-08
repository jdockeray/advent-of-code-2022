import path from 'path'
import { AdventFile } from '../lib/AdventFile'

export const areCharactersUnique = (str: string): boolean => {
  return [...new Set(str.split('')).entries()].length === str.length
}

export const endOfSeq = (str: string, len: number = 4): number => {
  let marker = 0
  str.split('').forEach((ch, idx) => {
    if (marker === 0 && areCharactersUnique(str.slice(idx, idx + len))) {
      marker = idx + len
    }
  })
  return marker
}

if (process.env.NODE_ENV !== 'test') {
  const file = new AdventFile(path.resolve(__dirname, 'input.txt'))
  const input = file.readLines().removeBlanks()[0]
  console.log(endOfSeq(input, 4))
  console.log(endOfSeq(input, 14))
}
