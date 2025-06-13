// bulletinboard.js (掲示板トップ「和気あいあい」ページ用)
document.addEventListener('DOMContentLoaded', () => {
    const featuredThreadsList = document.getElementById('featured-threads-list');
    const hotThreadsList = document.getElementById('hot-threads-list');

    const allThreadsSampleData = [
        { id: 'thread001', title: '今週末の天気とおすすめスポット', category: 'zatsudan', accessCount: 2580, commentCount: 35, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
        { id: 'thread002', title: 'あの新作映画、見た人いる？【ネタバレ注意】', category: 'tv', accessCount: 1890, commentCount: 152, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'thread003', title: 'プログラミング学習で最初にぶつかる壁', category: 'work', accessCount: 1550, commentCount: 88, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
        { id: 'thread004', title: '健康のための食生活改善レポート', category: 'zatsudan', accessCount: 1230, commentCount: 45, createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString() },
        { id: 'thread005', title: '最新AI技術の活用事例と倫理問題', category: 'news', accessCount: 2200, commentCount: 62, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
        { id: 'thread006', title: 'お気に入りのインディーズゲーム教えて！', category: 'game', accessCount: 980, commentCount: 180, createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString() },
        { id: 'thread007', title: '今期の覇権アニメはこれだ！徹底討論', category: 'anime', accessCount: 1750, commentCount: 210, createdAt: new Date(Date.now() - 86400000 * 2.5).toISOString() },
        { id: 'thread008', title: '応援してるスポーツチームの現状と未来', category: 'sports', accessCount: 1100, commentCount: 75, createdAt: new Date(Date.now() - 86400000 * 0.8).toISOString() },
        { id: 'thread009', title: '買ってよかったガジェット2024年上半期', category: 'zatsudan', accessCount: 1950, commentCount: 92, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 'thread010', title: '最近のテレビ番組、面白いの減った？', category: 'tv', accessCount: 850, commentCount: 130, createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
    ];

    const categoryDisplayNames = {
        zatsudan: '雑談', news: 'ニュース', work: '会社・仕事', anime: 'アニメ',
        sports: 'スポーツ', tv: 'テレビ', game: 'ゲーム', unknown: 'その他'
    };

    function getCrownHtml(rank) {
        if (rank === 1) {
            return '<span class="crown gold">👑</span>';
        }
        return '';
    }

    function renderFeaturedThreads() {
        if (!featuredThreadsList) return;
        featuredThreadsList.innerHTML = '';

        const sortedByAccess = [...allThreadsSampleData]
            .sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0))
            .slice(0, 5);

        if (sortedByAccess.length === 0) {
            featuredThreadsList.innerHTML = '<li>現在、注目されてるスレはありません。</li>';
            return;
        }

        sortedByAccess.forEach((thread, index) => {
            const listItem = document.createElement('li');
            const rank = index + 1;
            const crownHtml = getCrownHtml(rank);
            const categoryName = categoryDisplayNames[thread.category] || categoryDisplayNames.unknown;

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

        const sortedByComments = [...allThreadsSampleData]
            .sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))
            .slice(0, 5);

        if (sortedByComments.length === 0) {
            hotThreadsList.innerHTML = '<li>現在、盛り上がってるスレはありません。</li>';
            return;
        }

        sortedByComments.forEach((thread, index) => {
            const listItem = document.createElement('li');
            const rank = index + 1;
            const crownHtml = getCrownHtml(rank);
            const categoryName = categoryDisplayNames[thread.category] || categoryDisplayNames.unknown;

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

    renderFeaturedThreads();
    renderHotThreads();

    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return '';
        return unsafe
             .replace(/&/g, "&")
             .replace(/</g, "<")
             .replace(/>/g, ">")
             .replace(/"/g, '"') // ★ここを修正
             .replace(/'/g, "'"); // ★ここを修正 (または ''')
     }
});