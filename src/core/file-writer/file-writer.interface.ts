import {FileHandle} from 'node:fs/promises';

export interface FileWriterInterface {
  readonly fileHandle: FileHandle;
  write(row: string): void;
}
