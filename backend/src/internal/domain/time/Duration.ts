import { Interval } from './Interval.js';
import { UnsupportedIntervalException } from './UnsupportedIntervalException.js';

export class Duration {
  private constructor(
    private readonly value: {
      years?: number;
      months?: number;
      days?: number;
      hours?: number;
      seconds?: number;
    },
  ) {}

  static years(years: number): Duration {
    return new Duration({ years });
  }

  static months(months: number): Duration {
    return new Duration({ months });
  }

  static days(days: number): Duration {
    return new Duration({ days });
  }

  static hours(hours: number): Duration {
    return new Duration({ hours });
  }

  static seconds(seconds: number): Duration {
    return new Duration({ seconds });
  }

  static interval(interval: Interval, count = 1): Duration {
    switch (interval) {
      case Interval.Day:
        return Duration.days(count);
      case Interval.Week:
        return Duration.days(count * 7);
      case Interval.Month:
        return Duration.months(count);
      case Interval.Year:
        return Duration.years(count);
      default:
        throw new UnsupportedIntervalException();
    }
  }

  addTo(date: Date): Date {
    const result = new Date(date);

    if (this.value.years) {
      result.setFullYear(
        result.getFullYear() + this.value.years,
      );
    }

    if (this.value.months) {
      const originalDay = result.getDate();

      result.setDate(1);
      result.setMonth(result.getMonth() + this.value.months);

      const lastDayOfTargetMonth = new Date(
        result.getFullYear(),
        result.getMonth() + 1,
        0,
      ).getDate();

      result.setDate(
        Math.min(originalDay, lastDayOfTargetMonth),
      );
    }

    if (this.value.days) {
      result.setDate(result.getDate() + this.value.days);
    }

    if (this.value.hours) {
      result.setHours(result.getHours() + this.value.hours);
    }

    if (this.value.seconds) {
      result.setSeconds(
        result.getSeconds() + this.value.seconds,
      );
    }

    return result;
  }

  toDays(): number {
    const days =
      (this.value.years ?? 0) * 365 +
      (this.value.months ?? 0) * 30 +
      (this.value.days ?? 0) +
      (this.value.hours ?? 0) / 24 +
      (this.value.seconds ?? 0) / 86_400;

    return Math.ceil(days);
  }
}
