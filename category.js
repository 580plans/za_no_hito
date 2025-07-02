// category.js
document.addEventListener('DOMContentLoaded', () => {
    // ... (DOM要素取得とカテゴリ特定ロジックは変更なし) ...

    let allBulletinBoards = window.allThreadsSampleDataForLoggedInPage || [];

    // ... (カテゴリ名表示、文字数カウンター処理は変更なし) ...

    const createNewThreadButton = document.getElementById('create-new-thread-button');
    if (createNewThreadButton) {
        createNewThreadButton.addEventListener('click', () => {
            const newThreadTitleInput = document.getElementById('new-thread-title');
            const title = newThreadTitleInput.value.trim();
            if (title === '') { alert('スレッド名を入力してください。'); return; }

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
            saveAllThreads(); // ★ 保存関数を呼び出す

            renderCategoryThreads();
            newThreadTitleInput.value = '';
            
            const newThreadCharCounter = document.getElementById('new-thread-char-counter');
            if (newThreadCharCounter) {
                const maxLength = parseInt(newThreadTitleInput.getAttribute('maxlength'), 10) || 30;
                newThreadCharCounter.textContent = `0 / ${maxLength}`;
                newThreadCharCounter.style.color = '#777';
            }
            
            alert('新しいスレッドを作成しました！');
        });
    }

    function renderCategoryThreads() {
        // ... (この関数内のロジックは変更なし) ...
    }

    function saveAllThreads() {
        localStorage.setItem('allThreads', JSON.stringify(window.allThreadsSampleDataForLoggedInPage));
        console.log("All threads data saved to localStorage.");
    }
});