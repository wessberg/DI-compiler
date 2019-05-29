/**
 * A WeakMultiMap is a wrapper around a Map that assumes that all values are collections
 */
export class MultiMap<K, V, C extends V[] = V[]> {
  /**
   * The inner Map between keys and collections
   * @template K, C
   * @type {WeakMap<K, C>}
   */
  // @ts-ignore
  protected readonly map: Map<K, C> | WeakMap<K, C> = new Map();

  /**
   * Gets the value for the given key. If it is not defined, it will initialize a new collection for it
   * @template K, V, C
   * @param {K} key
   * @returns {C}
   */
  public get(key: K): C {
    let match = this.map.get(key);
    if (match == null) {
      match = <C>(<unknown>[]);
      this.map.set(key, match);
    }
    return match;
  }

  /**
   * Pushes the given value to the collection for the given key
   * @template K, V
   * @param {K} key
   * @param {V[]} value
   * @returns {number}
   */
  public add(key: K, ...value: V[]): void {
    const collection = this.get(key);
    collection.push(...value);
  }

  /**
   * Returns true if the collection has the given key
   * @template K
   * @param {K} key
   * @returns {boolean}
   */
  public has(key: K): boolean {
    return this.map.has(key);
  }

  /**
   * Finds a value in the collection matching the given key
   * @template K, V
   * @param {K} key
   * @param {Function} callback
   * @returns {boolean}
   */
  public findValue<S extends V>(
    key: K,
    callback: (value: V, collection: C) => boolean
  ): S | undefined {
    if (!this.has(key)) return undefined;
    const collection = this.get(key);
    for (const value of collection) {
      if (callback(value, collection)) return <S>value;
    }
    return undefined;
  }
}
