export class LineReader {
  payload: string[]

  constructor(lines: string[]) {
    this.payload = lines
  }

  removeBlanks(): string[] {
    return this.payload.filter((line) => line !== '')
  }
}
