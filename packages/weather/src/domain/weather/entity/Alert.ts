/**
 * 気象アラートエンティティ
 * ドメイン層のビジネスロジックを持つ
 */
export class Alert {
  constructor(
    public readonly event: string,
    public readonly areaDesc: string,
    public readonly severity: string,
    public readonly status: string,
    public readonly headline: string
  ) {}

  /**
   * アラートをフォーマットされた文字列に変換
   */
  format(): string {
    return [
      `Event: ${this.event}`,
      `Area: ${this.areaDesc}`,
      `Severity: ${this.severity}`,
      `Status: ${this.status}`,
      `Headline: ${this.headline}`,
      "---",
    ].join("\n");
  }

  /**
   * アラートが危険レベルかどうかを判定
   */
  isSevere(): boolean {
    return (
      this.severity === "Severe" ||
      this.severity === "Extreme" ||
      this.severity === "Warning"
    );
  }
}
