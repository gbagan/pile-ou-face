<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "./Button.svelte";

  type Props = {
    title: string;
    emoji: string;
    children: Snippet;
    onOk: () => void;
  }

  let { title, emoji, children, onOk }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="backdrop" onclick={onOk} >
  <dialog open onclick={e => e.stopPropagation()}>
    <div class="header">
      <p class="emoji">{emoji}</p>
      <p class="title">{title}</p>
    </div>
    <div class="body">
      {@render children()}
    </div>
    <div class="buttons">
      <Button onclick={onOk} variant="teal">Compris !</Button>
    </div>
  </dialog>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: color-mix(in srgb, var(--slate-900) 55%, transparent);
    backdrop-filter: blur(3px);
  }
  
  dialog {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: max-content;
    background: var(--indigo-950);
    border: 1.5px solid var(--violet-700);
    border-radius: 1rem;
    padding: 0;
    overflow: hidden;
    animation: popIn .35s cubic-bezier(.34,1.56,.64,1);
  }

  @keyframes popIn {
    from { transform: translate(-50%, -50%) scale(.8); opacity: 0; }
    to   { transform: translate(-50%, -50%) scale(1);  opacity: 1; }
  }

  .header {
    padding: 1.25rem 1.25rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
  }

  .emoji {
    font-size: 3rem;
    animation: bounce 1s ease infinite;
  }

  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-0.5rem ); }
  }

  .title {
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--slate-100);
    font-family: var(--handwritten);
  }

  .body {
    width: 65vmin;
    padding: 0 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    color: var(--slate-100);
    font-family: var(--handwritten);
    font-size: 1.1rem;
  }

  .buttons {
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
</style>