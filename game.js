// キャラクターの設定
var character = document.getElementById('character');
var characterPos = {x: window.innerWidth / 2, y: window.innerHeight / 2};
var characterSize = 50; // キャラクターのサイズ

// レベル、スピード、敵の配列
var level = 1;
var speed = 2;
var enemies = [];

// ゲームエリアの範囲を取得
var game = document.getElementById('game');
var gameRect = game.getBoundingClientRect();

// 敵生成と更新のインターバル
var enemyInterval;
var updateInterval;

// レベルアップのタイマー設定
var levelUpTimer;

function startLevelUpTimer() {
    levelUpTimer = setInterval(levelUp, 10000); // 10秒ごとにレベルアップ
}

// 初期ラウンドの更新 (1秒後)
setTimeout(function() {
    levelUp();
    // 9秒後に通常の10秒間隔のレベルアップを開始
    setTimeout(startLevelUpTimer, 9000);
}, 1000);

// キャラクターの位置を更新
function updateCharacterPos(e) {
    characterPos.x = Math.min(Math.max(e.clientX - characterSize / 2, 0), window.innerWidth - characterSize);
    characterPos.y = Math.min(Math.max(e.clientY - characterSize / 2, 0), window.innerHeight - characterSize);
    character.style.left = characterPos.x + 'px';
    character.style.top = characterPos.y + 'px';
}

// マウスの移動に追随するキャラクター
game.addEventListener('mousemove', updateCharacterPos);

// 新しい敵を作成
function createEnemy() {
    var enemySize = 50;
    var enemyPos = { 
        left: Math.random() * (gameRect.width - enemySize),  
        top: Math.random() * (gameRect.height - enemySize)  
    };

    var warning = document.createElement('div');
    warning.className = 'warning';
    warning.style.left = enemyPos.left + 'px';
    warning.style.top = enemyPos.top + 'px';
    game.appendChild(warning);

    setTimeout(function() {
        game.removeChild(warning);
        var enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.left = enemyPos.left + 'px';
        enemy.style.top = enemyPos.top + 'px';
        game.appendChild(enemy);
        enemies.push(enemy);
    }, 1000);
}

// 敵を更新
function updateEnemies() {
    enemies.forEach(function(enemy) {
        var dx = characterPos.x - parseFloat(enemy.style.left);
        var dy = characterPos.y - parseFloat(enemy.style.top);

        var distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < 50) {
            endGame();
        } else {
            var angle = Math.atan2(dy, dx);
            enemy.style.left = parseFloat(enemy.style.left) + Math.cos(angle) * speed / 2 + 'px';
            enemy.style.top = parseFloat(enemy.style.top) + Math.sin(angle) * speed / 2 + 'px';
        }
    });
}

// スコアとレベルを更新
function updateScore() {
    document.getElementById('score').innerText = "レベル: " + level;
}

// ゲームオーバー
function endGame() {
    clearInterval(enemyInterval);
    clearInterval(updateInterval);
    clearInterval(levelUpTimer);
    clearInterval(roundInterval); // 忘れずにroundIntervalもクリアします
    
    game.innerHTML = "Game Over";
    game.style.color = "red";
    game.style.fontSize = "50px";
    game.style.textAlign = "center";
    game.style.paddingTop = window.innerHeight / 2 + "px";
    
    // プレイ再開ボタンの作成
    var replayBtn = document.createElement('button');
    replayBtn.innerText = "Play Again";
    replayBtn.className = "cute-button";  // ボタンにクラス名を付けて、CSSでデザインできるようにします
    replayBtn.onclick = function() {
        location.reload(); // 画面をリロードしてゲームをリセットします
    }
    game.appendChild(replayBtn);
    
    // ツイッターボタンの作成
    var tweetBtn = document.createElement('button');
    tweetBtn.innerText = "Author on Twitter";
    tweetBtn.className = "cute-button"; 
    tweetBtn.onclick = function() {
        var url = "https://twitter.com/rxnupx"; 
        window.open(url);
    }
    game.appendChild(tweetBtn);
}


// レベルアップと敵の全滅
function levelUp() {
    level++;
    speed += level;
    enemies.forEach(function(enemy) {
        game.removeChild(enemy);
    });
    enemies = [];
    timer = 10; // Add this line to reset the timer
    updateScore();
    clearInterval(enemyInterval);
    clearInterval(updateInterval);
    clearInterval(roundInterval); // Add this line to clear the roundInterval
    enemyInterval = setInterval(createEnemy, 2000 / level);
    updateInterval = setInterval(updateEnemies, 20);
    roundInterval = setInterval(updateRound, 1000); // Add this line to restart the roundInterval
}

// ラウンド終了時の処理を追加
var roundInterval;
function updateRound() {
    if (timer > 0) {
        timer--;
    } else {
        levelUp();
    }
    updateTimer();
}

// レベルアップのタイマー設定
var levelUpTimer;

// タイマーの設定
var timer = 10;
updateTimer();

function updateTimer() {
    document.getElementById('timer').innerText = "次のラウンドまで: " + timer + "秒";
}

// 敵を攻撃
game.onclick = function(e) {
    if (e.target.classList.contains('enemy')) {
        game.removeChild(e.target);
        enemies = enemies.filter(enemy => enemy !== e.target);
        score++;
        if (score % 10 === 0) {
            level++;
            speed += level;
            enemies.forEach(enemy => game.removeChild(enemy));
            enemies = [];
            timer = 10;
        }
        updateScore();
    }
}

// ラウンド終了時の処理を追加
var roundInterval = setInterval(function() {
    if (timer > 0) {
        timer--;
    } else {
        levelUp();
        timer = 10;
    }
    updateTimer();
}, 1000);

// 初期化
updateCharacterPos();
updateScore();
enemyInterval = setInterval(createEnemy, 2000 / level);
updateInterval = setInterval(updateEnemies, 20);

//// 初期化
//updateCharacterPos();
//updateScore();
//createEnemy();
//enemyInterval = setInterval(createEnemy, 2000 / level);
//updateInterval = setInterval(updateEnemies, 20);
//levelUpTimer = setInterval(levelUp, 10000); // 10秒ごとにレベルアップ
