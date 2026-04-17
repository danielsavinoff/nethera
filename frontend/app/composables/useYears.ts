import { computed } from "vue";

const DEFAULT_START_YEAR = 2015;

export const getYearsRange = (
  startYear = DEFAULT_START_YEAR,
  endYear = new Date().getFullYear() + 1,
) => {
  if (!Number.isInteger(startYear) || !Number.isInteger(endYear)) {
    return [];
  }

  if (startYear > endYear) {
    return [];
  }

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index,
  );
};

export const useYears = () => {
  const currentYear = new Date().getFullYear();

  const years = computed(() => getYearsRange().map(String));

  return {
    years,
    currentYear,
  };
};
