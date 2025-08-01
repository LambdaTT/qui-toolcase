<template>
  <q-btn-dropdown class="full-width q-mx-xs" :icon="Icon" :color="Color" :label="Label"
    :disable="Disable || AvailableActions.length < 1">
    <q-list class="text-primary">
      <q-item v-close-popup v-for="action in AvailableActions" :key="action.label" clickable @click="action.fn">
        <q-item-section avatar>
          <q-icon size="sm" :name="action.icon" />
        </q-item-section>
        <q-item-section>{{ action.label }}</q-item-section>
        <q-tooltip v-if="!!action.tooltip">{{ action.tooltip }}</q-tooltip>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
export default {
  name: 'ui-gadgets-btndropdown',

  props: {
    Icon: String,
    Disable: Boolean,
    Color: String,
    Label: String,
    AvailableActions: Array,
  }
}
</script>