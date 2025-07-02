// thread.js

// thread_detail.html のメインコンテンツを初期化/描画するグローバル関数
function initializeThreadDetailPage() {
    console.log("Attempting to initialize thread_detail.html MAIN CONTENT (from thread.js)...");

    // ページ内の要素を取得
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

    // 依存するグローバル関数・データの存在チェック
    if (typeof window.getQueryParam !== 'function' || typeof escapeHtml !== 'function' || !window.allThreadsSampleDataForLoggedInPage || !window.categoryDisplayNamesForLoggedInPage || !window.currentLoggedInUser) {
        console.error("Required global functions or data from script.js are not available in thread.js!");
        if(threadTitleElement) threadTitleElement.textContent = 'ページ初期化エラー';
        return;
    }

    const threadId = window.getQueryParam('id');
    const loggedInUserName = window.currentLoggedInUser.name || "ゲスト";

    if (!threadId) {
        if (threadTitleElement) threadTitleElement.textContent = 'エラー';
        if (initialPostSectionElement) initialPostSectionElement.style.display = 'block';
        if (initialPostBodyElement) initialPostBodyElement.innerHTML = '<p>表示するスレッドのIDが指定されていません。</p>';
        if (commentFormElement) commentFormElement.style.display = 'none';
        if (commentsListElement) commentsListElement.innerHTML = '';
        console.error("Thread ID not found in URL for thread_detail.html.");
        return;
    }

    const currentThread = window.allThreadsSampleDataForLoggedInPage.find(t => t.id === threadId);
    console.log("[thread.js] Found thread data:", currentThread);

    if (currentThread) {
        // --- スレッド情報の表示 ---
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

        // ★★★ 最初の投稿エリアの表示ロジックを修正 ★★★
        if (initialPostSectionElement) {
            initialPostSectionElement.style.display = 'block'; // 常に表示する
            
            // 投稿者と日時を常に表示
            if (initialPostAuthorElement) {
                 const postAuthor = currentThread.author || loggedInUserName; // スレッド作成者を最初の投稿者とする
                 initialPostAuthorElement.innerHTML = `<a href="profile.html">${escapeHtml(postAuthor)}</a>`;
                 initialPostAuthorElement.style.display = 'block';
            }
            if (initialPostDateElement) {
                 const postDate = new Date(currentThread.createdAt);
                 initialPostDateElement.textContent = `${postDate.toLocaleDateString('ja-JP')} ${postDate.toLocaleTimeString('ja-JP')}`;
                 initialPostDateElement.setAttribute('datetime', postDate.toISOString());
                 initialPostDateElement.style.display = 'block';
            }
            // 本文を表示 (もしデータに本文があればそれを、なければ仮のテキストを表示)
            if (initialPostBodyElement) {
                 // 将来的にはスレッド作成時に本文を保存するようになったら、そのデータを参照する
                 // 例: currentThread.initialPostContent
                 const initialContent = currentThread.initialPostContent || `これは「${currentThread.title}」スレッドの最初の投稿のサンプル本文です。`;
                 initialPostBodyElement.innerHTML = `<p>${escapeHtml(initialContent).replace(/\n/g, '<br>')}</p>`;
            }
        }
        // ★★★ ここまで修正 ★★★
        
        // --- コメントリストの表示 ---
        if (commentsListElement) {
            window.renderThreadComments(commentsListElement, threadId);
        }

        // --- コメントフォームの処理 ---
        if (commentFormElement && commentTextInput && commentCharCounter) {
            const maxLength = parseInt(commentTextInput.getAttribute('maxlength'), 10) || 100;
            commentCharCounter.textContent = `${commentTextInput.value.length} / ${maxLength}`;
            
            commentTextInput.addEventListener('input', () => {
                const currentLength = commentTextInput.value.length;
                commentCharCounter.textContent = `${currentLength} / ${maxLength}`;
                if (currentLength > maxLength) {
                    commentCharCounter.style.color = 'red';
                } else {
                    commentCharCounter.style.color = '#777';
                }
            });

            const submitThreadCommentHandler = (event) => {
                event.preventDefault();
                const commentText = commentTextInput.value.trim();
                if (commentText && threadId && window.currentLoggedInUser && window.currentLoggedInUser.name) {
                    const newComment = {
                        author: window.currentLoggedInUser.name,
                        text: commentText,
                        date: new Date().toISOString()
                    };
                    if (!window.threadSampleComments[threadId]) {
                        window.threadSampleComments[threadId] = [];
                    }
                    window.threadSampleComments[threadId].push(newComment);
                    window.renderThreadComments(commentsListElement, threadId);
                    commentTextInput.value = '';
                    commentCharCounter.textContent = `0 / ${maxLength}`;
                } else {
                    console.warn("Thread comment submission failed. Missing data.");
                }
            };
            if (commentFormElement._submitHandler) {
                commentFormElement.removeEventListener('submit', commentFormElement._submitHandler);
            }
            commentFormElement.addEventListener('submit', submitThreadCommentHandler);
            commentFormElement._submitHandler = submitThreadCommentHandler;
        }

    } else { // currentThread が見つからなかった場合
        if (threadTitleElement) threadTitleElement.textContent = 'スレッドが見つかりません';
        if (initialPostSectionElement) {
            initialPostSectionElement.style.display = 'block';
            if(initialPostAuthorElement) initialPostAuthorElement.style.display = 'none';
            if(initialPostDateElement) initialPostDateElement.style.display = 'none';
            if (initialPostBodyElement) initialPostBodyElement.innerHTML = '<p>指定されたスレッドは存在しないか、削除された可能性があります。</p>';
        }
        if (commentFormElement) commentFormElement.style.display = 'none';
        if (commentsListElement) commentsListElement.innerHTML = '';
        console.warn("[thread.js] Thread data not found for ID:", threadId);
    }
    console.log("Finished initializing thread_detail.html MAIN CONTENT (from thread.js).");
}