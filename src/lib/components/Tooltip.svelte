<script lang="ts">
  import type { DataPoint } from './BarChart.svelte'; // Reuse the DataPoint interface. Maybe we should move it to a separate file.

  interface TooltipProps {
    data: DataPoint | null;
    position: { x: number; y: number };
  }

  let { data, position } = $props<TooltipProps>();
</script>

<!--
  This is the tooltip container. We only render it if there's data to show.
  The style attribute positions it absolutely on the page.
-->
{#if data}
  <div class="tooltip" style="left: {position.x}px; top: {position.y}px;">
    <strong>{data.name}</strong>
    <div class="value">{data.value.toLocaleString()}</div>
  </div>
{/if}

<style>
  .tooltip {
    position: absolute; /* Crucial for positioning */
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: sans-serif;
    font-size: 0.85rem;
    line-height: 1.4;
    min-width: 80px;
    text-align: center;
    /* This prevents the tooltip from flickering by blocking mouse events */
    pointer-events: none;
    /* A slight transform to position it nicely relative to the cursor */
    transform: translate(-50%, -110%);
    transition: opacity 0.1s ease-out;
    white-space: nowrap;
    z-index: 10;
  }

  .tooltip strong {
    display: block;
    margin-bottom: 4px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 4px;
  }
</style>
