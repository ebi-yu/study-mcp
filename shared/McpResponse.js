/**
 * MCPレスポンス生成ヘルパー
 */
export const McpResponse = {
    text(message) {
        return {
            content: [{ type: "text", text: message }],
        };
    },
    error(errorMessage) {
        return this.text(errorMessage);
    },
    fromResult(result, formatter) {
        return result.success
            ? this.text(formatter(result.data))
            : this.error(result.error);
    },
    fromStringResult(result) {
        return result.success ? this.text(result.data) : this.error(result.error);
    },
};
//# sourceMappingURL=McpResponse.js.map