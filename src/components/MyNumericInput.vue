<template>
  <q-input
    ref="input"
    :type="type"
    :filled="filled"
    :model-value="value"
    @update:model-value="onUpdate"
    v-bind="attrs"
    @keydown="onKeyDown"
  >
    <template v-for="(_, slot) in _slots" :key="slot" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" :key="slot" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  useAttrs,
  useSlots,
  PropType,
  nextTick,
} from 'vue';
import { useIntl } from 'src/composables/intl';
import { QInput } from 'quasar';

type InputType = QInput['type'];
const attrs = useAttrs();
const slots = useSlots();
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  type: {
    type: String as PropType<InputType>,
    default: 'text',
  },
  filled: {
    type: Boolean,
    default: true,
  },
});

const _slots = computed(() => slots);
const { intl, digits } = useIntl();

const input = ref<QInput>();
const el = computed(
  () => input.value?.$el.querySelector('input') as HTMLInputElement
);

function getCursorData() {
  return {
    val: value.value,
    start: el.value.selectionStart || 0,
    end: el.value.selectionEnd || 0,
  };
}

async function onKeyDown(evt: KeyboardEvent) {
  var before = getCursorData();
  let keyVal = 0;
  switch (evt.key) {
    case 'Delete':
      break;
    case 'Backspace':
      break;
    default:
      keyVal = parseInt(evt.key);
  }
  if (
    (keyVal || keyVal === 0) &&
    (!Number.isNaN(keyVal) || Number.isFinite(keyVal))
  ) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const after = getCursorData();

    let _before = 0;
    let _pos = 0;
    if (['Delete', 'Backspace'].includes(evt.key)) {
      if (evt.key === 'Backspace' || before.end !== before.start) {
        _before = before.val.length - before.end;
        _pos = after.val.length - _before;
        el.value.setSelectionRange(_pos, _pos);
      } else {
        _before = before.val.length - before.start;
        _pos = after.val.length - _before + 1;
        el.value.setSelectionRange(_pos, _pos);
      }
    } else {
      const _diff = before.end - before.start;
      _before = before.val.length - before.start;
      _pos = after.val.length - _before + _diff;
      el.value.setSelectionRange(_pos, _pos);
    }
  }
}

const value = ref('');
async function updateValue() {
  await nextTick();
  value.value = intl.value.format(props.modelValue);
}
const meta = computed(() => ({ value: props.modelValue, intl: intl.value }));
watch(() => meta.value, updateValue, { immediate: true });

function onUpdate(val: string | number | null) {
  let interger = 0;
  if (typeof val === 'string') {
    const numbers = val.replace(/\D/gi, '') || '0';
    interger = parseInt(numbers);
    if (digits.value >= 1) interger = interger / Math.pow(10, digits.value);
  }
  if (typeof val === 'number') {
    interger = val;
  }

  if (interger !== props.modelValue) {
    emit('update:modelValue', interger);
  } else {
    updateValue();
  }
}
</script>
