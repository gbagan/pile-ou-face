<script lang="ts">
  import { divMod, range, sleep } from "@gbagan/utils";
  import { COINS_LENGTH } from "../lib/constants";

  type Props = {
    coins: (0 | 1)[];
    tossCoin: (coin: 0 | 1) => void;
    reset: () => void;
    nextPhase: () => void;
  }

  let { coins, tossCoin: toss, reset, nextPhase }: Props = $props();

  let currentCoin: number | null = $state.raw(null);

  async function tossCoin(coin: 0 | 1) {
    if (coins.length >= COINS_LENGTH) return;
    toss(coin);
    currentCoin = (coins.length - 1);
    await sleep(0);
    currentCoin = null;
    if (coins.length === COINS_LENGTH) {
      nextPhase();
    }
  }
</script>

<div class="app">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
  <svg viewBox="0 0 950 610">
    <image
      href="./pile.avif"
      width="120"
      height="120"
      style:cursor="pointer"
      style:transform="translate(50px, 480px)"
      onclick={() => tossCoin(0)}
    />
    <image
      href={coins.length === 0 ? "./empty-basket.avif" : "./full-basket.avif"}
      width="120"
      height="120"
      style:cursor="pointer"
      style:transform="translate(400px, 480px)"
      onclick={reset}
    />
    <image
      href="./face.avif"
      width="120"
      height="120"
      style:transform="translate(750px, 480px)"
      style:cursor="pointer"
      onclick={() => tossCoin(1)}
    />
    {#each range(0, COINS_LENGTH) as i}
      {@const [y, x] = divMod(i, 20)}
      <circle
        cx={50+45*x}
        cy={194+45*y}
        r="15"
        stroke="red"
        stroke-width="2"
        stroke-dasharray="10 5"
        fill="transparent"
      />
    {/each}
    {#each coins as d, i}
      {@const [y, x] = divMod(i, 20)}
      {@const tr =
        i !== currentCoin
        ? `translate(${31+45*x}px, ${175+45*y}px) scale(0.25)`
        : d === 0
        ? "translate(300px, 480px) scale(1)"
        : "translate(500px, 480px) scale(1)"
      }
      <image
        href={d === 0 ? "./pile.avif" : "./face.avif"}
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