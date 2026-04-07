export class Duration {
  private constructor(private readonly ms: number) {}

  static between(from: Date, to: Date): Duration {
    return new Duration(to.getTime() - from.getTime());
  }

  static days(days: number): Duration {
    return new Duration(days * 24 * 60 * 60 * 1000);
  }

  static hours(hours: number): Duration {
    return new Duration(hours * 60 * 60 * 1000);
  }

  static seconds(seconds: number): Duration {
    return new Duration(seconds * 1000);
  }

  inHours(): number {
    return this.ms / (1000 * 60 * 60);
  }

  inSeconds(): number {
    return this.ms / 1000;
  }

  addTo(date: Date): Date {
    return new Date(date.getTime() + this.ms);
  }
}
