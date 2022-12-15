import path from 'path'
import { AdventFile } from '../lib/AdventFile'

export type Command = 'cd' | 'ls'
export type Args = string | Array<[string, number] | [string, null]>

export class Cd {
  kind: 'cd' = 'cd'
  command: Command
  args: string
  constructor(command: Command, args: string) {
    this.command = command
    this.args = args
  }
}

export class Ls {
  kind: 'ls' = 'ls'
  command: Command
  args: Array<[string, number] | [string, null]>
  constructor(
    command: Command,
    args: Array<[string, number] | [string, null]>
  ) {
    this.command = command
    this.args = args
  }
}

export type Instruction = Ls | Cd

export const parseLsGroup = (group: string[]): Instruction => {
  const cmds: Array<[string, number] | [string, null]> = [
    ...group.slice(1),
  ].map((line) => {
    const chunks = line.split(' ')
    if (chunks[0] === 'dir') {
      return [chunks[1], null]
    }
    return [chunks[1], parseInt(chunks[0])]
  })
  return new Ls('ls', cmds)
}

export const parseDirGroup = (group: string[]): Instruction => {
  const cmds = group[0].split(' ')
  return new Cd('cd', cmds[2])
}

export const parseInstruction = (group: string[]): Instruction => {
  if (group[0].substring(0, 4) === '$ cd') {
    return parseDirGroup(group)
  }
  return parseLsGroup(group)
}

export const parseInstructions = (groups: string[][]): Instruction[] => {
  return groups.map(parseInstruction)
}

export class FileSystem {
  files: Array<[string, number]>
  folders: string[]
  constructor(files: Array<[string, number]> = [], folders: string[] = []) {
    this.files = files
    this.folders = folders
  }
}

const ls = (
  instruct: Ls,
  map: Map<string, FileSystem>,
  key: string
): Map<string, FileSystem> => {
  instruct.args.forEach((arg) => {
    const currentDir = map.get(key)
    if (currentDir === undefined) {
      throw new Error(`dir: ${key} should be defined`)
    }
    if (arg[1] === null) {
      const folder = `${key}:${arg[0]}`
      if (!currentDir.folders.includes(folder)) {
        map.set(folder, new FileSystem())
        map.set(
          key,
          new FileSystem(currentDir.files, [...currentDir.folders, folder])
        )
      }
    } else {
      map.set(
        key,
        new FileSystem([...currentDir.files, arg], currentDir?.folders)
      )
    }
  })
  return map
}

const cd = (instruct: Cd, context: string[]): string[] => {
  if (instruct.args === '/') {
    return ['/']
  }
  if (instruct.args === '..') {
    if (context.length === 1) return ['/']
    return [...context.slice(0, -1)]
  }
  return [...context, instruct.args]
}

const getKey = (path: string[]): string => {
  return path.join(':')
}

export const mapFileSystem = (
  instructions: Instruction[]
): Map<string, FileSystem> => {
  let dirMap: Map<string, FileSystem> = new Map([
    ['/', { files: [], folders: [] }],
  ])
  let context: string[] = []
  instructions.forEach((instruct) => {
    if (instruct.kind === 'ls') {
      dirMap = ls(instruct, dirMap, getKey(context))
    }
    if (instruct.kind === 'cd') {
      context = cd(instruct, context)
    }
  })
  return dirMap
}

export const getFolderSize = (
  key: string,
  dirMap: Map<string, FileSystem>
): number => {
  const node = dirMap.get(key)
  if (node === undefined) {
    throw new Error(`dir: ${key} should be defined`)
  }
  const sumOfFiles = node.files.reduce((pv, cv) => pv + cv[1], 0)

  const sumOfFolders = node.folders.reduce(
    (pv, cv) => pv + getFolderSize(cv, dirMap),
    0
  )

  return sumOfFiles + sumOfFolders
}

export const sizeOfDirectoryToDelete = (
  dirMap: Map<string, FileSystem>
): number => {
  const rootFolderSize = getFolderSize('/', dirMap)
  const MAX_SPACE = 70000000
  const MEMORY_REQUIRED = 30000000
  let nominee = null
  for (const key of dirMap.keys()) {
    const folderSize = getFolderSize(key, dirMap)
    const isCandidate =
      MAX_SPACE - (rootFolderSize - folderSize) > MEMORY_REQUIRED
    if (isCandidate) {
      if (nominee === null || folderSize < nominee) {
        nominee = folderSize
      }
    }
  }
  if (nominee === null) {
    throw new Error('no candidates to delete')
  }
  return nominee
}

export const sumOfValidFolders = (dirMap: Map<string, FileSystem>): number => {
  let sum = 0
  for (const key of dirMap.keys()) {
    const folderSize = getFolderSize(key, dirMap)
    if (folderSize <= 100000) {
      sum = sum + folderSize
    }
  }
  return sum
}

if (process.env.NODE_ENV !== 'test') {
  const file = new AdventFile(path.resolve(__dirname, 'input.txt'))
  const groups = file.readLines().group((str) => str.charAt(0) === '$')

  const instructions = parseInstructions(groups)
  const fileTree = mapFileSystem(instructions)

  console.log(sumOfValidFolders(fileTree))
  console.log(sizeOfDirectoryToDelete(fileTree))
}
