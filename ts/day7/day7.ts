import path from 'path'
import { AdventFile } from '../lib/AdventFile'

export type Command = 'cd' | 'ls'
export type Args = string | Array<[string, number] | [string, null]>
export class Instruction {
  command: Command
  args: Args
  constructor(command: Command, args: Args) {
    this.command = command
    this.args = args
  }
}

export class TreeNode {
  data: [string, number] | [string, null]
  parent: TreeNode | null = null
  leftMostChild: TreeNode | null = null
  rightSibling: TreeNode | null = null
  constructor(data: [string, number | null]) {
    this.data = data
  }

  changeDir(instruction: Instruction): TreeNode | null {
    if (instruction.args === '..') {
      return this.parent
    }
    if (instruction.args === '/' && this.parent === null) {
      return this
    }
    if (instruction.args === '/' && this.parent != null) {
      return this.parent?.changeDir(instruction)
    }
    if (this.data[0] === instruction.args) {
      return this
    }
    if (this.rightSibling != null) {
      return this.rightSibling?.changeDir(instruction)
    }
    return null
  }

  ls(instruction: Instruction): void {
    if (instruction.args.length > 0) {
      if (typeof instruction.args[0] === 'string') {
        throw new Error('ls invalid args')
      }
      this.rightSibling = new TreeNode(instruction.args[0])
      this.rightSibling.ls(new Instruction('ls', instruction.args.slice(1)))
    }
  }
}

export const postOrder = (tree: TreeNode | null): number => {
  if (tree === null) {
    return 0
  }

  const nullish = tree.data[1]
  console.log(tree.data)
  let visit = 0
  if (nullish !== null) {
    visit = nullish
  }

  const left = postOrder(tree.leftMostChild)
  const right = postOrder(tree.rightSibling)

  return left + visit + right
}

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
  return new Instruction('ls', cmds)
}

export const parseDirGroup = (group: string[]): Instruction => {
  const cmds = group[0].split(' ')
  return new Instruction('cd', cmds[2])
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

if (process.env.NODE_ENV !== 'test') {
  const file = new AdventFile(path.resolve(__dirname, 'input.txt'))
  const input = file.readLines().group((str) => str.charAt(0) === '$')

  console.log(input)
}
