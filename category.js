// category.js
document.addEventListener('DOMContentLoaded', () => {
    const categoryNameDisplay = document.getElementById('category-name-display');
    const categoryThreadsList = document.getElementById('category-threads-list');
    const newThreadTitleInput = document.getElementById('new-thread-title');
    const createNewThreadButton = document.getElementById('create-new-thread-button');

    // 現在のカテゴリを特定する (例: HTMLのタイトルやURLから)
    // ここでは仮に、ページのタイトルからカテゴリ名を取得する単純な例
    let currentCategory = '';
    const pageTitle = document.title; // "雑談 - 掲示板 - 座の人"
    if (pageTitle.includes('雑談')) currentCategory = 'zatsudan';
    else if (pageTitle.includes('ニュース')) currentCategory = 'news';
    else if (pageTitle.includes('会社・仕事')) currentCategory = 'work';
    else if (pageTitle.includes('アニメ')) currentCategory = 'anime';
    else if (pageTitle.includes('スポーツ')) currentCategory = 'sports';
    else if (pageTitle.includes('テレビ')) currentCategory = 'tv';
    else if (pageTitle.includes('ゲーム')) currentCategory = 'game';
    // より堅牢な方法としては、URLのファイル名やクエリパラメータ、data属性などを使用

    if (categoryNameDisplay && currentCategory) {
        // 例: "雑談" -> "雑談スレッド一覧"
        const categoryDisplayNames = {
            zatsudan: '雑談', news: 'ニュース', work: '会社・仕事', anime: 'アニメ',
            sports: 'スポーツ', tv: 'テレビ', game: 'ゲーム'
        };
        categoryNameDisplay.textContent = (categoryDisplayNames[currentCategory] || 'カテゴリ') + 'スレッド一覧';
        // スレッド作成フォームの見出しも更新
        const postFormH3 = document.querySelector('.post-form h3');
        if (postFormH3) {
            postFormH3.textContent = `新しいスレッドを「${categoryDisplayNames[currentCategory] || 'このカテゴリ'}」に作成`;
        }
    }

    let allBulletinBoards = []; // 全てのカテゴリのスレッドを保持

    // ローカルストレージから全てのスレッドを読み込む
    const storedBoards = localStorage.getItem('bulletinBoardsAll'); // 新しいキー名
    if (storedBoards) {
        try {
            allBulletinBoards = JSON.parse(storedBoards);
        } catch (e) {
            console.error("Error parsing bulletinBoardsAll from localStorage:", e);
            allBulletinBoards = [];
        }
    } else {
        // サンプルデータ (カテゴリ情報を含む)
        allBulletinBoards = [
            { id: 'zatsu001', title: '今日のランチ何食べた？', category: 'zatsudan', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), comments: 15 },
            { id: 'zatsu002', title: '最近ハマってる趣味', category: 'zatsudan', createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), comments: 8  },
            { id: 'news001', title: '〇〇社、新技術を発表', category: 'news', createdAt: new Date().toISOString(), comments: 25 },
            { id: 'anime001', title: '今期アニメNo.1は？', category: 'anime', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), comments: 42 },
            { id: 'game001', title: 'あの新作ゲーム、もうクリアした？', category: 'game', createdAt: new Date().toISOString(), comments: 30 },
        ];
        saveAllBulletinBoards(); // 初期データを保存
    }

    renderCategoryThreads();

    if (createNewThreadButton && newThreadTitleInput) {
        createNewThreadButton.addEventListener('click', () => {
            const title = newThreadTitleInput.value.trim();
            if (title === '') {
                alert('スレッド名を入力してください。');
                return;
            }
            if (!currentCategory) {
                alert('カテゴリが特定できませんでした。');
                return;
            }

            const newThread = {
                id: 'thread-' + currentCategory + '-' + Date.now(),
                title: title,
                category: currentCategory,
                createdAt: new Date().toISOString(),
                comments: 0 // 初期コメント数
            };
            allBulletinBoards.push(newThread);
            saveAllBulletinBoards();
            renderCategoryThreads(); // スレッド一覧を再描画
            newThreadTitleInput.value = '';
            alert('新しいスレッド「' + escapeHtml(title) + '」を「' + currentCategory + '」カテゴリに作成しました。');
        });
    }

    function renderCategoryThreads() {
        if (!categoryThreadsList || !currentCategory) return;
        categoryThreadsList.innerHTML = '';

        const threadsInThisCategory = allBulletinBoards.filter(board => board.category === currentCategory)
                                             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 作成日時の降順

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
            // thread_detail.html はスレッド詳細表示ページ (別途作成)
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
             .replace(/"/g, """)
             .replace(/'/g, "'");
     }
});