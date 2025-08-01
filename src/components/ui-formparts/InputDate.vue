<template>
  <InputField ignorePadding :disable="disable" :Mask="mask" v-model="value" :Label="Label" :dense="dense"
    :Error="hasError" :ErrorMsg="errormsg" :readonly="readonly" :clearable="clearable" @focus="() => $emit('focus')"
    Icon="fas fa-calendar-alt" />
</template>

<script>
export default {
  name: 'ui-formparts-inputdate',

  props: {
    modelValue: String,
    readonly: Boolean,
    disable: Boolean,
    dense: Boolean,
    clearable: Boolean,
    withTime: Boolean,
    withSeconds: Boolean,
    BrazilianFormat: Boolean,
    Default: String,
    Label: String,
    Error: Boolean,
  },

  data() {
    return {
      value: null,
      mask: `${this.withTime ? `##/##/#### ##:##${this.withSeconds ? ':##' : ''}` : '##/##/####'}`,
      state: 'pending',
      error: false,
      errormsg: '',
    }
  },

  computed: {
    hasError() {
      return this.state === 'error' || this.error;
    }
  },

  watch: {
    modelValue(val) {
      if (val && val.length >= 10) {
        let date = val.split(' ')[0];
        let time = val.split(' ')[1] ?? null;

        // If typing mode is enabled, we set the modelValue to the current date, but reverting from 'yyyy-mm-dd' to 'dd/mm/yyyy':
        let dateParts = date.split('-');
        this.value = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        if (this.withTime) {
          this.value += ` ${time ?? '00:00:00'}`;
        }
      } else {
        // Reset the typing mode options when closed
        this.value = null;
      }
    },

    value(val) {
      this.error = false;
      this.errormsg = '';
      this.state = 'pending';
      let emitValue = null;

      if (!val) return this.clear();
      else if (val.length < 10) return;

      const [datePart, timePart] = val.split(' ');
      const [day, month, year] = datePart.split('/').map(Number);

      if (!(day > 0 && day <= 31 && month > 0 && month <= 12 && year > 0)) {
        this.error = true;
        this.errormsg = 'Data inválida';
        this.state = 'error';
        return;
      }

      if (!!timePart) {
        const timeParts = timePart.split(':');
        if (timeParts.length < 2 || timeParts.length > 3) {
          this.error = true;
          this.errormsg = 'Hora inválida';
          this.state = 'error';
          return;
        }
        const [hours, minutes, seconds] = timeParts.map(Number);
        if (!(hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60 && (seconds === undefined || (seconds >= 0 && seconds < 60)))) {
          this.error = true;
          this.errormsg = 'Hora inválida';
          this.state = 'error';
          return;
        }
      }

      this.state = 'success';

      emitValue = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      if (this.withTime) emitValue += ` ${timePart ?? '00:00:00'}`;

      this.$emit('update:modelValue', emitValue);
      this.$emit('update:state', this.state);
    }
  },

  methods: {
    clear() {
      this.value = this.Default || null;
      this.error = false;
      this.errormsg = '';
    }
  },

  mounted() {
    if (this.Default) {
      this.value = this.Default;
    }
  }
}
</script>