document.addEventListener('DOMContentLoaded', () => {
    const essayTimelineList = document.getElementById('essay-timeline');
    const popularEssaysList = document.getElementById('popular-essays-list');
    const recentEssayImagesTab = document.getElementById('recent-essay-images-tab');
    const activeThreadsList = document.getElementById('active-threads-list');

    const loginFormAside = document.getElementById('login-form-aside');
    const emailLoginInput = document.getElementById('email-login');
    const passwordLoginInput = document.getElementById('password-login');

    let essays = [];
    let popularEssays = [];
    let recentEssayImages = [];
    let activeThreads = [];

    // ローカルストレージから随筆を読み込む
    const storedEssays = localStorage.getItem('essays');
    if (storedEssays) {
        essays = JSON.parse(storedEssays);
        renderEssayTimeline();
    }

    // 仮の随筆データ
    popularEssays = [{ id: 1, content: '人気の随筆 1' }, { id: 2, content: '注目の随筆' }];
    recentEssayImages = ['https://via.placeholder.com/80/800080', 'https://via.placeholder.com/80/008000'];

    // 仮の掲示板データ
    activeThreads = [{ id: 3, title: '活況スレッドBBS' }];

    renderEssayTimeline();
    renderPopularEssays();
    renderRecentEssayImages();
    renderActiveThreads();

    loginFormAside.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = emailLoginInput.value;
        const password = passwordLoginInput.value;
        console.log('ログイン試行:', email, password);
        // 実際のログイン処理は別途実装
    });

    function renderEssayTimeline() {
        essayTimelineList.innerHTML = '';
        essays.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(essay => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<p>${escapeHtml(essay.content)}</p> <span class="post-meta">${essay.timestamp}</span>`;
            essayTimelineList.appendChild(listItem);
        });
    }

    function renderPopularEssays() {
        popularEssaysList.innerHTML = '';
        popularEssays.forEach(essay => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<p>${escapeHtml(essay.content)}</p>`;
            popularEssaysList.appendChild(listItem);
        });
    }

    function renderRecentEssayImages() {
        recentEssayImagesTab.innerHTML = '';
        recentEssayImages.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            recentEssayImagesTab.appendChild(img);
        });
    }

    function renderActiveThreads() {
        const activeThreadsListElement = document.getElementById('active-threads-list');
        if (activeThreadsListElement) {
            activeThreadsListElement.innerHTML = '';
            activeThreads.forEach(thread => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="thread.html?id=${thread.id}">${escapeHtml(thread.title)}</a>`;
                activeThreadsListElement.appendChild(listItem);
            });
        }
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
     }

    renderEssayTimeline();
    renderPopularEssays();
    renderRecentEssayImages();
    renderActiveThreads();
});