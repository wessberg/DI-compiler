import path, { ParsedPath } from "path";
import { platform } from "os";
import slash from "slash";

export const ROOT_DIRECTORY = path.parse(process.cwd()).root;
export const PLATFORM = platform();
export const DRIVE_LETTER_REGEXP = /^\w:/;

export function normalize(p: string): string {
  return ensurePosix(p);
}

export function parse(p: string): ParsedPath {
  const parsedPath = path.parse(p);
  return {
    ext: parsedPath.ext,
    name: normalize(parsedPath.name),
    base: normalize(parsedPath.base),
    dir: normalize(parsedPath.dir),
    root: normalize(parsedPath.root),
  };
}

/**
 * On Windows, it is important that all absolute paths are absolute, including the drive letter, because TypeScript assumes this
 */
export function ensureHasDriveLetter(p: string): string {
  if (PLATFORM !== "win32") return p;
  if (DRIVE_LETTER_REGEXP.test(p)) return p;
  if (p.startsWith(ROOT_DIRECTORY)) return p;
  if (!isAbsolute(p)) return p;
  return nativeJoin(ROOT_DIRECTORY, p);
}

/**
 * Ensures that the given path follows posix file names
 */
export function ensurePosix(p: string): string {
  return slash(p);
}

export function nativeNormalize(p: string): string {
  // Converts to either POSIX or native Windows file paths
  return path.normalize(p);
}

export function nativeDirname(p: string): string {
  return path.dirname(p);
}

export function nativeJoin(...paths: string[]): string {
  return path.join(...paths);
}

export function isAbsolute(p: string): boolean {
  return path.isAbsolute(p);
}
