document.addEventListener('DOMContentLoaded', () => {
    // const createBulletinBoardButton = document.getElementById('create-bulletin-board'); // ★削除
    // const bulletinBoardTitleInput = document.getElementById('bulletin-board-title'); // ★削除
    const popularThreadsList = document.getElementById('popular-threads-list'); // 「近頃にぎやかなスレ」用

    // let bulletinBoards = []; // bulletinboard.htmlではスレッド作成機能がなくなったため、このページでは直接使わない
    let popularThreadsData = [];

    // 「近頃にぎやかなスレ」の仮データ
    popularThreadsData = [
        { id: 'pop1', title: '【雑談】今日の出来事 Part2', accessCount: 150 },
        { id: 'pop2', title: 'おすすめのランチ教えてください！', accessCount: 120 },
        { id: 'pop3', title: '最新ゲームの攻略情報交換', accessCount: 100 },
        { id: 'pop4', title: '週末どこ行く？お出かけ相談', accessCount: 90 },
        { id: 'pop5', title: '見てるアニメについて語ろう', accessCount: 85 }
    ];

    renderLivelyThreads();

    /* ★スレッド作成フォームがなくなったため、以下の処理は不要
    if (createBulletinBoardButton && bulletinBoardTitleInput) {
        createBulletinBoardButton.addEventListener('click', () => {
            // ...
        });
    }
    */

    function renderLivelyThreads() {
        if (!popularThreadsList) return;
        popularThreadsList.innerHTML = '';

        const sortedThreads = [...popularThreadsData].sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0));

        if (sortedThreads.length === 0) {
            popularThreadsList.innerHTML = '<li>現在、にぎやかなスレはありません。</li>';
            return;
        }
        sortedThreads.forEach(thread => {
            const listItem = document.createElement('li');
            // thread.html はまだないので、href="#" にしておくか、将来のパスを指定
            listItem.innerHTML = `<a href="thread_detail.html?id=${thread.id}">${escapeHtml(thread.title)}</a>`;
            popularThreadsList.appendChild(listItem);
        });
    }

    /* ★bulletinboard.html ではスレッド作成を行わないため、saveBulletinBoardsは不要
    function saveBulletinBoards() {
        // localStorage.setItem('bulletinBoards', JSON.stringify(bulletinBoards));
    }
    */

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