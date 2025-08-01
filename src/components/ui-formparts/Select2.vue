<template>
  <q-select behavior="menu" hide-bottom-space :bg-color="`bg-${BgColor ? BgColor : 'white'}`" option-disable="inactive"
    :disable="disable" :hide-dropdown-icon="readonly" :dense="dense" filled square :clearable="clearable"
    v-model="selected" use-input hide-selected fill-input input-debounce="300" :options="options" @filter="filterFn"
    :label="Label" :error="Error" @focus="$emit('focus')" :readonly="readonly">
    <template v-if="!!Icon" v-slot:append>
      <q-icon :name="Icon" color="grey-8" />
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Nenhum resultado
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
export default {
  name: 'ui-formparts-select2',

  props: {
    BgColor: String,
    Options: Array,
    Label: String,
    Icon: String,
    Error: Boolean,
    readonly: Boolean,
    disable: Boolean,
    dense: Boolean,
    modelValue: {
      types: ['string', 'object', 'number']
    },
    clearable: Boolean
  },

  data() {
    return {
      rawData: [],
      selected: null,
    }
  },

  computed: {
    options() {
      if (this.rawData.length > 0) {
        return [...this.rawData].sort((a, b) =>
          String(a.label).localeCompare(String(b.label), 'pt-BR', { sensitivity: 'base' }))
      }
      return [];
    }
  },

  watch: {
    selected(v) {
      this.$emit('update:model-value', v?.value);
    },

    modelValue(v) {
      this.setValue(v);
    },

    Options: {
      handler(v) {
        this.rawData = v;
      },

      deep: true
    }
  },

  methods: {
    setValue(v) {
      if (this.Options !== null) {
        if (v === null || typeof v == 'undefined' || v === '') {
          this.selected = null;
        } else {
          this.selected = this.Options.filter((opt) => {
            return String(opt.value).toLocaleLowerCase() == String(v).toLocaleLowerCase();
          })[0] ?? null;
        }
      } else {
        setTimeout(() => this.setValue(v), 100);
      }
    },

    filterFn(val, update) {
      if (!!val == false || val === '') {
        update(() => {
          this.rawData = this.Options;
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.rawData = this.Options.filter(v => String(v.label).toLowerCase().includes(needle));
      })
    },
  },

  mounted() {
    this.rawData = this.Options;
    this.setValue(this.modelValue);
  }
}
</script>