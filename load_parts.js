// load_parts.js

async function loadHTMLPart(filePath, targetElementId, activeCategory = null, callback = null) {
    try {
        console.log(`loadHTMLPart: Fetching ${filePath} for target ${targetElementId}`);
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load HTML part: ${filePath}, Status: ${response.status}`);
        }
        const htmlText = await response.text();
        const targetElement = document.getElementById(targetElementId);

        if (targetElement) {
            targetElement.innerHTML = htmlText;
            console.log(`loadHTMLPart: Successfully loaded ${filePath} into ${targetElementId}`);

            if (activeCategory) {
                // querySelectorAll は NodeList を返すので、forEach が使える
                const links = targetElement.querySelectorAll('a[data-category]');
                links.forEach(link => {
                    if (link.dataset.category === activeCategory) {
                        link.classList.add('active-category');
                    } else {
                        link.classList.remove('active-category');
                    }
                });
                // 掲示板トップ「和気あいあい」用
                const boardTopLink = targetElement.querySelector('.board-top-link a');
                if (boardTopLink && activeCategory === 'wakiaiai') {
                    boardTopLink.classList.add('active-category');
                }
            }

            if (typeof callback === 'function') {
                console.log(`loadHTMLPart: Executing callback for ${targetElementId}`);
                callback();
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

// ★★★ loadPageParts関数を script.js からここに移動 ★★★
async function loadPageParts(path) {
    const essayPages = ['logged_in.html', 'essay_detail.html', 'create_essay.html', 'past_essays.html', 'profile.html', 'notifications.html'];
    const boardPages = ['bulletinboard.html', 'thread_detail.html', 'category_zatsudan.html', 'category_news.html', 'category_work.html', 'category_anime.html', 'category_sports.html', 'category_tv.html', 'category_game.html'];
    
    if (essayPages.includes(path)) {
        const container = document.getElementById('left-column-container');
        if (typeof loadHTMLPart === 'function' && container) {
            await loadHTMLPart('_left_column_logged_in.html', 'left-column-container');
        }
    } else if (boardPages.includes(path)) {
        const container = document.getElementById('left-column-container');
        if (typeof loadHTMLPart === 'function' && container) {
            let categoryKey = 'wakiaiai'; // デフォルトは掲示板トップ
            if(path.startsWith('category_')) {
                categoryKey = path.replace('category_', '').replace('.html', '');
            } else if (path === 'thread_detail.html') {
                const threadId = getQueryParam('id'); // この関数はグローバルなので呼び出せる
                // ★ App.allThreads を直接参照せず、localStorageから一時的に読む
                const allThreads = JSON.parse(localStorage.getItem('allThreads') || '[]');
                const thread = allThreads.find(t => t.id === threadId); 
                if (thread) {
                    categoryKey = thread.category;
                } else {
                    categoryKey = null;
                }
            }
            await loadHTMLPart('_left_column_bulletinboard.html', 'left-column-container', categoryKey);
        }
    }
}