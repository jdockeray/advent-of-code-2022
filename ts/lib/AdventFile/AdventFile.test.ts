import path from 'path'
import { AdventFile } from './AdventFile'

describe('FileReader', () => {
  it('reads a file from a path', () => {
    const file = new AdventFile(path.resolve(__dirname, 'input.test.txt'))
    const lines = file.readLines()
    expect(lines.payload.length).toBe(4)
  })
})
