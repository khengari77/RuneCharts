import type { Meta, StoryObj } from '@storybook/svelte';
import BarChart from '$lib/components/BarChart.svelte';
import type { DataPoint } from '$lib/components/BarChart.svelte'; // Import DataPoint interface

// --- Meta configuration for Storybook ---
const meta = {
  title: 'Visualizations/BarChart',
  component: BarChart,
  // Storybook automatically infers argTypes from Svelte 5 $props() declaration,
  // but we can override or add custom controls here.
  argTypes: {
    barColor: { control: 'color', description: 'Color of the bars.' },
    width: { control: 'number', description: 'Width of the SVG container.' },
    height: { control: 'number', description: 'Height of the SVG container.' },
    // Data prop usually handled via `args.data` directly
  },
  parameters: {
    docs: {
      description: {
        component: 'A customizable bar chart component built with Svelte 5 and D3.js.',
      },
    },
  },
} satisfies Meta<BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Sample Data ---
const sampleData: DataPoint[] = [
  { name: 'Category A', value: 10 },
  { name: 'Category B', value: 25 },
  { name: 'Category C', value: 18 },
  { name: 'Category D', value: 32 },
  { name: 'Category E', value: 15 },
];

// --- Stories ---
export const Default: Story = {
  args: {
    data: sampleData,
    width: 500,
    height: 300,
    barColor: '#4e79a7', // Default color
  },
};

export const CustomColor: Story = {
    args: {
      data: sampleData,
      width: 500,
      height: 300,
      barColor: '#e15759', // A nice red
    },
};

export const FewerBars: Story = {
    args: {
      data: [
        { name: 'Sales', value: 120 },
        { name: 'Marketing', value: 95 },
      ],
      width: 300,
      height: 400,
    },
};

export const EmptyData: Story = {
    args: {
      data: [],
      width: 500,
      height: 300,
      barColor: '#76b7b2',
    },
    parameters: {
      docs: {
        description: {
          story: 'Demonstrates the chart with an empty dataset. Should show no bars.',
        },
      },
    },
};
