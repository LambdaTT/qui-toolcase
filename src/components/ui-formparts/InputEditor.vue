<template>
  <div>
    <label v-if="Label" for="editor" class="q-my-md">
      <i class="fas fa-caret-right"></i> {{ Label }}
    </label>
    <form autocorrect="off" autocapitalize="on" autocomplete="off" spellcheck="off">
      <q-editor dense toolbar-bg="grey-2"
        :disable="disable" :readonly="readonly" :placeholder="placeholder" v-model="value"
        :class="`full-width ${this.Error ? 'error' : ''}`" @focus="() => $emit('focus')"
        :toolbar="[
          ['undo', 'redo', 'print'],
          [
            {
              label: $q.lang.editor.fontSize,
              icon: $q.iconSet.editor.fontSize,
              fixedLabel: true,
              fixedIcon: true,
              list: 'no-icons',
              options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
            },
            {
              label: $q.lang.editor.defaultFont,
              icon: $q.iconSet.editor.font,
              fixedIcon: true,
              list: 'no-icons',
              options: [
                'default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 
                'impact', 'lucida_grande', 'times_new_roman', 'verdana'
              ]
            },
          ],
          ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
          ['link', 'hr'],
          [
            {
              icon: $q.iconSet.editor.align,
              fixedLabel: true,
              list: 'only-icons',
              options: ['left', 'center', 'right', 'justify'],
            },
            'unordered', 'ordered', 'outdent', 'indent', 'quote', 'removeFormat'
          ],
          ['fullscreen'],
        ]"
        :fonts="{
          arial: 'Arial',
          arial_black: 'Arial Black',
          comic_sans: 'Comic Sans MS',
          courier_new: 'Courier New',
          impact: 'Impact',
          lucida_grande: 'Lucida Grande',
          times_new_roman: 'Times New Roman',
          verdana: 'Verdana'
        }">
      </q-editor>
    </form>
  </div>
</template>

<script>
export default{
  name: 'ui-formparts-inputeditor',

  props:{
    modelValue: String,
    disable: Boolean,
    readonly: Boolean,
    placeholder: String,
    Label: String,
    Error: Boolean,
  },

  data(){
    return {
      value: "",
    }
  },

  watch:{
    // Input
    modelValue(v){
      if(v === null) {
        this.value = '';
      } else {
        this.value = v;
      }
    },

    // Output
    value(v){
      if(v == '<br>') {
        v = '';
      }
      this.$emit('update:model-value', (v == '') ? null : v);
    }
  },
}
</script>

<style scoped>
  .error{
    border: 2px solid red;
  }
</style>

<style scoped>
  h1 {
    font-size: 1.5rem;
    line-height: 15px;
  }
</style>