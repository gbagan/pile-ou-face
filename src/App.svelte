<script lang="ts">
  import { sleep } from "@gbagan/utils";
  import RollPhase from "./components/RollPhase.svelte";
  import Scores from "./components/Scores.svelte";
  import ScoreContainer from "./components/ScoreContainer.svelte";
  
  type Phase = "roll" | "stats";

  let coins: (0 | 1)[] = $state([]);
  let phase = $state.raw<Phase>("roll");

  async function tossCoin(coin: 0 | 1) {
    coins.push(coin);
  }

  function reset() {
    coins.length = 0;
  }

  async function nextPhase() {
    await sleep(2000);
    phase = "stats";
  }

  /*
  async function simulate() {
    if (locked) return;
    locked = true;
    draw.reset();
    const random = new Uint32Array(DRAW_LENGTH);
    crypto.getRandomValues(random);
    for (let i = 0; i < 40; i++) {
      await sleep(70);
      for (let j = 0; j < 5; j++) {
        draw.toss((random[5 * i + j] & 1) as 0 | 1);
      }
    }
    locked = false;
  }
  */
</script>

{#if phase === "roll"}
  <RollPhase {coins} {tossCoin} {reset} {nextPhase} />
{:else}
  <ScoreContainer>
    <Scores {coins} />
  </ScoreContainer>
{/if}