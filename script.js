// script.js

// グローバルスコープの escapeHtml 関数
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') { return unsafe; }
    return unsafe
         .replace(/&/g, "&") // ★修正
         .replace(/</g, "<")   // ★修正
         .replace(/>/g, ">")   // ★修正
         .replace(/"/g, '"') // ★修正
         .replace(/'/g, "'"); // ★修正
}

// グローバルスコープの getCrownHtml 関数
function getCrownHtml(rank) {
    if (rank === 1) {
        return '<span class="crown gold">👑</span>';
    }
    return '';
}

// グローバルスコープの左カラム初期化関数
function initializeLeftColumnContent() {
    // console.log("Attempting to initialize left column content FROM GLOBAL FUNCTION...");
    const userImageEl = document.getElementById('left-column-user-image');
    const usernameTextEl = document.getElementById('left-column-username-text');
    const followingListEl = document.getElementById('following-list-left-column');

    if (window.currentLoggedInUser) {
        if (userImageEl) {
            userImageEl.src = window.currentLoggedInUser.profileImageUrl || 'default_user_thumb.png';
            userImageEl.alt = (window.currentLoggedInUser.name ? escapeHtml(window.currentLoggedInUser.name) : 'ユーザー') + "の画像";
        }
        if (usernameTextEl && window.currentLoggedInUser.name) {
            usernameTextEl.textContent = escapeHtml(window.currentLoggedInUser.name);
        }
    } else {
        if(userImageEl) userImageEl.src = 'default_user_thumb.png';
        if(usernameTextEl) usernameTextEl.textContent = "ゲスト";
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
                a.textContent = escapeHtml(user.name);
                li.appendChild(a);
                followingListEl.appendChild(li);
            });
        }
    }
}

// グローバルスコープの logged_in.html メインコンテンツ初期化関数
function initializeLoggedInMainContent() {
    window.initializePopularEssaysData();
    window.initializeMediaTimelineItems();
    const essayTimelineLoggedInEl = document.getElementById('essay-timeline-logged-in');
    const popularEssaysListEl = document.getElementById('popular-essays-list');
    const recentMediaTabEl = document.getElementById('recent-essay-images-tab');
    const loggedInActiveThreadsListEl = document.getElementById('active-threads-list');
    if(essayTimelineLoggedInEl) window.renderEssayTimeline(essayTimelineLoggedInEl);
    if(popularEssaysListEl) window.renderPopularEssays(popularEssaysListEl);
    if(recentMediaTabEl) window.renderRecentMedia(recentMediaTabEl);
    if(loggedInActiveThreadsListEl) window.renderLoggedInActiveThreads(loggedInActiveThreadsListEl);
    setTimeout(() => { window.initializeTabs('.tab-button-logged-in', '.tab-content-logged-in', 'essays'); }, 0);
}

// グローバルスコープの essay_detail.html メインコンテンツ初期化関数
function initializeEssayDetailMainContent() {
    const essayIdFromUrl = window.getQueryParam('id');
    const detailElements = {
        title: document.getElementById('essay-title-detail'), author: document.getElementById('essay-author-detail'), datetime: document.getElementById('essay-datetime-detail'),
        imageContainer: document.getElementById('essay-image-detail-container'), image: document.getElementById('essay-image-detail'),
        videoContainer: document.getElementById('essay-video-detail-container'), video: document.getElementById('essay-video-detail'),
        text: document.getElementById('essay-text-detail'), commentsList: document.getElementById('comments-list'), commentForm: document.getElementById('comment-form')
    };
    if (essayIdFromUrl) {
        window.renderEssayDetail(essayIdFromUrl, detailElements);
        if (detailElements.commentForm) {
            const submitHandler = (event) => window.handleCommentSubmit(event, parseInt(essayIdFromUrl, 10), detailElements);
            if (detailElements.commentForm._submitHandler) { detailElements.commentForm.removeEventListener('submit', detailElements.commentForm._submitHandler); }
            detailElements.commentForm.addEventListener('submit', submitHandler); detailElements.commentForm._submitHandler = submitHandler;
        }
    } else {
        if (detailElements.title) detailElements.title.textContent = 'エラー'; if (detailElements.text) detailElements.text.innerHTML = '<p>表示する随筆のIDが指定されていません。</p>';
        if (detailElements.commentForm) detailElements.commentForm.style.display = 'none'; if (detailElements.commentsList) detailElements.commentsList.innerHTML = '';
    }
}

// グローバルスコープの通知ページ初期化関数
function initializeNotificationsPage() {
    const notificationListAreaEl = document.getElementById('notification-list-area');
    if (notificationListAreaEl) { window.renderNotifications(notificationListAreaEl); }
    else { console.warn("Notification list area ('notification-list-area') not found on notifications.html."); }
}

