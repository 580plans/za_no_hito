document.addEventListener('DOMContentLoaded', () => {
    const bulletinBoardList = document.getElementById('bulletin-board-list');
    const createBulletinBoardButton = document.getElementById('create-bulletin-board');
    const bulletinBoardTitleInput = document.getElementById('bulletin-board-title');
    const popularThreadsList = document.getElementById('popular-threads-list');
    const recentImagesBoard = document.getElementById('recent-images-board');
    const activeThreadsList = document.getElementById('active-threads-list');

    let bulletinBoards = [];
    let popularThreads = []; // 仮のデータ
    let recentBoardImages = []; // 仮のデータ
    let activeBoardThreads = []; // 仮のデータ

    // ローカルストレージから掲示板を読み込む
    const storedBoards = localStorage.getItem('bulletinBoards');
    if (storedBoards) {
        bulletinBoards = JSON.parse(storedBoards);
        renderBulletinBoards();
    }

    // 仮のデータ
    popularThreads = [{ id: 1, title: '人気スレッドBBS 1' }, { id: 2, title: '注目スレッドBBS' }];
    recentBoardImages = ['https://via.placeholder.com/50/0000FF', 'https://via.placeholder.com/50/FF0000'];
    activeBoardThreads = [{ id: 3, title: '活況スレッドBBS' }];

    renderPopularThreads();
    renderRecentBoardImages();
    renderActiveThreads();

    createBulletinBoardButton.addEventListener('click', () => {
        const title = bulletinBoardTitleInput.value.trim();
        if (title !== '') {
            const newBoard = {
                id: Date.now(),
                title: title
            };
            bulletinBoards.push(newBoard);
            saveBulletinBoards();
            renderBulletinBoards();
            bulletinBoardTitleInput.value = '';
        }
    });

    function renderBulletinBoards() {
        bulletinBoardList.innerHTML = '';
        bulletinBoards.forEach(board => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="thread.html?id=${board.id}">${escapeHtml(board.title)}</a>`;
            bulletinBoardList.appendChild(listItem);
        });
    }

    function renderPopularThreads() {
        popularThreadsList.innerHTML = '';
        popularThreads.forEach(thread => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="thread.html?id=${thread.id}">${escapeHtml(thread.title)}</a>`;
            popularThreadsList.appendChild(listItem);
        });
    }

    function renderRecentBoardImages() {
        recentImagesBoard.innerHTML = '';
        recentBoardImages.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            recentImagesBoard.appendChild(img);
        });
    }

    function renderActiveThreads() {
        activeThreadsList.innerHTML = '';
        activeBoardThreads.forEach(thread => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="thread.html?id=${thread.id}">${escapeHtml(thread.title)}</a>`;
            activeThreadsList.appendChild(listItem);
        });
    }

    function saveBulletinBoards() {
        localStorage.setItem('bulletinBoards', JSON.stringify(bulletinBoards));
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
     }
});