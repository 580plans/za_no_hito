// script.js

// グローバルスコープの escapeHtml 関数 (修正)
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') { return unsafe; }
    return unsafe
         .replace(/&/g, "&")
         .replace(/</g, "<")
         .replace(/>/g, ">")
         .replace(/"/g, '"')
         .replace(/'/g, "'");
}

// グローバルスコープの左カラム初期化関数
function initializeLeftColumnContent() {
    console.log("Attempting to initialize left column content FROM GLOBAL FUNCTION...");
    const usernameLinkEl = document.getElementById('left-column-username');
    const followingListEl = document.getElementById('following-list-left-column');

    if (usernameLinkEl && window.currentLoggedInUser && window.currentLoggedInUser.name) {
        usernameLinkEl.textContent = escapeHtml(window.currentLoggedInUser.name); // 正しい escapeHtml を使用
        console.log("Left column username updated to:", window.currentLoggedInUser.name);
    } else {
        console.warn("Left column username element ('left-column-username') or window.currentLoggedInUser not found/ready.");
        if (!usernameLinkEl) console.warn("   Reason: usernameLinkEl is null");
        if (!window.currentLoggedInUser) console.warn("   Reason: window.currentLoggedInUser is undefined");
        else if (!window.currentLoggedInUser.name) console.warn("   Reason: window.currentLoggedInUser.name is undefined");
    }

    if (followingListEl) {
        followingListEl.innerHTML = '';
        const sampleFollowingUsers = [
            { id: 'user123', name: '夏目漱石' }, { id: 'user456', name: '芥川龍之介' }, { id: 'user789', name: '太宰治' }
        ];
        if (sampleFollowingUsers.length === 0) {
            const li = document.createElement('li');
            li.textContent = '刮目中の人はいません';
            li.style.padding = '4px 15px'; li.style.fontSize = '0.9em';
            followingListEl.appendChild(li);
        } else {
            sampleFollowingUsers.forEach(user => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `profile.html?id=${user.id}`;
                a.textContent = escapeHtml(user.name); // 正しい escapeHtml を使用
                li.appendChild(a);
                followingListEl.appendChild(li);
            });
        }
        console.log("Left column following list updated.");
    } else {
        console.warn("Left column following list element ('following-list-left-column') not found.");
    }
}

// グローバルスコープの logged_in.html メインコンテンツ初期化関数
function initializeLoggedInMainContent() {
    console.log("Attempting to initialize logged_in.html MAIN CONTENT...");
    window.initializePopularEssaysData();
    window.initializeRecentEssayImages();

    const essayTimelineLoggedInEl = document.getElementById('essay-timeline-logged-in');
    const popularEssaysListEl = document.getElementById('popular-essays-list');
    const recentEssayImagesTabEl = document.getElementById('recent-essay-images-tab');
    const loggedInActiveThreadsListEl = document.getElementById('active-threads-list');

    // console.log("Element Check for logged_in.html main content (from initializeLoggedInMainContent):");
    // ... (要素取得ログは必要に応じてコメント解除)

    if(essayTimelineLoggedInEl) window.renderEssayTimeline(essayTimelineLoggedInEl);
    else console.warn("essayTimelineLoggedInEl not found in initializeLoggedInMainContent");

    if(popularEssaysListEl) window.renderPopularEssays(popularEssaysListEl);
    else console.warn("popularEssaysListEl not found in initializeLoggedInMainContent");

    if(recentEssayImagesTabEl) window.renderRecentEssayImages(recentEssayImagesTabEl);
    else console.warn("recentEssayImagesTabEl not found in initializeLoggedInMainContent");
    
    if(loggedInActiveThreadsListEl) window.renderLoggedInActiveThreads(loggedInActiveThreadsListEl);
    else console.warn("loggedInActiveThreadsListEl not found in initializeLoggedInMainContent");
    
    // ★ initializeTabs を呼び出す前に、タブボタンとコンテンツが存在するか確認する方がより安全
    // setTimeoutは一旦削除し、呼び出しタイミングをHTML側のコールバックに依存させる
    console.log("Calling initializeTabs for logged_in.html from initializeLoggedInMainContent...");
    window.initializeTabs('.tab-button-logged-in', '.tab-content-logged-in', 'essays');
    console.log("Finished initializing logged_in.html MAIN CONTENT.");
}

