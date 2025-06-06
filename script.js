document.addEventListener('DOMContentLoaded', () => {
    const essayTimelineList = document.getElementById('essay-timeline');
    const essayTimelineLoggedInList = document.getElementById('essay-timeline-logged-in');
    const popularEssaysList = document.getElementById('popular-essays-list');
    const recentEssayImagesTab = document.getElementById('recent-essay-images-tab');

    const loginFormAside = document.getElementById('login-form-aside');
    const emailLoginInput = document.getElementById('email-login');
    const passwordLoginInput = document.getElementById('password-login');

    let essays = [];
    let popularEssays = [];
    let recentEssayImages = [];
    let activeThreads = [];

    function initializeSampleEssays() {
        essays = [
            {
                id: 1,
                title: 'サイト開設のご挨拶',
                content: '本日、新しいコミュニティサイト「座の人」を開設いたしました！\n皆さんと一緒に素敵な場所にしていきたいです。どうぞよろしくお願いいたします。',
                timestamp: new Date('2024-07-21T10:00:00').toISOString(),
                author: { id: 'user123', name: '運営チーム' }
            },
            {
                id: 2,
                title: 'お気に入りのカフェ紹介',
                content: '最近見つけたカフェがとても素敵なので紹介します。静かで落ち着いた雰囲気で、コーヒーも絶品です。\n読書や作業にもぴったりですよ。',
                timestamp: new Date('2024-07-20T15:30:00').toISOString(),
                author: { id: 'user456', name: 'カフェ好きA' }
            },
            {
                id: 3,
                title: '週末のハイキング記録',
                content: '週末に〇〇山へハイキングに行ってきました。天気も良く、山頂からの景色は最高でした！\n自然の中でリフレッシュできて、とても良い休日になりました。おすすめです。',
                timestamp: new Date('2024-07-19T09:15:00').toISOString(),
                author: { id: 'user789', name: 'アウトドア派B' }
            },
            {
                id: 4,
                title: '読んだ本の感想：思考の整理学',
                content: '外山滋比古さんの「思考の整理学」を読みました。グライダー能力と飛行機能力の話が特に印象的でした。\n自分の思考プロセスを見直す良いきっかけになりました。',
                timestamp: new Date('2024-07-18T20:00:00').toISOString(),
                author: { id: 'user101', name: '読書家C' }
            },
            {
                id: 5,
                title: '新しい趣味、始めました！',
                content: '最近、水彩画を始めました。まだ全然うまく描けませんが、色を重ねていくのがとても楽しいです。\nいつか風景画を描けるようになりたいな。',
                timestamp: new Date('2024-07-17T18:45:00').toISOString(),
                author: { id: 'user112', name: 'アート好きD' }
            }
        ];
        localStorage.setItem('essays', JSON.stringify(essays));
    }

    const storedEssays = localStorage.getItem('essays');
    if (storedEssays) {
        try {
            essays = JSON.parse(storedEssays);
            if (!Array.isArray(essays) || essays.length === 0) {
                initializeSampleEssays();
            }
        } catch (e) {
            console.error("Error parsing essays from localStorage:", e);
            essays = [];
            initializeSampleEssays();
        }
    } else {
        initializeSampleEssays();
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
        // index.html 用のタイムライン処理
        if (essayTimelineList) {
            essayTimelineList.innerHTML = '';
            if (Array.isArray(essays)) {
                const sortedEssaysForIndex = [...essays].sort((a, b) => {
                    const dateA = a && a.timestamp ? new Date(a.timestamp) : new Date(0);
                    const dateB = b && b.timestamp ? new Date(b.timestamp) : new Date(0);
                    return dateB - dateA;
                });
                sortedEssaysForIndex.slice(0, 3).forEach(essay => {
                    if (essay && essay.title && essay.timestamp) {
                        const listItem = document.createElement('li');
                        const postDate = new Date(essay.timestamp);
                        const formattedTimestamp = `${postDate.getFullYear()}/${String(postDate.getMonth() + 1).padStart(2, '0')}/${String(postDate.getDate()).padStart(2, '0')}`;
                        listItem.innerHTML = `
                            <h4>${escapeHtml(essay.title)}</h4>
                            <p class="post-meta">投稿日: ${formattedTimestamp}</p>
                        `;
                        // listItem.classList.add('index-essay-item'); // 必要ならスタイル用クラス
                        essayTimelineList.appendChild(listItem);
                    }
                });
            }
        }

        // logged_in.html 用のタイムライン処理
        if (essayTimelineLoggedInList) {
            essayTimelineLoggedInList.innerHTML = '';
            if (Array.isArray(essays)) {
                const sortedEssays = [...essays].sort((a, b) => {
                    const dateA = a && a.timestamp ? new Date(a.timestamp) : new Date(0);
                    const dateB = b && b.timestamp ? new Date(b.timestamp) : new Date(0);
                    return dateB - dateA;
                });
                sortedEssays.slice(0, 5).forEach(essay => {
                    if (essay && essay.id && essay.title && typeof essay.content !== 'undefined' && essay.timestamp && essay.author && essay.author.id && essay.author.name) {
                        const listItem = document.createElement('li');
                        listItem.classList.add('essay-item-logged-in');

                        let snippet = String(essay.content).split('\n')[0];
                        if (snippet.length > 80) {
                            snippet = snippet.substring(0, 80) + '...';
                        }

                        const postDate = new Date(essay.timestamp);
                        const formattedTimestamp = `${postDate.getFullYear()}/${String(postDate.getMonth() + 1).padStart(2, '0')}/${String(postDate.getDate()).padStart(2, '0')} ${String(postDate.getHours()).padStart(2, '0')}:${String(postDate.getMinutes()).padStart(2, '0')}`;
                        const essayDetailLink = `essay_detail.html?id=${essay.id}`;
                        const authorProfileLink = `profile.html?id=${essay.author.id}`;

                        listItem.innerHTML = `
                            <div class="essay-title-container">
                                <h4 class="essay-title-logged-in"><a href="${essayDetailLink}">${escapeHtml(essay.title)}</a></h4>
                                <span class="essay-author-logged-in"><a href="${authorProfileLink}">${escapeHtml(essay.author.name)}</a></span>
                            </div>
                            <p class="essay-snippet-logged-in">${escapeHtml(snippet)}</p>
                            <p class="essay-meta-logged-in">投稿日時: ${formattedTimestamp}</p>
                        `;
                        essayTimelineLoggedInList.appendChild(listItem);
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
        temp = temp.replace(/"/g, '"');
        temp = temp.replace(/'/g, "'");
        return temp;
     }
});