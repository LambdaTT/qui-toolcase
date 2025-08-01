<template>
  <div :class="ignorePadding ? '' : (dense ? 'q-pa-xs' : 'q-pa-sm')">
    <!-- Input text: -->
    <q-input v-if="type == 'text' || type == null" type="text" square filled hide-bottom-space :ref="inputRefId"
      :label="Label" :clearable="clearable" :dense="dense" :disable="disable" :readonly="readonly"
      :maxlength="maxlength" :mask="Mask" :reverse-fill-mask="ReverseFillMask" :fill-mask="FillMask"
      :class="`full-width bg-${BgColor ? BgColor : 'white'}`" v-model="value" :error="Error" :error-message="ErrorMsg"
      @focus="() => $emit('focus')" @update:model-value="updModelValue" @click="inputClicked">
      <template v-slot:append>
        <slot name="buttons"></slot>
        <q-icon v-if="!!Icon" :name="Icon" color="grey-8" />
      </template>
    </q-input>

    <!-- Input password: -->
    <q-input v-if="type == 'password'" type="password" square filled hide-bottom-space :ref="inputRefId" :label="Label"
      :clearable="clearable" :dense="dense" :disable="disable" :readonly="readonly" :maxlength="maxlength"
      :class="`full-width bg-${BgColor ? BgColor : 'white'}`" v-model="value" :error="Error"
      @focus="() => $emit('focus')" @update:model-value="updModelValue" @click="inputClicked" :error-message="ErrorMsg">
      <template v-slot:append>
        <slot name="buttons"></slot>
        <q-icon v-if="!!Icon" :name="Icon" color="grey-8" />
      </template>
    </q-input>

    <!-- Input textarea: -->
    <q-input v-if="type == 'textarea'" type="textarea" square filled hide-bottom-space :ref="inputRefId" :label="Label"
      :clearable="clearable" :dense="dense" :disable="disable" :readonly="readonly" :maxlength="maxlength"
      :class="`full-width bg-${BgColor ? BgColor : 'white'}`" v-model="value" :error="Error"
      @focus="() => $emit('focus')" @update:model-value="updModelValue" @click="inputClicked" :error-message="ErrorMsg">
      <template v-slot:append>
        <slot name="buttons"></slot>
        <q-icon v-if="!!Icon" :name="Icon" color="grey-8" />
      </template>
    </q-input>

    <!-- Input email: -->
    <q-input v-if="type == 'email'" type="email" square filled hide-bottom-space maxlength="255" :ref="inputRefId"
      :label="Label" :clearable="clearable" :dense="dense" :disable="disable" :readonly="readonly"
      :class="`full-width bg-${BgColor ? BgColor : 'white'}`" v-model="value" :error="Error"
      @focus="() => $emit('focus')" @update:model-value="updModelValue" @click="inputClicked" :error-message="ErrorMsg">
      <template v-slot:append>
        <slot name="buttons"></slot>
        <q-icon v-if="!!Icon" :name="Icon" color="grey-8" />
      </template>
    </q-input>

    <!-- Input number: -->
    <q-input v-if="type == 'number'" :ref="inputRefId" square filled hide-bottom-space :step="step" :max="max"
      :min="min" :label="Label" :clearable="clearable" :dense="dense" :disable="disable" :readonly="readonly"
      :class="`full-width bg-${BgColor ? BgColor : 'white'}`" v-model="value" :error="Error"
      @focus="() => $emit('focus')" type="number" @update:model-value="updModelValue" @click="inputClicked"
      :error-message="ErrorMsg">
      <template v-slot:append>
        <slot name="buttons"></slot>
        <q-icon v-if="!!Icon" :name="Icon" color="grey-8" />
      </template>
    </q-input>

    <!-- Input select: -->
    <Select2 v-if="type == 'select'" :BgColor="BgColor" :clearable="clearable" :dense="dense" :disable="disable"
      :readonly="readonly" v-model="value" :Options="Options" :Label="Label" :Icon="Icon" :Error="Error"
      @focus="() => $emit('focus')" @update:model-value="updModelValue">
    </Select2>

    <!-- Input date: -->
    <InputDate v-if="type == 'date'" :dense="dense" :clearable="clearable" :disable="disable" :readonly="readonly" v-model="value"
      :Default="Default" :Label="Label" :Error="Error" @focus="() => $emit('focus')"
      @update:model-value="updModelValue">
    </InputDate>

    <!-- Input datetime: -->
    <InputDate v-if="type == 'datetime'" withTime :withSeconds="withSeconds" :dense="dense" :clearable="clearable"
      :disable="disable" :readonly="readonly" v-model="value" :Default="Default" :Label="Label" :Error="Error"
      @focus="() => $emit('focus')" @update:model-value="updModelValue">
    </InputDate>

    <!-- Input date picker: -->
    <DatePicker v-if="type == 'datepicker'" :BgColor="BgColor" :dense="dense" :disable="disable" :readonly="readonly"
      :todayBtn="todayBtn" :dateOptions="dateOptions" :minDatePage="minDatePage" :maxDatePage="maxDatePage"
      v-model="value" :Default="Default" :Label="Label" :Error="Error" @focus="() => $emit('focus')"
      @update:model-value="updModelValue">
    </DatePicker>

    <!-- Input daterange picker: -->
    <DatePicker v-if="type == 'daterangepicker'" :BgColor="BgColor" :dense="dense" :disable="disable"
      :readonly="readonly" :todayBtn="todayBtn" :dateOptions="dateOptions" :minDatePage="minDatePage"
      :maxDatePage="maxDatePage" v-model="value" range :Default="Default" :Label="Label" :Error="Error"
      @focus="() => $emit('focus')" @update:model-value="updModelValue">
    </DatePicker>

    <!-- Input datetime picker: -->
    <DatePicker v-if="type == 'datetimepicker'" :withSeconds="withSeconds" :BgColor="BgColor" :dense="dense"
      :disable="disable" :todayBtn="todayBtn" :dateOptions="dateOptions" :minDatePage="minDatePage"
      :maxDatePage="maxDatePage" :readonly="readonly" v-model="value" withTime :Default="Default" :Label="Label"
      :Error="Error" @focus="() => $emit('focus')" @update:model-value="updModelValue">
    </DatePicker>

    <!-- Input datetimerange picker: -->
    <DatePicker v-if="type == 'datetimerange'" :withSeconds="withSeconds" :BgColor="BgColor" :dense="dense"
      :todayBtn="todayBtn" :dateOptions="dateOptions" :minDatePage="minDatePage" :maxDatePage="maxDatePage"
      :disable="disable" :readonly="readonly" v-model="value" range withTime :Default="Default" :Label="Label"
      :Error="Error" @focus="() => $emit('focus')" @update:model-value="updModelValue">
    </DatePicker>

    <!-- Input time: -->
    <TimePicker v-if="type == 'time'" :withSeconds="withSeconds" :BgColor="BgColor" :dense="dense" :disable="disable"
      :readonly="readonly" v-model="value" :Default="Default" :Label="Label" :Error="Error" square
      @update:model-value="updModelValue" @focus="() => $emit('focus')">
    </TimePicker>

    <!-- Input color: -->
    <InputColor v-if="type == 'color'" :BgColor="BgColor" :clearable="clearable" :dense="dense" :disable="disable"
      :readonly="readonly" v-model="value" :Default="Default" :Label="Label" :Error="Error"
      @focus="() => $emit('focus')" @update:model-value="updModelValue">
    </InputColor>

    <!-- Input file: -->
    <FileUpload v-if="type == 'file'" :accept="accept" :clearable="clearable" :disable="disable" :readonly=readonly
      v-model="value" :ReadAsURL="ReadAsURL" :Label="Label" :Icon="Icon" :Error="Error" @focus="() => $emit('focus')"
      @update:model-value="updModelValue" @fileupload-before-choose="broadcast('fileupload-before-choose')"
      @fileupload-chosen="broadcast('fileupload-chosen')">
    </FileUpload>

    <!-- Input Editor -->
    <InputEditor v-if="type == 'editor'" :disable="disable" :readonly=readonly v-model="value" :Label="Label"
      :Error="Error" :placeholder="placeholder" @focus="() => $emit('focus')" @update:model-value="updModelValue">
    </InputEditor>
  </div>

