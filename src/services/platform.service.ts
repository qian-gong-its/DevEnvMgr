import { platform } from 'node:os';

type Platform = 'linux' | 'macos' | 'windows' | 'unknown';

const PLATFORM_MAP = {
  linux: 'linux',
  darwin: 'macos',
  win32: 'windows',
} as const;

export const getPlatform = (): Platform => {
  return PLATFORM_MAP[platform() as keyof typeof PLATFORM_MAP] ?? 'unknown';
};
