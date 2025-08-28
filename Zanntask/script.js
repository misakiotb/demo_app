class ZanntaskApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('zanntasks')) || [];
        this.taskIdCounter = parseInt(localStorage.getItem('zanntaskCounter')) || 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTasks();
        setInterval(() => this.updateTaskUrgency(), 60000); // 1分ごとに更新
    }

    bindEvents() {
        document.getElementById('add-btn').addEventListener('click', () => this.addTask());
        document.getElementById('task-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    addTask() {
        const taskInput = document.getElementById('task-input');
        const dueDateInput = document.getElementById('due-date-input');
        
        if (!taskInput.value.trim()) return;

        const task = {
            id: ++this.taskIdCounter,
            text: taskInput.value.trim(),
            dueDate: dueDateInput.value,
            createdAt: new Date().toISOString(),
            completed: false
        };

        this.tasks.push(task);
        this.saveTasks();
        
        taskInput.value = '';
        dueDateInput.value = '';
        
        this.renderTasks();
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
    }

    completeTask(taskId, taskElement) {
        // 居合斬りエフェクトを実行
        this.triggerSlashEffect(taskElement, () => {
            this.deleteTask(taskId);
            this.renderTasks();
        });
    }

    triggerSlashEffect(taskElement, callback) {
        const slashEffect = document.getElementById('slash-effect');
        const slashLine = slashEffect.querySelector('.slash-line');
        const particlesContainer = slashEffect.querySelector('.particles');
        
        // タスク要素の位置を取得
        const taskRect = taskElement.getBoundingClientRect();
        const centerX = taskRect.left + taskRect.width / 2;
        const centerY = taskRect.top + taskRect.height / 2;

        // 斬撃線の位置設定
        slashLine.style.left = centerX + 'px';
        slashLine.style.top = '0';
        
        // エフェクト表示
        slashEffect.classList.remove('hidden');
        slashLine.classList.add('animate');

        // パーティクル生成
        this.createParticles(particlesContainer, centerX, centerY);

        // タスク要素にアニメーション追加
        taskElement.classList.add('completing');

        // エフェクト終了後の処理
        setTimeout(() => {
            slashEffect.classList.add('hidden');
            slashLine.classList.remove('animate');
            particlesContainer.innerHTML = '';
            callback();
        }, 500);
    }

    createParticles(container, centerX, centerY) {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // ランダムな方向と距離
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = Math.random() * 100 + 50;
            const randomX = Math.cos(angle) * distance + (Math.random() - 0.5) * 50;
            const randomY = Math.sin(angle) * distance + (Math.random() - 0.5) * 50;
            
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--random-x', randomX + 'px');
            particle.style.setProperty('--random-y', randomY + 'px');
            
            container.appendChild(particle);
            
            // アニメーション開始
            setTimeout(() => {
                particle.classList.add('animate');
            }, Math.random() * 100);
        }
    }

    getRandomPosition(taskSize) {
        const canvas = document.getElementById('task-canvas');
        const canvasRect = canvas.getBoundingClientRect();
        
        // 画面の端からのマージンを設定
        const margin = 50;
        const formHeight = 160; // フォーム部分の高さ
        
        const maxX = canvasRect.width - taskSize.width - margin;
        const maxY = canvasRect.height - taskSize.height - margin - formHeight;
        
        const x = Math.random() * Math.max(maxX, 0) + margin;
        const y = Math.random() * Math.max(maxY, 0) + formHeight + margin;
        
        return { x, y };
    }

    calculateTaskSize(task) {
        const now = new Date();
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        
        let scale = 1;
        let urgencyClass = '';
        
        if (dueDate) {
            const timeDiff = dueDate.getTime() - now.getTime();
            const daysDiff = timeDiff / (1000 * 3600 * 24);
            
            if (daysDiff < 0) {
                // 期限切れ - 最大サイズ
                scale = 2.0;
                urgencyClass = 'overdue';
            } else if (daysDiff < 1) {
                // 24時間以内 - 大きめ
                scale = 1.7;
                urgencyClass = 'urgent';
            } else if (daysDiff < 3) {
                // 3日以内 - やや大きめ
                scale = 1.4;
                urgencyClass = 'urgent';
            } else if (daysDiff < 7) {
                // 1週間以内 - 少し大きめ
                scale = 1.2;
            } else {
                // それ以上 - 標準サイズ
                scale = 1.0;
            }
        }
        
        return { scale, urgencyClass };
    }

    positionTaskInCenter(task, taskElement, urgencyInfo) {
        const canvas = document.getElementById('task-canvas');
        const canvasRect = canvas.getBoundingClientRect();
        
        // 画面中央に近いほど期限が切迫している
        const centerX = canvasRect.width / 2;
        const centerY = canvasRect.height / 2;
        
        // 期限の緊急度に応じて中央からの距離を調整
        let maxDistance;
        if (urgencyInfo.urgencyClass === 'overdue') {
            maxDistance = 50; // 画面中央付近
        } else if (urgencyInfo.urgencyClass === 'urgent') {
            maxDistance = 150; // 中央寄り
        } else {
            maxDistance = Math.min(canvasRect.width, canvasRect.height) / 2 - 100; // 外側
        }
        
        // ランダムな角度で配置
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * maxDistance;
        
        const x = centerX + Math.cos(angle) * distance - taskElement.offsetWidth / 2;
        const y = centerY + Math.sin(angle) * distance - taskElement.offsetHeight / 2;
        
        // 画面外に出ないように調整
        const safeX = Math.max(10, Math.min(x, canvasRect.width - taskElement.offsetWidth - 10));
        const safeY = Math.max(170, Math.min(y, canvasRect.height - taskElement.offsetHeight - 10));
        
        return { x: safeX, y: safeY };
    }

    renderTasks() {
        const canvas = document.getElementById('task-canvas');
        canvas.innerHTML = '';

        this.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            
            const urgencyInfo = this.calculateTaskSize(task);
            
            // タスクテキストと日付を設定
            let taskHTML = `<div class="task-text">${task.text}</div>`;
            if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                taskHTML += `<div class="task-due-date">期限: ${dueDate.toLocaleDateString('ja-JP')}</div>`;
            }
            taskElement.innerHTML = taskHTML;
            
            // 緊急度に応じたクラスを追加
            if (urgencyInfo.urgencyClass) {
                taskElement.classList.add(urgencyInfo.urgencyClass);
            }
            
            // サイズ調整
            taskElement.style.transform = `scale(${urgencyInfo.scale})`;
            
            // 一時的に画面外に配置してサイズを測定
            taskElement.style.position = 'absolute';
            taskElement.style.left = '-9999px';
            canvas.appendChild(taskElement);
            
            // 位置を計算して配置
            const position = this.positionTaskInCenter(task, taskElement, urgencyInfo);
            taskElement.style.left = position.x + 'px';
            taskElement.style.top = position.y + 'px';
            
            // クリックイベントを追加
            taskElement.addEventListener('click', () => {
                this.completeTask(task.id, taskElement);
            });
        });
    }

    updateTaskUrgency() {
        this.renderTasks();
    }

    saveTasks() {
        localStorage.setItem('zanntasks', JSON.stringify(this.tasks));
        localStorage.setItem('zanntaskCounter', this.taskIdCounter.toString());
    }
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    new ZanntaskApp();
});