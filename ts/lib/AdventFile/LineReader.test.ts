import path from 'path'
import { AdventFile } from './AdventFile'
import { LineReader } from './LineReader'

describe('LineReader', () => {
  it('removes blanks', () => {
    const file = new AdventFile(path.resolve(__dirname, 'input.test.txt'))
    const lines = file.readLines()
    expect(lines.removeBlanks()).toEqual(['hello', 'hello'])
  })

  it.each<[string[], string[][]]>([
    [
      ['$ ls', '$ cd ..', 'dir bnjj'],
      [['$ ls'], ['$ cd ..', 'dir bnjj']],
    ],
    [
      ['$ ls', '$ cd ..', 'dir bnjj', '$ ls'],
      [['$ ls'], ['$ cd ..', 'dir bnjj'], ['$ ls']],
    ],
  ])('when lines are %j group should return %j', (input, expected) => {
    const lines = new LineReader(input)
    const groups = lines.group((str) => str.charAt(0) === '$')
    expect(groups[0]).toEqual(expected[0])
    expect(groups[1]).toEqual(expected[1])
    expect(groups[2]).toEqual(expected[2])
  })
})
