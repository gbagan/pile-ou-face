<script lang="ts">
  const COLORS = [
    "var(--green-500)",
    "var(--orange-400)",
    "var(--red-500)"
  ];
  
  type Props = {
    text: string;
    thresholds: [number, number, number, number];
    needle: number
  }

  let { text, thresholds, needle }: Props = $props();

  function polarToCartesian(centerX: number, centerY: number, radius: number, angle: number): [number, number] {
    return [ centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle) ];
  }

  function partDescription(cx: number, cy: number, innerRadius: number, outerRadius: number,
    startAngle: number, endAngle: number)
  {
    const [isx, isy] = polarToCartesian(cx, cy, innerRadius, startAngle);
    const [iex, iey] = polarToCartesian(cx, cy, innerRadius, endAngle);
    const [osx, osy] = polarToCartesian(cx, cy, outerRadius, startAngle);
    const [oex, oey] = polarToCartesian(cx, cy, outerRadius, endAngle);
    return `M${isx} ${isy}L${osx} ${osy}A${outerRadius} ${outerRadius} 0 0 1 ${oex} ${oey}`
      + `L${iex} ${iey}A${innerRadius} ${innerRadius} 0 0 0 ${isx} ${isy}`;
  }

  let color = $derived(
    thresholds[1] <= needle && needle <= thresholds[2]
    ? COLORS[0]
    : thresholds[0] <= needle && needle <= thresholds[3]
    ? COLORS[1]
    : COLORS[2]
  );


</script>

{#snippet wheelPart(start: number, end: number, color: string)}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <path
    d={partDescription(125, 110, 40, 75, Math.PI*(1+start), Math.PI*(1+end))}
    fill={color}
    stroke="var(--slate-700)"
    stroke-width="1.5"
  />
{/snippet}

<rect x="0" y="0" width="250" height="150" rx="20" ry="20" fill="var(--slate-950)"/>
<rect x="15" y="15" width="220" height="100" rx="15" ry="15" fill="white" />
<text x="125" y="140" fill="white" text-anchor="middle">{text}</text>
{@render wheelPart(0, thresholds[0], COLORS[2])}
{@render wheelPart(thresholds[0], thresholds[1], COLORS[1])}
{@render wheelPart(thresholds[1], thresholds[2], COLORS[0])}
{@render wheelPart(thresholds[2], thresholds[3], COLORS[1])}
{@render wheelPart(thresholds[3], 1, COLORS[2])}
<rect
  x="-1"
  y="-1"
  width="70"
  height="2"
  style:transform="translate(124px, 110px) rotate({-180+180*needle}deg)"
  fill="url(#metal)"
  filter="url(#shadow)"
  class="needle"
/>
<circle cx="30" cy="30" r="10" fill={color} stroke="var(--slate-700)" stroke-width="1" />

<style>
  .needle {
    transition: transform 300ms linear;
  }
</style>