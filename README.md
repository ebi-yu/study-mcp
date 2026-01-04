# study-mcp

MCPサーバの学習/勉強用リポジトリ

## MCPの概念

MCPはクライアントサーバアーキテクチャで構成されます。

`MCPホスト`（Claude CodeやGitHub Copilotなど）は、**MCPサーバとの接続を確立すると、各MCPサーバごとにMCPクライアントを作成します**。

`MCPクライアント`は、各MCPサーバとの通信を担当し、MCPサーバとの専用の接続を維持します。

`MCPサーバ`は通常、ローカルでは独立したプロセスとして実行され、標準入出力（stdio）を介して`MCPホスト`と通信します。リモートでは、HTTPやWebSocketなどのストリーミング可能なプロトコルを介して、複数の`MCPクライアント`と通信します。

## MCPのレイヤー

MCPは「トランスポートレイヤー」「データレイヤー」の2つのレイヤーで構成されます。

| レイヤー | 説明 |
| --- | --- |
| **トランスポートレイヤー** | トランスポート固有の接続の確立、メッセージのフレーミング、承認など、クライアントとサーバー間のデータ交換を可能にする通信メカニズムとチャネルを定義します。 |
| **データレイヤー** | ライフサイクル管理を含むクライアントとサーバー間の通信用の JSON-RPC ベースのプロトコルと、ツール、リソース、プロンプト、通知などのコア プリミティブを定義します。 |

**補足 : JSON-RPCについて**

JSON-RPCは、リモートプロシージャコール(ネットワーク上の他のコンピュータ上で関数を呼び出すこと)をJSON形式で行うための軽量なプロトコルです。
>
### トランスポートレイヤー

トランスポートレイヤーは、クライアントとサーバー間の通信チャネルと認証を管理します。接続の確立、メッセージのフレーミング、そしてMCP参加者間の安全な通信を処理します。

前述の通り、stdioやHTTP、WebSocketなどが利用されます。
応答が不要な場合は後述のイベント駆動での通知を使用できます。

### データレイヤー

データレイヤーでは主に`プリミティブ`を定義し、開発者がMCPサーバーからMCPクライアントにコンテキストを共有する方法を定義します。

データレイヤーでのやり取りはJSON-RPC形式で行われます。

## プリミティブ

プリミティブでは、クライアントとサーバが互いに提供できるものを定義します。
これにより、AIアプリケーションはMCPサーバーで実行可能なアクションとコンテキストを理解できます。

MCPサーバでのプリミティブは以下の通りです。

| プリミティブ | 説明 | 例 | 制御主体 |
| --- | --- | --- | --- |
| **ツール** | LLMが能動的に呼び出すことができる関数。データベースへの書き込み、外部APIの呼び出し、ファイルの変更など、アクションを実行できます。 | フライト検索、メッセージ送信、カレンダーイベント作成 | **Model**（モデルが使用判断） |
| **リソース** | 読み取り専用のデータソース。ファイル内容、データベーススキーマ、APIドキュメントなど、コンテキストとして情報を提供します。 | ドキュメント取得、ナレッジベースへのアクセス、カレンダー読み取り | **Application**（アプリが取得判断） |
| **プロンプト** | 特定のツールやリソースを使用するための事前構築された指示テンプレート。ユーザーが明示的に呼び出す必要があります。 | 旅行計画、ミーティング要約、メール下書き | **User**（ユーザーが選択） |

MCPクライアントでも同様にプリミティブを提供できます。

- **サンプリング** : サーバーがクライアントのAIアプリケーションに言語モデルの補完を要求できるようにします
- **取得** : サーバーがクライアントのAIアプリケーションにユーザーの追加コンテキストを要求できるようにします
- **ログ記録** : サーバーがクライアントのAIアプリケーションにログメッセージを送信できるようにします

### ツール

MCPクライアントが呼び出せるMCPサーバ上のツールを定義します。

**操作のためのエンドポイント**

| エンドポイント | 説明 | リスポンス |
| --- | --- | --- |
| `tools/list` | MCPサーバ上で利用可能なツールの一覧を取得します | ツール名、説明、入力スキーマなど |
| `tools/call` | MCPサーバ上の特定のツールを実行します | ツールの実行結果 |

### リソース

