class MathGame {
    constructor() {
        this.currentQuestion = 1;
        this.score = 0;
        this.totalQuestions = 10;
        this.correctAnswer = 0;
        this.isAnswering = true;
        
        this.init();
    }
    
    init() {
        this.generateQuestion();
        this.setupEventListeners();
    }
    
    generateQuestion() {
        // 2～19の数字を生成
        const num1 = Math.floor(Math.random() * 18) + 2;
        const num2 = Math.floor(Math.random() * 18) + 2;
        
        this.correctAnswer = num1 + num2;
        
        // 画面に表示
        document.getElementById('num1').textContent = num1;
        document.getElementById('num2').textContent = num2;
        
        // 5つの選択肢を生成
        this.generateAnswerCards();
        
        // 結果表示をクリア
        document.getElementById('result').textContent = '';
        
        // カードの状態をリセット
        this.resetCards();
        
        this.isAnswering = true;
    }
    
    generateAnswerCards() {
        const cards = [];
        
        // 正解を含める
        cards.push(this.correctAnswer);
        
        // 間違いの選択肢を4つ生成
        while (cards.length < 5) {
            // 正解の±1～10の範囲で間違いの選択肢を生成
            const wrongAnswer = this.correctAnswer + (Math.floor(Math.random() * 21) - 10);
            
            // 正の数で、まだ配列にない数字のみ追加
            if (wrongAnswer > 0 && !cards.includes(wrongAnswer)) {
                cards.push(wrongAnswer);
            }
        }
        
        // 配列をシャッフル
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        
        // カードに値を設定
        for (let i = 0; i < 5; i++) {
            document.getElementById(`card${i + 1}`).textContent = cards[i];
        }
    }
    
    setupEventListeners() {
        for (let i = 1; i <= 5; i++) {
            document.getElementById(`card${i}`).addEventListener('click', (e) => {
                this.handleAnswer(e.target);
            });
        }
    }
    
    handleAnswer(clickedCard) {
        if (!this.isAnswering) return;
        
        this.isAnswering = false;
        const selectedAnswer = parseInt(clickedCard.textContent);
        const resultElement = document.getElementById('result');
        
        if (selectedAnswer === this.correctAnswer) {
            // 正解
            clickedCard.classList.add('correct');
            resultElement.textContent = '○';
            resultElement.style.color = '#11998e';
            this.score++;
        } else {
            // 不正解
            clickedCard.classList.add('wrong');
            resultElement.textContent = '×';
            resultElement.style.color = '#eb3349';
            
            // 正解のカードを表示
            this.highlightCorrectAnswer();
        }
        
        // スコア更新
        document.getElementById('score').textContent = this.score;
        
        // 次の問題へ進む
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }
    
    highlightCorrectAnswer() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (parseInt(card.textContent) === this.correctAnswer) {
                card.classList.add('correct');
            }
        });
    }
    
    resetCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.remove('correct', 'wrong');
        });
    }
    
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion > this.totalQuestions) {
            this.endGame();
        } else {
            document.getElementById('currentQuestion').textContent = this.currentQuestion;
            this.generateQuestion();
        }
    }
    
    endGame() {
        document.getElementById('gameArea').style.display = 'none';
        document.getElementById('finalResult').style.display = 'block';
        document.getElementById('finalScore').textContent = `${this.score}/${this.totalQuestions} 正解！`;
    }
}

function restartGame() {
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('finalResult').style.display = 'none';
    
    // ゲームをリセット
    game = new MathGame();
    document.getElementById('currentQuestion').textContent = '1';
    document.getElementById('score').textContent = '0';
}

// ゲーム開始
let game = new MathGame();