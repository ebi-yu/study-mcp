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
export const McpResponse = {
  text(message: string): McpToolResponse {
    return {
      content: [{ type: "text" as const, text: message }],
    };
  },

  error(errorMessage: string): McpToolResponse {
    return this.text(errorMessage);
  },

  fromResult<T>(
    result: Result<T>,
    formatter: (data: T) => string
  ): McpToolResponse {
    return result.success
      ? this.text(formatter(result.data))
      : this.error(result.error);
  },

  fromStringResult(result: Result<string>): McpToolResponse {
    return result.success ? this.text(result.data) : this.error(result.error);
  },
};
