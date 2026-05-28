import { Markov } from "./Markov";

export class Draw {
  coins: (0 | 1)[] = $state([]);
  #lastTailsSequence = 0;
  #lastHeadsSequence = 0;
  largestSequence = $state.raw(0);
  #headsCount = $state.raw(0);
  #predictedCount = $state.raw(0);
  #markov1: Markov;
  #markov2: Markov;
  #markov3: Markov;

  constructor() {
    this.#markov1 = new Markov(1, this.coins);
    this.#markov2 = new Markov(2, this.coins);
    this.#markov3 = new Markov(3, this.coins);
  }

  #predict(): 0 | 1 {
    return this.#markov3.predict() ?? this.#markov2.predict() ?? this.#markov1.predict() ?? 0; 
  }

  toss(coin: 0 | 1) {
    let prediction = this.#predict();
    if (coin === prediction) {
      this.#predictedCount += 1;
    }
    this.#markov1.update(coin);
    this.#markov2.update(coin);
    this.#markov3.update(coin);
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
    this.#predictedCount = 0;
    this.largestSequence = 0;
    this.#markov1.reset();
    this.#markov2.reset();
    this.#markov3.reset();
  }

  headsRate() {
    return this.coins.length === 0 ? 0.5 : this.#headsCount / this.coins.length;
  }

  longRunRate() {
    if (this.coins.length <= 1) {
      return 0.5;
    }
    return this.largestSequence / Math.min(17, this.coins.length);
  }

  predictedRate() {
    return this.coins.length === 0 ? 0.5 : this.#predictedCount / this.coins.length;
  }
}