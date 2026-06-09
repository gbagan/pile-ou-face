<script lang="ts">
  import Score from "./Score.svelte";
</script>

<div class="grid">
  <Score title="Pile 31% / Face 39%" score={25} delay={0} />
  <Score title="Plus long run 6" score={50} delay={1100} />
  <Score title="Imprédictibilité 31%" score={75} delay={4*1100} />
  <Score title="Incompressibilité" score={100} delay={8*1100 } />
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
</style>

