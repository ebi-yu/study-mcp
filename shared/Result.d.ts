/**
 * 処理結果を表す汎用型（Result Pattern）
 */
export type Result<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
};
/**
 * Result型を生成・操作するためのヘルパー
 */
export declare const ResultHelper: {
    ok<T>(data: T): Result<T>;
    fail<T>(error: string): Result<T>;
    fromError<T>(error: unknown, fallbackMessage: string): Result<T>;
    isOk<T>(result: Result<T>): result is {
        success: true;
        data: T;
    };
    isFail<T>(result: Result<T>): result is {
        success: false;
        error: string;
    };
    map<T, U>(result: Result<T>, fn: (data: T) => U): Result<U>;
    getOrDefault<T>(result: Result<T>, defaultValue: T): T;
};
//# sourceMappingURL=Result.d.ts.map