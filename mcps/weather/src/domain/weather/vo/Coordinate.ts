/**
 * 座標値オブジェクト
 * 緯度・経度のバリデーションと不変性を保証
 */
export class Coordinate {
  private constructor(
    public readonly latitude: number,
    public readonly longitude: number
  ) {}

  /**
   * 座標を生成（バリデーション付き）
   * @throws Error 無効な座標の場合
   */
  static create(latitude: number, longitude: number): Coordinate {
    if (latitude < -90 || latitude > 90) {
      throw new Error(
        `Invalid latitude: ${latitude}. Must be between -90 and 90.`
      );
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error(
        `Invalid longitude: ${longitude}. Must be between -180 and 180.`
      );
    }
    return new Coordinate(latitude, longitude);
  }

  /**
   * 座標を小数点4桁でフォーマット
   */
  format(): string {
    return `${this.latitude.toFixed(4)},${this.longitude.toFixed(4)}`;
  }

  /**
   * 等価性の比較
   */
  equals(other: Coordinate): boolean {
    return (
      this.latitude === other.latitude && this.longitude === other.longitude
    );
  }
}
