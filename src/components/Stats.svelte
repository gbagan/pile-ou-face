<script lang="ts">
  type Props = {
    text: string;
  }

  let { text }: Props = $props();

  function polarToCartesian(centerX: number, centerY: number, radius: number, angle: number): [number, number] {
    return [ centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle) ];
  }

  function pizza(cx: number, cy: number, innerRadius: number, outerRadius: number,
    startAngle: number, endAngle: number) 
  {
    const [isx, isy] = polarToCartesian(cx, cy, innerRadius, startAngle);
    const [iex, iey] = polarToCartesian(cx, cy, innerRadius, endAngle);
    const [osx, osy] = polarToCartesian(cx, cy, outerRadius, startAngle);
    const [oex, oey] = polarToCartesian(cx, cy, outerRadius, endAngle);
    return `M${isx} ${isy}L${osx} ${osy}A${outerRadius} ${outerRadius} 0 0 1 ${oex} ${oey}`
      + `L${iex} ${iey}A${innerRadius} ${innerRadius} 0 0 0 ${isx} ${isy}`;
  }
</script>

{#snippet wheelPart(start: number, end: number, color: string)}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <path
    d={pizza(125, 110, 40, 75, Math.PI*(1+start), Math.PI*(1+end))}
    fill={color}
    stroke="black"
    stroke-width="1.5"
  />
{/snippet}


<rect x="0" y="0" width="250" height="150" rx="20" ry="20" fill="black "/>
<rect x="15" y="15" width="220" height="100" rx="15" ry="15" fill="white" />
<text x="125" y="140" fill="white" text-anchor="middle">{text}</text>
{@render wheelPart(0, 0.3, "red")}
{@render wheelPart(0.3, 0.4, "orange")}
{@render wheelPart(0.4, 0.6, "green")}
{@render wheelPart(0.6, 0.7, "orange")}
{@render wheelPart(0.7, 1, "red")}
<rect
  x="-1"
  y="-1"
  width="70" height="2"
  style:transform="translate(124px, 110px) rotate(-90deg)"
  fill="url(#metal)"
  filter="url(#shadow)"
/>