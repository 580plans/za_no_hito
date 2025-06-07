// script.js
document.addEventListener('DOMContentLoaded', () => {
    // ... (既存のDOM要素取得処理はそのまま) ...
    const essayTimelineList = document.getElementById('essay-timeline');
    const essayTimelineLoggedInList = document.getElementById('essay-timeline-logged-in');
    const popularEssaysList = document.getElementById('popular-essays-list'); // ★ ここで表示を更新
    const recentEssayImagesTab = document.getElementById('recent-essay-images-tab');
    const activeThreadsListElement = document.getElementById('active-threads-list');

    const loginFormAside = document.getElementById('login-form-aside');
    const emailLoginInput = document.getElementById('email-login');
    const passwordLoginInput = document.getElementById('password-login');

    let essays = [];
    // ★ 人気の随筆用サンプルデータ (アクセス数を含む)
    let popularEssaysData = []; // ここに人気記事のデータを入れる
    let recentEssayImages = [];
    let activeThreads = [];

    // --- サンプルデータの初期化 ---
    function initializeSampleEssays() {
        essays = [
            // ... (既存のessaysデータはそのまま) ...
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

    // ★ 人気の随筆用サンプルデータを定義 (上位10件表示のため、10件以上用意)
    function initializePopularEssaysData() {
        popularEssaysData = [
            { id: 101, title: '話題のAI技術とその未来', content: 'AI技術は日々進化しており、私たちの生活を大きく変えようとしています。この記事では最新の動向と今後の展望を解説します。', timestamp: new Date('2024-07-22T11:00:00').toISOString(), author: { id: 'author001', name: 'テクノロジー愛好家' }, accessCount: 1520 },
            { id: 102, title: '簡単！週末ブランチレシピ集', content: '週末はちょっと贅沢なブランチで気分転換しませんか？手軽に作れるおしゃれなレシピを5つご紹介します。', timestamp: new Date('2024-07-22T09:30:00').toISOString(), author: { id: 'author002', name: '料理研究家S' }, accessCount: 1280 },
            { id: 103, title: '夏休みの国内旅行おすすめスポット', content: '今年の夏休みはどこへ行きますか？穴場から定番まで、満足できる国内旅行スポットを厳選しました。', timestamp: new Date('2024-07-21T18:00:00').toISOString(), author: { id: 'author003', name: '旅行ジャーナリストT' }, accessCount: 1150 },
            { id: 104, title: '在宅ワークの生産性を上げるコツ', content: '在宅ワークが続く中、集中力を維持するのは大変ですよね。生産性を格段に上げるための7つの秘訣をお教えします。', timestamp: new Date('2024-07-21T14:20:00').toISOString(), author: { id: 'author004', name: '効率化コンサルタント' }, accessCount: 1080 },
            { id: 105, title: '初心者向け資産運用ガイド', content: '将来のために資産運用を始めたいけど、何から手をつければいいかわからない…そんなあなたに贈る、基本の「き」。', timestamp: new Date('2024-07-22T08:00:00').toISOString(), author: { id: 'author005', name: 'FPアドバイザーM' }, accessCount: 990 },
            { id: 106, title: '愛猫との暮らしをもっと豊かにするアイデア', content: '猫との生活は素晴らしいものですが、ちょっとした工夫でさらに絆が深まります。愛猫家必見のヒント集。', timestamp: new Date('2024-07-20T20:00:00').toISOString(), author: { id: 'author006', name: '猫マスターK' }, accessCount: 920 },
            { id: 107, title: '心が疲れた時に読みたい名言集', content: '時には誰かの言葉に救われることがあります。あなたの心に寄り添う、古今東西の名言を集めました。', timestamp: new Date('2024-07-19T22:30:00').toISOString(), author: { id: 'author007', name: '言葉ソムリエ' }, accessCount: 880 },
            { id: 108, title: '家庭菜園始めました！夏野菜育成記録', content: 'ベランダでの小さな家庭菜園。トマトやキュウリの成長記録と、収穫の喜びをお届けします。', timestamp: new Date('2024-07-22T13:00:00').toISOString(), author: { id: 'author008', name: 'ガーデニング初心者Y' }, accessCount: 750 },
            { id: 109, title: '最新スマートフォン徹底比較レビュー', content: '2024年上半期に発売された注目のスマートフォンを、スペックから使い勝手まで詳細に比較します。', timestamp: new Date('2024-07-21T10:45:00').toISOString(), author: { id: 'author009', name: 'ガジェットブロガーG' }, accessCount: 720 },
            { id: 110, title: '映画「あの夏の約束」感想と考察', content: '先日公開された話題の映画「あの夏の約束」。感動のストーリーと、作中に隠されたメッセージを深く考察します。', timestamp: new Date('2024-07-20T16:00:00').toISOString(), author: { id: 'author010', name: '映画評論家E' }, accessCount: 680 },
            { id: 111, title: '隠れた名曲J-POPプレイリスト', content: 'あまり知られていないけれど、心に響くJ-POPの名曲たち。あなたのお気に入りが見つかるかも。', timestamp: new Date('2024-07-18T10:00:00').toISOString(), author: { id: 'author011', name: '音楽キュレーターZ' }, accessCount: 550 },
            { id: 112, title: 'プログラミング学習の始め方', content: 'プログラミングに興味があるけど、何から始めればいいの？現役エンジニアが初学者向けに解説します。', timestamp: new Date('2024-07-17T14:30:00').toISOString(), author: { id: 'author012', name: 'エンジニアP' }, accessCount: 430 },
        ];
        // 将来的にはここで localStorage から読み込む処理などが入る
    }
    initializePopularEssaysData(); // 人気記事データを初期化


    recentEssayImages = ['https://via.placeholder.com/80/800080/FFFFFF?text=Img1', 'https://via.placeholder.com/80/008000/FFFFFF?text=Img2', 'https://via.placeholder.com/80/FF0000/FFFFFF?text=Img3'];
    activeThreads = [{ id: 3, title: '活況スレッドBBS' }, { id: 4, title: '新機能のアイデア募集' }];


    // --- HTMLエスケープ関数 ---
    function escapeHtml(unsafe) {
        // ... (既存のescapeHtml関数はそのまま) ...
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

    // --- レンダリング関数 ---
    function renderEssayTimeline() {
        // ... (既存のrenderEssayTimeline関数はそのまま) ...
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
                        essayTimelineList.appendChild(listItem);
                    }
                });
            }
        }

        // logged_in.html 用のタイムライン処理 (「新規の随筆」タブ)
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
                        listItem.classList.add('essay-item-logged-in'); // 共通のスタイルクラス

                        let snippet = String(essay.content).split('\n')[0];
                        if (snippet.length > 80) {
                            snippet = snippet.substring(0, 80) + '...';
                        }

                        const postDate = new Date(essay.timestamp);
                        const formattedTimestamp = `${postDate.getFullYear()}/${String(postDate.getMonth() + 1).padStart(2, '0')}/${String(postDate.getDate()).padStart(2, '0')} ${String(postDate.getHours()).padStart(2, '0')}:${String(postDate.getMinutes()).padStart(2, '0')}`;
                        const essayDetailLink = `essay_detail.html?id=${essay.id}`;
                        const authorProfileLink = `profile.html?user_id=${essay.author.id}`;

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

    // ★「近頃多く読まれた随筆」タブのレンダリング関数を改修
    function renderPopularEssays() {
        if (popularEssaysList) { // #popular-essays-list が存在する場合
            popularEssaysList.innerHTML = ''; // 既存の内容をクリア

            // アクセス数でソートし、上位10件を取得
            const rankedEssays = [...popularEssaysData]
                .sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0))
                .slice(0, 10);

            if (Array.isArray(rankedEssays) && rankedEssays.length > 0) {
                rankedEssays.forEach((essay, index) => { // index を追加してランキング番号を表示することも可能
                    if (essay && essay.id && essay.title && typeof essay.content !== 'undefined' && essay.timestamp && essay.author && essay.author.id && essay.author.name) {
                        const listItem = document.createElement('li');
                        listItem.classList.add('essay-item-logged-in'); // 「新規の随筆」タブと同じスタイルクラスを使用

                        let snippet = String(essay.content).split('\n')[0];
                        if (snippet.length > 80) {
                            snippet = snippet.substring(0, 80) + '...';
                        }

                        const postDate = new Date(essay.timestamp);
                        const formattedTimestamp = `${postDate.getFullYear()}/${String(postDate.getMonth() + 1).padStart(2, '0')}/${String(postDate.getDate()).padStart(2, '0')} ${String(postDate.getHours()).padStart(2, '0')}:${String(postDate.getMinutes()).padStart(2, '0')}`;
                        const essayDetailLink = `essay_detail.html?id=${essay.id}`; // リンク先は適宜調整
                        const authorProfileLink = `profile.html?user_id=${essay.author.id}`; // リンク先は適宜調整

                        // ランキング番号を表示したい場合は、例えば以下のように h4 の前に挿入
                        // const rankNumber = index + 1;
                        // <span class="popular-rank-number">${rankNumber}. </span>
                        // 対応するCSSも必要: .popular-rank-number { font-weight: bold; margin-right: 5px; }

                        listItem.innerHTML = `
                            <div class="essay-title-container">
                                <h4 class="essay-title-logged-in"><a href="${essayDetailLink}">${escapeHtml(essay.title)}</a></h4>
                                <span class="essay-author-logged-in"><a href="${authorProfileLink}">${escapeHtml(essay.author.name)}</a></span>
                            </div>
                            <p class="essay-snippet-logged-in">${escapeHtml(snippet)}</p>
                            <p class="essay-meta-logged-in">投稿日時: ${formattedTimestamp} (アクセス数: ${essay.accessCount || 0})</p>
                        `;
                        popularEssaysList.appendChild(listItem);
                    }
                });
            } else {
                popularEssaysList.innerHTML = '<li>現在、多く読まれた随筆はありません。</li>';
            }
        }
        /*
        // 将来的なアクセス数リセット処理のイメージ
        function resetAccessCountsIfNeeded() {
            const now = new Date();
            const lastReset = localStorage.getItem('popularEssaysLastReset');
            const resetHour = 3; // 深夜3時

            // 簡単な日付比較: 日付が変わっていて、かつ現在の時間がリセット時間を過ぎているか
            // もっと正確な判定が必要な場合はライブラリ等検討
            if (!lastReset || new Date(lastReset).getDate() !== now.getDate()) {
                if (now.getHours() >= resetHour) {
                    popularEssaysData.forEach(essay => essay.accessCount = 0); // 仮のデータリセット
                    localStorage.setItem('popularEssaysData', JSON.stringify(popularEssaysData)); // 更新データを保存
                    localStorage.setItem('popularEssaysLastReset', now.toISOString());
                    console.log('Popular essays access counts reset.');
                    renderPopularEssays(); // 表示を更新
                }
            }
        }
        // ページ読み込み時や定期的に resetAccessCountsIfNeeded() を呼び出す
        // resetAccessCountsIfNeeded();
        */
    }


    function renderRecentEssayImages() {
        // ... (既存のrenderRecentEssayImages関数はそのまま) ...
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
        // ... (既存のrenderActiveThreads関数はそのまま) ...
        if (activeThreadsListElement) {
            activeThreadsListElement.innerHTML = '';
            if (Array.isArray(activeThreads)) {
                activeThreads.forEach(thread => {
                    if (thread && typeof thread.id !== 'undefined' && typeof thread.title !== 'undefined') {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<a href="bulletinboard.html?thread_id=${thread.id}">${escapeHtml(String(thread.title))}</a>`;
                        activeThreadsListElement.appendChild(listItem);
                    }
                });
            }
        }
    }

    // --- タブ切り替え機能の共通化 ---
    function initializeTabs(tabButtonSelector, tabContentSelector, initialTabId) {
        // ... (既存のinitializeTabs関数はそのまま) ...
        const tabButtons = document.querySelectorAll(tabButtonSelector);
        const tabContents = document.querySelectorAll(tabContentSelector);

        if (tabButtons.length === 0 || tabContents.length === 0) {
            return;
        }

        function showTab(tabId) {
            tabButtons.forEach(btn => {
                if (btn.dataset.tab === tabId) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabToShow = button.dataset.tab;
                showTab(tabToShow);
            });
        });

        if (initialTabId) {
            const initialActiveButton = document.querySelector(`${tabButtonSelector}[data-tab="${initialTabId}"]`);
            const initialActiveContent = document.getElementById(initialTabId);
            if (initialActiveButton && initialActiveContent) {
                showTab(initialTabId);
            } else if (tabButtons.length > 0) {
                showTab(tabButtons[0].dataset.tab);
            }
        } else if (tabButtons.length > 0) {
             showTab(tabButtons[0].dataset.tab);
        }
    }

    // --- ログインフォーム処理 ---
    if (loginFormAside && emailLoginInput && passwordLoginInput) {
        // ... (既存のログインフォーム処理はそのまま) ...
        loginFormAside.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = emailLoginInput.value;
            const password = passwordLoginInput.value;
            console.log('ログイン試行:', email, password);
        });
    }

    // --- 「刮目中の人」リストの動的生成 (logged_in.html のみ) ---
    const followingList = document.getElementById('following-list');
    if (followingList) {
        // ... (既存の「刮目中の人」処理はそのまま) ...
        const followingUsers = ['ユーザーA', 'ユーザーB', 'ユーザーC', 'ユーザーX', 'ユーザーY', 'ユーザーZ'];
        followingUsers.forEach(user => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = user;
            listItem.appendChild(link);
            followingList.appendChild(listItem);
        });
    }


    // --- ページごとの初期化処理 ---
    if (document.querySelector('.tab-buttons .tab-button')) {
        initializeTabs('.tab-buttons .tab-button', '.tab-content', 'essays');
    }
    if (document.querySelector('.tab-buttons-logged-in .tab-button-logged-in')) {
        initializeTabs('.tab-buttons-logged-in .tab-button-logged-in', '.tab-content-logged-in', 'essays');
    }


    // --- 初期レンダリング ---
    renderEssayTimeline();
    renderPopularEssays(); // ★ この呼び出しで新しいロジックが実行される
    renderRecentEssayImages();
    renderActiveThreads();

});