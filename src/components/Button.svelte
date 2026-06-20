
<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    variant?: 'violet' | 'teal' | 'ghost';
    onclick?: () => void;
    disabled?: boolean;
  }

  let { children, onclick, variant = 'violet', disabled = false }: Props = $props();
</script>
 
<button
  class="btn btn-{variant}"
  {onclick}
  {disabled}
>
  {@render children()}
</button>
 
<style>
  .btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 1rem 2rem;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 500;
    color: #fff;
    overflow: hidden;
    transition: transform .15s, background .2s;
    letter-spacing: .01em;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
 
  .btn:hover  { transform: scale(1.04); }
  .btn:active { transform: scale(0.97); }
 
  .btn-violet             { background: var(--indigo-400); }
  .btn-violet:hover       { background: var(--indigo-600); }
  .btn-violet:disabled    { background: var(--violet-300); }
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
</style>