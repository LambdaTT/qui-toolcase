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
    <div class="text-center q-pa-xl" v-show="!showLoader && rawData?.length == 0">
      <div>
        <q-icon size="lg" name="far fa-folder-open"></q-icon> *
      </div>
      <div class="text-h6">
        Sem Dados.
      </div>
    </div>

    <!-- Content -->
    <div v-show="!showLoader && rawData?.length > 0" :id="`chart-${Name}-container`">
      <canvas :style="this.CanvasStyle" ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
// Libs:
import Chart from 'chart.js'

export default {
  name: 'ui-charts-pie',

  props: {
    Name: String,
    modelValue: {
      type: Object,
      required: true
    },
    DataURL: String,
    Filters: Object,
    LabelsField: String,
    ValueField: String,
    CanvasStyle: String,
    Percentage: Boolean,
    BeforeLoad: Function,
    OnLoaded: Function,
  },

  data() {
    return {
      chartElement: null,
      loading: false,
      showLoader: false,
      rawData: [],
      loadTimeout: null,
      filters: {}
    }
  },

  computed: {
    factory() {
      return {
        data: this.rawData,
        element: this.chartElement,
        filters: this.filters,
        reload: this.reload
      }
    }
  },

  watch: {
    loading: {
      handler: function (v) {
        this.showLoader = v;
      }
    },

    Filters: {
      handler(v) {
        // Save filters state:
        localStorage.removeItem(`ChartPie.${this.Name}.filters`);

        var filters = JSON.parse(JSON.stringify(this.Filters));

        if (Object.keys(filters).length > 0)
          localStorage.setItem(`ChartPie.${this.Name}.filters`, JSON.stringify(filters));

        clearTimeout(this.loadTimeout);

        for (let k in filters) {
          if (filters[k] == null)
            delete filters[k] == null
        }

        this.filters = filters;

        this.loadTimeout = setTimeout(async () => {
          var response = await this.loadData();
          this.rawData = response.data
        }, 200);
      },
      deep: true
    },

    rawData: {
      handler() {
        this.triggerChart();
        this.$emit('update:model-value', this.factory);
      }
    }
  },

  methods: {
    async loadData() {
      if (!this.loading) {
        // turn on loading indicator
        this.loading = true;

        var params = {};
        if (!!this.filters)
          for (let k in this.filters)
            if (!!this.filters[k])
              params[k] = this.filters[k];

        try {
          // Before Load callback:
          if (this.BeforeLoad) await this.BeforeLoad(params);

          // fetch data from server
          var response = await this.$http.get(this.DataURL, params);

          // On Loaded callback:
          if (this.OnLoaded) await this.OnLoaded(response);

          return response;
        } catch (err) {
          this.loading = false;
          this.errorState = true;
          this.$emit('error-thrown', err);
        }
      }
    },

    triggerChart() {
      var chartObj = {
        type: "pie",
        data: {
          labels: [],
          datasets: [{
            label: 'chart pie',
            data: [],
            backgroundColor: [],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          tooltips: {
            mode: 'label',
          }
        },

      };

      // Clone datasets, detaching from reference:
      var dataset = chartObj.data.datasets[0]
      for (let i = 0; i < this.rawData.length; i++) {
        let data = this.rawData[i];
        chartObj.data.labels.push(data[this.LabelsField]);

        dataset.backgroundColor.push(this.$utils.randomHexColor())

        dataset.data.push(data[this.ValueField]);
      }

      // Update chart:
      if (this.chartElement != null) {
        this.chartElement.config = chartObj;
        this.chartElement.update();
      }
      // Start new chart: 
      else {
        var ctx = this.$refs.chartCanvas;
        this.chartElement = new Chart(ctx, chartObj);
      }

      this.loading = false;
    },

    reload() {
      clearTimeout(this.loadTimeout);

      this.loadTimeout = setTimeout(async () => {
        this.rawData = (await this.loadData()).data;
      }, 200);
    }
  },

  async mounted() {
    var response = await this.loadData();
    this.rawData = response.data
  }
}
</script>