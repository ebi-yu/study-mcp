import type { Result } from "./Result";
/**
 * MCPツールのレスポンス型
 */
export interface McpToolResponse {
    [x: string]: unknown;
    content: Array<{
        type: "text";
        text: string;
    }>;
}
/**
 * MCPレスポンス生成ヘルパー
 */
export declare const McpResponse: {
    text(message: string): McpToolResponse;
    error(errorMessage: string): McpToolResponse;
    fromResult<T>(result: Result<T>, formatter: (data: T) => string): McpToolResponse;
    fromStringResult(result: Result<string>): McpToolResponse;
};
//# sourceMappingURL=McpResponse.d.ts.map