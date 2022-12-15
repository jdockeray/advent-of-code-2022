import {
  Cd,
  Instruction,
  Ls,
  mapFileSystem,
  FileSystem,
  parseDirGroup,
  parseInstruction,
  parseInstructions,
  parseLsGroup,
} from './day7'

describe('parseDirGroup', () => {
  it.each<[string[], Instruction]>([
    [['$ cd a'], new Cd('cd', 'a')],
    [['$ cd ..'], new Cd('cd', '..')],
    [['$ cd /'], new Cd('cd', '/')],
  ])('%j should return %o', (input, expected) => {
    expect(parseDirGroup(input)).toEqual(expected)
  })
})

describe('parseLsGroup', () => {
  it.each<[string[], Instruction]>([
    [
      ['$ ls', '176441 dcgvw', '9961 grcj.sdl'],
      new Ls('ls', [
        ['dcgvw', 176441],
        ['grcj.sdl', 9961],
      ]),
    ],
    [['$ ls', '9961 grcj.sdl'], new Ls('ls', [['grcj.sdl', 9961]])],
    [['$ ls', 'dir dcqf'], new Ls('ls', [['dcqf', null]])],
  ])('%j should return %o', (input, expected) => {
    expect(parseLsGroup(input)).toEqual(expected)
  })
})
describe('parseInstruction', () => {
  it.each<[string[], Instruction]>([
    [['$ cd mfmps'], new Cd('cd', 'mfmps')],
    [
      ['$ ls', '176441 dcgvw', '9961 grcj.sdl'],
      new Ls('ls', [
        ['dcgvw', 176441],
        ['grcj.sdl', 9961],
      ]),
    ],
    [['$ ls', 'dir mfmps'], new Ls('ls', [['mfmps', null]])],
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
    expect(instructions[0]).toEqual(new Cd('cd', 'mfmps'))
    expect(instructions[1]).toEqual(
      new Ls('ls', [
        ['dcgvw', 176441],
        ['grcj.sdl', 9961],
      ])
    )
  })
})

describe('map file system', () => {
  it('builds a map of the file system', () => {
    const mappedFileSystem = mapFileSystem([])
    expect(mappedFileSystem.get('/')).toEqual({
      files: [],
      folders: [],
    })
  })
  it('handles the first command', () => {
    const mappedFileSystem = mapFileSystem([new Cd('cd', '/')])
    expect(mappedFileSystem.get('/')).toEqual({
      files: [],
      folders: [],
    })
  })
  it('can create new directories', () => {
    const instructions = [new Cd('cd', '/'), new Ls('ls', [['a', null]])]
    const mappedFileSystem = mapFileSystem(instructions)

    expect(mappedFileSystem.get('/:a')).toEqual({ files: [], folders: [] })
  })
  it('can create new files', () => {
    const instructions = [new Cd('cd', '/'), new Ls('ls', [['a', 123]])]
    const mappedFileSystem = mapFileSystem(instructions)

    expect(mappedFileSystem.get('/')).toEqual(new FileSystem([['a', 123]]))
  })
  it('can change directory and create files', () => {
    const instructions = [
      new Cd('cd', '/'),
      new Ls('ls', [['a', null]]),
      new Cd('cd', 'a'),
      new Ls('ls', [['abc', 123]]),
    ]
    const mappedFileSystem = mapFileSystem(instructions)

    expect(mappedFileSystem.get('/:a')).toEqual(new FileSystem([['abc', 123]]))
  })
  it('does not overwrite exisiting directories', () => {
    const instructions = [
      new Cd('cd', '/'),
      new Ls('ls', [['a', null]]),
      new Cd('cd', 'a'),
      new Ls('ls', [['abc', 123]]),
      new Cd('cd', '/'),
      new Ls('ls', [['a', null]]),
    ]
    const mappedFileSystem = mapFileSystem(instructions)

    expect(mappedFileSystem.get('/:a')).toEqual(new FileSystem([['abc', 123]]))
  })
  it('can create many directory chained by name', () => {
    const instructions = [
      new Cd('cd', '/'),
      new Ls('ls', [['a', null]]),
      new Cd('cd', 'a'),
      new Ls('ls', [['b', null]]),
      new Cd('cd', 'b'),
      new Ls('ls', [['c', null]]),
      new Cd('cd', 'c'),
      new Ls('ls', [['d', null]]),
    ]
    const mappedFileSystem = mapFileSystem(instructions)
    expect(mappedFileSystem.get('/:a:b:c:d')).toEqual(new FileSystem())
  })
  it('can go up one dir when command is ..', () => {
    const instructions = [
      new Cd('cd', '/'),
      new Ls('ls', [['a', null]]),
      new Cd('cd', 'a'),
      new Ls('ls', [['b', null]]),
      new Cd('cd', 'b'),
      new Cd('cd', '..'),
      new Ls('ls', [['c', null]]),
    ]
    const mappedFileSystem = mapFileSystem(instructions)
    expect(mappedFileSystem.get('/:a:c')).toEqual(new FileSystem())
  })

  it('stops at / when command is ..', () => {
    const instructions = [
      new Cd('cd', '/'),
      new Ls('ls', [['a', null]]),
      new Cd('cd', 'a'),
      new Ls('ls', [['b', null]]),
      new Cd('cd', 'b'),
      new Cd('cd', '..'),
      new Cd('cd', '..'),
      new Cd('cd', '..'),
      new Cd('cd', '..'),
      new Cd('cd', '..'),
      new Cd('cd', '..'),
      new Cd('cd', '..'),
      new Ls('ls', [['b', null]]),
    ]
    const mappedFileSystem = mapFileSystem(instructions)
    expect(mappedFileSystem.get('/:b')).toEqual(new FileSystem())
  })
})
