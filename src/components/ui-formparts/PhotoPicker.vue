<template>
  <div id="wrapper" :class="`q-pa-sm ${setAlign}`">
    <div v-if="cover">
      <q-card class="q-pa-sm">
        <q-img class="bg-grey-3" :src="input.src ? input.src : DefaultImgPath" :ratio="16 / 9" fit="contain" :height="coverHeight"
          :width="coverWidth" />
        <FileUpload @activateFn="(fn) => activateFileInput = fn" class="hidden" v-model="input" :ReadAsURL="true"
          @update:model-value="updModelValue">
        </FileUpload>
        <q-btn class="bg-white" id="btn-edit" color="primary" flat round :disable="disable" icon="fas fa-edit"
          @click="activateFileInput()" :size="setIconSize">
          <q-tooltip v-if="!disable">Alterar imagem</q-tooltip>
        </q-btn>
      </q-card>
    </div>
    <q-avatar v-else :square="square" :size="setSize">
      <q-img :src="input.src ? input.src : DefaultImgPath" />
      <FileUpload @activateFn="(fn) => activateFileInput = fn" class="hidden" v-model="input" :ReadAsURL="true"
        @update:model-value="updModelValue" :accept="accept ? accept : 'image/*'">
      </FileUpload>
      <q-btn class="bg-white" id="btn-edit" color="primary" flat round :disable="disable" icon="fas fa-edit"
        @click="activateFileInput()" :size="setIconSize">
        <q-tooltip v-if="!disable">Alterar imagem</q-tooltip>
      </q-btn>
    </q-avatar>
  </div>
  <!-- <div id="wrapper" class="text-center q-pa-sm">
    <div :class="`photo-container ${square ? 'square' : ''}`">
      <q-img :src="input.src ? input.src : DefaultImgPath" />
    </div>
    <FileUpload @activateFn="(fn) => activateFileInput = fn" class="hidden" v-model="input" :ReadAsURL="true"
      @update:model-value="updModelValue">
    </FileUpload>
    <q-btn class="bg-white" id="btn-edit" color="primary" flat round :disable="disable" icon="fas fa-edit"
      @click="activateFileInput()" size="md">
      <q-tooltip v-if="!disable">Alterar imagem</q-tooltip>
    </q-btn>
  </div> -->
</template>

<script>
export default {
  name: 'ui-formparts-photopicker',

  props: {
    DefaultImgPath: String,
    modelValue: Object,
    disable: Boolean,
    square: Boolean,
    size: String,
    cover: Boolean,
    coverHeight: String,
    coverWidth: String,
    align: String,
    accept: {
      type: String,
      validator: val => val === 'image/*' || val === 'image/png' || val === 'image/jpeg' || val === 'image/jpg'
    }
  },

  data() {
    return {
      activateFileInput: null,
      input: {
        file: null,
        name: null,
        src: null,
        size: null,
      }
    }
  },

  watch: {
    modelValue: {
      handler(v) {
        for (let k in this.input) {
          this.input[k] = v[k];
        }
      },
      deep: true
    }
  },

  computed: {
    setSize() {
      if (!!this.size) { return this.size + 'px'; }
      return '150px';
    },

    setIconSize() {
      if (!!this.size) {
        if (this.size <= 70) return this.size / 7 + 'px';
        if (this.size <= 100) return 'sm';
        if (this.size <= 300) return 'md';
        return 'lg';
      }
      return 'md';
    },

    setAlign() {
      if (!!this.align) {
        switch (this.align) {
          case 'left':
            return 'text-left';
          case 'right':
            return 'text-right';
          default:
            return 'text-center';
        }
      }
      return 'text-center';
    }
  },

  methods: {
    updModelValue(v) {
      this.$emit('update:model-value', v);
    },
  }

}
</script>

<style scoped>
#wrapper {
  position: relative;
  width: 100%;
}

.photo-container {
  width: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.photo-container>img {
  width: 100%;
}

#btn-edit {
  position: absolute;
  right: 0px;
  bottom: 0px;
}

.square {
  border-radius: 0%;
}
</style>