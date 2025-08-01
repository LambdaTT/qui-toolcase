<template>
  <q-input hide-bottom-space :class="`full-width bg-${BgColor ? BgColor : 'white'}`" :label="Label" :dense="dense"
    readonly filled v-model="value" :error="Error">
    <template v-slot:append>
      <q-icon id="clear-button" v-if="!!value && !readonly" name="cancel" clickable @click="clear()"
        class="cursor-pointer">
        <q-tooltip>Limpar seleção</q-tooltip>
      </q-icon>
      <q-icon v-if="readonly" name="fas fa-clock" color="grey-8" class="cursor-ban"></q-icon>
      <q-icon v-if="!readonly" name="fas fa-clock" color="primary" clickable @click="$emit('focus')"
        class="cursor-pointer">
        <q-tooltip>Selecionar hora</q-tooltip>
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time :with-seconds="withSeconds" @update:model-value="updateModelValue" v-model="value" format24h>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Fechar" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
export default {
  name: 'ui-formparts-timepicker',

  props: {
    BgColor: String,
    dense: Boolean,
    Label: String,
    Error: Boolean,
    modelValue: String,
    readonly: Boolean,
    Default: String,
    withSeconds: Boolean
  },

  data() {
    return {
      value: null,
    }
  },

  watch: {
    modelValue(v) {
      this.value = v;
    }
  },

  methods: {
    updateModelValue(v) {
      this.value = `${v}`;
      this.$emit('update:model-value', this.value);
    },

    clear() {
      this.value = this.Default;
      this.$emit('update:model-value', this.Default);
    }
  },

  mounted() {
    if (!this.modelValue)
      this.clear();
    else this.value = this.modelValue;
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