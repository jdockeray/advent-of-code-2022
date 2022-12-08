export class LineReader {
  payload: string[]

  constructor(lines: string[]) {
    this.payload = lines
  }

  removeBlanks(): string[] {
    return this.payload.filter((line) => line !== '')
  }

  group(predicate: (str: string) => boolean): string[][] {
    let groups: string[][] = []
    let group: string[] = []

    this.payload.forEach((line, idx) => {
      const isGroupStart = predicate(line)
      const isEndOfLines = idx === this.payload.length - 1
      if (isEndOfLines && isGroupStart) {
        groups = [...groups, [...group], [line]]
      } else if (!isEndOfLines && isGroupStart) {
        if (group.length > 0) {
          groups = [...groups, [...group]]
        }
        group = [line]
      } else if (isEndOfLines && !isGroupStart) {
        groups = [...groups, [...group, line]]
      } else {
        group = [...group, line]
      }
    })
    return groups
  }
}
