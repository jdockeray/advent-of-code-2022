import { AdventFile } from './AdventFile'

describe('FileReader', () => {
  it('reads a file from a path', () => {
    const file = new AdventFile('input.test.txt')
    const lines = file.readLines()
    expect(lines.payload.length).toBe(4)
    expect(file.path).toBe('input.test.txt')
  })
})

describe('LineReader', () => {
  it('removes blanks', () => {
    const file = new AdventFile('input.test.txt')
    const lines = file.readLines()
    expect(lines.removeBlanks()).toEqual(['hello', 'hello'])
  })
})
