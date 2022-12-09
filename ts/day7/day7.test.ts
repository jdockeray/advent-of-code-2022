import {
  postOrder,
  Instruction,
  parseDirGroup,
  parseInstruction,
  parseInstructions,
  parseLsGroup,
  TreeNode,
} from './day7'

describe('parseDirGroup', () => {
  it.each<[string[], Instruction]>([
    [['$ cd a'], new Instruction('cd', 'a')],
    [['$ cd ..'], new Instruction('cd', '..')],
    [['$ cd /'], new Instruction('cd', '/')],
  ])('%j should return %o', (input, expected) => {
    expect(parseDirGroup(input)).toEqual(expected)
  })
})

describe('parseLsGroup', () => {
  it.each<[string[], Instruction]>([
    [
      ['$ ls', '176441 dcgvw', '9961 grcj.sdl'],
      new Instruction('ls', [
        ['dcgvw', 176441],
        ['grcj.sdl', 9961],
      ]),
    ],
    [['$ ls', '9961 grcj.sdl'], new Instruction('ls', [['grcj.sdl', 9961]])],
  ])('%j should return %o', (input, expected) => {
    expect(parseLsGroup(input)).toEqual(expected)
  })
})
describe('parseInstruction', () => {
  it.each<[string[], Instruction]>([
    [['$ cd mfmps'], new Instruction('cd', 'mfmps')],
    [
      ['$ ls', '176441 dcgvw', '9961 grcj.sdl'],
      new Instruction('ls', [
        ['dcgvw', 176441],
        ['grcj.sdl', 9961],
      ]),
    ],
    [['$ ls', 'dir mfmps'], new Instruction('ls', [['mfmps', null]])],
  ])('%j should return %o', (input, expected) => {
    expect(parseInstruction(input)).toEqual(expected)
  })
})
describe('parseInstructions', () => {
  it('parses instructions', () => {
    const instructions = parseInstructions([
      ['$ cd mfmps'],
      ['$ ls', '176441 dcgvw', '9961 grcj.sdl'],
    ])
    expect(instructions[0]).toEqual(new Instruction('cd', 'mfmps'))
    expect(instructions[1]).toEqual(
      new Instruction('ls', [
        ['dcgvw', 176441],
        ['grcj.sdl', 9961],
      ])
    )
  })
})

describe('TreeNode - changeDir', () => {
  it('goes up one level when command is ..', () => {
    const tree = new TreeNode(['/', null])
    tree.leftMostChild = new TreeNode(['child', null])
    tree.leftMostChild.parent = tree

    const cmd = new Instruction('cd', '..')

    const after = tree.leftMostChild.changeDir(cmd)
    expect(after?.data).toEqual(['/', null])
  })
  it('goes up to root when command is /', () => {
    const parent = new TreeNode(['/', null])
    parent.leftMostChild = new TreeNode(['child', null])
    const child = parent.leftMostChild
    child.leftMostChild = new TreeNode(['grandchild', null])
    child.parent = parent
    const grandchild = child.leftMostChild
    grandchild.parent = child

    const cmd = new Instruction('cd', '/')

    const after = grandchild.changeDir(cmd)
    expect(after?.data).toEqual(['/', null])
  })

  it('gets right sibling', () => {
    const parent = new TreeNode(['/', null])
    parent.rightSibling = new TreeNode(['middle', null])
    const cmd = new Instruction('cd', 'middle')
    expect(parent.changeDir(cmd)?.data).toEqual(['middle', null])
  })
})
describe('TreeNode - ls', () => {
  it('adds files', () => {
    const parent = new TreeNode(['/', null])

    const cmd = new Instruction('ls', [
      ['b.txt', 176441],
      ['c.dat', 9961],
    ])
    parent.ls(cmd)

    expect(parent.rightSibling?.data).toEqual(['b.txt', 176441])
    expect(parent.rightSibling?.rightSibling?.data).toEqual(['c.dat', 9961])
  })
  it('adds dirs', () => {
    const parent = new TreeNode(['/', null])

    const cmd = new Instruction('ls', [
      ['b', null],
      ['c', null],
    ])
    parent.ls(cmd)

    expect(parent.rightSibling?.data).toEqual(['b', null])
    expect(parent.rightSibling?.rightSibling?.data).toEqual(['c', null])
  })
  it('adds files and dirs', () => {
    const parent = new TreeNode(['/', null])

    const cmd = new Instruction('ls', [
      ['b', null],
      ['b.txt', 176441],
    ])
    parent.ls(cmd)

    expect(parent.rightSibling?.data).toEqual(['b', null])
    expect(parent.rightSibling?.rightSibling?.data).toEqual(['b.txt', 176441])
  })
})

describe.only('Post order', () => {
  it('gets the size of one child', () => {
    const parent = new TreeNode(['e', null])
    parent.leftMostChild = new TreeNode(['i', 584])
    parent.leftMostChild.parent = parent

    expect(postOrder(parent)).toBe(584)
  })
  it('gets the size of a nested dir', () => {
    const parent = new TreeNode(['e', null])
    parent.leftMostChild = new TreeNode(['i', 10])

    const child = parent.leftMostChild

    child.leftMostChild = new TreeNode(['x', 10])
    child.parent = parent
    child.leftMostChild.parent = child

    expect(postOrder(parent)).toBe(20)
  })
  it.only('gets the size of a nested dir and siblings', () => {
    const parent = new TreeNode(['e', null])
    parent.leftMostChild = new TreeNode(['i', 10])

    const child = parent.leftMostChild

    child.leftMostChild = new TreeNode(['x', 10])
    child.parent = parent

    const grandchild = child.leftMostChild
    grandchild.rightSibling = new TreeNode(['y', 10])
    grandchild.parent = child

    expect(postOrder(parent)).toBe(30)
  })

  it('gets the size of child siblings', () => {
    const parent = new TreeNode(['e', null])
    parent.leftMostChild = new TreeNode(['i', 10])
    const child = parent.leftMostChild
    child.rightSibling = new TreeNode(['x', 10])
    child.parent = parent
    child.rightSibling.parent = parent

    expect(postOrder(parent)).toBe(20)
  })

  it('gets the size of direct siblings', () => {
    const parent = new TreeNode(['e', null])
    parent.rightSibling = new TreeNode(['i', 10])

    expect(postOrder(parent)).toBe(10)
  })
})
