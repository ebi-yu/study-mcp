# 概要

アメリカの国立気象局（NWS: National Weather Service）のAPIを利用して、天気予報や警報情報を取得するMCPサーバーです。

## エンドポイント一覧

| ツール名        | 説明                           | 入力パラメータ                          | 出力形式          |
|-----------------|--------------------------------|---------------------------------------|-------------------|
| get_alerts     | 指定した州の天気警報を取得する   | state_code: 州コード（例: "CA"）       | テキスト          |
| get_forecast   | 指定した座標の天気予報を取得する | latitude: 緯度, longitude: 経度        | テキスト          |

## 使用方法

使用するAIエージェントの設定で、MCPサーバーのエンドポイントを指定してください。例えば、Claude Desktopの場合、`claude_desktop_config.json`に以下のように設定します。

```json
{
  "mcpServers": {
    "weather": {
      "command": "bun",
      "args": ["run", "/path/to/study-mcp/packages/weather/src/index.ts"]
    }
  }
}
```
