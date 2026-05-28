export class Markov {
  #coins: readonly (0 | 1)[];
  #order: number;
  #table: Record<string, [number, number]> = {};

  constructor(order: number, coins: readonly (0 | 1)[]) {
    this.#coins = coins;
    this.#order = order;
  }

  reset() {
    this.#table = {};
  }

  #key() {
    if (this.#coins.length < this.#order) return null;
    return this.#coins.slice(-this.#order).join('');
  }

  update(coin: 0 | 1) {
    const key = this.#key();
    if (key === null) return;
    const table = this.#table;
    if (!table[key]) table[key] = [0, 0];
    table[key][coin]++;
  }

  predict(): 0 | 1 | null {
    const key = this.#key();
    const table = this.#table;
    if (key === null || !table[key]) return null;
    const p0 = table[key][0];
    const p1 = table[key][1];
    const t = p0 + p1;
    if (t === 0) return null;
    return p1 >= 0.5 * t ? 1 : 0;
  }
}
