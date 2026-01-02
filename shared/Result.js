/**
 * Result型を生成・操作するためのヘルパー
 */
export const ResultHelper = {
    ok(data) {
        return { success: true, data };
    },
    fail(error) {
        return { success: false, error };
    },
    fromError(error, fallbackMessage) {
        const message = error instanceof Error ? error.message : fallbackMessage;
        return { success: false, error: message };
    },
    isOk(result) {
        return result.success;
    },
    isFail(result) {
        return !result.success;
    },
    map(result, fn) {
        if (result.success) {
            return { success: true, data: fn(result.data) };
        }
        return result;
    },
    getOrDefault(result, defaultValue) {
        return result.success ? result.data : defaultValue;
    },
};
//# sourceMappingURL=Result.js.map