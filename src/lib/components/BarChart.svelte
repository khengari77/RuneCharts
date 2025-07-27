<script lang="ts">
  import { scaleBand, scaleLinear } from 'd3-scale';
  import { max } from 'd3-array';

  // This interface defines the shape of our data
  export interface DataPoint {
    name: string;
    value: number;
  }

  // Define an interface for the component's props for type safety
  interface BarChartProps {
    data: DataPoint[];
    width?: number; // Optional prop with default value
    height?: number; // Optional prop with default value
    barColor?: string; // Optional prop with default value
  }

  // Destructure props using $props()
  let {
    data,
    width = 500,  // Default values directly in destructuring
    height = 300,
    barColor = '#4e79a7',
  } = $props<BarChartProps>(); // Type annotation for $props

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

<!-- 4. RENDER THE SVG VISUALIZATION -->
<!-- Svelte automatically passes width and height as attributes when prop name matches -->
<svg {width} {height}>
  <!-- Group for margins, transformed to push content into viewable area -->
  <g transform="translate({margin.left}, {margin.top})">
    <!-- Use a Svelte #each block to iterate over data and create bars -->
    {#each data as d}
      <rect
        x={xScale(d.name)}
        y={yScale(d.value)}
        width={xScale.bandwidth()}
        height={innerHeight - yScale(d.value)}
        fill={barColor}
      >
        <!-- Simple tooltip on hover for accessibility -->
        <title>{d.name}: {d.value}</title>
      </rect>
    {/each}
  </g>
</svg>

<style>
  /* Basic styling for the component */
  svg {
    border: 1px solid #ccc;
    background-color: #f9f9f9;
  }

  rect {
    transition: fill 0.2s ease-in-out; /* Smooth color transitions */
  }

  rect:hover {
    filter: brightness(1.2); /* Lighten bar on hover */
  }
</style>
