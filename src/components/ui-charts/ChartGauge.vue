<template>
  <div>
    <div v-if="ShowProgression" class="text-center text-bold text-h6" :style="`color:${gaugeColor}`">
      {{ FormatProgression ? FormatProgression(value) : value }} / {{ FormatProgression ? FormatProgression(maxValue) :
        maxValue }}
    </div>
    <canvas style="width: 100%;" ref="gaugeChart"></canvas>
  </div>
</template>

<script>
// Libs:
import Chart from "chart.js";

export default {
  name: "ui-charts-gauge",

  props: {
    ShowProgression: Boolean,
    FormatProgression: Function,
    value: {
      type: Number,
      required: true,
    },
    minValue: {
      type: Number,
      default: 0,
    },
    maxValue: {
      type: Number,
      default: 100,
    },
  },

  data() {
    return {
      chartInstance: null,
      gaugeColor: '#000',
      debounceTimeoutId: null,
    };
  },

  mounted() {
    const ctx = this.$refs.gaugeChart.getContext("2d");
    const gaugeValue = Math.min(
      Math.max(this.value, this.minValue),
      this.maxValue
    );
    const normalizedValue =
      ((gaugeValue - this.minValue) / (this.maxValue - this.minValue)) * 100;

    const gaugeColor =
      normalizedValue < 33
        ? "#FF0000" // Red for low
        : normalizedValue < 66
          ? "#FFFF00" // Yellow for medium
          : "#4CAF50"; // Green for high
    this.gaugeColor = gaugeColor;

    this.chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [normalizedValue, 100 - normalizedValue],
            backgroundColor: [gaugeColor, "#E0E0E0"], // Dynamic color
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true, // Allow full control of height and width
        rotation: Math.PI, // Start from the bottom
        circumference: Math.PI, // Semi-circle
        cutoutPercentage: 60, // Adjust thickness
        tooltips: {
          enabled: false, // Disable tooltips
        },
        layout: {
          padding: 0, // Remove all padding around the chart
        },
        animation: {
          duration: 1000,
        },
        minValue: 0, // Minimum gauge value
        maxValue: 100, // Maximum gauge value
      },
      plugins: [
        {
          afterDraw: (chart) => {
            const ctx = chart.chart.ctx;
            const width = chart.chart.width;
            const height = chart.chart.height;

            // Center coordinates
            const centerX = width / 2;
            const centerY = chart.chartArea.top + chart.chart.outerRadius;

            // Radius for needle calculation
            const outerRadius = chart.chart.outerRadius;
            const innerRadius = chart.chart.innerRadius;
            const radius = (innerRadius + outerRadius) / 2;

            // Calculate needle angle based on normalized value
            const normalizedValue =
              ((chart.data.datasets[0].data[0] - chart.options.minValue) /
                (chart.options.maxValue - chart.options.minValue)) *
              Math.PI; // Normalize to half-circle
            const angle = Math.PI + normalizedValue;

            // Draw needle
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, -radius * 0.02); // Needle width (2% of radius)
            ctx.lineTo(radius * 0.9, 0); // Needle length (90% of radius)
            ctx.lineTo(0, radius * 0.02); // Needle width (2% of radius)
            ctx.fillStyle = "#000000"; // Needle color
            ctx.fill();
            ctx.restore();

            // Draw percentage text
            ctx.font = `${Math.round(height / 10)}px Arial`; // Font size dynamically based on height
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.fillText(
              `${Math.round(chart.data.datasets[0].data[0])}%`,
              centerX,
              centerY - radius * 0.6 // Adjust position based on radius
            );
          },

        },
      ],
    });
  },

  watch: {
    value(newValue) {
      this.updChartData(newValue);
    },

    maxValue() {
      this.updChartData(this.value);
    },

    minValue() {
      this.updChartData(this.value);
    },
  },

  methods: {
    updChartData(newValue) {
      if (!!this.debounceTimeoutId) clearTimeout(this.debounceTimeoutId);

      setTimeout(() => {
        if (this.chartInstance) {
          const gaugeValue = Math.min(
            Math.max(newValue, this.minValue),
            this.maxValue
          );
          const normalizedValue =
            ((gaugeValue - this.minValue) / (this.maxValue - this.minValue)) *
            100;

          const gaugeColor =
            normalizedValue < 33
              ? "#FF0000" // Red for low
              : normalizedValue < 66
                ? "#FFFF00" // Yellow for medium
                : "#4CAF50"; // Green for high

          this.gaugeColor = gaugeColor;

          this.chartInstance.data.datasets[0].data = [
            normalizedValue,
            100 - normalizedValue,
          ];
          this.chartInstance.data.datasets[0].backgroundColor = [
            gaugeColor,
            "#E0E0E0",
          ];
          this.chartInstance.update();
        }
      }, 200)
    },
  },

  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  max-height: 100%;
}
</style>
