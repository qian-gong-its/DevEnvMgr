import { readFile } from 'node:fs/promises';

import {
  templatesConfigSchema,
  type TemplatesConfig,
} from '../schemas/template.schema.js';
import {
  userSettingsConfigSchema,
  type UserSettingsConfig,
} from '../schemas/user-setting.schema.js';
import { resolveDemPath } from '../services/path.service.js';

const readJson = async (filePath: string): Promise<unknown> => {
  const content = await readFile(filePath, 'utf8');
  return JSON.parse(content) as unknown;
};

export const loadTemplatesConfig = async (): Promise<TemplatesConfig> => {
  const filePath = resolveDemPath('src', 'config', 'templates.paths.json');
  return templatesConfigSchema.parse(await readJson(filePath));
};

export const loadUserSettingsConfig = async (): Promise<UserSettingsConfig> => {
  const filePath = resolveDemPath('src', 'config', 'user-settings.paths.json');
  return userSettingsConfigSchema.parse(await readJson(filePath));
};
