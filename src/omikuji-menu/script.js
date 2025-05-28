document.addEventListener('DOMContentLoaded', () => {
    const drawButton = document.getElementById('drawButton');
    const loadingAnimation = document.getElementById('loadingAnimation');
    const resultDiv = document.getElementById('result');
    const fortuneTextElem = document.getElementById('fortuneText');
    const menuTextElem = document.getElementById('menuText');
    const colorTextElem = document.getElementById('colorText');

    // 運勢とその確率（大吉50%、中吉30%、吉10%、小吉10%）
    const fortunes = [
        { name: '大吉', probability: 0.5 },
        { name: '中吉', probability: 0.3 },
        { name: '吉', probability: 0.1 },
        { name: '小吉', probability: 0.1 }
    ];

    // ラッキーカラー
    const luckyColors = [
        '金運アップのゴールド', '幸運のレッド', '健康のグリーン',
        '癒しのブルー', '恋愛運上昇のピンク', '仕事運向上のシルバー',
        '勝負運のブラック', '金運のイエロー', '開運のパープル',
        '浄化のホワイト', 'パワーストーンのターコイズ', '高貴なパープル',
        '若返りのオレンジ', '知性のネイビー', '癒しのエメラルドグリーン'
    ];

    // 豪華で面白いメニュー
    const menuItems = [
        // 和食
        '築地の名店が作る極上マグロの大トロ丼',
        '天ぷら職人が揚げる季節の天ぷら盛り合わせ',
        '幻のスープで作る至福のラーメン',
        '日本海で獲れたばかりの極上マグロの本マグロづくし',
        '有機栽培の米と天然だしで作る究極の味噌汁定食',
        
        // 洋食
        '熟成黒毛和牛100%使用！絶品ハンバーグステーキ',
        'ふわとろ半熟オムライス 特製デミグラスソースがけ',
        'イタリア直輸入のトマトで作る本格ナポリタン',
        '老舗洋食店の禁断のレシピを再現したカレーライス',
        '国産チーズを贅沢に使った絶品グラタン',
        
        // 中華
        '四川の達人が作る本場の麻婆豆腐',
        '皮から手作りの極上餃子 特製タレ付き',
        '釜で炊き上げる本格チャーハン 干しエビと長ネギの香り立つ一品',
        '国産豚肉をふんだんに使った甘酢あんかけの酢豚',
        'エビの甘みを引き立てる特製チリソースのエビチリ'
    ];

    // 確率に基づいて運勢を選択する関数
    function selectFortune() {
        const random = Math.random();
        let cumulativeProbability = 0;
        
        for (const fortune of fortunes) {
            cumulativeProbability += fortune.probability;
            if (random <= cumulativeProbability) {
                return fortune.name;
            }
        }
        return fortunes[0].name; // デフォルトで大吉を返す
    }

    // 配列からランダムに要素を1つ選ぶ関数
    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    drawButton.addEventListener('click', () => {
        // 結果表示を隠し、ローディングアニメーションを表示
        resultDiv.classList.add('hidden');
        drawButton.disabled = true;
        loadingAnimation.classList.remove('hidden');

        // 5秒待機
        setTimeout(() => {
            // 運勢を選択
            const selectedFortune = selectFortune();
            
            // ラッキーカラーを選択
            const luckyColor = getRandomItem(luckyColors);
            
            // メニューを選択
            const selectedMenu = getRandomItem(menuItems);

            // 結果を表示
            fortuneTextElem.textContent = `${selectedFortune} 🎊`;
            menuTextElem.innerHTML = `今日のおすすめ: <span class="highlight">${selectedMenu}</span>`;
            colorTextElem.innerHTML = `ラッキーカラー: <span class="highlight">${luckyColor}</span>`;
            
            // 運勢に応じて背景色を変更
            switch(selectedFortune) {
                case '大吉':
                    resultDiv.style.borderColor = '#e6a420'; // 金色
                    break;
                case '中吉':
                    resultDiv.style.borderColor = '#b90000'; // 赤
                    break;
                case '吉':
                    resultDiv.style.borderColor = '#4CAF50'; // 緑
                    break;
                case '小吉':
                    resultDiv.style.borderColor = '#2196F3'; // 青
                    break;
            }
            
            loadingAnimation.classList.add('hidden');
            resultDiv.classList.remove('hidden');
            drawButton.disabled = false;

        }, 5000); // 5000ミリ秒 = 5秒
    });
});
