
<script lang="ts">
  import { sleep, times } from "@gbagan/utils";
  import type { Snippet } from "svelte";

  const STARS = ['⭐', '✨', '💫', '🌟']
 
  type Props = {
    children: Snippet;
    variant?: 'violet' | 'teal' | 'ghost';
    onclick?: () => void;
    disabled?: boolean;
    icon?: string;
  }

  type Star = {
    id: number;
    glyph: string;
    tx: string;
    delay: number;
  }

  let { children, onclick, variant = 'violet', disabled = false, icon }: Props = $props();
 
  let stars: Star[] = $state([])
  let starId = 0
 
  async function handleClick(e: MouseEvent) {
    const btn = e.currentTarget as HTMLElement;
 
    // Ripple
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
 
    // Étoiles
    const count = 7
    const newStars = times(count, i => {
      const angle = (i / count) * 360;
      const dist  = 55 + Math.random() * 30;
      const rad   = angle * Math.PI / 180;
      return {
        id:    ++starId,
        glyph: STARS[Math.floor(Math.random() * STARS.length)],
        tx:    `translate(${Math.cos(rad) * dist}px, ${Math.sin(rad) * dist}px)`,
        delay: i * 0.03,
      }
    });
    stars = [...stars, ...newStars];
    onclick?.();
    await sleep(850);
    const ids = new Set(newStars.map(s => s.id));
    stars = stars.filter(s => !ids.has(s.id));
  }
</script>
 
<button
  class="btn btn-{variant}"
  onclick={handleClick}
  {disabled}
>
  {#if icon}
    <span class="icon" aria-hidden="true">
      <i class="ti ti-{icon}"></i>
    </span>
  {/if}
  {@render children()}
 
  {#each stars as s (s.id)}
    <span
      class="star"
      style="--tx:{s.tx}; animation-delay:{s.delay}s"
    >{s.glyph}</span>
  {/each}
</button>
 
<style>
  .btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px 36px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 17px;
    font-weight: 500;
    color: #fff;
    overflow: hidden;
    transition: transform .15s, background .2s;
    outline: none;
    letter-spacing: .01em;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
 
  .btn:hover  { transform: scale(1.04); }
  .btn:active { transform: scale(0.97); }
  .btn:focus-visible { box-shadow: 0 0 0 3px #AFA9EC; }
 
  .btn-violet             { background: var(--indigo-400); }
  .btn-violet:hover       { background: var(--indigo-600); }
  .btn-violet:hover       { background: var(--violet-300); }
  .btn-teal               { background: var(--teal-600); }
  .btn-teal:hover         { background: var(--teal-800); }
  .btn-teal:disabled      { background: var(--teal-300); }
 
  .btn-ghost {
    background: transparent;
    border: 1.5px solid #7F77DD;
    color: #7F77DD;
  }
  .btn-ghost:hover        { background: #EEEDFE; color: #534AB7; border-color: #534AB7; }
  .btn-ghost:focus-visible { box-shadow: 0 0 0 3px #AFA9EC; }
 
  .icon {
    font-size: 20px;
    display: flex;
    align-items: center;
    transition: transform .5s cubic-bezier(.34, 1.56, .64, 1);
  }
 
  .btn:hover .icon { transform: rotate(-360deg); }
 
  .btn :global(.ripple) {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, .25);
    transform: scale(0);
    animation: ripple .55s linear;
    pointer-events: none;
  }
 
  .star {
    position: absolute;
    left: 50%;
    top: 50%;
    pointer-events: none;
    font-size: 14px;
    animation: burst .7s ease forwards;
  }
 
  @keyframes ripple {
    to { transform: scale(4); opacity: 0; }
  }
 
  @keyframes burst {
    0%   { opacity: 1; transform: translate(0, 0) scale(.5); }
    100% { opacity: 0; transform: var(--tx) scale(1.2); }
  }
</style>