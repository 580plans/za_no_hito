document.addEventListener('DOMContentLoaded', () => {
    const threadTitleElement = document.getElementById('thread-title');
    const originalPostElement = document.getElementById('original-post');
    const repliesListElement = document.getElementById('replies-list');
    const replyContentInput = document.getElementById('reply-content');
    const replyButton = document.getElementById('reply-button');

    // URLから投稿IDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));

    let posts = [];

    // ローカルストレージから投稿を読み込む
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
        posts = JSON.parse(storedPosts);
        renderThread();
    }

    function renderThread() {
        const post = posts.find(p => p.id === postId);
        if (post) {
            threadTitleElement.textContent = post.title || '(無題)';
            // 元の投稿内容は表示しないため、ここでは何もしません
            renderReplies(post.replies);
        } else {
            threadTitleElement.textContent = 'スレッドが見つかりません';
        }
    }

    function renderReplies(replies) {
        repliesListElement.innerHTML = '';
        replies.forEach((reply, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="reply-header">
                    <div class="reply-meta">${index + 1}</div>
                    <div class="reply-meta">${reply.timestamp}</div>
                </div>
                <div class="reply-content">${escapeHtml(reply.content)}</div>
            `;
            repliesListElement.appendChild(listItem);
        });
    }

    replyButton.addEventListener('click', () => {
        const replyContent = replyContentInput.value.trim();
        if (replyContent !== '') {
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
                const newReply = {
                    id: Date.now(),
                    content: replyContent,
                    timestamp: new Date().toLocaleString()
                };
                posts[postIndex].replies.push(newReply);
                savePosts();
                renderThread();
                replyContentInput.value = '';
            }
        }
    });

    function savePosts() {
        localStorage.setItem('posts', JSON.stringify(posts));
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