// category.js
document.addEventListener('DOMContentLoaded', () => {
    const categoryNameDisplay = document.getElementById('category-name-display');
    const categoryThreadsList = document.getElementById('category-threads-list');
    const newThreadTitleInput = document.getElementById('new-thread-title');
    const createNewThreadButton = document.getElementById('create-new-thread-button');
    const newThreadCharCounter = document.getElementById('new-thread-char-counter');

    let currentCategory = '';
    if (typeof currentCategoryForPage !== 'undefined') {
        currentCategory = currentCategoryForPage;
    } else {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);
        if (filename.startsWith('category_')) {
            currentCategory = filename.replace('category_', '').replace('.html', '');
        }
        // console.warn('currentCategoryForPage is not defined in HTML. Falling back to filename-based detection.');
    }

    if (!currentCategory) {
        console.error('Category could not be determined for this page.');
        if(categoryNameDisplay) categoryNameDisplay.textContent = 'カテゴリ不明';
        if(createNewThreadButton) createNewThreadButton.disabled = true;
        if(newThreadTitleInput) newThreadTitleInput.disabled = true;
        return;
    }

    if (categoryNameDisplay) {
        const categoryDisplayNames = window.categoryDisplayNamesForLoggedInPage || {};
        const displayName = categoryDisplayNames[currentCategory] || currentCategory;
        categoryNameDisplay.textContent = displayName + 'スレッド一覧';
        const postFormH3 = document.querySelector('.post-form h3');
        if (postFormH3) {
            postFormH3.textContent = `新しいスレッドを「${displayName}」に作成`;
        }
    }
    
    let allBulletinBoards = window.allThreadsSampleDataForLoggedInPage || [];

    renderCategoryThreads();

    if (newThreadTitleInput && newThreadCharCounter) {
        const maxLength = parseInt(newThreadTitleInput.getAttribute('maxlength'), 10) || 30;
        newThreadCharCounter.textContent = `${newThreadTitleInput.value.length} / ${maxLength}`;
        newThreadTitleInput.addEventListener('input', () => {
            const currentLength = newThreadTitleInput.value.length;
            newThreadCharCounter.textContent = `${currentLength} / ${maxLength}`;
            if (currentLength > maxLength) {
                newThreadCharCounter.style.color = 'red';
            } else {
                newThreadCharCounter.style.color = '#777';
            }
        });
    }

    if (createNewThreadButton && newThreadTitleInput) {
        createNewThreadButton.addEventListener('click', () => {
            const title = newThreadTitleInput.value.trim();
            const maxLength = parseInt(newThreadTitleInput.getAttribute('maxlength'), 10) || 30;
            if (title === '') { alert('スレッド名を入力してください。'); return; }
            if (title.length > maxLength) { alert(`スレッド名は${maxLength}文字以内で入力してください。`); return; }

            const newThread = {
                id: 'thread-' + Date.now(),
                title: title,
                category: currentCategory,
                createdAt: new Date().toISOString(),
                accessCount: 1,
                commentCount: 1,
                author: window.currentLoggedInUser ? window.currentLoggedInUser.name : "ゲスト"
            };
            
            window.allThreadsSampleDataForLoggedInPage.push(newThread);
            saveAllThreads();

            renderCategoryThreads();
            newThreadTitleInput.value = '';
            
            if (newThreadCharCounter) {
                newThreadCharCounter.textContent = `0 / ${maxLength}`;
                newThreadCharCounter.style.color = '#777';
            }
            alert('新しいスレッドを作成しました！');
        });
    }

    function renderCategoryThreads() {
        if (!categoryThreadsList) return;
        categoryThreadsList.innerHTML = '';
        const threadsInThisCategory = allBulletinBoards.filter(board => board.category === currentCategory)
                                             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (threadsInThisCategory.length === 0) {
            categoryThreadsList.innerHTML = '<li>このカテゴリにはまだスレッドがありません。最初のスレッドを作成しましょう！</li>';
            return;
        }
        threadsInThisCategory.forEach(thread => {
            const listItem = document.createElement('li');
            const postDate = new Date(thread.createdAt);
            const formattedTimestamp = `${postDate.getFullYear()}/${String(postDate.getMonth() + 1).padStart(2, '0')}/${String(postDate.getDate()).padStart(2, '0')}`;
            
            if (typeof escapeHtml !== 'function') {
                console.error("escapeHtml function from script.js is not available.");
                return;
            }
            
            listItem.innerHTML = `
                <a href="thread_detail.html?id=${thread.id}" class="thread-title-link">${escapeHtml(thread.title)}</a>
                <div class="thread-meta">
                    <span>作成日: ${formattedTimestamp}</span>
                    <span>コメント: ${thread.commentCount || 0}</span>
                </div>
            `;
            categoryThreadsList.appendChild(listItem);
        });
    }

    function saveAllThreads() {
        localStorage.setItem('allThreads', JSON.stringify(window.allThreadsSampleDataForLoggedInPage));
        console.log("All threads data saved to localStorage.");
    }
});