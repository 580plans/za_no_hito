# za_no_hito
ザの人
1. プロジェクトの概要 (Project Overview)
   <pre>
    プロジェクト名    : ザの人
    目的・概要　　　  : ブラウザ環境での使用を前提とした、ミニブログ（簡易ブログ）の作成
    ターゲットユーザー : ブラウザ環境でネットアクセスするユーザーを対象に、昨今のSNSとは違った小さなコミュニティを作る
    現状と今後の展望  : ミニブログは現在制作中の段階。公開に向けて各種機能を追加していく
     <pre/>
      
2. 環境構築 (Setup and Installation)
   <pre>
     このプロジェクトは、Web標準技術（HTML, CSS, JavaScript）を用いて開発されており、特別なソフトウェアのインストールは不要です。
     動作環境: 最新のモダンブラウザでの動作を推奨します。
              Google Chrome (最新版)
              Mozilla Firefox (最新版)
              Microsoft Edge (最新版)
              Safari (最新版)
     
     開発環境 (開発者向け)
    テキストエディタ :VS Code
                    Webブラウザのデベロッパーツール
   <pre/>

### インストール手順 (Installation Steps)

このプロジェクトは、特別なインストール手順を必要としません。
以下のいずれかの方法で、プロジェクトを開始できます。

1.  **リポジトリをクローンする (推奨)**:
    ```bash
    git clone [https://github.com/580plans/za_no_hito.git](https://www.google.com/search?q=https://github.com/%E3%81%82%E3%81%AA%E3%81%9F%E3%81%AE%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E5%90%8D/%E3%81%82%E3%81%AA%E3%81%9F%E3%81%AE%E3%83%AA%E3%83%9D%E3%82%B8%E3%83%88%E3%83%AA%E5%90%8D.git)
    cd za_no_hito
    ```
    クローン後、お好きなWebブラウザで `index.html` ファイルを開いてください。

2.  **ZIPファイルをダウンロードする**:
    GitHubのプロジェクトページから「Code」ボタンをクリックし、「Download ZIP」を選択してファイルをダウンロードしてください。
    解凍後、解凍されたフォルダ内の `index.html` ファイルをWebブラウザで開いてください。

 ### 環境変数設定 (Environment Variables)

このプロジェクトでは、一部の外部サービスを利用するためにAPIキーなどの設定が必要です。
以下のファイルを直接編集して、設定を行ってください。

* `src/js/config.js` (または `assets/js/settings.js` など、設定ファイルの名前)

    ```javascript
    // src/js/config.js の例
    const API_KEY = "YOUR_API_KEY_HERE"; // ここに取得したAPIキーを設定してください
    const API_BASE_URL = "[https://api.example.com/v1](https://www.google.com/search?q=https://api.example.com/v1)";
    ```
    **注意**: APIキーは公開リポジトリに直接コミットしないことを強く推奨します。
    可能であれば、サーバーサイドでプロキシを立てるなど、より安全な方法を検討してください。

　3. 使い方 (Usage)
 基本的な使い方: 誰でもアカウントを作成することで、簡易ブログや掲示板の作成、閲覧、投稿ができ、ゆるくコミュニケーションが取れる場です
 
### ディレクトリ構造 (Directory Structure)

このプロジェクトは、シンプルで直感的なファイル構成を採用しています。
主要なファイルとディレクトリの役割は以下の通りです。

  <pre>
.
├── css/                   # スタイルシート（CSS）ファイル群
│   └── style.css          # メインのスタイルシート
├── js/                    # JavaScriptファイル群
│   └── script.js          # メインのJavaScriptファイル
├── images/                # プロジェクト内で使用する画像ファイル
│   └── (画像ファイル...)
├── index.html             # プロジェクトのエントリーポイントとなるHTMLファイル
└── README.md              # この説明ドキュメント
  </pre>

* `index.html`: プロジェクトのメインとなるHTMLファイルです。ブラウザでこのファイルを開くことでアプリケーションが起動します。
* `css/`: プロジェクト全体のスタイルを定義するCSSファイル群を格納します。現在は `style.css` がメインです。
* `js/`: プロジェクトの動的な挙動を記述するJavaScriptファイル群を格納します。現在は `script.js` がメインです。
* `images/`: アプリケーション内で使用する画像アセットを格納します。

---

## 技術スタック

このプロジェクトは以下の技術を用いて開発されています。

### フロントエンド
* **HTML, CSS, JavaScript**: ウェブ標準技術
* **Vue.js**: UI構築のためのプログレッシブJavaScriptフレームワーク
* **Nuxt.js**: Vue.jsベースのサーバーサイドレンダリングおよび静的サイト生成フレームワーク
* **TypeScript**: 型安全なJavaScript開発
* **SCSS/Sass**: CSSプリプロセッサ

### デプロイ/ホスティング
* **Netlify**: フロントエンドアプリケーションのデプロイとホスティング

### 開発ツール
* **Vue CLI**: Vue.jsプロジェクトのセットアップと開発支援
* **ESLint**: コード品質の維持とリンティング
* **Prettier**: コードフォーマットの自動化
* **Node.js**: JavaScriptランタイム環境
* **npm / Yarn**: パッケージ管理

