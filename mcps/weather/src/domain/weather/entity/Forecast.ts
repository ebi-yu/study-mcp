/**
 * 天気予報の1期間を表すエンティティ
 */
export class ForecastPeriod {
  constructor(
    public readonly name: string,
    public readonly temperature: number,
    public readonly temperatureUnit: string,
    public readonly windSpeed: string,
    public readonly windDirection: string,
    public readonly shortForecast: string
  ) {}

  /**
   * 予報期間をフォーマットされた文字列に変換
   */
  format(): string {
    return [
      `${this.name}:`,
      `Temperature: ${this.temperature}°${this.temperatureUnit}`,
      `Wind: ${this.windSpeed} ${this.windDirection}`,
      `${this.shortForecast}`,
      "---",
    ].join("\n");
  }

  /**
   * 気温が華氏から摂氏に変換した値を取得
   */
  getTemperatureInCelsius(): number {
    if (this.temperatureUnit === "C") {
      return this.temperature;
    }
    return Math.round(((this.temperature - 32) * 5) / 9);
  }
}

/**
 * 天気予報エンティティ
 * 複数の予報期間をまとめて管理
 */
export class Forecast {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly periods: ForecastPeriod[]
  ) {}

  /**
   * 予報全体をフォーマットされた文字列に変換
   */
  format(): string {
    if (this.periods.length === 0) {
      return "No forecast periods available";
    }

    const formattedPeriods = this.periods.map((period) => period.format());
    return `Forecast for ${this.latitude}, ${
      this.longitude
    }:\n\n${formattedPeriods.join("\n")}`;
  }

  /**
   * 予報期間が存在するかどうか
   */
  hasPeriods(): boolean {
    return this.periods.length > 0;
  }
}
