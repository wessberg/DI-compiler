import { join, normalize } from "path";
import { TS } from "../../src/type/type";
import * as typescript from "typescript";
import { di } from "../../src/transformer/di";
import {
  isAbsolute,
  nativeDirname,
  nativeJoin,
  nativeNormalize,
  parse,
} from "../../src/path-util";

// tslint:disable:no-any
export interface TestFileRecord {
  fileName: string;
  text: string;
  entry: boolean;
}

export type TestFile = TestFileRecord | string;

interface FileResult {
  fileName: string;
  code: string;
}

interface TransformerOptions {
  compilerOptions: Partial<TS.CompilerOptions>;
  cwd: string;
}

/**
 * Prepares a test
 */
export function generateTransformerResult(
  inputFiles: TestFile[] | TestFile,
  {
    compilerOptions = {},
    cwd = process.cwd(),
  }: Partial<TransformerOptions> = {}
): readonly FileResult[] {
  const files: TestFileRecord[] = (Array.isArray(inputFiles)
    ? inputFiles
    : [inputFiles]
  )
    .map((file) =>
      typeof file === "string"
        ? {
            text: file,
            fileName: `auto-generated-${Math.floor(Math.random() * 100000)}.ts`,
            entry: true,
          }
        : file
    )
    .map((file) => ({ ...file, fileName: join(cwd, file.fileName) }));

  const directories = new Set(
    files.map((file) => nativeNormalize(nativeDirname(file.fileName)))
  );

  const entryFiles = files.filter((file) => file.entry);
  if (entryFiles.length === 0) {
    throw new ReferenceError(`No entry could be found`);
  }

  const results: FileResult[] = [];

  let input: Record<string, string> | string;
  if (entryFiles.length === 1) {
    input = entryFiles[0].fileName;
  } else {
    input = {};

    // Ensure no conflicting chunk names
    const seenNames = new Set<string>();
    for (const entryFile of entryFiles) {
      let candidateName = parse(entryFile.fileName).name;
      let offset = 0;
      if (!seenNames.has(candidateName)) {
        seenNames.add(candidateName);
      } else {
        candidateName = `${candidateName}-${++offset}`;
        while (true) {
          if (seenNames.has(candidateName)) {
            candidateName = `${candidateName.slice(
              0,
              candidateName.length - 2
            )}-${++offset}`;
          } else {
            seenNames.add(candidateName);
            break;
          }
        }
      }

      input[candidateName] = entryFile.fileName;
    }
  }

  const program = typescript.createProgram({
    rootNames: files.map((file) => file.fileName),
    options: {
      module: typescript.ModuleKind.ESNext,
      target: typescript.ScriptTarget.ESNext,
      moduleResolution: typescript.ModuleResolutionKind.NodeJs,
      allowJs: true,
      sourceMap: false,
      ...compilerOptions,
    },
    host: {
      ...typescript.sys,

      getSourceFile(
        fileName: string,
        languageVersion: TS.ScriptTarget
      ): TS.SourceFile | undefined {
        const normalized = normalize(fileName);
        const sourceText = this.readFile(normalized);
        if (sourceText == null) return undefined;

        return typescript.createSourceFile(
          normalized,
          sourceText,
          languageVersion,
          true,
          typescript.ScriptKind.TS
        );
      },

      getCurrentDirectory() {
        return ".";
      },

      getDefaultLibFileName(options: TS.CompilerOptions): string {
        return typescript.getDefaultLibFileName(options);
      },

      getCanonicalFileName(fileName: string): string {
        return this.useCaseSensitiveFileNames()
          ? fileName
          : fileName.toLowerCase();
      },

      getNewLine(): string {
        return typescript.sys.newLine;
      },

      useCaseSensitiveFileNames() {
        return typescript.sys.useCaseSensitiveFileNames;
      },

      readFile: (fileName) => {
        const normalized = nativeNormalize(fileName);
        const absoluteFileName = isAbsolute(normalized)
          ? normalized
          : nativeJoin(cwd, normalized);
        const file = files.find(
          (currentFile) => currentFile.fileName === absoluteFileName
        );
        if (file != null) return file.text;
        return typescript.sys.readFile(absoluteFileName);
      },
      writeFile() {
        // Noop
      },
      fileExists: (fileName) => {
        const normalized = nativeNormalize(fileName);
        const absoluteFileName = isAbsolute(normalized)
          ? normalized
          : nativeJoin(cwd, normalized);
        if (files.some((file) => file.fileName === absoluteFileName)) {
          return true;
        }

        return typescript.sys.fileExists(absoluteFileName);
      },
      directoryExists: (dirName) => {
        const normalized = nativeNormalize(dirName);
        if (directories.has(normalized)) return true;
        return typescript.sys.directoryExists(normalized);
      },
      realpath(path: string): string {
        return nativeNormalize(path);
      },
      readDirectory(
        rootDir: string,
        extensions: readonly string[],
        excludes: readonly string[] | undefined,
        includes: readonly string[],
        depth?: number
      ): string[] {
        const nativeNormalizedRootDir = nativeNormalize(rootDir);
        const realResult = typescript.sys.readDirectory(
          rootDir,
          extensions,
          excludes,
          includes,
          depth
        );
        const virtualFiles = files
          .filter((file) => file.fileName.includes(nativeNormalizedRootDir))
          .map((file) => file.fileName);
        return [...new Set([...realResult, ...virtualFiles])].map(
          nativeNormalize
        );
      },

      getDirectories(path: string): string[] {
        return typescript.sys.getDirectories(path).map(nativeNormalize);
      },
    },
  });

  const transformers = di({ program });

  program.emit(
    undefined,
    (fileName, code) => {
      results.push({ fileName, code });
    },
    undefined,
    undefined,
    transformers
  );

  return results;
}
