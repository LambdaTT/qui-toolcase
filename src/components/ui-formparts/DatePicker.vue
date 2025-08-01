<template>
  <q-input hide-bottom-space :class="`full-width bg-${BgColor ? BgColor : 'white'}`" :dense="dense" readonly filled
    square v-model="formattedDate" :error="Error" :label="Label">
    <template v-slot:append>
      <q-icon id="clear-button" v-if="!!formattedDate && !readonly" name="cancel" clickable @click="clear()"
        class="cursor-pointer">
        <q-tooltip>Limpar seleção</q-tooltip>
      </q-icon>
      <q-icon v-if="readonly" name="fas fa-calendar-alt" color="grey-8" class="cursor-ban"></q-icon>
      <q-icon v-else clickable @click="$emit('focus');" name="fas fa-calendar-alt" color="primary"
        class="cursor-pointer">
        <q-tooltip>Selecionar {{ range ? 'Período' : 'Data' }}</q-tooltip>
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-card>
            <q-date :emit-immediately="!range" :range="range" :today-btn="todayBtn" :options="dateOptions"
              :navigation-min-year-month="minDatePage" :navigation-max-year-month="maxDatePage" v-model="date"
              @update:model-value="updateModelValue()">
            </q-date>
            <div v-if="withTime" class="q-pa-sm">
              <TimePicker :withSeconds="withSeconds" dense :Label="range ? 'De:' : 'Hora'" v-model="firstTime"
                :Default="defaultFirstTime" @update:model-value="updateModelValue()">
              </TimePicker>
              <TimePicker :withSeconds="withSeconds" v-if="range" dense Label="Até:" v-model="lastTime"
                :Default="defaultLastTime" class="q-pt-sm" @update:model-value="updateModelValue()">
              </TimePicker>
            </div>
            <div class="row items-center justify-end q-pa-sm">
              <q-btn v-close-popup class="q-mr-sm" label="Digitar" color="primary" dense @click="typingMode = true" />
              <q-btn v-close-popup label="Fechar" color="primary" flat dense />
            </div>
          </q-card>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
export default {
  name: 'ui-formparts-datepicker',

  props: {
    modelValue: { type: [String, Object] },
    Default: { type: [String, Object] },
    BgColor: String,
    Label: String,
    Error: { type: Boolean, default: false },
    dateOptions: { type: [Array, Function] },
    dense: Boolean,
    range: Boolean,
    readonly: Boolean,
    withTime: Boolean,
    withSeconds: Boolean,
    todayBtn: Boolean,
    minDatePage: String,
    maxDatePage: String,
  },

  data() {
    return {
      defaultFirstTime: null,
      defaultLastTime: null,
      firstTime: null,
      lastTime: null,
      date: null,
    }
  },

  watch: {
    date() {
      this.updateModelValue();
    },

    firstTime() {
      this.updateModelValue();
    },

    lastTime() {
      this.updateModelValue();
    },
  },

  methods: {
    setDefault() {
      var v = this.Default ?? null;
      var date;
      var firstTime;
      var lastTime;

      if (!!v) {
        // For date range:
        if (typeof v == 'object') {
          date = {
            from: null,
            to: null
          };
          firstTime = null;
          lastTime = null;

          if (!!v.from) {
            if (v.from.includes(':')) {
              let arr = v.from.split(' ');
              date.from = arr[0];
              firstTime = arr[1];
            } else {
              date.from = v.from;
            }
          }

          if (!!v.to) {
            if (v.to.includes(':')) {
              let arr = v.to.split(' ');
              date.to = arr[0];
              lastTime = arr[1];
            } else {
              date.to = v.to;
            }
          }
        }

        // For single date:
        else {
          if (v.includes(':')) {
            let arr = v.split(' ');
            date = arr[0];
            firstTime = arr[1];
          } else {
            date = v;
          }
        }
      } else {
        date = null;
        firstTime = null;
        lastTime = null;
      }

      this.date = date;
      this.firstTime = firstTime;
      this.lastTime = lastTime;

      if (!!this.Default && firstTime) {
        this.defaultFirstTime = firstTime;
      }
      if (!!this.Default && lastTime) {
        this.defaultLastTime = lastTime;
      }
    },

    updateModelValue() {
      var val;

      // For date range:
      if (this.date != null && (typeof this.date == 'object' || this.range)) {
        // 1. Handle date:
        val = {
          from: !!this.date.from ? this.date.from.replaceAll('/', '-') : null,
          to: !!this.date.to ? this.date.to.replaceAll('/', '-') : null,
        };
        // 2. Handle first time:
        if (!!val.from && this.firstTime) val.from = `${val.from} ${this.firstTime}`
        // 3. Handle last time:
        if (!!val.to && this.lastTime) val.to = `${val.to} ${this.lastTime}`
      }

      // For single date:
      else {
        // 1. Handle date:
        val = !!this.date ? this.date.replaceAll('/', '-') : null;
        // 2. Handle first time:
        if (!!val && this.firstTime) val = `${val} ${this.firstTime}`
      }
      this.$emit('update:model-value', val);
    },

    clear() {
      this.setDefault();
      this.$emit('update:model-value', this.Default);
      if (this.withTime) {
        this.defaultFirstTime = this.firstTime ? this.firstTime : '00:00:00';
        if (this.range)
          this.defaultLastTime = this.lastTime ? this.lastTime : '23:59:59';

      }
    }
  },

  computed: {
    formattedDate() {
      if (!!this.modelValue) {
        if (typeof this.modelValue == 'object') {
          if (!this.modelValue?.from || !this.modelValue?.to) return null;

          let fromData = this.modelValue.from.split('-');
          let toData = this.modelValue.to.split('-');

          var dayFrom = fromData[2];
          var dayTo = toData[2];
          if (this.modelValue.from.includes(':')) {
            let dayData = dayFrom.split(' ');
            dayFrom = dayData[0];
            fromData[0] = `${fromData[0]} ${dayData[1]}`;
          }
          if (this.modelValue.to.includes(':')) {
            let dayData = dayTo.split(' ');
            dayTo = dayData[0];
            toData[0] = `${toData[0]} ${dayData[1]}`;
          }

          return `De: ${dayFrom}/${fromData[1]}/${fromData[0]}  ->  Até: ${dayTo}/${toData[1]}/${toData[0]}`
        } else {
          var dateData = this.modelValue.split('-');

          var day = dateData[2];
          if (this.modelValue.includes(':')) {
            let dayData = day.split(' ');
            day = dayData[0];
            dateData[0] = `${dateData[0]} ${dayData[1]}`;
          }
          return `${day}/${dateData[1]}/${dateData[0]}`
        }
      }
      else return null;
    },
  },

  mounted() {
    setTimeout(() => {
      this.setDefault();
    }, 200);
  }

}
</script>
<style scoped>
.cursor-ban {
  cursor: not-allowed
}

#clear-button {
  opacity: 0.7;
}

#clear-button:hover {
  opacity: 1;
}
</style>