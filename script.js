document.addEventListener('DOMContentLoaded', () => {
    // 各要素を取得する前に、存在確認を行うように変更
    const essayTimelineList = document.getElementById('essay-timeline');
    const popularEssaysList = document.getElementById('popular-essays-list');
    const recentEssayImagesTab = document.getElementById('recent-essay-images-tab');

    const loginFormAside = document.getElementById('login-form-aside');
    const emailLoginInput = document.getElementById('email-login');
    const passwordLoginInput = document.getElementById('password-login');

    let essays = [];
    let popularEssays = [];
    let recentEssayImages = [];
    let activeThreads = [];

    const storedEssays = localStorage.getItem('essays');
    if (storedEssays) {
        try {
            essays = JSON.parse(storedEssays);
        } catch (e) {
            console.error("Error parsing essays from localStorage:", e);
            essays = [];
        }
    }

    popularEssays = [{ id: 1, content: '人気の随筆 1' }, { id: 2, content: '注目の随筆' }];
    recentEssayImages = ['https://via.placeholder.com/80/800080', 'https://via.placeholder.com/80/008000'];
    activeThreads = [{ id: 3, title: '活況スレッドBBS' }];

    renderEssayTimeline();
    renderPopularEssays();
    renderRecentEssayImages();
    renderActiveThreads();

    if (loginFormAside && emailLoginInput && passwordLoginInput) {
        loginFormAside.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = emailLoginInput.value;
            const password = passwordLoginInput.value;
            console.log('ログイン試行:', email, password);
        });
    }

    function renderEssayTimeline() {
        if (essayTimelineList) {
            essayTimelineList.innerHTML = '';
            if (Array.isArray(essays)) {
                essays.sort((a, b) => {
                    const dateA = a && a.timestamp ? new Date(a.timestamp) : new Date(0);
                    const dateB = b && b.timestamp ? new Date(b.timestamp) : new Date(0);
                    return dateB - dateA;
                }).forEach(essay => {
                    if (essay && typeof essay.content !== 'undefined') {
                        const listItem = document.createElement('li');
                        const timestampText = essay.timestamp ? `<span class="post-meta">${new Date(essay.timestamp).toLocaleString()}</span>` : '';
                        listItem.innerHTML = `<p>${escapeHtml(String(essay.content))}</p> ${timestampText}`;
                        essayTimelineList.appendChild(listItem);
                    }
                });
            }
        }
    }

    function renderPopularEssays() {
        if (popularEssaysList) {
            popularEssaysList.innerHTML = '';
            if (Array.isArray(popularEssays)) {
                popularEssays.forEach(essay => {
                    if (essay && typeof essay.content !== 'undefined') {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<p>${escapeHtml(String(essay.content))}</p>`;
                        popularEssaysList.appendChild(listItem);
                    }
                });
            }
        }
    }

    function renderRecentEssayImages() {
        if (recentEssayImagesTab) {
            recentEssayImagesTab.innerHTML = '';
            if (Array.isArray(recentEssayImages)) {
                recentEssayImages.forEach(imageUrl => {
                    if (typeof imageUrl === 'string') {
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.alt = "Recent Essay Image";
                        recentEssayImagesTab.appendChild(img);
                    }
                });
            }
        }
    }

    function renderActiveThreads() {
        const activeThreadsListElement = document.getElementById('active-threads-list');
        if (activeThreadsListElement) {
            activeThreadsListElement.innerHTML = '';
            if (Array.isArray(activeThreads)) {
                activeThreads.forEach(thread => {
                    if (thread && typeof thread.id !== 'undefined' && typeof thread.title !== 'undefined') {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<a href="thread.html?id=${thread.id}">${escapeHtml(String(thread.title))}</a>`;
                        activeThreadsListElement.appendChild(listItem);
                    }
                });
            }
        }
    }

    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') {
            return '';
        }
        let temp = unsafe;
        temp = temp.replace(/&/g, "&");
        temp = temp.replace(/</g, "<");
        temp = temp.replace(/>/g, ">");
        temp = temp.replace(/"/g, """);
        temp = temp.replace(/'/g, "'");
        return temp;
     }

    // DOMContentLoadedの最後で再度呼び出している箇所は、通常は不要なのでコメントアウト推奨
    // renderEssayTimeline();
    // renderPopularEssays();
    // renderRecentEssayImages();
    // renderActiveThreads();
});