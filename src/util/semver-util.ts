function splitSemverIntoParts(
  version: string,
  desiredLength?: number
): number[] {
  // Split a given version string into three parts.
  const parts = version.split(".").map((element) => parseInt(element));
  if (
    parts.length === 0 ||
    (desiredLength != null && parts.length > desiredLength) ||
    parts.some(isNaN)
  ) {
    throw new Error(`Received invalid version string: ${version}`);
  }

  if (desiredLength != null) {
    for (let i = 0; i < desiredLength - parts.length; i++) {
      parts.push(0);
    }
  }

  return parts;
}

function splitSemverVersionsIntoEquivalentParts(
  v1: string,
  v2: string
): [number[], number[]] {
  const v1Splitted = v1.split(".");
  const v2Splitted = v2.split(".");
  const desiredLength = Math.max(v1Splitted.length, v2Splitted.length);

  return [
    splitSemverIntoParts(v1, desiredLength),
    splitSemverIntoParts(v2, desiredLength),
  ];
}

export function compareSemver(v1: string, v2: string): number {
  const [v1Semver, v2Semver] = splitSemverVersionsIntoEquivalentParts(v1, v2);

  for (let i = 0; i < v1Semver.length; i++) {
    const v1Part = v1Semver[i];
    const v2Part = v2Semver[i];
    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }
  return 0;
}
