import { z } from 'zod';

const targetPathsSchema = z
  .object({
    windows: z.string().trim().min(1).optional(),
    linux: z.string().trim().min(1).optional(),
    macos: z.string().trim().min(1).optional(),
  })
  .refine((targets) => Object.values(targets).some(Boolean), {
    message: 'At least one target path is required',
  });

export const userSettingItemSchema = z.object({
  id: z.string().trim().min(1),
  description: z.string().trim().min(1),
  dotfilesPath: z.string().trim().min(1),
  targets: targetPathsSchema,
});

export const userSettingsConfigSchema = z.object({
  name: z.literal('user-settings'),
  common: z.array(userSettingItemSchema),
  linux: z.array(userSettingItemSchema),
  windows: z.array(userSettingItemSchema),
  vscode: z.array(userSettingItemSchema),
});

export type UserSettingItem = z.infer<typeof userSettingItemSchema>;
export type UserSettingsConfig = z.infer<typeof userSettingsConfigSchema>;
