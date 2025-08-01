<template>
  <div style="position: relative;">
    <canvas ref="canvas" class="full-width" style="height:200px;border-radius:8px;background-color:#fff;"></canvas>
    <div style="position:absolute;bottom:8px;right:8px;display:flex;gap:8px;">
      <q-btn dense flat icon="fas fa-eraser" label="Limpar" color="negative" @click="handleClear" />
      <q-btn dense flat icon="fas fa-check-circle" label="Salvar" color="positive" @click="handleSave" />
    </div>
  </div>
</template>

<script>
// Libs:
import SignaturePad from 'signature_pad';

export default {
  name: 'ui-gadgets-signaturepad',

  props: {
    penColor: { type: String, default: 'rgb(0,0,0)' },
    bgColor: { type: String, default: 'rgb(255,255,255)' }
  },

  data() {
    return {
      signaturePad: null,
      dataURL: null,
    };
  },

  methods: {
    initialize() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);

      this.signaturePad = new SignaturePad(canvas, {
        backgroundColor: this.bgColor,
        penColor: this.penColor
      });
    },

    handleClear() {
      this.resize();

      if (this.signaturePad) {
        this.signaturePad.clear();
        this.dataURL = null;
        this.$emit('cleared');
      }
    },

    handleSave() {
      if (this.signaturePad && !this.signaturePad.isEmpty()) {
        this.dataURL = this.signaturePad.toDataURL('image/png');
        this.$emit('saved', this.dataURL);
      } else {
        this.$emit('error', 'empty'); // Emitir erro caso vazio
      }
    },

    resize() {
      this.initialize();
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initialize();
    });
    window.addEventListener('resize', this.resize);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.resize);
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
