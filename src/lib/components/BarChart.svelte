<script lang="ts">
  import { fly } from 'svelte/transition';
  import { scaleBand, scaleLinear } from 'd3-scale';
  import { max } from 'd3-array';
  import Axis from './Axis.svelte';
  import Tooltip from './Tooltip.svelte';


  // This interface defines the shape of our data
  export interface DataPoint {
    name: string;
    value: number;
  }

  // Define an interface for the component's props for type safety
  interface BarChartProps {
    data: DataPoint[];
    height?: number; // Optional prop with default value
    barColor?: string; // Optional prop with default value
  }

  // Destructure props using $props()
  let {
    data,
    height = 300,
    barColor = '#4e79a7',
  } = $props<BarChartProps>(); // Type annotation for $props


  let hoveredData = $state<DataPoint | null>(null); // State variable for storing the hovered data
  let tooltipPosition = $state({ x: 0, y: 0 }); // State variable for storing the tooltip positioning
  let width = $state(0); // State variable for storing the width of the chart


  function handleMouseOver(event: MouseEvent, data: DataPoint) {
    // Update the hoveredData state variable
    hoveredData = data;
  }

  function handleMouseMove(event: MouseEvent) {
    // Calculate the tooltip position based on the mouse position
    const { x, y } = event.target.getBoundingClientRect();
    tooltipPosition = { x, y };
  }

  function handleMouseLeave() {
    // Reset the hoveredData state variable
    hoveredData = null;
  }

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  // These values will automatically re-calculate when their dependencies (width, height, data) change.
  const innerWidth = $derived(width - margin.left - margin.right);
  const innerHeight = $derived(height - margin.top - margin.bottom);

  const xScale = $derived(
    scaleBand<string>() // Explicitly type scaleBand
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.1)
  );

  const yScale = $derived(
    scaleLinear<number, number>() // Explicitly type scaleLinear
      .domain([0, max(data, (d) => d.value) || 0]) // Use || 0 to handle empty data safely
      .range([innerHeight, 0]) // In SVG, 0 is at the top
  );

  // Optional: Add an effect for logging or other side-effects if needed
  // $effect(() => {
  //   console.log('Bar chart data updated:', data);
  // });
</script>

<div class="chart-container" bind:clientWidth={width}> 
{#if width > 0}
<div class="chart-wrapper" onmousemove={handleMouseMove} onmouseleave={handleMouseLeave}>
<svg {width} {height}>
  <g transform="translate({margin.left}, {margin.top})">

    <g transform="translate(0, {innerHeight})">
      <Axis scale={xScale} orientation="bottom" />
    </g>

    <g>
      <Axis scale={yScale} orientation="left" />
    </g>

    {#each data as d, i (d.name)}
      <rect
        x={xScale(d.name)}
        y={yScale(d.value)}
        width={xScale.bandwidth()}
        height={innerHeight - yScale(d.value)}
        fill={barColor}
        onmouseenter={(event) => handleMouseOver(event, d)}

        in:fly={{ y: 20, duration: 300, delay: i * 60 }}
      >
        <!-- Simple tooltip on hover for accessibility -->
        <title>{d.name}: {d.value}</title>
      </rect>
    {/each}
  </g>
</svg>

  <Tooltip data={hoveredData} position={tooltipPosition} />
</div>
{/if}
</div>


<style>
  .chart-container { 
    width: 100%;
    height: auto;
  }

  .chart-wrapper {
    position: relative; /* This is crucial for positioning the absolute tooltip */
    display: inline-block; /* Or block, depending on your layout needs */
  }


  svg {
    border: 1px solid #ccc;
    background-color: #f9f9f9;
  }
   
  rect {
    transition: fill 0.2s ease-in-out; /* Smooth color transitions */
  }

  rect:hover {
    filter: brightness(1.2);
  }

  /* Target elements inside the Axis component using :global */
  /* This ensures our chart component can control the axis styles */
  :global(g.tick text) {
    font-family: sans-serif;
    font-size: 0.7rem;
    color: #666;
  }

  :global(g.tick line) {
    stroke: #ccc;
  }

  :global(.domain) {
    stroke: #999;
  }
</style>
