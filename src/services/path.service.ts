import { homedir, platform } from 'node:os';
import { join, resolve } from 'node:path';

type Platform = 'linux' | 'macos' | 'windows' | 'unknown';

const PLATFORM_MAP = {
  linux: 'linux',
  darwin: 'macos',
  win32: 'windows',
} as const;

export const getPlatform = (): Platform => {
  return PLATFORM_MAP[platform() as keyof typeof PLATFORM_MAP] ?? 'unknown';
};

export const getUserHomeDir = (): string => homedir();

export const getWorkspaceDir = (): string =>
  join(getUserHomeDir(), 'Workspace');

export const getDotfilesDir = (): string =>
  join(getWorkspaceDir(), 'eu.gongqian.dotfiles');

export const resolveUserPath = (...paths: string[]): string =>
  join(getUserHomeDir(), ...paths);

// console.log(resolveUserPath('.config', 'Code', 'User', 'settings.json'));
