/**
 * 州コード値オブジェクト
 * 2文字の米国州コードのバリデーションと不変性を保証
 */
export class StateCode {
  private constructor(public readonly value: string) {}

  /**
   * 州コードを生成（バリデーション付き）
   * @throws Error 無効な州コードの場合
   */
  static create(code: string): StateCode {
    const upperCode = code.toUpperCase().trim();

    if (upperCode.length !== 2) {
      throw new Error(
        `Invalid state code: ${code}. Must be exactly 2 characters.`
      );
    }

    if (!/^[A-Z]{2}$/.test(upperCode)) {
      throw new Error(
        `Invalid state code: ${code}. Must contain only letters.`
      );
    }

    return new StateCode(upperCode);
  }

  /**
   * 等価性の比較
   */
  equals(other: StateCode): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
