import { computed, toValue, type MaybeRefOrGetter } from "vue";

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

const getIsoWeekNumber = (date: Date) => {
  const normalizedDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const day = normalizedDate.getUTCDay() || 7;

  normalizedDate.setUTCDate(normalizedDate.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(normalizedDate.getUTCFullYear(), 0, 1));

  return Math.ceil(
    ((normalizedDate.getTime() - yearStart.getTime()) / MILLISECONDS_IN_DAY +
      1) /
      7,
  );
};

export const getIsoWeeksInYear = (year: number) => {
  if (!Number.isInteger(year)) {
    return [];
  }

  const lastIsoWeek = getIsoWeekNumber(new Date(Date.UTC(year, 11, 28)));

  return Array.from({ length: lastIsoWeek }, (_, index) => index + 1);
};

export const useIsoWeeks = (year: MaybeRefOrGetter<number | string>) => {
  const weeks = computed(() => {
    const parsedYear = Number.parseInt(String(toValue(year)), 10);

    return getIsoWeeksInYear(parsedYear);
  });

  return {
    weeks,
  };
};
