<script lang="ts">
  import { sleep, times } from "@gbagan/utils";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  type Props = {
    title: string;
    score: number;
    delay: number;
    onclick: () => void;
  }

  type Star = {
    id: number;
    x: number;
    glyph: string;
    size: number;
    delay: number;
  }

  let { title, score, delay, onclick }: Props = $props();
  let currentScore = $state.raw(0);
  let showMoreInfo = $state.raw(false);

  const LEVELS = [
    { min: 0,   max: 24,  label: 'Niveau 1 — Débutant',     color: 'var(--stone-400)', emoji: '🐣' },
    { min: 25,  max: 49,  label: 'Niveau 2 — Apprenti',     color: 'var(--blue-500)', emoji: '⚡' },
    { min: 50,  max: 74,  label: 'Niveau 3 — Confirmé',     color: 'var(--emerald-600)', emoji: '🔥' },
    { min: 75,  max: 99,  label: 'Niveau 4 — Expert',       color: 'var(--orange-600)', emoji: '💥' },
    { min: 100, max: 100, label: 'NIVEAU MAX — Légendaire !',color: 'var(--violet-500)', emoji: '🏆' },
  ]

  /*
  const LEVELS = [
    { min: 0,   max: 24,  label: 'Niveau 1 — Débutant',     color: '#888780', emoji: '🐣' },
    { min: 25,  max: 49,  label: 'Niveau 2 — Apprenti',     color: '#378ADD', emoji: '⚡' },
    { min: 50,  max: 74,  label: 'Niveau 3 — Confirmé',     color: '#1D9E75', emoji: '🔥' },
    { min: 75,  max: 99,  label: 'Niveau 4 — Expert',       color: '#D85A30', emoji: '💥' },
    { min: 100, max: 100, label: 'NIVEAU MAX — Légendaire !',color: '#7F77DD', emoji: '🏆' },
  ]
  */

  const MILESTONES: Record<number, string> = {
    25:  '25 pts — Premier palier !',
    50:  'Mi-chemin ! 🎯',
    75:  '75 pts — Presque là !',
    100: 'SCORE PARFAIT ! 🏆',
  }

  const level = $derived(LEVELS.find(l => currentScore >= l.min && currentScore <= l.max) ?? LEVELS[0])
  const pct   = $derived(Math.max(0, Math.min(100, currentScore)))
  const barW  = $derived(currentScore === 0 ? 0 : Math.max(4, pct))

  let stars: Star[] = $state.raw([]);

  let starIds = 0;

  async function spawnStars(count: number) {
    const newStars: Star[] = times(count, () => ({
      id:    starIds++,
      x:     Math.max(2, Math.min(98, pct + (Math.random() - 0.5) * 8)),
      glyph: ['⭐', '✨', '💫', '🌟'][Math.floor(Math.random() * 4)],
      size:  12 + Math.random() * 8,
      delay: Math.random() * 0.4,
    }));
    stars = [...stars, ...newStars];
    await sleep(1200);
    const ids = new Set(newStars.map(s => s.id))
    stars = stars.filter(s => !ids.has(s.id))
  }

  onMount(async () => {
    currentScore = 0;
    await sleep(delay);
    while (currentScore < score) {
      currentScore = currentScore+25;
      spawnStars(currentScore >= 100 ? 12 : 4);
      await sleep(1100);
    }
    showMoreInfo = true;
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="wrapper" {onclick}>
  <div class="header">
    <div class="player">
      <div class="avatar" style:background={level.color}>
        {level.emoji}
      </div>
      <div>
        <div class="player-name">{title}</div>
        <div class="level-label" style:color={level.color}>{level.label}</div>
      </div>
    </div>
    <div class="score-block">
      <div class="score-display" style:color={level.color}>{currentScore}</div>
      <div class="score-max">/ 100 pts</div>
    </div>
  </div>

  <div class="bar-area">
    <div class="bar-track">
      <div
        class="bar-fill"
        style:width="{barW}%"
        style:background={level.color}
        style:--glow="color-mix(in srgb, {level.color} 40%, transparent)"
      >
        {#if currentScore > 0}
          <div
            class="orb"
            style:background={level.color}
          >
            {level.emoji}
          </div>
        {/if}
      </div>

      {#each stars as s (s.id)}
        <span
          class="star"
          style="left:{s.x}%; font-size:{s.size}px; animation-delay:{s.delay}s"
        >{s.glyph}</span>
      {/each}
    </div>

    <div class="ticks">
      {#each [0, 25, 50, 75, 100] as t}
        <span>{t}</span>
      {/each}
    </div>
  </div>

  {#if MILESTONES[currentScore]}
    <div
      class="milestone"
      style:background="color-mix(in srgb, {level.color} 13%, transparent)"
      style:color={level.color}
    >
      {MILESTONES[currentScore]}
    </div>
  {/if}
  {#if showMoreInfo}
    <div class="more-info" transition:fade>
      Clique pour plus d'info!
    </div>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
    padding: 1.5rem 1rem 1rem;
    width: 25rem;
    height: 12rem;
    margin: 0 auto;
    font-family: var(--font-sans, system-ui, sans-serif);
    background: rgba(255, 255, 255, 0.7);
    border-radius: 1rem;
    cursor: pointer;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.2rem;
  }

  .player {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }

  .avatar {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    animation: float 3s ease-in-out infinite;
    flex-shrink: 0;
  }

  .player-name {
    font-weight: 500;
    font-size: 1rem;
    color: var(--slate-900);
  }

  .level-label {
    font-size: 0.75rem;
    font-weight: 500;
    transition: color 0.4s;
  }

  .score-block {
    text-align: right;
  }

  .score-display {
    font-size: 2rem;
    font-weight: 500;
    line-height: 1;
    transition: color 0.4s;
    animation: pulse 0.3s ease;
  }

  .score-max {
    font-size: 0.7rem;
    color: var(--color-text-secondary, #666);
  }

  .bar-area {
    margin-bottom: 0.5rem;
  }

  .bar-track {
    position: relative;
    background: var(--color-background-secondary, #f0f0f0);
    border-radius: 999px;
    height: 1.75rem;
    border: 0.5px solid var(--color-border-tertiary, rgba(0,0,0,.12));
    overflow: visible;
  }

  .bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    overflow: visible;
  }

  .orb {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    position: absolute;
    right: -0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    z-index: 2;
    transition: background 0.4s, box-shadow 0.4s;
    box-shadow: 0 0 10px 3px var(--glow);
  }

  .star {
    position: absolute;
    top: 50%;
    pointer-events: none;
    animation: stars 0.9s ease forwards;
  }

  .ticks {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    padding: 0 2px;
    font-size: 0.7rem;
    color: #999;
  }

  .milestone {
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    margin-bottom: 1.2rem;
    animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition: background 0.3s, color 0.3s;
  }

  .more-info {
    position: absolute;
    font-size: 0.8rem;
    font-weight: 500;
    right: 1rem;
    bottom: 1rem;
    color: var(--slate-800);
    animation: shake 4s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-0.4rem); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.08); }
  }

  @keyframes popIn {
    0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
    70%  { transform: scale(1.3) rotate(5deg); }
    100% { transform: scale(1) rotate(0); opacity: 1; }
  }

  @keyframes stars {
    0%   { opacity: 0; transform: translateY(0) scale(0); }
    50%  { opacity: 1; transform: translateY(-1.75rem) scale(1.2); }
    100% { opacity: 0; transform: translateY(-3.25rem) scale(0); }
  }

  @keyframes shake {
    0%, 85%, 100% {
      transform: translateX(0);
    }
    86% { transform: translateX(-4px); }
    88% { transform: translateX(4px); }
    90% { transform: translateX(-4px); }
    92% { transform: translateX(4px); }
    94% { transform: translateX(0); }
    95% { transform: translateX(0); }
    96% { transform: translateX(-3px); }
    97.5% { transform: translateX(3px); }
    99% { transform: translateX(0); }
  }
</style>
