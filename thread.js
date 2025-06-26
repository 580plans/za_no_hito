// thread.js

// ★ initializeThreadDetailPage をグローバル関数として定義
function initializeThreadDetailPage() {
    console.log("Attempting to initialize thread_detail.html MAIN CONTENT (from thread.js)...");

    const threadTitleElement = document.getElementById('thread-title-detail');
    const threadAuthorElement = document.getElementById('thread-author-detail');
    const threadCreatedAtElement = document.getElementById('thread-created-at-detail');
    const threadCategoryElement = document.getElementById('thread-category-detail');
    const initialPostSectionElement = document.querySelector('.thread-initial-post');
    const initialPostAuthorElement = document.getElementById('initial-post-author');
    const initialPostDateElement = document.getElementById('initial-post-date');
    const initialPostBodyElement = document.getElementById('initial-post-body');
    const commentsListElement = document.getElementById('thread-comments-list');
    const commentFormElement = document.getElementById('comment-form');
    const commentTextInput = document.getElementById('comment-text-input');
    const commentCharCounter = document.getElementById('comment-char-counter');

    if (typeof window.getQueryParam !== 'function' || typeof escapeHtml !== 'function' || !window.allThreadsSampleDataForLoggedInPage || !window.categoryDisplayNamesForLoggedInPage || !window.currentLoggedInUser) {
        console.error("Required global functions or data from script.js are not available in thread.js!");
        if(threadTitleElement) threadTitleElement.textContent = 'ページ初期化エラー';
        return;
    }

    const threadId = window.getQueryParam('id');
    console.log("[thread.js] URL Parameter threadId:", threadId); // ★追加: threadIdのログ
    // ★追加: スレッドデータ全体のログ（長くなるので注意、確認後コメントアウト推奨）
    // console.log("[thread.js] All threads data for lookup:", JSON.parse(JSON.stringify(window.allThreadsSampleDataForLoggedInPage)));

    const loggedInUserName = window.currentLoggedInUser.name || "ゲスト";

    if (!threadId) {
        if (threadTitleElement) threadTitleElement.textContent = 'エラー';
        if (initialPostBodyElement) initialPostBodyElement.innerHTML = '<p>表示するスレッドのIDが指定されていません。</p>';
        if (commentFormElement) commentFormElement.style.display = 'none';
        if (initialPostSectionElement) initialPostSectionElement.style.display = 'block';
        if (commentsListElement) commentsListElement.innerHTML = '';
        console.error("Thread ID not found in URL for thread_detail.html.");
        return;
    }

    const currentThread = window.allThreadsSampleDataForLoggedInPage.find(t => t.id === threadId);
    console.log("[thread.js] Found thread data:", currentThread); // ★追加: 見つかったスレッドデータのログ

    if (currentThread) {
        if (threadTitleElement) threadTitleElement.textContent = escapeHtml(currentThread.title);
        if (threadAuthorElement) {
            const threadCreator = currentThread.author || loggedInUserName;
            threadAuthorElement.innerHTML = `作成者: <a href="profile.html">${escapeHtml(threadCreator)}</a>`;
        }
        if (threadCreatedAtElement) {
            const createdDate = new Date(currentThread.createdAt);
            threadCreatedAtElement.textContent = `作成日時: ${createdDate.toLocaleDateString('ja-JP')} ${createdDate.toLocaleTimeString('ja-JP')}`;
            threadCreatedAtElement.setAttribute('datetime', createdDate.toISOString());
        }
        if (threadCategoryElement) {
            threadCategoryElement.textContent = `カテゴリ: ${escapeHtml(window.categoryDisplayNamesForLoggedInPage[currentThread.category] || currentThread.category)}`;
        }

        const currentThreadCommentsData = window.threadSampleComments[threadId] || [];
        if (initialPostSectionElement && initialPostBodyElement) {
            if (currentThreadCommentsData.length === 0 && (!currentThread.initialPostContent || currentThread.initialPostContent.trim() === '')) {
                initialPostSectionElement.style.display = 'block';
                initialPostBodyElement.innerHTML = '<p style="color: #777; font-style: italic;">このスレに投稿した人はまだいません。1げとのチャンスです。</p>';
                if (initialPostAuthorElement) initialPostAuthorElement.style.display = 'none';
                if (initialPostDateElement) initialPostDateElement.style.display = 'none';
                if (commentFormElement) commentFormElement.style.display = 'block';
            } else if (currentThread.initialPostContent) {
                initialPostSectionElement.style.display = 'block';
                if (initialPostAuthorElement) initialPostAuthorElement.innerHTML = `<a href="profile.html">${escapeHtml(currentThread.author || loggedInUserName)}</a>`;
                if (initialPostDateElement) {
                     const postDate = new Date(currentThread.createdAt);
                     initialPostDateElement.textContent = `${postDate.toLocaleDateString('ja-JP')} ${postDate.toLocaleTimeString('ja-JP')}`;
                     initialPostDateElement.setAttribute('datetime', postDate.toISOString());
                }
                initialPostBodyElement.innerHTML = `<p>${escapeHtml(currentThread.initialPostContent).replace(/\n/g, '<br>')}</p>`;
                if (commentFormElement) commentFormElement.style.display = 'block';
            } else {
                initialPostSectionElement.style.display = 'none';
                if (commentFormElement) commentFormElement.style.display = 'block';
            }
        }

        if (commentsListElement) {
            window.renderThreadComments(commentsListElement, threadId);
        }

        if (commentFormElement && commentTextInput && commentCharCounter) {
            const maxLength = parseInt(commentTextInput.getAttribute('maxlength'), 10) || 100;
            commentCharCounter.textContent = `${commentTextInput.value.length} / ${maxLength}`;
            commentTextInput.addEventListener('input', () => { /* ... (変更なし) ... */ });
            const submitThreadCommentHandler = (event) => { /* ... (変更なし) ... */ };
            if (commentFormElement._submitHandler) { commentFormElement.removeEventListener('submit', commentFormElement._submitHandler); }
            commentFormElement.addEventListener('submit', submitThreadCommentHandler);
            commentFormElement._submitHandler = submitThreadCommentHandler;
        }

    } else { // currentThread が見つからなかった場合
        if (threadTitleElement) threadTitleElement.textContent = 'スレッドが見つかりません';
        if (initialPostSectionElement) initialPostSectionElement.style.display = 'block'; // メッセージ表示のため表示
        if (initialPostBodyElement) initialPostBodyElement.innerHTML = '<p>指定されたスレッドは存在しないか、削除された可能性があります。</p>';
        if (commentFormElement) commentFormElement.style.display = 'none';
        if (commentsListElement) commentsListElement.innerHTML = '';
        console.warn("[thread.js] Thread data not found for ID:", threadId); // ★追加: 警告ログ
    }
    console.log("Finished initializing thread_detail.html MAIN CONTENT (from thread.js).");
}