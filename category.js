// category.js
document.addEventListener('DOMContentLoaded', () => {
    const categoryNameDisplay = document.getElementById('category-name-display');
    const categoryThreadsList = document.getElementById('category-threads-list');
    const newThreadTitleInput = document.getElementById('new-thread-title');
    const createNewThreadButton = document.getElementById('create-new-thread-button');

    // ★現在のカテゴリをHTML側で定義されたグローバル変数から取得
    let currentCategory = '';
    if (typeof currentCategoryForPage !== 'undefined') {
        currentCategory = currentCategoryForPage;
    } else {
        // フォールバック: URLのファイル名から簡易的に取得 (より堅牢な方法を推奨)
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);
        if (filename.startsWith('category_')) {
            currentCategory = filename.replace('category_', '').replace('.html', '');
        }
        console.warn('currentCategoryForPage is not defined in HTML. Falling back to filename-based detection.');
    }


    if (!currentCategory) {
        console.error('Category could not be determined for this page.');
        if(categoryNameDisplay) categoryNameDisplay.textContent = 'カテゴリ不明';
        // 必要に応じて、スレッド作成フォームを無効化するなどの処理
        if(createNewThreadButton) createNewThreadButton.disabled = true;
        if(newThreadTitleInput) newThreadTitleInput.disabled = true;
        return; // カテゴリが特定できない場合は以降の処理を中断
    }

    // (以降の category.js のコードは前回と同じ)
    // ... (カテゴリ名表示、スレッド表示、スレッド作成処理など) ...
    // ...
    if (categoryNameDisplay && currentCategory) {
        const categoryDisplayNames = {
            zatsudan: '雑談', news: 'ニュース', work: '会社・仕事', anime: 'アニメ',
            sports: 'スポーツ', tv: 'テレビ', game: 'ゲーム'
        };
        const displayName = categoryDisplayNames[currentCategory] || currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1); // フォールバック
        categoryNameDisplay.textContent = displayName + 'スレッド一覧';
        const postFormH3 = document.querySelector('.post-form h3');
        if (postFormH3) {
            postFormH3.textContent = `新しいスレッドを「${displayName}」に作成`;
        }
    }

    let allBulletinBoards = [];
    const storedBoards = localStorage.getItem('bulletinBoardsAll');
    if (storedBoards) {
        try {
            allBulletinBoards = JSON.parse(storedBoards);
        } catch (e) {
            console.error("Error parsing bulletinBoardsAll from localStorage:", e);
            allBulletinBoards = [];
        }
    } else {
        allBulletinBoards = [
            { id: 'zatsu001', title: '今日のランチ何食べた？', category: 'zatsudan', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), comments: 15 },
            { id: 'zatsu002', title: '最近ハマってる趣味', category: 'zatsudan', createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), comments: 8  },
            { id: 'news001', title: '〇〇社、新技術を発表', category: 'news', createdAt: new Date().toISOString(), comments: 25 },
            { id: 'anime001', title: '今期アニメNo.1は？', category: 'anime', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), comments: 42 },
            { id: 'game001', title: 'あの新作ゲーム、もうクリアした？', category: 'game', createdAt: new Date().toISOString(), comments: 30 },
            { id: 'work001', title: 'テレワークの悩み共有', category: 'work', createdAt: new Date().toISOString(), comments: 12 },
            { id: 'sports001', title: '次のW杯どうなる？', category: 'sports', createdAt: new Date().toISOString(), comments: 18 },
            { id: 'tv001', title: 'あのドラマの最終回が衝撃的だった', category: 'tv', createdAt: new Date().toISOString(), comments: 22 },
        ];
        saveAllBulletinBoards();
    }

    renderCategoryThreads();

    if (createNewThreadButton && newThreadTitleInput) {
        createNewThreadButton.addEventListener('click', () => {
            const title = newThreadTitleInput.value.trim();
            if (title === '') {
                alert('スレッド名を入力してください。');
                return;
            }
            const newThread = {
                id: 'thread-' + currentCategory + '-' + Date.now(),
                title: title,
                category: currentCategory,
                createdAt: new Date().toISOString(),
                comments: 0
            };
            allBulletinBoards.push(newThread);
            saveAllBulletinBoards();
            renderCategoryThreads();
            newThreadTitleInput.value = '';
            const categoryDisplayName = (document.getElementById('category-name-display')?.textContent.replace('スレッド一覧', '').trim()) || currentCategory;
            alert('新しいスレッド「' + escapeHtml(title) + '」を「' + categoryDisplayName + '」カテゴリに作成しました。');
        });
    }

    function renderCategoryThreads() {
        if (!categoryThreadsList) return;
        categoryThreadsList.innerHTML = '';
        const threadsInThisCategory = allBulletinBoards.filter(board => board.category === currentCategory)
                                             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (threadsInThisCategory.length === 0) {
            categoryThreadsList.innerHTML = '<li>このカテゴリにはまだスレッドがありません。最初のスレッドを作成しましょう！</li>';
            return;
        }
        threadsInThisCategory.forEach(thread => {
            const listItem = document.createElement('li');
            const postDate = new Date(thread.createdAt);
            const formattedTimestamp = `${postDate.getFullYear()}/${String(postDate.getMonth() + 1).padStart(2, '0')}/${String(postDate.getDate()).padStart(2, '0')}`;
            listItem.innerHTML = `
                <a href="thread_detail.html?id=${thread.id}">${escapeHtml(thread.title)}</a>
                <div class="thread-meta">作成日: ${formattedTimestamp} (コメント: ${thread.comments || 0})</div>
            `;
            categoryThreadsList.appendChild(listItem);
        });
    }

    function saveAllBulletinBoards() {
        localStorage.setItem('bulletinBoardsAll', JSON.stringify(allBulletinBoards));
    }

    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return '';
        return unsafe
             .replace(/&/g, "&")
             .replace(/</g, "<")
             .replace(/>/g, ">")
             .replace(/"/g, '"')
             .replace(/'/g, "'");
     }
});