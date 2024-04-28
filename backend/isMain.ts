import url from "node:url";

/**
 * Is the passed `import.meta.url` the main module or imported?
 */
export function isMain(metaUrl: string): boolean {
  if (!metaUrl.startsWith('file:')) {
    return false;
  }

  const modulePath = url.fileURLToPath(metaUrl);
  return process.argv[1] === modulePath;
}
