<template>
  <div>
    <q-input :disable="disable" :readonly="readonly" hide-bottom-space square filled :clearable="clearable" v-model="fileData.name"
      @click="inputClicked()" type="text" :label="!!Label ? Label : 'Selecione o arquivo'" @clear="clearFile"
      :color="!!Color ? Color : 'primary'" @focus="$emit('focus')" :error="Error">
      <template v-slot:prepend>
        <q-icon name="cloud_upload" />
      </template>
      <template v-slot:append>
        <q-icon v-if="!!Icon" :name="Icon" />
      </template>
    </q-input>
    <div v-show="this.fileData.size != null" class="text-caption text-right">{{ (this.fileData.size / 1024).toFixed(2) }}
      kb
    </div>
    <input :disabled="readonly" :ref="inputRefId" :accept="accept" type="file" v-on:change="fileChange"
      style="display:none;">
  </div>
</template>
<script>

export default {
  name: 'ui-formparts-fileupload',

  props: {
    clearable: Boolean,
    disable: Boolean,
    readonly: Boolean,
    accept: String,
    modelValue: Object,
    Icon: String,
    Label: String,
    Color: String,
    Error: Boolean,
    ReadAsURL: Boolean,
  },

  data() {
    return {
      fileData: {
        file: null,
        name: null,
        src: null,
        size: null
      },
      dialogIsOpen: false,
      repetitionLock: false,
      inputRefId: null,
    }
  },

  watch: {
    modelValue: {
      handler(v) {
        this.fileData = v;
      },
      deep: true
    },

    fileData: {
      handler(v) {
        this.$emit('update:model-value', v)
      },
      deep: true
    }
  },

  methods: {
    sleep(miliseconds) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(miliseconds), miliseconds);
      })
    },

    async inputClicked() {
      if (!this.repetitionLock) {
        this.repetitionLock = true;
        this.$eventbroadcaster.$broadcast('fileupload-before-choose');
        await this.sleep(100);
        this.dialogIsOpen = true;
        window.addEventListener('focus', this.onWindowFocus);
        this.$refs[this.inputRefId].click();
        document.activeElement.blur();
      }
    },

    clearFile() {
      var input = this.$refs[this.inputRefId];
      input.value = null;
      this.clearFileData();
    },

    clearFileData() {
      this.fileData = {
        file: null,
        name: null,
        src: null,
        size: null
      }
    },

    readFile(file) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function (evt) {
          resolve({
            "src": evt.target.result,
            "file": file
          })
        };

        if (this.ReadAsURL) reader.readAsDataURL(file);
        else reader.readAsText(file);
      })
    },

    async fileChange(evt) {
      this.dialogIsOpen = false;
      var input = evt.target;

      if (input.files.length > 0) {
        let filedata = await this.readFile(input.files[0]);
        this.fileData = {
          file: filedata.file,
          name: filedata.file.name,
          src: filedata.src,
          size: filedata.file.size,
        };
      } else {
        this.clearFileData();
      }

      this.repetitionLock = false;
      this.$eventbroadcaster.$broadcast('fileupload-chosen')
    },

    onWindowFocus() {
      window.removeEventListener('focus', this.onWindowFocus);

      setTimeout(() => {
        if (this.dialogIsOpen)
          this.fileChange({ target: { files: [] } })
      }, 100)
    }
  },

  mounted() {
    this.$emit('activateFn', this.inputClicked);
    this.inputRefId = `InputFileRef-${this.$utils.uniqid()}`;
    this.$emit('expose-ref', this.$refs[this.inputRefId]);
  }
}
</script>
