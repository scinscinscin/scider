interface SciderConstructorOpts {}

const defaultOptions: SciderConstructorOpts = {};

export class Scider<K, V> extends Map<K, V> {
  // private internal: Map<K, V> = new Map();
  private timeoutMap: Map<K, NodeJS.Timeout> = new Map();

  public constructor(partialOpts?: Partial<SciderConstructorOpts>) {
    super();
    const opts: SciderConstructorOpts = { ...partialOpts, ...defaultOptions };
  }

  public set(key: K, value: V, opts?: { deleteInSeconds?: number }) {
    if (this.has(key)) this.remove(key);

    super.set(key, value);

    const timeout = opts?.deleteInSeconds;
    if (timeout) {
      const timeoutCounter = setTimeout(() => {
        super.delete(key);
        this.timeoutMap.delete(key);
      }, timeout * 1000);

      this.timeoutMap.set(key, timeoutCounter);
    }

    return this;
  }

  public has(key: K) {
    return super.has(key);
  }

  public remove(key: K) {
    const timeoutCounter = this.timeoutMap.get(key);
    if (timeoutCounter !== undefined) {
      clearTimeout(timeoutCounter);
    }

    super.delete(key);
    this.timeoutMap.delete(key);
  }
}
