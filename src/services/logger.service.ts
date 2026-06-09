import fs from "node:fs";

import { getProjectRootDir, resolveProjectPath } from './path.service.js';

const logDir = resolveProjectPath(getProjectRootDir(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, {
    recursive: true,
  });
}

console.log(logDir);
