<script lang="ts">
  import { divMod, range, sleep } from "@gbagan/utils";
  import { runThresholds, thresholds } from "./lib/thresholds";
  import { Draw } from "./lib/Draw.svelte";
  import Stats from "./components/Stats.svelte";

  const DRAW_LENGTH = 200;
  
  let draw = new Draw();
  let currentPiece: null | number = $state.raw(null);
  let locked = $state.raw(false);

  async function drawPiece(val: 0 | 1) {
    if (locked || draw.coins.length >= DRAW_LENGTH) return;
    currentPiece = draw.coins.length;
    draw.toss(val);
    await sleep(0);
    currentPiece = null;
  }

  function reset() {
    if (locked) return;
    draw.reset();
  }

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
        text="Pile {Math.round(100 * draw.headsRate())}% - Face {100 - Math.round(100 * draw.headsRate())}%"
        thresholds={thresholds[draw.coins.length]}
        needle={draw.headsRate()}
      />
    </g>
    <g style:transform="translate(350px, 10px)">
      <Stats
        text="Plus long run: {draw.largestSequence}"
        thresholds={runThresholds[draw.coins.length]}
        needle={draw.longRunRate()} 
      />
    </g>
    <g style:transform="translate(630px, 10px)">
      <Stats
        text="Prédictibilité {Math.round(100 * draw.predictedRate())}%"
        thresholds={thresholds[draw.coins.length]}
        needle={draw.predictedRate()}
      />
    </g>
    <image
      href={draw.coins.length === 0 ? "./empty-basket.webp" : "./full-basket.webp"}
      width="120"
      height="120"
      style:cursor="pointer"
      style:transform="translate(50px, 480px)"
      onclick={reset}
    />
    <image
      href="./pile.webp"
      width="120"
      height="120"
      style:cursor="pointer"
      style:transform="translate(300px, 480px)"
      onclick={() => drawPiece(0)}
    />
    <image
      href="./face.webp"
      width="120"
      height="120"
      style:transform="translate(500px, 480px)"
      style:cursor="pointer"
      onclick={() => drawPiece(1)}
    />
    <image
      href="./dice.webp"
      width="120"
      height="120"
      style:cursor="pointer"
      style:transform="translate(750px, 480px)"
      onclick={simulate}
    />
    {#each range(0, DRAW_LENGTH) as i}
      {@const [y, x] = divMod(i, 25)}
      <circle
        cx={50+35*x}
        cy={194+35*y}
        r="13"
        stroke="red"
        stroke-width="2"
        stroke-dasharray="10 5"
        fill="transparent"
      />
    {/each}
    {#each draw.coins as d, i}
      {@const [y, x] = divMod(i, 25)}
      {@const tr =
        i !== currentPiece
        ? `translate(${35+35*x}px, ${180+35*y}px) scale(0.2)`
        : d === 0
        ? "translate(300px, 480px) scale(1)"
        : "translate(500px, 480px) scale(1)"
      }
      <image
        href={d === 0 ? "./pile.webp" : "./face.webp"}
        width="150"
        height="150"
        class="piece"
        style:transform={tr}
      />
    {/each}
  </svg>
</div>

<style>
  .app {
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    width: 100vw;
    min-height: 100vh;
  }

  svg {
    display: block;
    width: 100%;
    height: 100vh;
    max-width: 100%;
    object-fit: contain; /* ou utiliser viewBox */
  }

  .piece {
    transition: transform linear 500ms;
    pointer-events: none;
  }
</style>