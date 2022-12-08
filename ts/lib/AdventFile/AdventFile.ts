import { LineReader } from './LineReader'
import fs from 'fs'
export class AdventFile {
  path: string
  constructor(path: string) {
    this.path = path
  }

  readLines(): LineReader {
    const body = fs.readFileSync(this.path, 'utf8')
    const lines = body.split('\n')
    return new LineReader(lines)
  }
}
