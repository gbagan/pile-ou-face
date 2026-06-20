<script lang="ts">
  import { count, divMod, sleep } from "@gbagan/utils";
  import { IconRefresh } from '@tabler/icons-svelte';
  import Score from "./Score.svelte";
  import { Markov } from "../lib/markov";
  import { lzw } from "../lib/lzw";
  import Button from "./Button.svelte";
  import { onMount, tick } from "svelte";
  import HelpDialog from "./HelpDialog.svelte";

  type Props = {
    coins: (0 | 1)[];
    reset: () => void;
  }

  let { coins, reset }: Props = $props();
  let locked = $state.raw(true);
  let dialog: "A" | "B" | "C" | "D" | null = $state.raw(null);
  let dialogEl: HTMLDialogElement;

  let headsRate = $derived(count(coins, c => c === 1) / coins.length);

  let headsScore = $derived(
    headsRate >= .43 && headsRate <= .57
    ? 100
    : headsRate >= .41 && headsRate <= .59
    ? 75
    : headsRate >= .35 && headsRate <= .65
    ? 50
    : 25
  );

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

  let longRunScore = $derived(
    largestSequence >= 5 && largestSequence <= 10
    ? 100
    : largestSequence >= 4 && largestSequence <= 13
    ? 75
    : largestSequence >= 3 && largestSequence <= 14
    ? 50
    : 25
  );

  let compressionScore = $derived.by(() => {
    const n = lzw(coins);
    return n >= 34
    ? 100
    : n >= 33
    ? 75
    : n >= 32
    ? 50
    : 25
  });

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

  let predictedScore = $derived(
    predictedRate >= .43 && predictedRate <= .57
    ? 100
    : predictedRate >= .41 && predictedRate <= .59
    ? 75
    : predictedRate >= .35 && predictedRate <= .65
    ? 50
    : 25
  );

  async function openDialog(d: "A" | "B" | "C" | "D") {
    dialog = d;
  }

  function closeDialog() {
    dialog = null;
  }

  async function restart() {
    if (locked) return;
    reset();
  }

  onMount(async () => {
    await sleep(1000 * (5 + (headsScore + longRunScore + predictedScore + compressionScore) / 25));
    locked = false;
  });
</script>

<div class="container">
  <div class="grid">
    <Score
      title="Pile {100 - Math.round(100*headsRate)}% / Face {Math.round(100*headsRate)}%"
      score={headsScore}
      delay={1000}
      onclick={() => openDialog("A")}
    />
    <Score
      title="Plus long run {largestSequence}"
      score={longRunScore}
      delay={1000 * (2 + headsScore / 25)}
      onclick={() => openDialog("B")}
    />
    <Score
      title="Imprédictibilité {100 - Math.round(100*predictedRate)}%"
      score={predictedScore}
      delay={1000 * (3 + (headsScore + longRunScore) / 25)}
      onclick={() => openDialog("C")}
    />
    <Score
      title="Incompressibilité"
      score={compressionScore}
      delay={1000 * (4 + (headsScore + longRunScore + predictedScore) / 25)}
      onclick={() => openDialog("D")}
    />
  </div>
  <div class="coins">
    <svg viewBox="0 0 200 50">
      {#each coins as d, i}
        {@const [y, x] = divMod(i, 20)}
        <image
          href={d === 0 ? "./pile.avif" : "./face.avif"}
          width="8"
          height="8"
          style:transform="translate({10*x+1}px, {10*y+1}px)"
        />
      {/each}
    </svg>
  </div>
  <Button
    variant="teal"
    onclick={restart}
    disabled={locked}
  >
    <IconRefresh stroke={2} /> Nouvelle partie
  </Button>
</div>
<HelpDialog {dialog} {closeDialog} />

<style>
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin: 1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .coins {
    width: 60rem;
  }
</style>

