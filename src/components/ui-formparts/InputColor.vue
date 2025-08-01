<template>
  <div>
    <q-input hide-bottom-space :class="`full-width bg-${BgColor ? BgColor : 'white'}`" square filled :dense="dense" readonly v-model="value" :error="Error"
      @focus="() => $emit('focus')" :label="Label">
      <template v-slot:append>
        <span v-if="!!value" :style="`background-color:${value};`" id="color-preview"></span>
        <q-icon id="clear-button" v-if="!!value && !readonly" name="cancel" clickable @click="clear()"
          class="cursor-pointer">
          <q-tooltip>Limpar seleção</q-tooltip>
        </q-icon>
        <q-icon v-if="readonly" name="colorize" color="grey-8" class="cursor-ban"></q-icon>
        <q-icon v-if="!readonly" clickable @click="$emit('focus');" name="colorize" color="primary"
          class="cursor-pointer">
          <q-tooltip>Selecionar cor</q-tooltip>
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="value" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  name: 'ui-formparts-inputcolor',

  props: {
    BgColor: String,
    readonly: Boolean,
    dense: Boolean,
    modelValue: String,
    Label: String,
    Error: Boolean,
    Default: String,
  },

  data() {
    return {
      value: null
    }
  },

  watch: {
    modelValue(v) {
      this.value = v;
    },

    value(v){
      this.updModelValue(v);
    }
  },

  methods: {
    updModelValue(v) {
      this.$emit('update:model-value', v);
    },

    clear() {
      if (!!this.Default) this.value = this.Default;
      else this.value = this.modelValue;
    }
  },

  created() {
    this.clear();
  }
}
</script>

<style scoped>
#color-preview {
  display: inline-block;
  border: 0.5px solid;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>