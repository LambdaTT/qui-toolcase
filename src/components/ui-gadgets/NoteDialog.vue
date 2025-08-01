<template>
  <div :style="`${BorderStyle ? `border: ${BorderStyle}` : ''}`"
    :class="`${BgColorClass ?? ''} ${Rounded ? 'rounded-borders' : ''} q-pa-sm`">
    <q-expansion-item :default-opened="DefaultOpened" :icon="Icon" :label="Label">
      <div class="text-caption q-pa-sm">
        <slot></slot>
      </div>
    </q-expansion-item>
  </div>
</template>

<script>
export default {
  name: 'ui-gadgets-notedialog',

  props: {
    BgColorClass: String,
    Rounded: Boolean,
    BorderStyle: String,
    Icon: String,
    Label: String,
    DefaultOpened: Boolean,
  }
}
</script>