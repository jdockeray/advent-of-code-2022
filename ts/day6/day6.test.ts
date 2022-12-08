import { areCharactersUnique, endOfSeq } from './day6'

describe('areCharactersUnique', () => {
  it.each<[string, boolean]>([
    ['mjqj', false],
    ['bvwb', false],
    ['wbjp', true],
  ])('%s should be %s', (input, expected) => {
    expect(areCharactersUnique(input)).toBe(expected)
  })
})

describe('endOfSeq - default', () => {
  it.each<[string, number]>([
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 5],
    ['nppdvjthqldpwncqszvftbrmjlhg', 6],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 10],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 11],
  ])(
    '%s needs to process %d before the first start-of-packet marker',
    (input, expected) => {
      expect(endOfSeq(input)).toBe(expected)
    }
  )
})

describe('endOfSeq - 14', () => {
  it.each<[string, number]>([
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 19],
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 23],
    ['nppdvjthqldpwncqszvftbrmjlhg', 23],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 29],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 26],
  ])(
    '%s needs to process %d before the first start-of-packet marker',
    (input, expected) => {
      expect(endOfSeq(input, 14)).toBe(expected)
    }
  )
})
