<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "./Button.svelte";

  type Props = {
    title: string;
    children: Snippet;
    onOk: () => void;
  }

  let { title, children, onOk }: Props = $props();
</script>

<div class="dialog-header">
  <p class="dialog-title">{title}</p>
</div>
<div class="dialog-body">
  {@render children()}
</div>
<div class="buttons">
  <Button onclick={onOk} variant="teal">Ok</Button>
</div>

<style>
  .dialog-header {
    padding: 20px 20px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
  }

  .dialog-emoji {
    font-size: 48px;
    animation: bounce 1s ease infinite;
  }

  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }

  .dialog-title {
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--slate-100);
    font-family: "Shantell Sans";
  }

.dialog-subtitle {
  font-size: 14px;
  color: #AFA9EC;
  font-family: inherit;
}

.dialog-body {
  width: 65vmin;
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--slate-100);
  font-family: "Shantell Sans";
  font-size: 1.1rem;
}

  .buttons {
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
</style>