// グローバルスコープの create_essay.html 初期化関数
function initializeCreateEssayPage() {
    const essayForm = document.getElementById('essay-form'); const mediaInput = document.getElementById('essay-media'); const mediaPreviewArea = document.getElementById('media-preview-area');
    if (mediaInput && mediaPreviewArea) {
        mediaPreviewArea.innerHTML = '<p class="empty-preview-text">イメージ</p>';
        mediaInput.addEventListener('change', (event) => {
            mediaPreviewArea.innerHTML = ''; const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (file.type.startsWith('image/')) { const img = document.createElement('img'); img.src = e.target.result; mediaPreviewArea.appendChild(img); }
                    else if (file.type.startsWith('video/')) { const video = document.createElement('video'); video.src = e.target.result; video.controls = true; video.style.maxWidth = '100%'; video.style.maxHeight = '300px'; mediaPreviewArea.appendChild(video); }
                    else { mediaPreviewArea.innerHTML = '<p style="color:red;">サポート外のファイル形式です。</p>'; mediaInput.value = ""; }
                }; reader.readAsDataURL(file);
            } else { mediaPreviewArea.innerHTML = '<p class="empty-preview-text">イメージ</p>'; }
        });
    }
    if (essayForm) {
        essayForm.addEventListener('submit', (event) => {
            event.preventDefault(); const title = document.getElementById('essay-title').value.trim(); const content = document.getElementById('essay-content').value.trim(); const mediaFile = mediaInput.files[0];
            if (!title || !content) { alert("タイトルと本文は必須です。"); return; }
            const newEssayId = window.essays.length > 0 ? Math.max(...window.essays.map(e => e.id)) + 1 : 1;
            const newEssay = { id: newEssayId, title: title, author: window.currentLoggedInUser.name, snippet: content.substring(0, 100) + (content.length > 100 ? "..." : ""), body: content.replace(/\n/g, '<br>'), date: new Date().toISOString().split('T')[0], image: null, videoUrl: null };
            if (mediaFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (mediaFile.type.startsWith('image/')) { newEssay.image = e.target.result; } else if (mediaFile.type.startsWith('video/')) { newEssay.videoUrl = e.target.result; }
                    window.saveNewEssay(newEssay);
                }; reader.readAsDataURL(mediaFile);
            } else { window.saveNewEssay(newEssay); }
        });
    }
}

// グローバルスコープの新しい随筆を保存しリダイレクトする関数
function saveNewEssay(essayData) { window.essays.push(essayData); localStorage.setItem('essays', JSON.stringify(window.essays)); alert('随筆を投稿しました！'); window.location.href = 'logged_in.html'; }

// グローバルスコープの past_essays.html のメインコンテンツを初期化/描画する関数
function initializePastEssaysPage() { const pastEssaysListAreaEl = document.getElementById('past-essays-list-area'); if (pastEssaysListAreaEl) { window.renderPastEssaysList(pastEssaysListAreaEl); } else { console.warn("Past essays list area not found."); } }

// グローバルスコープの profile.html のメインコンテンツを初期化/描画する関数
function initializeProfilePage() { const recentProfileEssaysListEl = document.getElementById('recent-profile-essays-list'); if (recentProfileEssaysListEl) { const targetUserName = window.currentLoggedInUser ? window.currentLoggedInUser.name : null; if (targetUserName) { window.renderRecentProfileEssays(recentProfileEssaysListEl, targetUserName); } else { recentProfileEssaysListEl.innerHTML = '<li>ユーザー情報が取得できませんでした。</li>'; } } }