MCPクライアントがアクセスできるMCPサーバ上のデータソースを定義します。
各リソースには一意の URI (例: file:///path/to/document.md) があり、適切なコンテンツ処理のために MIME タイプを宣言します。

リソースには「リソースを示す固有のURI」と「リソーステンプレート(柔軟なリソース定義のため)」の2種類があります。

**操作のためのエンドポイント**

| エンドポイント | 説明 | リスポンス |
| --- | --- | --- |
| `resources/list` | MCPサーバ上で利用可能なリソースの一覧を取得します | リソースURI、MIMEタイプ、説明など |
| `resources/templates/list` | MCPサーバ上で利用可能なリソーステンプレートの一覧を取得します | テンプレート定義の配列 |
| `resources/read` | 指定されたリソースのコンテンツを取得します | メタデータ付きリソースのコンテンツ |
| `resources/subscribe` | 指定されたリソースの更新を監視します | 購読確認 |

**リソーステンプレートの例**

```json
{
  "uriTemplate": "weather://forecast/{city}/{date}", // cityやdateにはユーザーの入力が入る
  "name": "weather-forecast",
  "title": "Weather Forecast",
  "description": "Get weather forecast for any city and date",
  "mimeType": "application/json"
}
```

### プロンプト

プロンプトは、期待される入力とインタラクションパターンを定義する構造化されたテンプレートです。ユーザーが明示的に呼び出す必要があり、自動的にトリガーされることはありません。プロンプトはコンテキストを意識でき、利用可能なリソースやツールを参照して包括的なワークフローを作成できます。また、リソースと同様に、パラメータ補完をサポートしています。

**操作のためのエンドポイント**

| エンドポイント | 説明 | リスポンス |
| --- | --- | --- |
| `prompts/list` | MCPサーバ上で利用可能なプロンプトの一覧を取得します | プロンプト名、説明、テンプレートなど |
| `prompts/get` | 指定されたプロンプトのテンプレートを取得します | プロンプトテンプレート |

例えば、プロンプトには「使用するリソーステンプレートの指定」「そのリソーステンプレートに渡す引数の指定」などが含まれます。

```json
{
  "name": "plan-vacation",
  "title": "Plan a vacation",
  "description": "Guide through vacation planning process",
  "arguments": [
    { "name": "destination", "type": "string", "required": true },
    { "name": "duration", "type": "number", "description": "days" },
    { "name": "budget", "type": "number", "required": false },
    { "name": "interests", "type": "array", "items": { "type": "string" } }
  ]
}
```

## 通知

MCPはサーバーとクライアント間の動的な更新を可能にする通知メカニズムを提供します。

例えば、サーバで利用可能なツールが変更された場合、サーバはクライアントに通知を送信して、最新のツールセットを反映させることができます。

## MCPサーバとの接続確率の仕組み

データレイヤーでのプロトコルに焦点を当てて、MCPクライアントとMCPサーバ間の接続確立の仕組みを説明します。

1. 初期化
2. ツールの検出(プリミティブ)
3. ツールの実行(プリミティブ)
4. リアウルタイム更新(通知)

### 1. 初期化

MCPクライアントはライフサイクル管理のinitializeのリクエストを、MCPサーバに送信します。リクエストはJSON-RPC形式です。**「プロトコルバージョンの確認」「MCPサーバの機能の検出」「アイデンティティの交換」** などが行われます。

**リクエスト**

```json
{
  "jsonrpc": "2.0", // JSON-RPCのバージョン
  "id": 1,
  "method": "initialize", // 呼び出すライフサイクル管理メソッド
  "params": {
    "protocolVersion": "2025-06-18", // プロトコルバージョン
    "capabilities": { // 使用できる機能
      "elicitation": {}
    },
    "clientInfo": { // アイデンティティ情報
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}
```

**レスポンス**

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

### 2. ツールの検出(プリミティブ)

クライアントは`tool/list`リクエストをMCPサーバに送信し、利用可能なツールの一覧を取得します。 |

**リクエスト**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

**レスポンス**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "calculator_arithmetic",
        "title": "Calculator",
        "description": "Perform mathematical calculations including basic arithmetic, trigonometric functions, and algebraic operations",
        "inputSchema": {
          "type": "object",
          "properties": {
            "expression": {
              "type": "string",
              "description": "Mathematical expression to evaluate (e.g., '2 + 3 * 4', 'sin(30)', 'sqrt(16)')"
            }
          },
          "required": ["expression"]
        }
      },
      {
        "name": "weather_current",
        "title": "Weather Information",
        "description": "Get current weather information for any location worldwide",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name, address, or coordinates (latitude,longitude)"
            },
            "units": {
              "type": "string",
              "enum": ["metric", "imperial", "kelvin"],
              "description": "Temperature units to use in response",
              "default": "metric"
            }
          },
          "required": ["location"]
        }
      }
    ]
  }
}
```

### 3. ツールの実行(プリミティブ)

クライアントは`tool/call`を使用して、MCPサーバ上の特定のツールを実行します。リクエストには、ツール名と必要な入力パラメータが含まれます。

**リクエスト**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "weather_current",
    "arguments": {
      "location": "San Francisco",
      "units": "imperial"
    }
  }
}
```

**レスポンス**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Current weather in San Francisco: 68°F, partly cloudy with light winds from the west at 8 mph. Humidity: 65%"
      }
    ]
  }
}
```

### 4. リアウルタイム更新(通知)

 MCPサーバは、ツールの状態変更や新しいツールの追加など、クライアントにリアルタイムで通知を送信します。

 通知はイベント駆動型で送信されます。

 **更新通知**

 ```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
 ```

 クライアントはこの通知を受け取ると、再度`tool/list`リクエストを送信して、最新のツールセットを取得します。

 ```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/list"
}
 ```

## MCPでの認証

MCPではOAuth2.1を使用して、MCPクライアントとMCPサーバ間の認証を行います。

以下のようなタイミングでは認証をすることが推奨されます。

- ユーザー固有のデータにアクセスする必要がある場合
- 誰がどのアクションを実行したかを監査する場合
- サーバーがユーザーの同意が必要なAPIを呼び出す場合
- 厳格なアクセス制御が必要なエンタープライズ環境の場合
- ユーザーごとにレート制限や使用量の追跡が必要な場合

### OAuth2.1フローの概要

1. MCPクライアントが認証が必要なMCPサーバにアクセスをすると、401 Unauthorizedレスポンスが返されます。
2. MCPクライアントは、PRMドキュメントへのURIポインタを使用してメタデータを取得し、認可サーバー、サポートされるスコープ、その他のリソース情報を取得します。
3. MCPクライアントは認可サーバーのメタデータを取得し、MCPサーバーから認可のためのエンドポイントを取得します。
4. MCPクライアントの情報が認可サーバーに登録されていることを確認します。
5. MCPクライアントは認可エンドポイントにアクセスし、ユーザーに認可を要求します。
6. ユーザーが認可を付与すると、認可サーバーはMCPクライアントに認可コードを発行します。
7. MCPクライアントは認可コードを使用してヘッダーに埋め込まれたアクセストークンを取得します。
8. MCPクライアントはアクセストークンを使用して、MCPサーバーにアクセスします。
