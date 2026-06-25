import { z } from 'zod';

export const templateTypeSchema = z.enum(['production', 'archive']);

export const templateItemSchema = z.object({
  id: z.string().trim().min(1),
  framework: z.string().trim().min(1),
  language: z.string().trim().min(1),
  type: templateTypeSchema,
  dotfilesPath: z.string().trim().min(1),
});

export const templatesConfigSchema = z
  .object({
    name: z.literal('templates'),
    dotfilesPath: z.string().trim().min(1),
    frameworks: z.array(z.string().trim().min(1)).min(1),
    languages: z.array(z.string().trim().min(1)).min(1),
    items: z.array(templateItemSchema).min(1),
  })
  .superRefine((config, context) => {
    const ids = new Set<string>();

    config.items.forEach((item, index) => {
      if (ids.has(item.id)) {
        context.addIssue({
          code: 'custom',
          path: ['items', index, 'id'],
          message: `Duplicate template id: ${item.id}`,
        });
      }
      ids.add(item.id);

      if (!config.frameworks.includes(item.framework)) {
        context.addIssue({
          code: 'custom',
          path: ['items', index, 'framework'],
          message: `Unknown framework: ${item.framework}`,
        });
      }

      if (!config.languages.includes(item.language)) {
        context.addIssue({
          code: 'custom',
          path: ['items', index, 'language'],
          message: `Unknown language: ${item.language}`,
        });
      }

      const expectedId = `${item.framework}-${item.language}`;
      if (item.id !== expectedId) {
        context.addIssue({
          code: 'custom',
          path: ['items', index, 'id'],
          message: `Template id must be '${expectedId}'`,
        });
      }

      const root = `${config.dotfilesPath}/`;
      if (!item.dotfilesPath.startsWith(root)) {
        context.addIssue({
          code: 'custom',
          path: ['items', index, 'dotfilesPath'],
          message: `Template path must be inside '${config.dotfilesPath}'`,
        });
      }
    });
  });

export type TemplateItem = z.infer<typeof templateItemSchema>;
export type TemplatesConfig = z.infer<typeof templatesConfigSchema>;