// グローバルスコープの thread_detail.html のメインコンテンツを初期化/描画する関数
function initializeThreadDetailPage() {
    const threadTitleDetailEl = document.getElementById('thread-title-detail');
    const threadAuthorDetailEl = document.getElementById('thread-author-detail');
    const threadCreatedAtDetailEl = document.getElementById('thread-created-at-detail');
    const threadCategoryDetailEl = document.getElementById('thread-category-detail');
    const initialPostAuthorEl = document.getElementById('initial-post-author');
    const initialPostDateEl = document.getElementById('initial-post-date');
    const initialPostBodyEl = document.getElementById('initial-post-body');
    const threadCommentsListEl = document.getElementById('thread-comments-list');
    const threadCommentFormEl = document.getElementById('comment-form');
    const commentTextInputEl = document.getElementById('comment-text-input');
    const commentCharCounterEl = document.getElementById('comment-char-counter');

    const threadId = window.getQueryParam('id');
    const loggedInUserName = window.currentLoggedInUser ? window.currentLoggedInUser.name : "ゲスト";

    if (threadId) {
        const threadData = window.allThreadsSampleDataForLoggedInPage.find(t => t.id === threadId);
        if (threadData) {
            if (threadTitleDetailEl) threadTitleDetailEl.textContent = escapeHtml(threadData.title);
            if (threadAuthorDetailEl) { threadAuthorDetailEl.innerHTML = `作成者: <a href="profile.html">${escapeHtml(loggedInUserName)}</a>`; }
            if (threadCreatedAtDetailEl) { const createdDate = new Date(threadData.createdAt); threadCreatedAtDetailEl.textContent = `作成日時: ${createdDate.toLocaleDateString('ja-JP')} ${createdDate.toLocaleTimeString('ja-JP')}`; threadCreatedAtDetailEl.setAttribute('datetime', createdDate.toISOString()); }
            if (threadCategoryDetailEl && window.categoryDisplayNamesForLoggedInPage) { threadCategoryDetailEl.textContent = `カテゴリ: ${escapeHtml(window.categoryDisplayNamesForLoggedInPage[threadData.category] || threadData.category)}`; }
            if (initialPostAuthorEl) { initialPostAuthorEl.innerHTML = `<a href="profile.html">${escapeHtml(loggedInUserName)}</a>`; }
            if (initialPostDateEl) { const postDate = new Date(threadData.createdAt); initialPostDateEl.textContent = `${postDate.toLocaleDateString('ja-JP')} ${postDate.toLocaleTimeString('ja-JP')}`; initialPostDateEl.setAttribute('datetime', postDate.toISOString()); }
            if (initialPostBodyEl) initialPostBodyEl.innerHTML = `<p>これは「${escapeHtml(threadData.title)}」スレッドの最初の投稿のサンプル本文です。スレッドID: ${escapeHtml(threadData.id)}</p>`;
            if (threadCommentsListEl) { window.renderThreadComments(threadCommentsListEl, threadId); }
            if (threadCommentFormEl) {
                const submitThreadCommentHandler = (event) => {
                    event.preventDefault();
                    const commentTextInput = threadCommentFormEl.querySelector('#comment-text-input');
                    if (!commentTextInput) return;
                    const commentText = commentTextInput.value.trim();
                    if (commentText && threadId && window.currentLoggedInUser && window.currentLoggedInUser.name) {
                        const newComment = { author: window.currentLoggedInUser.name, text: commentText, date: new Date().toISOString() };
                        if (!window.threadSampleComments[threadId]) { window.threadSampleComments[threadId] = []; }
                        window.threadSampleComments[threadId].push(newComment);
                        window.renderThreadComments(threadCommentsListEl, threadId);
                        commentTextInput.value = '';
                        if(commentCharCounterEl) commentCharCounterEl.textContent = `0 / ${commentTextInputEl.maxLength || 100}`;
                    }
                };
                if (threadCommentFormEl._submitHandler) { threadCommentFormEl.removeEventListener('submit', threadCommentFormEl._submitHandler); }
                threadCommentFormEl.addEventListener('submit', submitThreadCommentHandler);
                threadCommentFormEl._submitHandler = submitThreadCommentHandler;
            }
            if (commentTextInputEl && commentCharCounterEl) {
                const maxLength = parseInt(commentTextInputEl.getAttribute('maxlength'), 10) || 100;
                commentCharCounterEl.textContent = `${commentTextInputEl.value.length} / ${maxLength}`;
                commentTextInputEl.addEventListener('input', () => {
                    const currentLength = commentTextInputEl.value.length;
                    commentCharCounterEl.textContent = `${currentLength} / ${maxLength}`;
                    if (currentLength > maxLength) { commentCharCounterEl.style.color = 'red'; }
                    else { commentCharCounterEl.style.color = '#777'; }
                });
            }
        } else {
            if (threadTitleDetailEl) threadTitleDetailEl.textContent = 'スレッドが見つかりません';
            if (initialPostBodyEl) initialPostBodyEl.innerHTML = '<p>指定されたスレッドは存在しないか、削除された可能性があります。</p>';
        }
    } else {
        if (threadTitleDetailEl) threadTitleDetailEl.textContent = 'エラー';
        if (initialPostBodyEl) initialPostBodyEl.innerHTML = '<p>表示するスレッドのIDが指定されていません。</p>';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired. script.js MAIN execution started.");

    let userProfileFromStorage = localStorage.getItem('userProfile');
    let parsedProfile = userProfileFromStorage ? JSON.parse(userProfileFromStorage) : {};
    window.currentLoggedInUser = {
        name: parsedProfile.username || "座の人ユーザー",
        profileImageUrl: parsedProfile.profileImage || null
    };

    window.essays = [];
    window.popularEssaysData = [];
    window.mediaTimelineItems = [];
    window.allComments = {};
    window.threadSampleComments = {};

    // ★★★ スレッドデータの初期化処理をlocalStorage対応に修正 ★★★
    const storedThreads = localStorage.getItem('allThreads'); // キー名を統一
    if (storedThreads) {
        try {
            window.allThreadsSampleDataForLoggedInPage = JSON.parse(storedThreads);
            console.log("Loaded threads from localStorage.");
        } catch(e) {
            console.error("Failed to parse threads from localStorage, initializing with defaults.", e);
            initializeDefaultThreads();
        }
    } else {
        initializeDefaultThreads();
    }

    function initializeDefaultThreads() {
        console.log("Initializing threads with sample data and saving to localStorage.");
        window.allThreadsSampleDataForLoggedInPage = [
            { id: 'thread001', title: '今週末の天気とおすすめスポット', category: 'zatsudan', accessCount: 2580, commentCount: 35, createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), author: "管理人" },
            { id: 'thread002', title: 'あの新作映画、見た人いる？【ネタバレ注意】', category: 'tv', accessCount: 1890, commentCount: 152, createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), author: "ユーザーA" },
            { id: 'thread003', title: 'プログラミング学習で最初にぶつかる壁', category: 'work', accessCount: 1550, commentCount: 88, createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), author: "ユーザーB" },
            { id: 'thread004', title: '健康のための食生活改善レポート', category: 'zatsudan', accessCount: 1230, commentCount: 45, createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(), author: "ユーザーC" },
            { id: 'thread005', title: '最新AI技術の活用事例と倫理問題', category: 'news', accessCount: 2200, commentCount: 62, createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), author: "管理人" },
            { id: 'thread006', title: 'お気に入りのインディーズゲーム教えて！', category: 'game', accessCount: 980, commentCount: 180, createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(), author: "ユーザーA" },
            { id: 'thread007', title: '今期の覇権アニメはこれだ！徹底討論', category: 'anime', accessCount: 1750, commentCount: 210, createdAt: new Date(Date.now() - 86400000 * 2.5).toISOString(), author: "ユーザーB" },
            { id: 'thread008', title: '応援してるスポーツチームの現状と未来', category: 'sports', accessCount: 1100, commentCount: 75, createdAt: new Date(Date.now() - 86400000 * 0.8).toISOString(), author: "ユーザーC" },
            { id: 'thread009', title: '買ってよかったガジェット2024年上半期', category: 'zatsudan', accessCount: 1950, commentCount: 92, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), author: "管理人" },
            { id: 'thread010', title: '最近のテレビ番組、面白いの減った？', category: 'tv', accessCount: 850, commentCount: 130, createdAt: new Date(Date.now() - 86400000 * 6).toISOString(), author: "ユーザーA" },
        ];
        localStorage.setItem('allThreads', JSON.stringify(window.allThreadsSampleDataForLoggedInPage));
    }
    // ★★★ ここまで ★★★

    window.categoryDisplayNamesForLoggedInPage = {
        zatsudan: '雑談', news: 'ニュース', work: '会社・仕事', anime: 'アニメ', sports: 'スポーツ', tv: 'テレビ', game: 'ゲーム', unknown: 'その他'
    };
    window.sampleNotifications = [
        { id: 'noti001', type: 'comment', user: { name: 'コメントした人A', profileUrl: 'profile.html?user=userA' }, essay: { title: 'サイト開設のご挨拶', url: 'essay_detail.html?id=1' }, message: null, date: new Date(Date.now() - 3600000 * 2).toISOString(), read: false }, { id: 'noti002', type: 'follow', user: { name: '刮目した人B', profileUrl: 'profile.html?user=userB' }, essay: null, message: null, date: new Date(Date.now() - 3600000 * 5).toISOString(), read: true }, { id: 'noti003', type: 'system', user: null, essay: null, message: 'サイトメンテナンスのお知らせ：明日午前2時から3時まで、一時的にサイトをご利用いただけません。', date: new Date(Date.now() - 86400000 * 1).toISOString(), read: false }, { id: 'noti004', type: 'comment', user: { name: 'コメントした人C', profileUrl: 'profile.html?user=userC' }, essay: { title: '週末のハイキング記録', url: 'essay_detail.html?id=3' }, message: null, date: new Date(Date.now() - 86400000 * 2).toISOString(), read: true }
    ];

    window.initializeSampleEssays = function() {
        localStorage.removeItem('essays');
        const storedEssays = localStorage.getItem('essays');
        if (storedEssays) { window.essays = JSON.parse(storedEssays); }
        else {
            window.essays = [
                { id: 1, title: 'サイト開設のご挨拶', author: '管理人', snippet: 'このサイト「座の人」を開設しました。日々の雑記や思ったことを気ままに綴っていきます。', date: '2024-05-21', image: 'https://dummyimage.com/600x400/777/fff&text=Greeting+Image', videoUrl: null, body: 'このサイト「座の人」を開設しました。<br>日々の雑記や思ったことを気ままに綴っていきます。<br><br>どうぞよろしくお願いいたします。' },
                { id: 2, title: 'お気に入りのカフェ紹介 (動画あり)', author: 'ユーザーA', snippet: '最近見つけたカフェがとても素敵です。動画で雰囲気をご覧ください。', date: '2024-05-20', image: null, videoUrl: 'sample_video.mp4', body: '最近見つけたカフェがとても素敵です。<br>静かで落ち着いた雰囲気で、コーヒーも美味しい。<br>作業にも読書にもぴったりな空間です。お店の名前は「カフェ・ド・リラックス」。<br>ぜひ一度訪れてみてください。 (sample_video.mp4はローカルにダミーファイルを置いてください)' },
                { id: 3, title: '週末のハイキング記録', author: 'ユーザーB', snippet: '天気が良かったので、近くの山へハイキングに行ってきました。頂上からの景色は最高で、リフレッシュできました！', date: '2024-05-19', image: 'https://dummyimage.com/600x400/4CAF50/fff&text=Hiking+Detail', videoUrl: null, body: '天気が良かったので、近くの「見晴らし山」へハイキングに行ってきました。<br>片道約1時間半の道のりでしたが、新緑がとても綺麗で気持ちよかったです。<br>頂上からの景色は最高で、日頃の疲れも吹き飛びました！<br>お弁当も美味しかった。また行きたいです。' },
                { id: 4, title: '読んだ本の感想：思考の整理学', author: 'ユーザーC', snippet: '外山滋比古氏の「思考の整理学」を読みました。グライダー能力と飛行機能力の話が印象的。自分の思考プロセスを見直す良いきっかけになりました。', date: '2024-05-18', image: null, videoUrl: null, body: '外山滋比古氏の「思考の整理学」を読みました。<br>特に「グライダー能力」と「飛行機能力」の話が印象的でした。<br>情報を集めるだけでなく、それを自分なりに発酵させ、新しいアイデアを生み出すことの重要性を再認識しました。<br>自分の思考プロセスを見直す良いきっかけになった一冊です。' },
                { id: 5, title: '新しい趣味、始めました！', author: 'テストユーザー', snippet: '最近、料理を始めました。作るのも食べるのも楽しいです。美味しいパスタが作れるようになりたいな。', date: '2024-05-22', image: 'https://dummyimage.com/600x400/333/fff&text=Cooking+Detail', videoUrl: null, body: '最近、新しい趣味として料理を始めました！<br>これまであまり自炊をしてこなかったのですが、挑戦してみると意外と楽しくてハマっています。<br>作るのも食べるのも楽しいですね。<br>目下の目標は、美味しいペペロンチーノが作れるようになることです！' },
                { id: 6, title: '座の人ユーザーの日記１ (動画付き)', author: '座の人ユーザー', snippet: 'これは座の人ユーザーによる最初の投稿です。よろしくお願いします。', date: '2024-06-01', image: null, videoUrl: 'sample_video2.mp4', body: '座の人ユーザーです。<br>このミニブログで、日々の出来事や考えを共有していきたいと思います。<br>趣味は読書と散歩です。今日は散歩中に見つけた風景を動画でどうぞ。(sample_video2.mp4はローカルにダミーファイルを置いてください)' },
                { id: 7, title: '最近観た映画について', author: '座の人ユーザー', snippet: '先日、話題のSF映画を観てきました。映像美が素晴らしかったです。', date: '2024-06-05', image: null, videoUrl: null, body: '先日、話題のSF大作映画「ギャラクシー・アドベンチャーXX」を観てきました。<br>壮大な宇宙の映像美と、手に汗握るアクションシーンに圧倒されました。<br>ストーリーも感動的で、観終わった後しばらく余韻に浸っていました。おすすめです！' },
                { id: 8, title: '週末の予定', author: '座の人ユーザー', snippet: '今週末は、新しいカフェを開拓しに行く予定です。楽しみ！', date: '2024-06-10', image: 'https://dummyimage.com/600x400/ffc107/000&text=Weekend', videoUrl: null, body: '今週末の予定は…<br>土曜日は、最近オープンしたと噂のブックカフェに行ってみたいと思います。<br>美味しいコーヒーを飲みながら、ゆっくり読書ができたら最高ですね。<br>日曜日は、天気が良ければ公園でのんびり過ごそうかと考えています。' },
                { id: 9, title: 'プログラミング学習の進捗', author: '座の人ユーザー', snippet: 'JavaScriptの非同期処理について勉強中。なかなか難しいけど面白い。', date: '2024-06-15', image: null, videoUrl: null, body: '最近はJavaScriptの非同期処理（Promiseやasync/await）について集中的に勉強しています。<br>概念を理解するのがなかなか大変ですが、少しずつ分かってくると非常に面白いです。<br>実際にコードを書いて動かしてみるのが一番ですね。' },
                { id: 10, title: '今日のランチ', author: '座の人ユーザー', snippet: '今日は手作りパスタに挑戦。ペペロンチーノが上手にできた！', date: '2024-06-17', image: 'https://dummyimage.com/600x400/28a745/fff&text=Pasta', videoUrl: null, body: '今日のランチは、久しぶりに手作りパスタに挑戦しました。<br>念願のペペロンチーノです！<br>ニンニクと唐辛子の風味、オリーブオイルの乳化も上手くいって、過去最高の出来栄えでした。<br>やっぱり自分で作ると美味しいですね。' }
            ];
            localStorage.setItem('essays', JSON.stringify(window.essays));
        }
    };

    window.initializeSampleComments = function() {
        const storedComments = localStorage.getItem('allComments');
        if (storedComments) { window.allComments = JSON.parse(storedComments); }
        else {
            window.allComments = { 1: [ { author: '読者X', text: '開設おめでとうございます！楽しみにしています。', date: '2024-05-21T12:00:00Z' }, { author: '読者Y', text: '頑張ってください！', date: '2024-05-21T15:30:00Z' } ], 3: [ { author: 'ハイカーZ', text: '見晴らし山、いいですよね！私も好きです。', date: '2024-05-20T09:00:00Z' } ], 6: [ { author: 'コメントユーザーα', text: '初投稿おめでとうございます！応援しています。', date: new Date(Date.now() - 86400000 * 0.5).toISOString() } ], 7: [ { author: '映画好きβ', text: 'その映画、私も見ました！本当に最高でしたね！', date: new Date(Date.now() - 3600000 * 3).toISOString() } ] };
            localStorage.setItem('allComments', JSON.stringify(window.allComments));
        }
    };

    window.initializePopularEssaysData = function() {
        window.popularEssaysData = [ { id: 3, title: '週末のハイキング記録 (人気)', author: 'ユーザーB', snippet: '天気が良かったので、近くの山へハイキングに行ってきました。頂上からの景色は最高で、リフレッシュできました！', date: '2024-05-19', views: 105, image: 'https://dummyimage.com/600x400/4CAF50/fff&text=Hiking+Detail' }, { id: 1, title: 'サイト開設のご挨拶 (人気)', author: '管理人', snippet: 'このサイト「座の人」を開設しました。日々の雑記や思ったことを気ままに綴っていきます。', date: '2024-05-21', views: 98, image: 'https://dummyimage.com/600x400/777/fff&text=Greeting+Detail' }, { id: 10, title: '今日のランチ (人気)', author: '座の人ユーザー', snippet: '今日は手作りパスタに挑戦。ペペロンチーノが上手にできた！', date: '2024-06-17', views: 120, image: 'https://dummyimage.com/600x400/28a745/fff&text=Pasta' } ];
    };

    window.initializeMediaTimelineItems = function() {
        window.mediaTimelineItems = [];
        if (window.essays && window.essays.length > 0) {
            window.essays.forEach(essay => {
                if (essay.image) { window.mediaTimelineItems.push({ type: 'essay_image', mediaUrl: essay.image, thumbnailUrl: essay.image, essayId: essay.id, essayTitle: essay.title, author: essay.author, timestamp: new Date(essay.date).getTime(), linkUrl: `essay_detail.html?id=${essay.id}` }); }
                if (essay.videoUrl) { window.mediaTimelineItems.push({ type: 'essay_video', mediaUrl: essay.videoUrl, thumbnailUrl: 'video_thumb_icon.png', essayId: essay.id, essayTitle: essay.title, author: essay.author, timestamp: new Date(essay.date).getTime(), linkUrl: `essay_detail.html?id=${essay.id}` }); }
            });
        }
        window.mediaTimelineItems.sort((a, b) => b.timestamp - a.timestamp);
    };

    window.getQueryParam = function(param) { const urlParams = new URLSearchParams(window.location.search); return urlParams.get(param); };

    window.renderEssayTimeline = function(targetElement) { if (!targetElement) { return; } targetElement.innerHTML = ''; if (window.essays.length === 0) { targetElement.innerHTML = '<li>まだ随筆がありません。</li>'; return; } const sortedEssaysForTimeline = [...window.essays].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); sortedEssaysForTimeline.forEach((essay) => { const listItem = document.createElement('li'); listItem.classList.add('essay-item-logged-in'); listItem.innerHTML = `<div class="essay-title-container"><h4 class="essay-title-logged-in"><a href="essay_detail.html?id=${essay.id}">${escapeHtml(essay.title)}</a></h4><span class="essay-author-logged-in">投稿者: <a href="profile.html?user=${escapeHtml(String(essay.author))}">${escapeHtml(String(essay.author))}</a></span></div><p class="essay-snippet-logged-in">${escapeHtml(essay.snippet)}</p><p class="essay-meta-logged-in">投稿日: ${escapeHtml(essay.date)}</p>`; targetElement.appendChild(listItem); }); };
    
    window.renderPopularEssays = function(targetElement) { if (!targetElement) { return; } targetElement.innerHTML = ''; if (window.popularEssaysData.length === 0) { targetElement.innerHTML = '<li>現在、多く読まれた随筆はありません。</li>'; return; } window.popularEssaysData.forEach(essay => { const listItem = document.createElement('li'); listItem.classList.add('essay-item-logged-in'); listItem.innerHTML = `<div class="essay-title-container"><h4 class="essay-title-logged-in"><a href="essay_detail.html?id=${essay.id}">${escapeHtml(essay.title)}</a></h4><span class="essay-author-logged-in">投稿者: <a href="profile.html?user=${escapeHtml(String(essay.author))}">${escapeHtml(String(essay.author))}</a></span></div><p class="essay-snippet-logged-in">${escapeHtml(essay.snippet)}</p><p class="essay-meta-logged-in">投稿日: ${escapeHtml(essay.date)} / 閲覧数: ${essay.views || 0}</p>`; targetElement.appendChild(listItem); }); };

    window.renderRecentMedia = function(targetElement) { if (!targetElement) { return; } targetElement.innerHTML = ''; if (!window.mediaTimelineItems || window.mediaTimelineItems.length === 0) { targetElement.innerHTML = '<p>最近投稿された画像や動画はありません。</p>'; return; } window.mediaTimelineItems.forEach(item => { const mediaItemDiv = document.createElement('div'); mediaItemDiv.classList.add('recent-media-item'); let mediaHtml = ''; if (item.type === 'essay_image' && item.thumbnailUrl) { mediaHtml = `<img src="${escapeHtml(item.thumbnailUrl)}" alt="${escapeHtml(item.essayTitle || '画像')}">`; } else if (item.type === 'essay_video' && item.mediaUrl) { mediaHtml = `<video src="${escapeHtml(item.mediaUrl)}" poster="${escapeHtml(item.thumbnailUrl)}" autoplay loop muted playsinline preload="metadata" width="100%" height="100%" style="object-fit: cover;">お使いのブラウザは動画タグをサポートしていません。</video>`; } else { mediaHtml = '<p style="font-size:0.8em; padding:5px; text-align:center;">プレビュー不可</p>'; } let linkTitle = `投稿者: ${escapeHtml(item.author || item.userName || '不明')}`; if (item.essayTitle) { linkTitle += `\n随筆: ${escapeHtml(item.essayTitle)}`; } else if (item.type === 'essay_video') { linkTitle += `\n動画`; } else if (item.type === 'profile_image') { linkTitle += `\nプロフィール画像`; } mediaItemDiv.innerHTML = `<a href="${escapeHtml(item.linkUrl)}" title="${linkTitle}">${mediaHtml}</a>`; targetElement.appendChild(mediaItemDiv); }); };

    window.renderLoggedInActiveThreads = function(targetElement) { if (!targetElement) { return; } targetElement.innerHTML = ''; if (!window.allThreadsSampleDataForLoggedInPage || window.allThreadsSampleDataForLoggedInPage.length === 0) { targetElement.innerHTML = '<li>表示できるにぎやかなスレのデータがありません。</li>'; return; } const sortedByAccess = [...window.allThreadsSampleDataForLoggedInPage].sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0)).slice(0, 5); if (sortedByAccess.length === 0) { targetElement.innerHTML = '<li>現在、にぎやかなスレはありません。</li>'; return; } sortedByAccess.forEach((thread, index) => { const listItem = document.createElement('li'); const rank = index + 1; const crownHtml = getCrownHtml(rank); const categoryName = window.categoryDisplayNamesForLoggedInPage[thread.category] || window.categoryDisplayNamesForLoggedInPage.unknown; listItem.classList.add('thread-list-item'); listItem.innerHTML = `<div class="rank-display">${crownHtml}${rank}位</div><div class="thread-info-container"><div><span class="thread-category-badge">${escapeHtml(categoryName)}</span><a href="thread_detail.html?id=${thread.id}" class="thread-title-link">${escapeHtml(thread.title)}</a></div><div class="thread-stats">アクセス数: ${thread.accessCount || 0}</div></div>`; targetElement.appendChild(listItem); }); };

    window.initializeTabs = function(tabButtonSelector, tabContentSelector, initialTabId) { const tabButtons = document.querySelectorAll(tabButtonSelector); const tabContents = document.querySelectorAll(tabContentSelector); if (tabButtons.length === 0 || tabContents.length === 0) { return; } function showTab(tabId) { tabContents.forEach(content => { content.classList.remove('active'); if (content.id === tabId) { content.classList.add('active'); } }); tabButtons.forEach(button => { button.classList.remove('active'); if (button.dataset.tab === tabId) { button.classList.add('active'); } }); } tabButtons.forEach(button => { button.addEventListener('click', () => { showTab(button.dataset.tab); }); }); if (initialTabId && document.getElementById(initialTabId)) { showTab(initialTabId); } else if (tabButtons.length > 0) { showTab(tabButtons[0].dataset.tab); } };

    window.renderEssayDetail = function(essayId, elements) { const idToFind = parseInt(essayId, 10); const essay = window.essays.find(e => e.id === idToFind); if (!essay) { if(elements.title)elements.title.textContent='随筆が見つかりません';if(elements.text)elements.text.innerHTML='<p>指定されたIDの随筆は存在しないか、削除された可能性があります。</p>';if(elements.author)elements.author.textContent='';if(elements.datetime)elements.datetime.textContent='';if(elements.imageContainer)elements.imageContainer.style.display='none';if(elements.videoContainer)elements.videoContainer.style.display='none';if(elements.commentsList)elements.commentsList.innerHTML='';if(elements.commentForm)elements.commentForm.style.display='none'; return; } if (elements.commentForm) elements.commentForm.style.display = 'block'; if (elements.title) elements.title.textContent = essay.title; if (elements.author) elements.author.innerHTML = `投稿者: <a href="profile.html?user=${escapeHtml(String(essay.author))}">${escapeHtml(String(essay.author))}</a>`; if (elements.datetime) { elements.datetime.textContent = `投稿日時: ${new Date(essay.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}`; elements.datetime.setAttribute('datetime', new Date(essay.date).toISOString()); } if (essay.image && elements.imageContainer && elements.image) { elements.image.src = escapeHtml(essay.image); elements.image.alt = `随筆画像: ${escapeHtml(essay.title)}`; elements.imageContainer.style.display = 'block'; } else if (elements.imageContainer) { elements.imageContainer.style.display = 'none'; } if (essay.videoUrl && elements.videoContainer && elements.video) { elements.video.src = escapeHtml(essay.videoUrl); elements.videoContainer.style.display = 'block'; } else if (elements.videoContainer) { elements.videoContainer.style.display = 'none'; } if (elements.text) elements.text.innerHTML = essay.body ? essay.body.replace(/\n/g, '<br>') : '<p>本文がありません。</p>'; window.renderCommentsForEssay(idToFind, elements.commentsList); };

    window.renderCommentsForEssay = function(essayId, targetElement) { if (!targetElement) { return;} targetElement.innerHTML = ''; const essayComments = window.allComments[essayId] || []; if (essayComments.length === 0) { const noCommentItem = document.createElement('div'); noCommentItem.classList.add('comment-item'); noCommentItem.textContent = 'まだコメントはありません。'; targetElement.appendChild(noCommentItem); return; } essayComments.forEach(comment => { const commentItem = document.createElement('div'); commentItem.classList.add('comment-item'); commentItem.innerHTML = `<p class="comment-author">${escapeHtml(comment.author)}</p><p class="comment-text">${escapeHtml(comment.text)}</p><p class="comment-date"><time datetime="${new Date(comment.date).toISOString()}">${new Date(comment.date).toLocaleString('ja-JP')}</time></p>`; targetElement.appendChild(commentItem); }); };

    window.handleCommentSubmit = function(event, essayIdToSubmit, elements) { event.preventDefault(); const commentTextInput = document.getElementById('comment-text-input'); if (!commentTextInput) { return; } const commentText = commentTextInput.value.trim(); if (commentText && essayIdToSubmit && window.currentLoggedInUser && window.currentLoggedInUser.name) { const newComment = { author: window.currentLoggedInUser.name, text: commentText, date: new Date().toISOString() }; if (!window.allComments[essayIdToSubmit]) { window.allComments[essayIdToSubmit] = []; } window.allComments[essayIdToSubmit].push(newComment); localStorage.setItem('allComments', JSON.stringify(window.allComments)); window.renderCommentsForEssay(essayIdToSubmit, elements.commentsList); commentTextInput.value = ''; } };

    window.renderNotifications = function(targetElement) { if (!targetElement) { return; } targetElement.innerHTML = ''; if (!window.sampleNotifications || window.sampleNotifications.length === 0) { targetElement.innerHTML = '<li class="notification-item"><div class="notification-content"><p class="notification-text">新しい通知はありません。</p></div></li>'; return; } const sortedNotifications = [...window.sampleNotifications].sort((a, b) => new Date(b.date) - new Date(a.date)); sortedNotifications.forEach(noti => { const listItem = document.createElement('li'); listItem.classList.add('notification-item'); if (noti.read === false) { listItem.classList.add('notification-unread'); } let iconHtml = ''; let textHtml = ''; const notificationDate = new Date(noti.date); switch (noti.type) { case 'comment': iconHtml = '<span class="notification-icon">💬</span>'; textHtml = `<a href="${escapeHtml(noti.user.profileUrl)}">${escapeHtml(noti.user.name)}</a>さんがあなたの随筆「<a href="${escapeHtml(noti.essay.url)}">${escapeHtml(noti.essay.title)}</a>」にコメントしました。`; break; case 'follow': iconHtml = '<span class="notification-icon">👀</span>'; textHtml = `<a href="${escapeHtml(noti.user.profileUrl)}">${escapeHtml(noti.user.name)}</a>さんがあなたを刮目し始めました。`; break; case 'system': iconHtml = '<span class="notification-icon">📢</span>'; textHtml = escapeHtml(noti.message); break; default: iconHtml = '<span class="notification-icon">ℹ️</span>'; textHtml = '新しい通知があります。'; } listItem.innerHTML = `${iconHtml}<div class="notification-content"><p class="notification-text">${textHtml}</p><p class="notification-date"><time datetime="${notificationDate.toISOString()}">${notificationDate.toLocaleString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time></p></div>`; targetElement.appendChild(listItem); }); };

    window.renderPastEssaysList = function(targetElement) { if (!targetElement) { return; } targetElement.innerHTML = ''; if (!window.essays || window.essays.length === 0) { const li = document.createElement('li'); li.classList.add('past-essay-list-item'); li.textContent = '過去の随筆はありません。'; targetElement.appendChild(li); return; } const sortedPastEssays = [...window.essays].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); sortedPastEssays.forEach(essay => { const listItem = document.createElement('li'); listItem.classList.add('past-essay-list-item'); const commentCount = (window.allComments[essay.id] || []).length; let snippetText = ''; if (essay.body) { const firstBrIndex = essay.body.indexOf('<br>'); if (firstBrIndex !== -1) { snippetText = essay.body.substring(0, firstBrIndex); } else { snippetText = essay.body.substring(0, 50) + (essay.body.length > 50 ? '...' : ''); } } snippetText = escapeHtml(snippetText.replace(/<[^>]+>/g, '')); listItem.innerHTML = `<a href="essay_detail.html?id=${essay.id}"><span class="past-essay-list-title">${escapeHtml(essay.title)}</span><span class="past-essay-list-meta">投稿日: ${new Date(essay.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })} | コメント: ${commentCount}件</span><p class="past-essay-list-snippet">${snippetText}</p></a>`; targetElement.appendChild(listItem); }); };

    window.renderRecentProfileEssays = function(targetElement, authorName) { if (!targetElement) { return; } targetElement.innerHTML = ''; if (!window.essays || window.essays.length === 0) { const li = document.createElement('li'); li.classList.add('essay-item-logged-in'); li.style.padding = "10px 15px"; li.textContent = 'まだ随筆がありません。(全体)'; targetElement.appendChild(li); return; } const userEssays = window.essays.filter(essay => essay.author === authorName); const sortedUserEssays = [...userEssays].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5); if (sortedUserEssays.length === 0) { const li = document.createElement('li'); li.classList.add('essay-item-logged-in'); li.style.padding = "10px 15px"; li.textContent = `ユーザー「${escapeHtml(authorName)}」の随筆はまだありません。`; targetElement.appendChild(li); return; } sortedUserEssays.forEach(essay => { const listItem = document.createElement('li'); listItem.classList.add('essay-item-logged-in'); listItem.innerHTML = `<div class="essay-title-container"><h4 class="essay-title-logged-in"><a href="essay_detail.html?id=${essay.id}">${escapeHtml(essay.title)}</a></h4></div><p class="essay-snippet-logged-in">${escapeHtml(essay.snippet)}</p><p class="essay-meta-logged-in">投稿日: ${escapeHtml(essay.date)}</p>`; targetElement.appendChild(listItem); }); };

    window.renderThreadComments = function(targetElement, threadId) {
        if (!targetElement) { return; } targetElement.innerHTML = '';
        if (!window.threadSampleComments[threadId]) {
            window.threadSampleComments[threadId] = [
                { author: window.currentLoggedInUser.name, text: `これはスレッドID「${threadId}」への最初のコメントのサンプルです！`, date: new Date(Date.now() - 3600000 * 2 * Math.random()).toISOString() },
                { author: window.currentLoggedInUser.name, text: 'ふむふむ、なるほどですね。これは2番目のコメント。', date: new Date(Date.now() - 3600000 * 1 * Math.random()).toISOString() }
            ];
        }
        const currentThreadComments = window.threadSampleComments[threadId] || [];
        if (currentThreadComments.length === 0) { const noCommentItem = document.createElement('div'); noCommentItem.classList.add('comment-item'); noCommentItem.textContent = 'まだコメントはありません。'; targetElement.appendChild(noCommentItem); return; }
        const sortedComments = [...currentThreadComments].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        sortedComments.forEach((comment, index) => {
            const commentItem = document.createElement('div'); commentItem.classList.add('comment-item'); const commentDate = new Date(comment.date);
            const commentNumber = index + 1;
            const commentAuthorLink = `<a href="profile.html">${escapeHtml(comment.author)}</a>`;
            commentItem.innerHTML = `
                <p class="comment-meta">
                    <span class="comment-number">${commentNumber}.</span>
                    <span class="comment-author">${commentAuthorLink}</span>
                    <time class="comment-date" datetime="${commentDate.toISOString()}">${commentDate.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</time>
                </p>
                <p class="comment-text">${escapeHtml(comment.text)}</p>`;
            targetElement.appendChild(commentItem);
        });
    };

    // --- 共通のデータ初期化の呼び出し ---
    window.initializeSampleEssays();
    window.initializeSampleComments();

    console.log("script.js: Main DOMContentLoaded listener finished. Waiting for inline script callbacks (HTML files will call global init functions).");
});