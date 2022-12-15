import path from 'path'
import { AdventFile } from '../lib/AdventFile'

export type Command = 'cd' | 'ls'
export type Args = string | Array<[string, number] | [string, null]>
// export abstract class Instruction {
//   command: Command
//   abstract kind: string
//   constructor(command: Command) {
//     this.command = command
//   }
// }

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

if (process.env.NODE_ENV !== 'test') {
  const file = new AdventFile(path.resolve(__dirname, 'test.input.txt'))
  const groups = file.readLines().group((str) => str.charAt(0) === '$')

  const instructions = parseInstructions(groups)

  console.log(mapFileSystem(instructions))
}
