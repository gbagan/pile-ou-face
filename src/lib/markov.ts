export class Markov {
  #coins: (0 | 1)[] = [];
  #order: number;
  #table: Map<string, [number, number]> = new Map();

  constructor(order: number) {
    this.#order = order;
  }

  #key() {
    if (this.#coins.length < this.#order) return null;
    return this.#coins.slice(-this.#order).join('');
  }

  update(coin: 0 | 1) {
    const key = this.#key();
    this.#coins.push(coin);
    if (key === null) return;
    this.#table.getOrInsert(key, [0, 0])[coin]++;

  }

  predict(): 0 | 1 | null {
    const key = this.#key();
    const table = this.#table;
    if (key === null || !table.has(key)) return null;
    const [p0, p1] = table.get(key)!;
    const t = p0 + p1;
    if (t === 0) return null;
    return p1 >= 0.5 * t ? 1 : 0;
  }
}