</template>

<script>
export default {
  name: 'ui-formparts-inputfield',

  props: {
    // General
    modelValue: [String, Object, Number],
    BgColor: String,
    Label: String,
    Icon: String,
    Error: { type: Boolean, default: false },
    ErrorMsg: String,
    type: String,
    clearable: Boolean,
    dense: Boolean,
    disable: Boolean,
    maxlength: String,
    readonly: Boolean,
    // Date
    dateOptions: { type: [Array, Function] },
    todayBtn: Boolean,
    minDatePage: String,
    maxDatePage: String,
    // Time
    withSeconds: Boolean,
    // Select
    Options: Array,
    // Number
    step: String,
    max: String,
    min: String,
    // Mask
    Mask: String,
    ReverseFillMask: Boolean,
    FillMask: {
      type: [String, Boolean],
      default: false,
    },
    SelectOnClick: {
      type: Boolean,
      default: false,
    },
    // Others
    Default: [String, Object, Number],
    accept: String,
    ReadAsURL: Boolean,
    placeholder: String,
    ignorePadding: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      value: null,
      inputRefId: null
    }
  },

  watch: {
    modelValue(v) {
      this.value = v;
    }
  },

  methods: {
    inputClicked() {
      if (this.SelectOnClick) {
        const nativeInput = this.$refs[this.inputRefId].$el.querySelector('input');
        if (!!nativeInput) nativeInput.select();
      }
    },

    updModelValue(v) {
      this.$emit('update:model-value', v);
    },

    broadcast(eventName, data) {
      this.$emit(eventName, data);
    }
  },

  created() {
    this.inputRefId = `InputFieldRef-${this.$utils.uniqid()}`
    this.value = this.modelValue;
  },

  mounted() {
    this.$emit('expose-ref', this.$refs[this.inputRefId]);
  }
}
</script>