// load_parts.js (修正後)
async function loadHTMLPart(filePath, targetElementId, activeCategory = null, callback = null) { // ★第4引数 callback を追加
    try {
        console.log(`loadHTMLPart: Fetching ${filePath} for target ${targetElementId}`); // ★追加: 読み込み開始ログ
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load HTML part: ${filePath}, Status: ${response.status}`);
        }
        const htmlText = await response.text();
        const targetElement = document.getElementById(targetElementId);

        if (targetElement) {
            targetElement.innerHTML = htmlText;
            console.log(`loadHTMLPart: Successfully loaded ${filePath} into ${targetElementId}`); // ★追加: 読み込み成功ログ

            if (activeCategory) {
                const links = targetElement.querySelectorAll('#bulletinboard-categories ul li a'); // このセレクタは掲示板左カラム用
                // _left_column_logged_in.html には #bulletinboard-categories がないので、この部分は実行されないか、エラーになる可能性がある
                // もし左カラムでもアクティブ表示が必要なら、別途処理が必要
                links.forEach(link => {
                    if (link.dataset.category === activeCategory) {
                        link.classList.add('active-category');
                    } else {
                        link.classList.remove('active-category');
                    }
                });
            }

            // ★★★ コールバック関数を実行 ★★★
            if (typeof callback === 'function') {
                console.log(`loadHTMLPart: Executing callback for ${targetElementId}`); // ★追加: コールバック実行ログ
                callback(); // 引数なしでコールバックを実行
            }
            // ★★★ ここまで ★★★

        } else {
            console.error(`Target element with ID "${targetElementId}" not found.`);
        }
    } catch (error) {
        console.error('Error loading HTML part:', error);
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
            targetElement.innerHTML = '<p>コンテンツの読み込みに失敗しました。</p>';
        }
    }
}

// グローバルスコープに関数を公開する部分は、現状のままであれば不要かもしれません。
// HTMLファイルで <script src="load_parts.js"></script> と読み込んでいる場合、
// このファイル内で定義された loadHTMLPart 関数はグローバルにアクセス可能になるためです。
// もしESモジュールなどを使用している場合は window.loadHTMLPart のような明示的な公開が必要になります。
// 今回のケースでは、おそらく不要なのでコメントアウトしておきます。
// window.loadHTMLPart = loadHTMLPart;