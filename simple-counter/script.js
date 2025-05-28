// 要素を取得
const counterElement = document.getElementById('counter');
const incrementBtn = document.getElementById('increment');
const resetBtn = document.getElementById('reset');

// カウンターの状態
let count = 0;

// カウンターを更新する関数
function updateCounter() {
    counterElement.textContent = count;
    
    // アニメーション用のクラスを追加
    counterElement.classList.add('counter-animation');
    
    // アニメーションが終わったらクラスを削除
    setTimeout(() => {
        counterElement.classList.remove('counter-animation');
    }, 300);
}

// 増加ボタンのクリックイベント
incrementBtn.addEventListener('click', () => {
    count++;
    updateCounter();
});

// リセットボタンのクリックイベント
resetBtn.addEventListener('click', () => {
    if (count !== 0) {
        count = 0;
        updateCounter();
    }
});

// キーボード操作のサポート
document.addEventListener('keydown', (event) => {
    if (event.key === '+' || event.key === '=') {
        // + または = キーで増加
        count++;
        updateCounter();
        event.preventDefault();
    } else if (event.key === '0' || event.key === 'Escape') {
        // 0 または Esc キーでリセット
        if (count !== 0) {
            count = 0;
            updateCounter();
        }
        event.preventDefault();
    }
});

// 初期表示
updateCounter();
