<script lang="ts">
  import { fade } from 'svelte/transition';
  import { sleep } from "@gbagan/utils";
  import RollPhase from "./components/RollPhase.svelte";
  import Scores from "./components/Scores.svelte";
  import ScoreContainer from "./components/ScoreContainer.svelte";
  import { onMount } from 'svelte';
  
  type Phase = "home" | "roll" | "stats";

  let coins: (0 | 1)[] = $state([]);
  let phase = $state.raw<Phase>("home");
  let tid: number;

  async function tossCoin(coin: 0 | 1) {
    coins.push(coin);
  }

  function reset() {
    phase = "roll";
    coins.length = 0;
    resetTimer();
  }

  async function nextPhase() {
    await sleep(2000);
    phase = "stats";
    resetTimer();
  }

  onMount(() => {
    tid = setTimeout(() => {
      phase = "home";
      coins.length = 0;
    }, 60000)
  });

  function resetTimer() {
    clearTimeout(tid);
    tid = setTimeout(() => {
      phase = "home";
      coins.length = 0;
    }, 60000);
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

<svelte:window onclick={resetTimer} />
{#if phase === "home"}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="home" transition:fade onclick={() => phase="roll"}></div>
{:else if phase === "roll"}
  <div transition:fade>
    <RollPhase {coins} {tossCoin} {reset} {nextPhase} />
  </div>
{:else}
  <div transition:fade>
    <ScoreContainer>
      <Scores {coins} {reset} />
    </ScoreContainer>
  </div>
{/if}

<style>
  .home {
    height: 100vh;
    width: 100vw;
    background: url("../home.avif");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>