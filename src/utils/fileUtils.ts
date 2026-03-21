import * as fs from 'fs';
import * as path from 'path';

export function createDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

export function createFile(filePath: string, content: string) {
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf-8');
}
