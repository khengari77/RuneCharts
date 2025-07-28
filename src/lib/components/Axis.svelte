<script lang="ts">
  import { select } from 'd3-selection';
  import {axisLeft, axisBottom} from 'd3-axis';
	import type { ScaleBand, ScaleLinear } from 'd3-scale';

  interface AxisProps {
    scale: ScaleBand<string> | ScaleLinear<number, number>; 
    orientation: 'bottom' | 'left';
  }

  let { scale, orientation } = $props<AxisProps>();

  let gElement: SVGElement | undefined;

  $effect(() => {
    if (gElement) {
      
      const axis = orientation === 'bottom' ? axisBottom(scale) : axisLeft(scale);

      select(gElement).call(axis);
    }
  }); 
</script>


<g bind:this={gElement} />

