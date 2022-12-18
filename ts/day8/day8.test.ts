import { countVisible, getBestScore, getScenicScore } from './day8'

describe('count visible', () => {
  it('counts all trees round the edge', () => {
    const input = ['333', '313', '333']
    expect(countVisible(input)).toBe(8)
  })
  it('counts trees in the middle', () => {
    const input = ['333', '393', '333']
    expect(countVisible(input)).toBe(9)
  })
  it('counts several trees in the middle vertically', () => {
    const input = [
      '333',
      '393',
      '393',
      '393',
      '393',
      '393',
      '393',
      '393',
      '333',
    ]
    expect(countVisible(input)).toBe(27)
  })
  it('counts trees horizontally', () => {
    const input = ['33333333', '39999993', '33333333']
    expect(countVisible(input)).toBe(24)
  })

  it('counts trees visible from the top', () => {
    const input = ['979', '989', '999', '999', '999']
    expect(countVisible(input)).toBe(14)
  })
  it('counts trees visible from the right', () => {
    const input = ['99999', '99876', '99999']
    expect(countVisible(input)).toBe(15)
  })
  it('counts trees visible from the left', () => {
    const input = ['99999', '78999', '99999']
    expect(countVisible(input)).toBe(14)
  })
  it('counts trees visible from the bottom', () => {
    const input = ['999', '999', '989', '979', '969']
    expect(countVisible(input)).toBe(15)
  })
})

describe.only('scenic scores', () => {
  it('gets the scenic score', () => {
    const input = ['30373', '25512', '65332', '33549', '35390']
    expect(getScenicScore(2, 1, input)).toBe(4)
  })
  it('gets the scenic score', () => {
    const input = ['30373', '25512', '65332', '33549', '35390']
    expect(getScenicScore(2, 3, input)).toBe(8)
  })
  it('gets the scenic score', () => {
    const input = ['30373', '25512', '65332', '33549', '35390']
    expect(getScenicScore(3, 3, input)).toBe(3)
  })
  it('gets the scenic score', () => {
    const input = ['30373', '25512', '65332', '33549', '35390']
    expect(getScenicScore(0, 0, input)).toBe(0)
  })
  it('gets the best scenic score', () => {
    const input = ['30373', '25512', '65332', '33549', '35390']
    expect(getBestScore(input)).toBe(8)
  })
  it('gets the scenic score', () => {
    const input = ['30373', '25512', '65332', '33549', '35390']
    expect(getScenicScore(0, 2, input)).toBe(0)
  })
})
