<script lang="ts">
  import { sleep, times } from "@gbagan/utils";
  import { onMount } from "svelte";

  type Props = {
    title: string;
    score: number;
    delay: number;
  }

  type Star = {
    id: number;
    x: number;
    glyph: string;
    size: number;
    delay: number;
  }

  let { title, score, delay }: Props = $props();
  let scr = $state.raw(0);

  const LEVELS = [
    { min: 0,   max: 24,  label: 'Niveau 1 — Débutant',     color: '#888780', emoji: '🐣' },
    { min: 25,  max: 49,  label: 'Niveau 2 — Apprenti',     color: '#378ADD', emoji: '⚡' },
    { min: 50,  max: 74,  label: 'Niveau 3 — Confirmé',     color: '#1D9E75', emoji: '🔥' },
    { min: 75,  max: 99,  label: 'Niveau 4 — Expert',       color: '#D85A30', emoji: '💥' },
    { min: 100, max: 100, label: 'NIVEAU MAX — Légendaire !',color: '#7F77DD', emoji: '🏆' },
  ]

  const MILESTONES: Record<number, string> = {
    25:  '25 pts — Premier palier !',
    50:  'Mi-chemin ! 🎯',
    75:  '75 pts — Presque là !',
    100: 'SCORE PARFAIT ! 🏆',
  }

  const level = $derived(LEVELS.find(l => scr >= l.min && scr <= l.max) ?? LEVELS[0])
  const pct   = $derived(Math.max(0, Math.min(100, scr)))
  const barW  = $derived(scr === 0 ? 0 : Math.max(4, pct))

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
    scr = 0;
    await sleep(delay);
    while (scr < score) {
      scr = scr+25;
      spawnStars(scr >= 100 ? 12 : 4);
      await sleep(1100);
    }
  });
</script>

<div class="wrapper">
  <div class="header">
    <div class="player">
      <div class="avatar" style="background:{level.color}">
        {level.emoji}
      </div>
      <div>
        <div class="player-name">{title}</div>
        <div class="level-label" style="color:{level.color}">{level.label}</div>
      </div>
    </div>
    <div class="score-block">
      <div class="score-display" style="color:{level.color}">{scr}</div>
      <div class="score-max">/ 100 pts</div>
    </div>
  </div>

  <div class="bar-area">
    <div class="bar-track">
      <div
        class="bar-fill"
        style="width:{barW}%; background:{level.color}; --glow:{level.color}66"
      >
        {#if scr > 0}
          <div class="orb" style="background:{level.color}; box-shadow:0 0 10px 3px {level.color}66">
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

  {#if MILESTONES[scr]}
    <div class="milestone" style="background:{level.color}22; color:{level.color}">
      {MILESTONES[scr]}
    </div>
  {/if}
</div>

<style>
  .wrapper {
    padding: 1.5rem 1rem 1rem;
    width: 25rem;
    height: 12rem;
    margin: 0 auto;
    font-family: var(--font-sans, system-ui, sans-serif);
    background: rgba(255, 255, 255, 0.7);
    border-radius: 1rem;
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
    gap: 10px;
  }

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    animation: float 3s ease-in-out infinite;
    flex-shrink: 0;
  }

  .player-name {
    font-weight: 500;
    font-size: 15px;
    color: var(--color-text-primary, #111);
  }

  .level-label {
    font-size: 12px;
    font-weight: 500;
    transition: color 0.4s;
  }

  .score-block {
    text-align: right;
  }

  .score-display {
    font-size: 32px;
    font-weight: 500;
    line-height: 1;
    transition: color 0.4s;
    animation: pulse 0.3s ease;
  }

  .score-max {
    font-size: 11px;
    color: var(--color-text-secondary, #666);
  }

  .bar-area {
    margin-bottom: 0.5rem;
  }

  .bar-track {
    position: relative;
    height: 28px;
    background: var(--color-background-secondary, #f0f0f0);
    border-radius: 999px;
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
    width: 36px;
    height: 36px;
    border-radius: 50%;
    position: absolute;
    right: -14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    z-index: 2;
    transition: background 0.4s, box-shadow 0.4s;
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
    font-size: 11px;
    color: var(--color-text-tertiary, #999);
  }

  .milestone {
    display: inline-block;
    font-size: 13px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 999px;
    margin-bottom: 1.2rem;
    animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition: background 0.3s, color 0.3s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
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
    50%  { opacity: 1; transform: translateY(-28px) scale(1.2); }
    100% { opacity: 0; transform: translateY(-52px) scale(0); }
  }
</style>
