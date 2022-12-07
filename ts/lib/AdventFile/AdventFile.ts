import { LineReader } from './LineReader'
import fs from 'fs'
import path from 'path'
export class AdventFile {
  path: string
  constructor(path: string) {
    this.path = path
  }

  readLines(): LineReader {
    const body = fs.readFileSync(path.resolve(__dirname, this.path), 'utf8')
    const lines = body.split('\n')
    return new LineReader(lines)
  }
}
