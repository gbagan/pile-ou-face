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

<div class="header">
  <p class="emoji">{emoji}</p>
  <p class="title">{title}</p>
</div>
<div class="body">
  {@render children()}
</div>
<div class="buttons">
  <Button onclick={onOk} variant="teal">Ok</Button>
</div>

<style>
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