<template>
  <div>
    <!-- Loading -->
    <div class="text-center q-pa-xl text-grey-8" v-show="showLoader">
      <div>
        <q-spinner-gears size="lg" />
      </div>
      <div class="text-caption">
        Carregando...
      </div>
    </div>

    <!-- Empty -->
    <div class="text-center q-pa-xl" v-show="!showLoader && RawData?.length == 0">
      <div>
        <q-icon size="lg" name="far fa-folder-open"></q-icon> *
      </div>
      <div class="text-h6">
        Sem Dados.
      </div>
    </div>

    <!-- Content -->
    <div v-show="!showLoader && RawData?.length > 0" :id="`chart-${Name}-container`">
      <canvas :style="this.CanvasStyle" :id="`chart-${Name}-canvas`"></canvas>
    </div>
  </div>
</template>

<script>
// Libs:
import Chart from 'chart.js'

export default {
  name: 'ui-charts-line',

  props: {
    Name: String,
    RawData: Object,
    LoadDataFn: Function,
    Filter: Function,
    Datasets: Object,
    LabelsField: String,
    HideLegend: Boolean,
    CanvasStyle: String,
  },

  data() {
    return {
      chartElement: null,
      datasets: [],
      loading: false,
      showLoader: false
    }
  },

  watch: {
    loading: {
      handler: function (v) {
        this.showLoader = v;
      }
    },

    RawData: {
      handler: function () {
        this.triggerChart();
      },
      deep: true
    },
  },

  methods: {
    async loadData() {
      if (!this.loading) {
        this.loading = true;

        var params = {};

        if (!!this.Filter) params = this.Filter();

        await this.LoadDataFn(params);
      }
    },

    triggerChart() {
      var chartObj = {
        type: "line",
        data: {
          labels: [],
          datasets: this.datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: !this.HideLegend },
          tooltips: {
            mode: 'label',
            callbacks: {
              label: (tooltipItem, data) => {
                var index = tooltipItem.datasetIndex;

                if (!!this.Datasets[index].formatTooltip && typeof this.Datasets[index].formatTooltip == 'function')
                  return this.Datasets[index].formatTooltip(data.datasets[index].label, tooltipItem.yLabel);
                else return data.datasets[index].label + ": " + tooltipItem.yLabel;
              }
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        },

      };


      // Clone datasets, detaching from reference:
      var datasets = JSON.parse(JSON.stringify(chartObj.data.datasets));
      var labels = [];

      if (this.RawData[0] instanceof Array) {
        let setLabels = true;
        for (let j = 0; j < this.Datasets.length; j++) {
          let datasetData = [];
          for (let i = 0; i < this.RawData[j].length; i++) {
            let data = this.RawData[j][i];

            if (setLabels)
              labels.push(data[this.LabelsField]);

            datasetData.push(data[this.Datasets[j].field]);
          }
          setLabels = false;
          datasets[j].data = datasetData;
        }
      } else {
        for (let i = 0; i < this.RawData.length; i++) {
          let data = this.RawData[i];
          labels.push(data[this.LabelsField]);

          for (let j = 0; j < this.Datasets.length; j++) {
            let dataset = this.Datasets[j];
            let indicator = !!dataset.indicator ? dataset.indicator.split('=') : null;

            if (!!indicator && data[indicator[0]] != indicator[1])
              continue;

            datasets[j].data.push(data[dataset.field]);
          }
        }
      }

      chartObj.data.labels = labels;
      // Update reference with (re)created datasets:
      chartObj.data.datasets = datasets;

      // Update chart:
      if (this.chartElement != null) {
        this.chartElement.config = chartObj;
        this.chartElement.update();
      }
      // Start new chart: 
      else {
        var ctx = document.getElementById(`chart-${this.Name}-canvas`);
        this.chartElement = new Chart(ctx, chartObj);
      }

      this.loading = false;
    },
  },

  mounted() {
    for (let i = 0; i < this.Datasets.length; i++) {
      let set = this.Datasets[i];

      let color = this.$utils.randomHexColor()

      this.datasets.push({
        label: set.label,
        data: [],
        fill: false,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 3
      })
    }

    this.loadData();

    this.$emit('reload-fn', this.loadData);
  }
}
</script>