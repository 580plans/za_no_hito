// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired. script.js execution started.");

    // --- グローバル変数 ---
    let essays = [];
    let popularEssaysData = [];
    let recentEssayImages = [];
    let allComments = {}; // 仮: 全てのコメントを保持するオブジェクト { essayId: [comments] }

    const allThreadsSampleDataForLoggedInPage = [
        { id: 'thread001', title: '今週末の天気とおすすめスポット', category: 'zatsudan', accessCount: 2580, commentCount: 35, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
        { id: 'thread002', title: 'あの新作映画、見た人いる？【ネタバレ注意】', category: 'tv', accessCount: 1890, commentCount: 152, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'thread003', title: 'プログラミング学習で最初にぶつかる壁', category: 'work', accessCount: 1550, commentCount: 88, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
        { id: 'thread004', title: '健康のための食生活改善レポート', category: 'zatsudan', accessCount: 1230, commentCount: 45, createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString() },
        { id: 'thread005', title: '最新AI技術の活用事例と倫理問題', category: 'news', accessCount: 2200, commentCount: 62, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
        { id: 'thread006', title: 'お気に入りのインディーズゲーム教えて！', category: 'game', accessCount: 980, commentCount: 180, createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString() },
        { id: 'thread007', title: '今期の覇権アニメはこれだ！徹底討論', category: 'anime', accessCount: 1750, commentCount: 210, createdAt: new Date(Date.now() - 86400000 * 2.5).toISOString() },
    ];

    const categoryDisplayNamesForLoggedInPage = {
        zatsudan: '雑談', news: 'ニュース', work: '会社・仕事', anime: 'アニメ',
        sports: 'スポーツ', tv: 'テレビ', game: 'ゲーム', unknown: 'その他'
    };

    // --- データ初期化関数 ---
    function initializeSampleEssays() {
        localStorage.removeItem('essays'); // 開発中は常に最新のサンプルデータで初期化

        const storedEssays = localStorage.getItem('essays');
        if (storedEssays) {
            essays = JSON.parse(storedEssays);
        } else {
            essays = [
                { id: 1, title: 'サイト開設のご挨拶', author: '管理人', snippet: 'このサイト「座の人」を開設しました。日々の雑記や思ったことを気ままに綴っていきます。', date: '2024-05-21', image: 'https://dummyimage.com/600x400/777/fff&text=Greeting+Detail', body: 'このサイト「座の人」を開設しました。<br>日々の雑記や思ったことを気ままに綴っていきます。<br><br>どうぞよろしくお願いいたします。' },
                { id: 2, title: 'お気に入りのカフェ紹介', author: 'ユーザーA', snippet: '最近見つけたカフェがとても素敵です。静かで落ち着いた雰囲気で、コーヒーも美味しい。作業にも読書にもぴったりです。', date: '2024-05-20', image: null, body: '最近見つけたカフェがとても素敵です。<br>静かで落ち着いた雰囲気で、コーヒーも美味しい。<br>作業にも読書にもぴったりな空間です。お店の名前は「カフェ・ド・リラックス」。<br>ぜひ一度訪れてみてください。' },
                { id: 3, title: '週末のハイキング記録', author: 'ユーザーB', snippet: '天気が良かったので、近くの山へハイキングに行ってきました。頂上からの景色は最高で、リフレッシュできました！', date: '2024-05-19', image: 'https://dummyimage.com/600x400/4CAF50/fff&text=Hiking+Detail', body: '天気が良かったので、近くの「見晴らし山」へハイキングに行ってきました。<br>片道約1時間半の道のりでしたが、新緑がとても綺麗で気持ちよかったです。<br>頂上からの景色は最高で、日頃の疲れも吹き飛びました！<br>お弁当も美味しかった。また行きたいです。' },
                { id: 4, title: '読んだ本の感想：思考の整理学', author: 'ユーザーC', snippet: '外山滋比古氏の「思考の整理学」を読みました。グライダー能力と飛行機能力の話が印象的。自分の思考プロセスを見直す良いきっかけになりました。', date: '2024-05-18', image: null, body: '外山滋比古氏の「思考の整理学」を読みました。<br>特に「グライダー能力」と「飛行機能力」の話が印象的でした。<br>情報を集めるだけでなく、それを自分なりに発酵させ、新しいアイデアを生み出すことの重要性を再認識しました。<br>自分の思考プロセスを見直す良いきっかけになった一冊です。' },
                { id: 5, title: '新しい趣味、始めました！', author: 'テストユーザー', snippet: '最近、料理を始めました。作るのも食べるのも楽しいです。美味しいパスタが作れるようになりたいな。', date: '2024-05-22', image: 'https://dummyimage.com/600x400/333/fff&text=Cooking+Detail', body: '最近、新しい趣味として料理を始めました！<br>これまであまり自炊をしてこなかったのですが、挑戦してみると意外と楽しくてハマっています。<br>作るのも食べるのも楽しいですね。<br>目下の目標は、美味しいペペロンチーノが作れるようになることです！' }
            ];
            localStorage.setItem('essays', JSON.stringify(essays));
        }
    }

    function initializeSampleComments() {
        const storedComments = localStorage.getItem('allComments');
        if (storedComments) {
            allComments = JSON.parse(storedComments);
        } else {
            allComments = {
                1: [ { author: '読者X', text: '開設おめでとうございます！楽しみにしています。', date: '2024-05-21T12:00:00Z' }, { author: '読者Y', text: '頑張ってください！', date: '2024-05-21T15:30:00Z' } ],
                3: [ { author: 'ハイカーZ', text: '見晴らし山、いいですよね！私も好きです。', date: '2024-05-20T09:00:00Z' } ]
            };
            localStorage.setItem('allComments', JSON.stringify(allComments));
        }
    }

    function initializePopularEssaysData() {
        popularEssaysData = [
            { id: 3, title: '週末のハイキング記録 (人気)', author: 'ユーザーB', snippet: '天気が良かったので、近くの山へハイキングに行ってきました。頂上からの景色は最高で、リフレッシュできました！', date: '2024-05-19', views: 105, image: 'https://dummyimage.com/600x400/4CAF50/fff&text=Hiking+Detail' },
            { id: 1, title: 'サイト開設のご挨拶 (人気)', author: '管理人', snippet: 'このサイト「座の人」を開設しました。日々の雑記や思ったことを気ままに綴っていきます。', date: '2024-05-21', views: 98, image: 'https://dummyimage.com/600x400/777/fff&text=Greeting+Detail' },
        ];
    }

    function initializeRecentEssayImages() { // ★関数名を変更して明確化
        recentEssayImages = [
            'https://dummyimage.com/80x80/800080/FFFFFF&text=Img1',
            'https://dummyimage.com/80x80/008000/FFFFFF&text=Img2',
            'https://dummyimage.com/80x80/FF0000/FFFFFF&text=Img3',
            'https://dummyimage.com/80x80/0000FF/FFFFFF&text=Img4'
        ];
    }

    // --- ヘルパー関数 ---
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') { return unsafe; }
        return unsafe.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, '"').replace(/'/g, "'");
    }

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // --- logged_in.html 用レンダリング関数 ---
    function renderEssayTimeline(targetElement) {
        if (!targetElement) return;
        targetElement.innerHTML = '';
        if (essays.length === 0) {
            targetElement.innerHTML = '<li>まだ随筆がありません。</li>';
            return;
        }
        essays.forEach((essay) => {
            const listItem = document.createElement('li');
            listItem.classList.add('essay-item-logged-in');
            listItem.innerHTML = `
                <div class="essay-title-container">
                    <h4 class="essay-title-logged-in"><a href="essay_detail.html?id=${essay.id}">${escapeHtml(essay.title)}</a></h4>
                    <span class="essay-author-logged-in">投稿者: <a href="profile.html?user=${escapeHtml(String(essay.author))}">${escapeHtml(String(essay.author))}</a></span>
                </div>
                <p class="essay-snippet-logged-in">${escapeHtml(essay.snippet)}</p>
                <p class="essay-meta-logged-in">投稿日: ${escapeHtml(essay.date)}</p>
            `;
            targetElement.appendChild(listItem);
        });
    }

    function renderPopularEssays(targetElement) {
        if (!targetElement) return;
        targetElement.innerHTML = '';
        if (popularEssaysData.length === 0) {
            targetElement.innerHTML = '<li>現在、多く読まれた随筆はありません。</li>';
            return;
        }
        popularEssaysData.forEach(essay => {
            const listItem = document.createElement('li');
            listItem.classList.add('essay-item-logged-in');
            listItem.innerHTML = `
                <div class="essay-title-container">
                    <h4 class="essay-title-logged-in"><a href="essay_detail.html?id=${essay.id}">${escapeHtml(essay.title)}</a></h4>
                    <span class="essay-author-logged-in">投稿者: <a href="profile.html?user=${escapeHtml(String(essay.author))}">${escapeHtml(String(essay.author))}</a></span>
                </div>
                <p class="essay-snippet-logged-in">${escapeHtml(essay.snippet)}</p>
                <p class="essay-meta-logged-in">投稿日: ${escapeHtml(essay.date)} / 閲覧数: ${essay.views || 0}</p>
            `;
            targetElement.appendChild(listItem);
        });
    }

    function renderRecentEssayImages(targetElement) {
        if (!targetElement) return;
        targetElement.innerHTML = '';
        if (recentEssayImages.length === 0) {
            targetElement.innerHTML = '<p>最近投稿された画像はありません。</p>';
            return;
        }
        recentEssayImages.forEach((imageUrl, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = escapeHtml(imageUrl);
            imgElement.alt = `最近の画像 ${index + 1}`;
            targetElement.appendChild(imgElement);
        });
    }

    function renderLoggedInActiveThreads(targetElement) {
        if (!targetElement) return;
        targetElement.innerHTML = '';
        const sortedByAccess = [...allThreadsSampleDataForLoggedInPage]
            .sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0))
            .slice(0, 5);
        if (sortedByAccess.length === 0) {
            targetElement.innerHTML = '<li>現在、にぎやかなスレはありません。</li>';
            return;
        }
        sortedByAccess.forEach((thread) => {
            const listItem = document.createElement('li');
            const categoryName = categoryDisplayNamesForLoggedInPage[thread.category] || categoryDisplayNamesForLoggedInPage.unknown;
            listItem.classList.add('thread-list-item');
            listItem.innerHTML = `
                <div class="thread-info-container">
                    <div>
                        <span class="thread-category-badge">${escapeHtml(categoryName)}</span>
                        <a href="thread_detail.html?id=${thread.id}" class="thread-title-link">${escapeHtml(thread.title)}</a>
                    </div>
                    <div class="thread-stats">アクセス数: ${thread.accessCount || 0}</div>
                </div>
            `;
            targetElement.appendChild(listItem);
        });
    }

    function renderFollowingList(targetElement) {
        if (!targetElement) return;
        targetElement.innerHTML = '';
        const sampleFollowingUsers = [
            { id: 'user123', name: '夏目漱石' }, { id: 'user456', name: '芥川龍之介' }, { id: 'user789', name: '太宰治' }
        ];
        if (sampleFollowingUsers.length === 0) {
            const li = document.createElement('li');
            li.textContent = '刮目中の人はいません';
            li.style.padding = '4px 15px'; li.style.fontSize = '0.9em';
            targetElement.appendChild(li);
        } else {
            sampleFollowingUsers.forEach(user => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `profile.html?id=${user.id}`;
                a.textContent = escapeHtml(user.name);
                li.appendChild(a);
                targetElement.appendChild(li);
            });
        }
    }

    function initializeTabs(tabButtonSelector, tabContentSelector, initialTabId) {
        const tabButtons = document.querySelectorAll(tabButtonSelector);
        const tabContents = document.querySelectorAll(tabContentSelector);
        if (tabButtons.length === 0 || tabContents.length === 0) return; // 要素がなければ何もしない

        function showTab(tabId) {
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) { content.classList.add('active'); }
            });
            tabButtons.forEach(button => {
                button.classList.remove('active');
                if (button.dataset.tab === tabId) { button.classList.add('active'); }
            });
        }
        tabButtons.forEach(button => {
            button.addEventListener('click', () => { showTab(button.dataset.tab); });
        });
        if (initialTabId && document.getElementById(initialTabId)) { // 初期タブIDの存在確認
            showTab(initialTabId);
        } else if (tabButtons.length > 0) {
            showTab(tabButtons[0].dataset.tab);
        }
    }

    // --- essay_detail.html 用レンダリング関数 ---
    function renderEssayDetail(essayId, elements) {
        const idToFind = parseInt(essayId, 10);
        const essay = essays.find(e => e.id === idToFind);

        if (!essay) {
            if (elements.title) elements.title.textContent = '随筆が見つかりません';
            if (elements.text) elements.text.innerHTML = '<p>指定されたIDの随筆は存在しないか、削除された可能性があります。</p>';
            if (elements.author) elements.author.textContent = '';
            if (elements.datetime) elements.datetime.textContent = '';
            if (elements.imageContainer) elements.imageContainer.style.display = 'none';
            return;
        }

        if (elements.title) elements.title.textContent = essay.title;
        if (elements.author) elements.author.innerHTML = `投稿者: <a href="profile.html?user=${escapeHtml(String(essay.author))}">${escapeHtml(String(essay.author))}</a>`;
        if (elements.datetime) {
            elements.datetime.textContent = `投稿日時: ${new Date(essay.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}`;
            elements.datetime.setAttribute('datetime', new Date(essay.date).toISOString());
        }
        if (essay.image && elements.imageContainer && elements.image) {
            elements.image.src = escapeHtml(essay.image);
            elements.image.alt = `随筆画像: ${escapeHtml(essay.title)}`;
            elements.imageContainer.style.display = 'block';
        } else if (elements.imageContainer) {
            elements.imageContainer.style.display = 'none';
        }
        if (elements.text) elements.text.innerHTML = essay.body ? essay.body.replace(/\n/g, '<br>') : '<p>本文がありません。</p>';
        renderCommentsForEssay(idToFind, elements.commentsList);
    }

    function renderCommentsForEssay(essayId, targetElement) {
        if (!targetElement) return;
        targetElement.innerHTML = '';
        const essayComments = allComments[essayId] || [];
        if (essayComments.length === 0) {
            const noCommentItem = document.createElement('div');
            noCommentItem.classList.add('comment-item');
            noCommentItem.textContent = 'まだコメントはありません。';
            targetElement.appendChild(noCommentItem);
            return;
        }
        essayComments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.classList.add('comment-item');
            commentItem.innerHTML = `
                <p class="comment-author">${escapeHtml(comment.author)}</p>
                <p class="comment-text">${escapeHtml(comment.text)}</p>
                <p class="comment-date"><time datetime="${new Date(comment.date).toISOString()}">${new Date(comment.date).toLocaleString('ja-JP')}</time></p>
            `;
            targetElement.appendChild(commentItem);
        });
    }

    function handleCommentSubmit(event, essayId, elements) {
        event.preventDefault();
        const commentTextInput = document.getElementById('comment-text-input');
        if (!commentTextInput) return;
        const commentText = commentTextInput.value.trim();
        const loggedInUser = "ログインユーザー名(仮)"; // ★ 後で動的に

        if (commentText && essayId) {
            const newComment = { author: loggedInUser, text: commentText, date: new Date().toISOString() };
            if (!allComments[essayId]) { allComments[essayId] = []; }
            allComments[essayId].push(newComment);
            localStorage.setItem('allComments', JSON.stringify(allComments));
            renderCommentsForEssay(essayId, elements.commentsList);
            commentTextInput.value = '';
        }
    }


    // --- ページごとの初期化処理 ---
    initializeSampleEssays(); // 全ページで随筆データは必要
    initializeSampleComments(); // 全ページでコメントデータは必要（詳細ページで使うため）

    if (document.getElementById('essay-timeline-logged-in')) { // logged_in.html の場合
        console.log("Initializing logged_in.html specific content...");
        initializePopularEssaysData();
        initializeRecentEssayImages();

        const essayTimelineLoggedInEl = document.getElementById('essay-timeline-logged-in');
        const popularEssaysListEl = document.getElementById('popular-essays-list');
        const recentEssayImagesTabEl = document.getElementById('recent-essay-images-tab');
        const loggedInActiveThreadsListEl = document.getElementById('active-threads-list');
        const followingListEl = document.getElementById('following-list');

        renderEssayTimeline(essayTimelineLoggedInEl);
        renderPopularEssays(popularEssaysListEl);
        renderRecentEssayImages(recentEssayImagesTabEl);
        renderLoggedInActiveThreads(loggedInActiveThreadsListEl);
        renderFollowingList(followingListEl);
        initializeTabs('.tab-button-logged-in', '.tab-content-logged-in', 'essays');

    } else if (document.getElementById('essay-title-detail')) { // essay_detail.html の場合
        console.log("Initializing essay_detail.html specific content...");
        const essayId = getQueryParam('id');
        const detailElements = {
            title: document.getElementById('essay-title-detail'),
            author: document.getElementById('essay-author-detail'),
            datetime: document.getElementById('essay-datetime-detail'),
            imageContainer: document.getElementById('essay-image-detail-container'),
            image: document.getElementById('essay-image-detail'),
            text: document.getElementById('essay-text-detail'),
            commentsList: document.getElementById('comments-list'),
            commentForm: document.getElementById('comment-form')
        };

        if (essayId) {
            renderEssayDetail(essayId, detailElements);
            if (detailElements.commentForm) {
                detailElements.commentForm.addEventListener('submit', (event) => handleCommentSubmit(event, parseInt(essayId, 10), detailElements));
            }
        } else {
            if (detailElements.title) detailElements.title.textContent = 'エラー';
            if (detailElements.text) detailElements.text.innerHTML = '<p>表示する随筆のIDが指定されていません。</p>';
        }
    }
});