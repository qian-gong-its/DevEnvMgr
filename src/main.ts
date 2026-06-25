
import { create } from './services/create.service.js';

const printUsage = (): void => {
  console.log(`
Usage:
  dem create <framework> <language> <destination>

Example:
  dem create node ts Workspace/my-api
`);
};

const main = async (): Promise<void> => {
  const [command, framework, language, destination] =
    process.argv.slice(2);

  if (!command) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  switch (command) {
    case 'create': {
      if (!framework || !language || !destination) {
        console.error(
          '❌ Missing arguments for the create command.',
        );

        printUsage();
        process.exitCode = 1;
        return;
      }

      const templateId = `${framework}-${language}`;

      await create(
        framework,
        language,
        destination,
      );

      console.log(
        `✅ Project created from template "${templateId}".`,
      );

      console.log(
        `📁 Destination: ${destination}`,
      );

      return;
    }

    default:
      console.error(
        `❌ Unknown command: "${command}"`,
      );

      printUsage();
      process.exitCode = 1;
  }
};

main().catch((error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : 'An unknown error occurred.';

  console.error(`❌ ${message}`);
  process.exitCode = 1;
});