// グローバルスコープの essay_detail.html メインコンテンツ初期化関数
function initializeEssayDetailMainContent() {
    console.log("Attempting to initialize essay_detail.html MAIN CONTENT...");
    const essayIdFromUrl = window.getQueryParam('id');

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

    if (essayIdFromUrl) {
        window.renderEssayDetail(essayIdFromUrl, detailElements);
        if (detailElements.commentForm) {
            const submitHandler = (event) => window.handleCommentSubmit(event, parseInt(essayIdFromUrl, 10), detailElements);
            if (detailElements.commentForm._submitHandler) {
                detailElements.commentForm.removeEventListener('submit', detailElements.commentForm._submitHandler);
            }
            detailElements.commentForm.addEventListener('submit', submitHandler);
            detailElements.commentForm._submitHandler = submitHandler;
        }
    } else {
        console.error("Essay ID not found in URL for essay_detail.html. Displaying error message (from initializeEssayDetailMainContent).");
        if (detailElements.title) detailElements.title.textContent = 'エラー';
        if (detailElements.text) detailElements.text.innerHTML = '<p>表示する随筆のIDが指定されていません。</p>';
        if (detailElements.commentForm) detailElements.commentForm.style.display = 'none';
        if (detailElements.commentsList) detailElements.commentsList.innerHTML = '';
    }
    console.log("Finished initializing essay_detail.html MAIN CONTENT.");
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired. script.js MAIN execution started.");

    window.currentLoggedInUser = { name: "座の人ユーザー" };
    window.essays = [];
    window.popularEssaysData = [];
    window.recentEssayImages = [];
    window.allComments = {};
    window.allThreadsSampleDataForLoggedInPage = [ /* ... (内容は変更なし) ... */ ];
    window.categoryDisplayNamesForLoggedInPage = { /* ... (内容は変更なし) ... */ };

    // --- 関数定義を window オブジェクトにアタッチ ---
    window.initializeSampleEssays = function() {
        localStorage.removeItem('essays');
        const storedEssays = localStorage.getItem('essays');
        if (storedEssays) {
            window.essays = JSON.parse(storedEssays);
        } else {
            window.essays = [
                { id: 1, title: 'サイト開設のご挨拶', author: '管理人', snippet: 'このサイト「座の人」を開設しました。日々の雑記や思ったことを気ままに綴っていきます。', date: '2024-05-21', image: 'https://dummyimage.com/600x400/777/fff&text=Greeting+Detail', body: 'このサイト「座の人」を開設しました。<br>日々の雑記や思ったことを気ままに綴っていきます。<br><br>どうぞよろしくお願いいたします。' },
                { id: 2, title: 'お気に入りのカフェ紹介', author: 'ユーザーA', snippet: '最近見つけたカフェがとても素敵です。静かで落ち着いた雰囲気で、コーヒーも美味しい。作業にも読書にもぴったりです。', date: '2024-05-20', image: null, body: '最近見つけたカフェがとても素敵です。<br>静かで落ち着いた雰囲気で、コーヒーも美味しい。<br>作業にも読書にもぴったりな空間です。お店の名前は「カフェ・ド・リラックス」。<br>ぜひ一度訪れてみてください。' },
                { id: 3, title: '週末のハイキング記録', author: 'ユーザーB', snippet: '天気が良かったので、近くの山へハイキングに行ってきました。頂上からの景色は最高で、リフレッシュできました！', date: '2024-05-19', image: 'https://dummyimage.com/600x400/4CAF50/fff&text=Hiking+Detail', body: '天気が良かったので、近くの「見晴らし山」へハイキングに行ってきました。<br>片道約1時間半の道のりでしたが、新緑がとても綺麗で気持ちよかったです。<br>頂上からの景色は最高で、日頃の疲れも吹き飛びました！<br>お弁当も美味しかった。また行きたいです。' },
                { id: 4, title: '読んだ本の感想：思考の整理学', author: 'ユーザーC', snippet: '外山滋比古氏の「思考の整理学」を読みました。グライダー能力と飛行機能力の話が印象的。自分の思考プロセスを見直す良いきっかけになりました。', date: '2024-05-18', image: null, body: '外山滋比古氏の「思考の整理学」を読みました。<br>特に「グライダー能力」と「飛行機能力」の話が印象的でした。<br>情報を集めるだけでなく、それを自分なりに発酵させ、新しいアイデアを生み出すことの重要性を再認識しました。<br>自分の思考プロセスを見直す良いきっかけになった一冊です。' },
                { id: 5, title: '新しい趣味、始めました！', author: 'テストユーザー', snippet: '最近、料理を始めました。作るのも食べるのも楽しいです。美味しいパスタが作れるようになりたいな。', date: '2024-05-22', image: 'https://dummyimage.com/600x400/333/fff&text=Cooking+Detail', body: '最近、新しい趣味として料理を始めました！<br>これまであまり自炊をしてこなかったのですが、挑戦してみると意外と楽しくてハマっています。<br>作るのも食べるのも楽しいですね。<br>目下の目標は、美味しいペペロンチーノが作れるようになることです！' }
            ];
            localStorage.setItem('essays', JSON.stringify(window.essays));
        }
    };

    window.initializeSampleComments = function() {
        const storedComments = localStorage.getItem('allComments');
        if (storedComments) {
            window.allComments = JSON.parse(storedComments);
        } else {
            window.allComments = {
                1: [ { author: '読者X', text: '開設おめでとうございます！楽しみにしています。', date: '2024-05-21T12:00:00Z' }, { author: '読者Y', text: '頑張ってください！', date: '2024-05-21T15:30:00Z' } ],
                3: [ { author: 'ハイカーZ', text: '見晴らし山、いいですよね！私も好きです。', date: '2024-05-20T09:00:00Z' } ]
            };
            localStorage.setItem('allComments', JSON.stringify(window.allComments));
        }
    };

    window.initializePopularEssaysData = function() {
        window.popularEssaysData = [
            { id: 3, title: '週末のハイキング記録 (人気)', author: 'ユーザーB', snippet: '天気が良かったので、近くの山へハイキングに行ってきました。頂上からの景色は最高で、リフレッシュできました！', date: '2024-05-19', views: 105, image: 'https://dummyimage.com/600x400/4CAF50/fff&text=Hiking+Detail' },
            { id: 1, title: 'サイト開設のご挨拶 (人気)', author: '管理人', snippet: 'このサイト「座の人」を開設しました。日々の雑記や思ったことを気ままに綴っていきます。', date: '2024-05-21', views: 98, image: 'https://dummyimage.com/600x400/777/fff&text=Greeting+Detail' },
        ];
    };

    window.initializeRecentEssayImages = function() {
        window.recentEssayImages = [
            'https://dummyimage.com/80x80/800080/FFFFFF&text=Img1',
            'https://dummyimage.com/80x80/008000/FFFFFF&text=Img2',
            'https://dummyimage.com/80x80/FF0000/FFFFFF&text=Img3',
            'https://dummyimage.com/80x80/0000FF/FFFFFF&text=Img4'
        ];
    };

    window.getQueryParam = function(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    window.renderEssayTimeline = function(targetElement) {
        if (!targetElement) { console.warn("renderEssayTimeline: targetElement is null"); return; }
        targetElement.innerHTML = '';
        if (window.essays.length === 0) {
            targetElement.innerHTML = '<li>まだ随筆がありません。</li>';
            return;
        }
        window.essays.forEach((essay) => {
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
    };
    
    window.renderPopularEssays = function(targetElement) {
        if (!targetElement) { console.warn("renderPopularEssays: targetElement is null"); return; }
        targetElement.innerHTML = '';
        if (window.popularEssaysData.length === 0) {
            targetElement.innerHTML = '<li>現在、多く読まれた随筆はありません。</li>';
            return;
        }
        window.popularEssaysData.forEach(essay => {
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
    };

    window.renderRecentEssayImages = function(targetElement) {
        if (!targetElement) { console.warn("renderRecentEssayImages: targetElement is null"); return; }
        targetElement.innerHTML = '';
        if (window.recentEssayImages.length === 0) {
            targetElement.innerHTML = '<p>最近投稿された画像はありません。</p>';
            return;
        }
        window.recentEssayImages.forEach((imageUrl, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = escapeHtml(imageUrl);
            imgElement.alt = `最近の画像 ${index + 1}`;
            targetElement.appendChild(imgElement);
        });
    };

    window.renderLoggedInActiveThreads = function(targetElement) {
        if (!targetElement) { console.warn("renderLoggedInActiveThreads: targetElement is null"); return; }
        targetElement.innerHTML = '';
        const sortedByAccess = [...window.allThreadsSampleDataForLoggedInPage]
            .sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0))
            .slice(0, 5);
        if (sortedByAccess.length === 0) {
            targetElement.innerHTML = '<li>現在、にぎやかなスレはありません。</li>';
            return;
        }
        sortedByAccess.forEach((thread) => {
            const categoryName = window.categoryDisplayNamesForLoggedInPage[thread.category] || window.categoryDisplayNamesForLoggedInPage.unknown;
            const listItem = document.createElement('li');
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
    };

    window.initializeTabs = function(tabButtonSelector, tabContentSelector, initialTabId) {
        const tabButtons = document.querySelectorAll(tabButtonSelector);
        const tabContents = document.querySelectorAll(tabContentSelector);
        if (tabButtons.length === 0 || tabContents.length === 0) {
            console.warn("initializeTabs: Tab buttons or contents not found. Selector used:", tabButtonSelector, tabContentSelector);
            return;
        }

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
        if (initialTabId && document.getElementById(initialTabId)) {
            showTab(initialTabId);
        } else if (tabButtons.length > 0) {
            showTab(tabButtons[0].dataset.tab);
        } else {
            console.warn("initializeTabs: No initial tab to show and no tab buttons found.");
        }
    };

    window.renderEssayDetail = function(essayId, elements) {
        console.log("renderEssayDetail (now global) called with essayId:", essayId);
        const idToFind = parseInt(essayId, 10);
        const essay = window.essays.find(e => e.id === idToFind);

        if (!essay) {
            console.error("Essay not found for ID:", essayId);
            if (elements.title) elements.title.textContent = '随筆が見つかりません';
            if (elements.text) elements.text.innerHTML = '<p>指定されたIDの随筆は存在しないか、削除された可能性があります。</p>';
            if (elements.author) elements.author.textContent = '';
            if (elements.datetime) elements.datetime.textContent = '';
            if (elements.imageContainer) elements.imageContainer.style.display = 'none';
            if (elements.commentsList) elements.commentsList.innerHTML = '';
            if (elements.commentForm) elements.commentForm.style.display = 'none';
            return;
        }

        if (elements.commentForm) elements.commentForm.style.display = 'block';
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
        window.renderCommentsForEssay(idToFind, elements.commentsList);
    };

    window.renderCommentsForEssay = function(essayId, targetElement) {
        if (!targetElement) { console.warn("renderCommentsForEssay: targetElement is null for essayId:", essayId); return;}
        targetElement.innerHTML = '';
        const essayComments = window.allComments[essayId] || [];
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
    };

    window.handleCommentSubmit = function(event, essayIdToSubmit, elements) {
        event.preventDefault();
        // console.log("handleCommentSubmit (now global) called for essayId:", essayIdToSubmit);
        const commentTextInput = document.getElementById('comment-text-input');
        if (!commentTextInput) { console.error("Comment text input not found."); return; }
        const commentText = commentTextInput.value.trim();

        if (commentText && essayIdToSubmit && window.currentLoggedInUser && window.currentLoggedInUser.name) {
            const newComment = {
                author: window.currentLoggedInUser.name,
                text: commentText,
                date: new Date().toISOString()
            };
            if (!window.allComments[essayIdToSubmit]) { window.allComments[essayIdToSubmit] = []; }
            window.allComments[essayIdToSubmit].push(newComment);
            localStorage.setItem('allComments', JSON.stringify(window.allComments));
            window.renderCommentsForEssay(essayIdToSubmit, elements.commentsList);
            commentTextInput.value = '';
            // console.log("Comment submitted successfully:", newComment);
        } else {
            console.warn("Comment submission failed. Missing data:", {commentText, essayIdToSubmit, currentUser: window.currentLoggedInUser});
        }
    };

    // --- 共通のデータ初期化の呼び出し ---
    window.initializeSampleEssays(); // グローバル化された関数を呼び出す
    window.initializeSampleComments(); // グローバル化された関数を呼び出す

    console.log("script.js: Main DOMContentLoaded listener finished. Waiting for inline script callbacks (HTML files will call global init functions).");
});