// load_parts.js
async function loadHTMLPart(filePath, targetElementId, activeCategory = null) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load HTML part: ${filePath}, Status: ${response.status}`);
        }
        const htmlText = await response.text();
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
            targetElement.innerHTML = htmlText;

            // もしアクティブなカテゴリが指定されていれば、対応するリンクに .active-category クラスを付与
            if (activeCategory) {
                const links = targetElement.querySelectorAll('#bulletinboard-categories ul li a');
                links.forEach(link => {
                    if (link.dataset.category === activeCategory) {
                        link.classList.add('active-category');
                    } else {
                        link.classList.remove('active-category'); // 他は念のため削除
                    }
                });
            }
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

// グローバルスコープに関数を公開 (もしESモジュールを使わない場合)
// window.loadHTMLPart = loadHTMLPart;