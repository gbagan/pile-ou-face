
<script lang="ts">
  import { times } from '@gbagan/utils';
  import { onMount, type Snippet } from 'svelte'
 
  type Props = {
    children: Snippet;
  }

  type Point = {
    x: number;
    y: number;
  }

  type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    col: string;
    a: number;
    tail: Point[];
  }

  type Star = {
    x: number;
    y: number;
    r: number
    a: number
    sp: number;
  }

  let { children }: Props = $props();

  let canvas: HTMLCanvasElement;
 
  const BG1  = '#1A1640'
  const BG2  = '#0D0B28'
  const COLS = ['#7F77DD','#534AB7','#AFA9EC','#5DCAA5','#D85A30','#FAC775']
 
  onMount(() => {
    const ctx = canvas.getContext('2d')!;
    let W = 0;
    let H = 0;
    let stars: Star[] = [];
    let particles: Particle[] = [];
    let raf: number;
 
    function makeParticle(fromBottom = false): Particle {
      const side = Math.random() < .5 ? 'left' : 'right';
      return {
        x:   fromBottom ? Math.random() * W : (side === 'left' ? -20 : W + 20),
        y:   fromBottom ? H + 20 : Math.random() * H,
        vx:  (Math.random() * .6 + .2) * (side === 'left' ? 1 : -1),
        vy:  -(Math.random() * .5 + .2),
        r:   Math.random() * 4 + 2,
        col: COLS[Math.floor(Math.random() * COLS.length)],
        a:   Math.random() * .5 + .2,
        tail: [],
      }
    }
 
    function init() {
      stars = times(90, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.2 + .3,
        a:  Math.random(),
        sp: Math.random() * .008 + .003,
      }));
      particles = times(28, () => makeParticle());
    }
 
    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      init()
    }
 
    function draw() {
      ctx.clearRect(0, 0, W, H)
 
      const grd = ctx.createLinearGradient(0, 0, 0, H)
      grd.addColorStop(0, BG1)
      grd.addColorStop(1, BG2)
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H)
 
      for (const s of stars) {
        s.a += s.sp
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${.25 + .4 * Math.abs(Math.sin(s.a))})`
        ctx.fill()
      }
 
      for (const p of particles) {
        p.tail.push({ x: p.x, y: p.y })
        if (p.tail.length > 14) p.tail.shift()
 
        for (let i = 1; i < p.tail.length; i++) {
          const t = i / p.tail.length
          ctx.beginPath()
          ctx.moveTo(p.tail[i - 1].x, p.tail[i - 1].y)
          ctx.lineTo(p.tail[i].x, p.tail[i].y)
          ctx.strokeStyle = p.col + Math.floor(t * p.a * 120).toString(16).padStart(2, '0')
          ctx.lineWidth = p.r * t * .7
          ctx.stroke()
        }
 
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.col + Math.floor(p.a * 200).toString(16).padStart(2, '0')
        ctx.fill()
 
        p.x += p.vx
        p.y += p.vy
        if (p.x < -30 || p.x > W + 30 || p.y < -30) Object.assign(p, makeParticle(true))
      }
 
      raf = requestAnimationFrame(draw)
    }
 
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!);
    resize();
    draw();
 
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    }
  })
</script>
 
<div class="container">
  <canvas bind:this={canvas}></canvas>
  <div class="content">
    {@render children()}
  </div>
</div>
 
<style>
  .container {
    position: fixed;
    width: 100vw;
    min-height: 100vh;
    overflow: hidden;
  }
 
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
 
  .content {
    position: relative;
    z-index: 1;
  }
</style>