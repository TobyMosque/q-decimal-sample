import { useQuasar } from 'quasar';
import { ref, computed } from 'vue';

let $q: ReturnType<typeof useQuasar> | undefined;
const locale = ref('');
const digits = ref(2);

type IntlOptions = Omit<
  Intl.NumberFormatOptions,
  'maximumFractionDigits' | 'minimumFractionDigits'
>;
const options = ref({} as IntlOptions);
const intl = computed(() => {
  return new Intl.NumberFormat(
    locale.value || $q?.lang.isoName || navigator.language,
    {
      ...options.value,
      maximumFractionDigits: digits.value,
      minimumFractionDigits: digits.value,
    }
  );
});

export function useIntl() {
  if (!$q) {
    $q = useQuasar();
  }
  return {
    locale,
    digits,
    options,
    intl,
  };
}
