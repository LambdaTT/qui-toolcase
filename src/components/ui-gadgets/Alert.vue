<template>
  <q-dialog backdrop-filter="blur(4px) contrast(40%)" :persistent="persistent" v-model="show">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          <q-icon v-if="!!Icon" :name="Icon"></q-icon>
          {{ Title }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ Content }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'components-common-inconsistencewarning',

  props: {
    Icon: String,
    Title: String,
    Content: String,
    persistent: Boolean,
    modelValue: Boolean,
    DefaultOpened: Boolean,
  },

  data() {
    return {
      show: false,
    }
  },

  watch: {
    modelValue(v) {
      this.show = v;
    },

    show(v) {
      this.$emit('update:model-value', v);
    }
  },

  mounted() {
    if (this.DefaultOpened !== null) this.show = this.DefaultOpened;
  }
}
</script>