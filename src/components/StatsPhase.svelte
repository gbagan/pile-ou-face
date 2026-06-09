<script lang="ts">
  import { count, divMod } from "@gbagan/utils";
  import { Markov } from "../lib/markov";
  import { runThresholds, thresholds } from "../lib/thresholds";
  import Stats from "./Stats.svelte";
    import { lzw } from "../lib/lzw";
  type Props = {
    coins: (0 | 1)[];
  }

  let { coins }: Props = $props();

  let headsRate = $derived(count(coins, c => c === 1) / coins.length);

  let largestSequence = $derived.by(() => {
    let currentSequence = 0;
    let largest = 0;
    let previousCoin: 0 | 1 | null = null;
    for (const coin of coins) {
      if (coin !== previousCoin) {
        currentSequence = 1;
      } else {
        currentSequence++;
      }
      largest = Math.max(largest, currentSequence);
      previousCoin = coin;
    }
    return largest;
  });

  let longRunRate = $derived(Math.min(17, largestSequence) / Math.min(17, coins.length));

  let compressionScore = $derived(lzw(coins));

  let predictedRate = $derived.by(() => {
    let counter = 0;
    let markov1 = new Markov(1);
    let markov2 = new Markov(2);
    let markov3 = new Markov(3);
    for (const coin of coins) {
      let prediction = markov3.predict() ?? markov2.predict() ?? markov1.predict() ?? 0; 
      if (coin === prediction) {
        counter += 1;
      }
      markov1.update(coin);
      markov2.update(coin);
      markov3.update(coin);
    }
    return counter / coins.length; 
  });
</script>

<div class="app">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
  <svg viewBox="0 0 950 610">
    <defs>
      <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stop-color="#6E7A8A" />
        <stop offset="35%"  stop-color="#D0D5DA" />
        <stop offset="50%"  stop-color="#F0F2F4" />
        <stop offset="65%"  stop-color="#D0D5DA" />
        <stop offset="100%" stop-color="#6E7A8A" />
      </linearGradient>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.5)" />  
      </filter>
    </defs>
    <g style:transform="translate(70px, 10px)">
      <Stats
        text="Pile {Math.round(100 * headsRate)}% - Face {100 - Math.round(100 * headsRate)}%"
        thresholds={thresholds[coins.length]}
        needle={headsRate}
      />
    </g>
    <g style:transform="translate(350px, 10px)">
      <Stats
        text="Plus long run: {largestSequence}"
        thresholds={runThresholds[coins.length]}
        needle={longRunRate} 
      />
    </g>
    <g style:transform="translate(630px, 10px)">
      <Stats
        text="Prédictibilité {Math.round(100 * predictedRate)}%"
        thresholds={thresholds[coins.length]}
        needle={predictedRate}
      />
    </g>

    <g style:transform="translate(630px, 200px)">
      <Stats
        text="Compression {compressionScore}"
        thresholds={thresholds[coins.length]}
        needle={predictedRate}
      />
    </g>

    {#each coins as d, i}
      {@const [y, x] = divMod(i, 20)}
      <image
        href={d === 0 ? "./pile.avif" : "./face.avif"}
        width="25"
        height="25"
        class="piece"
        style:transform="translate({31+30*x}px, {175+30*y}px)"
      />
    {/each}
  </svg>
</div>