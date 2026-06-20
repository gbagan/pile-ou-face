<script lang="ts">
  import Dialog from "./Dialog.svelte";

  type Props = {
    dialog: "A" | "B" | "C" | "D" | null;
    closeDialog: () => void;
  }

  let { dialog, closeDialog }: Props = $props();
</script>

{#if dialog === "A"}
  <Dialog title="Piles/Faces" emoji="🪙" onOk={closeDialog}>
    Au hasard, piles et faces finissent toujours par s'équilibrer autour de 50% 🪙 <br/>
    Et plus tu lances, plus cet équilibre se confirme — c'est la loi des grands nombres !
  </Dialog>
{:else if dialog === "B"}
  <Dialog title="Plus long run" emoji="🏃" onOk={closeDialog}>
    Un run, c'est une série de piles ou de faces à la suite — genre pile, pile, pile, pile 🏃<br/>
    Sur 100 lancers au hasard, le record de la partie se situe presque toujours entre 5 et 10.<br/>
    En dessous ou au-dessus ? Ta séquence cache peut-être quelque chose… 🧐
  </Dialog>
{:else if dialog === "C"}
  <Dialog title="Imprédictibilité" emoji="🔮" onOk={closeDialog}>
    L'appli espione tes lancers pour essayer de deviner le prochain 🔮 <br/>
    Mais si tu joues vraiment au hasard, elle ne fait pas mieux qu'un pile ou face… à 50/50 !
  </Dialog>
{:else if dialog === "D"}
  <Dialog title="Incompressibilité" emoji="🗜️" onOk={closeDialog}>
    Imagine qu'on essaie de "zipper" ta séquence 🗜️ <br/>
    Si elle est vraiment aléatoire, impossible de la raccourcir — taux de compression : 0%.<br/>
    Dès qu'il y a des répétitions, ça se compresse… et ça se voit !<br/>
    L'algorithme utilisé ici : Lempel-Ziv-Welch.
  </Dialog>
{/if}