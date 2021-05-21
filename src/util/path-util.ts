import path, { ParsedPath } from "path";
import slash from "slash";

export function normalize(p: string): string {
  return ensurePosix(p);
}

export function join(...paths: string[]): string {
  return ensurePosix(path.join(...paths));
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
