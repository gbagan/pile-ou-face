export class Draw {
  coins: (0 | 1)[] = $state([]);
  #lastTailsSequence = 0;
  #lastHeadsSequence = 0;
  largestSequence = $state.raw(0);
  #headsCount = $state.raw(0);

  toss(coin: 0 | 1) {
    this.coins.push(coin);
    if (coin === 0) {
      this.#headsCount += 1;
      this.#lastHeadsSequence += 1;
      this.largestSequence = Math.max(this.largestSequence, this.#lastHeadsSequence)
      this.#lastTailsSequence = 0;
    } else {
      this.#lastHeadsSequence = 0;
      this.#lastTailsSequence += 1;
      this.largestSequence = Math.max(this.largestSequence, this.#lastTailsSequence)
    }
  }

  reset() {
    this.coins.length = 0;
    this.#lastTailsSequence = 0;
    this.#lastHeadsSequence = 0;
    this.#headsCount = 0;
    this.largestSequence = 0;
  }

  headsPercent() {
    return this.coins.length === 0 ? 50 : Math.round(100 * this.#headsCount / this.coins.length);
  }
}