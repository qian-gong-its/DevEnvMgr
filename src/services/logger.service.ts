import fs from 'node:fs';
import path from 'node:path';

import { getProjectRootDir, resolveProjectPath } from './path.service.js';

const logDir = resolveProjectPath(getProjectRootDir(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, {
    recursive: true,
  });
}

export type CMD = 'DIFF' | 'PULL' | 'PUSH';

const generateLogFilePath = (opt: CMD = 'DIFF', fileName = 'default') => {
  const timestamp = new Date().toISOString().split('T')[0];

  return path.join(logDir, `${timestamp}_${opt.toLowerCase()}-${fileName}.log`);
};

console.log(generateLogFilePath());

export const writeLogLine = (opt: CMD, fileName: string, message: string) => {
  const timestamp = new Date().toTimeString().split(' ')[0];

  const logLine = `[${timestamp}] ${message}\n`;

  console.log(logLine);

  fs.appendFileSync(generateLogFilePath(opt, fileName), logLine, 'utf-8');
};
