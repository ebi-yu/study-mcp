/**
 * 処理結果を表す汎用型（Result Pattern）
 */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Result型を生成・操作するためのヘルパー
 */
export const ResultHelper = {
  ok<T>(data: T): Result<T> {
    return { success: true, data };
  },

  fail<T>(error: string): Result<T> {
    return { success: false, error };
  },

  fromError<T>(error: unknown, fallbackMessage: string): Result<T> {
    const message = error instanceof Error ? error.message : fallbackMessage;
    return { success: false, error: message };
  },

  isOk<T>(result: Result<T>): result is { success: true; data: T } {
    return result.success;
  },

  isFail<T>(result: Result<T>): result is { success: false; error: string } {
    return !result.success;
  },

  map<T, U>(result: Result<T>, fn: (data: T) => U): Result<U> {
    if (result.success) {
      return { success: true, data: fn(result.data) };
    }
    return result;
  },

  getOrDefault<T>(result: Result<T>, defaultValue: T): T {
    return result.success ? result.data : defaultValue;
  },
};
