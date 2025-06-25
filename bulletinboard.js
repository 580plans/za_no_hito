// bulletinboard.js (掲示板トップ「和気あいあい」ページ用)
document.addEventListener('DOMContentLoaded', () => {
    const featuredThreadsList = document.getElementById('featured-threads-list');
    const hotThreadsList = document.getElementById('hot-threads-list');

    // このサンプルデータは、script.jsのwindow.allThreadsSampleDataForLoggedInPageと同じものを使うことを推奨
    // ここでは仮にbulletinboard.js内に保持するが、script.js側で一元管理が望ましい
    const allThreadsSampleData = window.allThreadsSampleDataForLoggedInPage || [ // script.jsにデータがあればそれを使う
        { id: 'thread001', title: '今週末の天気とおすすめスポット', category: 'zatsudan', accessCount: 2580, commentCount: 35, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
        { id: 'thread002', title: 'あの新作映画、見た人いる？<ネタバレ注意>', category: 'tv', accessCount: 1890, commentCount: 152, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'thread003', title: 'プログラミング学習で最初にぶつかる壁 & 解決法', category: 'work', accessCount: 1550, commentCount: 88, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
        { id: 'thread004', title: '健康のための食生活改善レポート', category: 'zatsudan', accessCount: 1230, commentCount: 45, createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString() },
        { id: 'thread005', title: '最新AI技術の活用事例と倫理問題', category: 'news', accessCount: 2200, commentCount: 62, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
        { id: 'thread006', title: 'お気に入りのインディーズゲーム教えて！', category: 'game', accessCount: 980, commentCount: 180, createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString() },
        { id: 'thread007', title: '今期の覇権アニメはこれだ！徹底討論', category: 'anime', accessCount: 1750, commentCount: 210, createdAt: new Date(Date.now() - 86400000 * 2.5).toISOString() },
        { id: 'thread008', title: '応援してるスポーツチームの現状と未来', category: 'sports', accessCount: 1100, commentCount: 75, createdAt: new Date(Date.now() - 86400000 * 0.8).toISOString() },
        { id: 'thread009', title: '買ってよかったガジェット2024年上半期', category: 'zatsudan', accessCount: 1950, commentCount: 92, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 'thread010', title: '最近のテレビ番組、面白いの減った？', category: 'tv', accessCount: 850, commentCount: 130, createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
    ];

    const categoryDisplayNames = window.categoryDisplayNamesForLoggedInPage || { // script.jsにデータがあればそれを使う
        zatsudan: '雑談', news: 'ニュース', work: '会社・仕事', anime: 'アニメ',
        sports: 'スポーツ', tv: 'テレビ', game: 'ゲーム', unknown: 'その他'
    };

    // getCrownHtml と escapeHtml は script.js のグローバル関数を使用する

    function renderFeaturedThreads() {
        if (!featuredThreadsList) return;
        featuredThreadsList.innerHTML = '';
        const sortedByAccess = [...allThreadsSampleData].sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0)).slice(0, 5);
        if (sortedByAccess.length === 0) { featuredThreadsList.innerHTML = '<li>現在、注目されてるスレはありません。</li>'; return; }
        sortedByAccess.forEach((thread, index) => {
            const listItem = document.createElement('li'); const rank = index + 1; const crownHtml = getCrownHtml(rank);
            const categoryName = categoryDisplayNames[thread.category] || categoryDisplayNames.unknown;
            if (typeof escapeHtml !== 'function') { console.error("escapeHtml is not defined."); return; }
            listItem.innerHTML = `
                <div class="rank-display">${crownHtml}${rank}位</div>
                <div class="thread-info-container">
                    <div>
                        <span class="thread-category-badge">${escapeHtml(categoryName)}</span>
                        <a href="thread_detail.html?id=${thread.id}" class="thread-title-link">${escapeHtml(thread.title)}</a> 
                    </div>
                    <div class="thread-stats">アクセス数: ${thread.accessCount || 0}</div>
                </div>
            `;
            featuredThreadsList.appendChild(listItem);
        });
    }

    function renderHotThreads() {
        if (!hotThreadsList) return;
        hotThreadsList.innerHTML = '';
        const sortedByComments = [...allThreadsSampleData].sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0)).slice(0, 5);
        if (sortedByComments.length === 0) { hotThreadsList.innerHTML = '<li>現在、盛り上がってるスレはありません。</li>'; return; }
        sortedByComments.forEach((thread, index) => {
            const listItem = document.createElement('li'); const rank = index + 1; const crownHtml = getCrownHtml(rank);
            const categoryName = categoryDisplayNames[thread.category] || categoryDisplayNames.unknown;
            if (typeof escapeHtml !== 'function') { console.error("escapeHtml is not defined."); return; }
            listItem.innerHTML = `
                <div class="rank-display">${crownHtml}${rank}位</div>
                <div class="thread-info-container">
                    <div>
                        <span class="thread-category-badge">${escapeHtml(categoryName)}</span>
                        <a href="thread_detail.html?id=${thread.id}" class="thread-title-link">${escapeHtml(thread.title)}</a> 
                    </div>
                    <div class="thread-stats">コメント数: ${thread.commentCount || 0}</div>
                </div>
            `;
            hotThreadsList.appendChild(listItem);
        });
    }

    if (typeof escapeHtml === 'function' && typeof getCrownHtml === 'function') {
        renderFeaturedThreads();
        renderHotThreads();
    } else {
        console.error("Required global functions (escapeHtml or getCrownHtml) are not defined. Bulletin board rendering aborted.");
    }
});