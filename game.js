const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

const ui = {
  gameStage: document.querySelector("#game-stage"),
  startScreen: document.querySelector("#start-screen"),
  pauseScreen: document.querySelector("#pause-screen"),
  gameOverScreen: document.querySelector("#game-over-screen"),
  countdownOverlay: document.querySelector("#countdown-overlay"),
  countdownValue: document.querySelector("#countdown-value"),
  startButton: document.querySelector("#start-button"),
  fullscreenButton: document.querySelector("#fullscreen-button"),
  resumeButton: document.querySelector("#resume-button"),
  exitButton: document.querySelector("#exit-button"),
  restartButton: document.querySelector("#restart-button"),
  homeButton: document.querySelector("#home-button"),
  playerCountToggle: document.querySelector("#player-count-toggle"),
  soloArrowControls: document.querySelector("#solo-arrow-controls"),
  twoPlayerControls: document.querySelector("#two-player-controls"),
  languagePicker: document.querySelector("#language-picker"),
  languageMenuButton: document.querySelector("#language-menu-button"),
  languageMenu: document.querySelector("#language-menu"),
  languageOptions: [...document.querySelectorAll(".language-option[data-language]")],
  backgroundPicker: document.querySelector("#background-picker"),
  backgroundMenuButton: document.querySelector("#background-menu-button"),
  backgroundMenu: document.querySelector("#background-menu"),
  backgroundCurrent: document.querySelector("#background-current"),
  backgroundOptions: [...document.querySelectorAll(".background-option")],
  soundToggle: document.querySelector("#sound-toggle"),
  soundIcon: document.querySelector("#sound-icon"),
  noclipToggle: document.querySelector("#noclip-toggle"),
  hardModeToggle: document.querySelector("#hard-mode-toggle"),
  homeBestScore: document.querySelector("#home-best-score"),
  pauseRunStats: document.querySelector("#pause-run-stats"),
  finalRunStats: document.querySelector("#final-run-stats"),
  finalScore: document.querySelector("#final-score"),
  gameOverTitle: document.querySelector("#game-over-title"),
  recordMessage: document.querySelector("#record-message"),
  obstacleLayer: document.querySelector("#obstacle-layer"),
  moveLeft: document.querySelector("#move-left"),
  useSpeedBoost: document.querySelector("#use-speed-boost"),
  pauseGame: document.querySelector("#pause-game"),
  useUmbrella: document.querySelector("#use-umbrella"),
  moveRight: document.querySelector("#move-right"),
};

const WORLD = { width: 720, height: 900 };
const PILE_FLOOR_Y = 838;
const SPEED_BOOST_DURATION = 2;
const SPEED_BOOST_MULTIPLIER = 1.65;
const TIME_THEMES = {
  morning: {
    sky: ["#f4bd80", "#b8d9df", "#dfe0c9"],
    celestial: "rgba(255, 239, 174, 0.9)",
    celestialX: 0.18,
    celestialY: 150,
    cloudAlpha: 0.95,
    hillBack: "#385346",
    hillFront: "#52705b",
    ground: "#6f8b68",
  },
  afternoon: {
    sky: ["#8ab8dc", "#bed2d9", "#d8d7c2"],
    celestial: "rgba(255, 248, 214, 0.72)",
    celestialX: 0.12,
    celestialY: 112,
    cloudAlpha: 1,
    hillBack: "#24382f",
    hillFront: "#314f3f",
    ground: "#52745a",
  },
  evening: {
    sky: ["#725f85", "#d58c79", "#efbd83"],
    celestial: "rgba(255, 188, 103, 0.9)",
    celestialX: 0.8,
    celestialY: 250,
    cloudAlpha: 0.62,
    hillBack: "#283730",
    hillFront: "#3c5040",
    ground: "#53664d",
  },
  night: {
    sky: ["#101b38", "#23385a", "#44566c"],
    celestial: "rgba(241, 240, 220, 0.9)",
    celestialX: 0.82,
    celestialY: 135,
    cloudAlpha: 0.3,
    hillBack: "#111d1c",
    hillFront: "#192923",
    ground: "#26382d",
  },
};
const STORAGE_KEY = "poop-dodge-best-score-v3";
const LEGACY_SCORES_STORAGE_KEY = "poop-dodge-best-scores-v2";
const LEGACY_STORAGE_KEY = "poop-dodge-best-score";
const LANGUAGE_STORAGE_KEY = "poop-dodge-language-v2";
const BACKGROUND_STORAGE_KEY = "poop-dodge-background-v1";
const SOUND_STORAGE_KEY = "poop-dodge-sound-v1";
const keys = { p1Left: false, p1Right: false, p2Left: false, p2Right: false };
const pressedKeys = new Set();

const TRANSLATIONS = {
  ko: {
    documentTitle: "Poop Dodge",
    description: "하늘에서 떨어지는 장애물을 피하며 최고 점수에 도전하는 웹 아케이드 게임",
    gameLabel: "Poop Dodge 게임",
    canvasFallback: "이 게임을 실행하려면 Canvas를 지원하는 브라우저가 필요합니다.",
    languageLabel: "언어 선택",
    languageMenu: "언어",
    backgroundLabel: "배경 선택",
    backgroundMenu: "배경",
    themeMorning: "아침",
    themeAfternoon: "오후",
    themeEvening: "저녁",
    themeNight: "밤",
    playerCountLabel: "플레이 인원",
    singlePlayer: "1인용",
    twoPlayer: "2인용",
    moveLabel: "조작 키 안내",
    mobileControls: "모바일 게임 컨트롤",
    moveLeft: "왼쪽으로 이동",
    moveRight: "오른쪽으로 이동",
    pauseControl: "일시정지",
    countdownGo: "시작!",
    homeEyebrow: "하나의 생존 모드",
    homeTitleTop: "피할\u00a0준비",
    homeTitleBottom: "됐나요?",
    homeCopy1: "쉬움부터 시작해 똥 지옥까지 버티세요.",
    homeCopy2: "오래 버틸수록 속도가 빨라집니다.",
    easy: "쉬움",
    normal: "보통",
    hard: "어려움",
    hell: "똥 지옥",
    best: "최고",
    noclipTitle: "노클립 모드",
    noclipDescription: "충돌 무시 · 최고 기록 저장 안 됨",
    hardModeTitle: "하드 모드",
    hardModeDescription: "빠른 낙하 · 추가 똥 · 시작 아이템 감소",
    hardModeBadge: "하드",
    startGame: "게임 시작",
    fullscreen: "전체 화면",
    exitFullscreen: "전체 화면 종료",
    move: "이동",
    pauseEyebrow: "잠깐 쉬어가기",
    pauseTitle: "일시정지",
    pauseCopy1: "Space 키를 누르면 계속 플레이합니다.",
    pauseCopy2: "R은 재시작, ESC는 홈으로 돌아갑니다.",
    continueGame: "계속하기",
    exitHome: "홈으로 나가기 · ESC",
    gameOverEyebrow: "게임 오버",
    gameOverTitle: "아깝네요!",
    playerDefeated: "{player}가 맞았습니다!",
    finalScore: "최종 점수",
    recordDefault: "최고 기록에 다시 도전하세요.",
    restart: "다시 하기",
    changeDifficulty: "홈으로 돌아가기 · ESC",
    score: "점수",
    fallenPoop: "떨어진 똥",
    newBest: "신기록!",
    noclipBadge: "노클립",
    windBadge: "강풍",
    umbrellaActive: "튕김 우산",
    umbrellaUses: "우산 사용권",
    umbrellaControl: "우산 발동",
    speedBoostActive: "속도 증가",
    speedBoostUses: "속도 아이템",
    speedBoostControl: "속도 아이템",
    stageUp: "{difficulty} 단계",
    stageProgress: "{difficulty} · 다음 단계 {seconds}초",
    stageFinal: "{difficulty} · 최종 단계",
    recordNew: "새 통합 최고 기록!",
    recordBest: "최고 기록 {score}점",
    homeBest: "최고 기록 {score}",
    runStats: "생존 {time} · 점수 {score}",
    shieldCollected: "보호막 준비! 다음 충돌을 막습니다",
    shieldSaved: "보호막이 충돌을 막았습니다",
    umbrellaEmpty: "남은 우산 사용권이 없습니다",
    speedEmpty: "남은 속도 아이템이 없습니다",
    supplyUmbrella: "30점 보급 · 우산 +1",
    supplySpeed: "30점 보급 · 속도 아이템 +1",
    supplyShield: "30점 보급 · 보호막 충전",
    giantWarning: "경고 · 거대 똥 출현!",
    soundOn: "효과음 켜짐",
    soundOff: "효과음 꺼짐",
    magnetActive: "자석 {seconds}s",
    shrinkActive: "축소 {seconds}s",
    magnetCollected: "자석 발동 · 아이템을 끌어당깁니다",
    shrinkCollected: "축소 발동 · 6초 동안 충돌 범위 감소",
    guideLabel: "게임 방법 및 설명",
    guideEyebrow: "게임 방법 및 설명",
    guideTitle: "살아남는 법",
    guideRuleScore: "일반 똥을 피하면 1점, 맞으면 게임 오버입니다.",
    guideQuickDifficulty: "30초마다 쉬움 → 보통 → 어려움 → 똥 지옥 순으로 상승합니다.",
    guideRuleTarget: "움직이지 않고 3개를 피하면 다음 똥 하나가 플레이어를 노립니다.",
    guideBird: "Space는 우산, Shift는 처음 주어지는 속도 아이템 5개를 사용합니다.",
    guideShield: "별 아이템은 다음 충돌을 한 번 막아주고, 30점마다 아이템 1개를 보급합니다.",
    guidePowerups: "자석은 아이템을 끌어당기고, 방울은 6초 동안 몸을 작게 만듭니다.",
    guideMultiplayer: "2인용은 한 명이 맞으면 종료되며 아이템을 공유합니다.",
  },
  en: {
    documentTitle: "Poop Dodge",
    description: "A web arcade game where you dodge falling obstacles and chase a high score.",
    gameLabel: "Poop Dodge game",
    canvasFallback: "This game requires a browser that supports Canvas.",
    languageLabel: "Select language",
    languageMenu: "LANGUAGE",
    backgroundLabel: "Select background",
    backgroundMenu: "BACKGROUND",
    themeMorning: "Morning",
    themeAfternoon: "Afternoon",
    themeEvening: "Evening",
    themeNight: "Night",
    playerCountLabel: "Number of players",
    singlePlayer: "1 PLAYER",
    twoPlayer: "2 PLAYERS",
    moveLabel: "Keyboard controls",
    mobileControls: "Mobile game controls",
    moveLeft: "Move left",
    moveRight: "Move right",
    pauseControl: "Pause game",
    countdownGo: "GO!",
    homeEyebrow: "ONE SURVIVAL RUN",
    homeTitleTop: "READY TO",
    homeTitleBottom: "DODGE?",
    homeCopy1: "Start on Easy and survive all the way to Poop Hell.",
    homeCopy2: "The longer you survive, the faster it gets.",
    easy: "EASY",
    normal: "NORMAL",
    hard: "HARD",
    hell: "POOP HELL",
    best: "BEST",
    noclipTitle: "NOCLIP MODE",
    noclipDescription: "Ignore hits · Best score disabled",
    hardModeTitle: "HARD MODE",
    hardModeDescription: "Faster drops · More poop · Fewer starting items",
    hardModeBadge: "HARD",
    startGame: "START GAME",
    fullscreen: "FULLSCREEN",
    exitFullscreen: "EXIT FULLSCREEN",
    move: "MOVE",
    pauseEyebrow: "TAKE A BREATH",
    pauseTitle: "PAUSED",
    pauseCopy1: "Press Space to continue.",
    pauseCopy2: "Press R to restart or ESC to return home.",
    continueGame: "CONTINUE",
    exitHome: "EXIT TO HOME · ESC",
    gameOverEyebrow: "GAME OVER",
    gameOverTitle: "SO CLOSE!",
    playerDefeated: "{player} GOT HIT!",
    finalScore: "FINAL SCORE",
    recordDefault: "Try for a new best.",
    restart: "TRY AGAIN",
    changeDifficulty: "BACK HOME · ESC",
    score: "SCORE",
    fallenPoop: "FALLEN",
    newBest: "New Best!",
    noclipBadge: "NOCLIP",
    windBadge: "WIND",
    umbrellaActive: "DEFLECTOR",
    umbrellaUses: "UMBRELLA USES",
    umbrellaControl: "USE UMBRELLA",
    speedBoostActive: "SPEED BOOST",
    speedBoostUses: "SPEED ITEMS",
    speedBoostControl: "USE SPEED ITEM",
    stageUp: "{difficulty} STAGE",
    stageProgress: "{difficulty} · NEXT IN {seconds}s",
    stageFinal: "{difficulty} · FINAL STAGE",
    recordNew: "New overall best!",
    recordBest: "Best score: {score}",
    homeBest: "BEST {score}",
    runStats: "SURVIVED {time} · SCORE {score}",
    shieldCollected: "SHIELD READY! Blocks the next hit",
    shieldSaved: "SHIELD BLOCKED THE HIT",
    umbrellaEmpty: "NO UMBRELLA USES LEFT",
    speedEmpty: "NO SPEED ITEMS LEFT",
    supplyUmbrella: "30 POINT SUPPLY · UMBRELLA +1",
    supplySpeed: "30 POINT SUPPLY · SPEED +1",
    supplyShield: "30 POINT SUPPLY · SHIELD READY",
    giantWarning: "WARNING · GIANT POOP INCOMING!",
    soundOn: "Sound on",
    soundOff: "Sound off",
    magnetActive: "MAGNET {seconds}s",
    shrinkActive: "SHRINK {seconds}s",
    magnetCollected: "MAGNET ON · Pulling items closer",
    shrinkCollected: "SHRINK ON · Smaller hitbox for 6 seconds",
    guideLabel: "Game instructions and details",
    guideEyebrow: "HOW TO PLAY",
    guideTitle: "SURVIVAL GUIDE",
    guideRuleScore: "Dodge regular poop for 1 point. Getting hit ends the game.",
    guideQuickDifficulty: "Every 30 seconds: Easy → Normal → Hard → Poop Hell.",
    guideRuleTarget: "Stay still for 3 dodges and one next poop targets a player.",
    guideBird: "Press Space for an umbrella. Shift uses one of 5 starting speed items.",
    guideShield: "Catch a star to block the next hit. Every 30 points supplies one item.",
    guidePowerups: "Magnets pull items closer, and bubbles shrink your hitbox for 6 seconds.",
    guideMultiplayer: "In 2-player mode, either hit ends the game and items are shared.",
  },
  ja: {
    documentTitle: "Poop Dodge",
    description: "落ちてくる障害物をよけてハイスコアを目指すウェブアーケードゲームです。",
    gameLabel: "Poop Dodge ゲーム",
    canvasFallback: "このゲームをプレイするにはCanvas対応ブラウザが必要です。",
    languageLabel: "言語を選択",
    languageMenu: "言語",
    backgroundLabel: "背景を選択",
    backgroundMenu: "背景",
    themeMorning: "朝",
    themeAfternoon: "昼",
    themeEvening: "夕方",
    themeNight: "夜",
    playerCountLabel: "プレイ人数",
    singlePlayer: "1人用",
    twoPlayer: "2人用",
    moveLabel: "操作キー",
    mobileControls: "モバイルゲーム操作",
    moveLeft: "左へ移動",
    moveRight: "右へ移動",
    pauseControl: "一時停止",
    countdownGo: "スタート！",
    homeEyebrow: "ひとつのサバイバルモード",
    homeTitleTop: "よける準備は",
    homeTitleBottom: "できた？",
    homeCopy1: "やさしいから始めて、うんち地獄まで生き残ろう。",
    homeCopy2: "長く生き残るほどスピードが上がります。",
    easy: "やさしい",
    normal: "ふつう",
    hard: "むずかしい",
    hell: "うんち地獄",
    best: "最高",
    noclipTitle: "ノークリップモード",
    noclipDescription: "衝突無効・最高記録は保存されません",
    hardModeTitle: "ハードモード",
    hardModeDescription: "高速落下・うんち増加・初期アイテム減少",
    hardModeBadge: "ハード",
    startGame: "ゲーム開始",
    fullscreen: "全画面",
    exitFullscreen: "全画面を終了",
    move: "移動",
    pauseEyebrow: "ひと休み",
    pauseTitle: "一時停止",
    pauseCopy1: "Spaceキーでゲームを再開します。",
    pauseCopy2: "Rで再スタート、ESCでホームに戻ります。",
    continueGame: "続ける",
    exitHome: "ホームに戻る · ESC",
    gameOverEyebrow: "ゲームオーバー",
    gameOverTitle: "おしい！",
    playerDefeated: "{player}が当たりました！",
    finalScore: "最終スコア",
    recordDefault: "最高記録にもう一度挑戦しよう。",
    restart: "もう一度",
    changeDifficulty: "ホームに戻る · ESC",
    score: "スコア",
    fallenPoop: "落下数",
    newBest: "新記録！",
    noclipBadge: "ノークリップ",
    windBadge: "強風",
    umbrellaActive: "反射の傘",
    umbrellaUses: "傘の使用回数",
    umbrellaControl: "傘を使う",
    speedBoostActive: "スピードアップ",
    speedBoostUses: "加速アイテム",
    speedBoostControl: "加速アイテムを使う",
    stageUp: "{difficulty}ステージ",
    stageProgress: "{difficulty}・次まで{seconds}秒",
    stageFinal: "{difficulty}・最終ステージ",
    recordNew: "総合新記録！",
    recordBest: "最高記録：{score}",
    homeBest: "最高記録 {score}",
    runStats: "生存 {time}・スコア {score}",
    shieldCollected: "シールド準備！次の衝突を防ぎます",
    shieldSaved: "シールドが衝突を防ぎました",
    umbrellaEmpty: "傘の使用回数がありません",
    speedEmpty: "加速アイテムがありません",
    supplyUmbrella: "30点補給・傘 +1",
    supplySpeed: "30点補給・加速 +1",
    supplyShield: "30点補給・シールド充電",
    giantWarning: "警告・巨大うんち出現！",
    soundOn: "効果音オン",
    soundOff: "効果音オフ",
    magnetActive: "磁石 {seconds}秒",
    shrinkActive: "縮小 {seconds}秒",
    magnetCollected: "磁石発動・アイテムを引き寄せます",
    shrinkCollected: "縮小発動・6秒間当たり判定が小さくなります",
    guideLabel: "ゲーム方法と説明",
    guideEyebrow: "ゲーム方法と説明",
    guideTitle: "生き残り方",
    guideRuleScore: "通常のうんちをよけると1点、当たるとゲームオーバーです。",
    guideQuickDifficulty: "30秒ごとに、やさしい→ふつう→むずかしい→うんち地獄へ上がります。",
    guideRuleTarget: "動かずに3個よけると、次の1個がプレイヤーを狙います。",
    guideBird: "Spaceで傘、Shiftで最初に持つ5個の加速アイテムを使います。",
    guideShield: "星を取ると次の衝突を1回防ぎ、30点ごとにアイテムを1個補給します。",
    guidePowerups: "磁石はアイテムを引き寄せ、バブルは6秒間当たり判定を小さくします。",
    guideMultiplayer: "2人用はどちらかが当たると終了し、アイテムを共有します。",
  },
  zh: {
    documentTitle: "Poop Dodge",
    description: "躲避从天而降的障碍物，挑战最高分的网页街机游戏。",
    gameLabel: "Poop Dodge 游戏",
    canvasFallback: "运行此游戏需要支持Canvas的浏览器。",
    languageLabel: "选择语言",
    languageMenu: "语言",
    backgroundLabel: "选择背景",
    backgroundMenu: "背景",
    themeMorning: "早晨",
    themeAfternoon: "下午",
    themeEvening: "傍晚",
    themeNight: "夜晚",
    playerCountLabel: "游戏人数",
    singlePlayer: "单人",
    twoPlayer: "双人",
    moveLabel: "操作按键",
    mobileControls: "手机游戏控制",
    moveLeft: "向左移动",
    moveRight: "向右移动",
    pauseControl: "暂停游戏",
    countdownGo: "开始！",
    homeEyebrow: "单一生存模式",
    homeTitleTop: "准备好",
    homeTitleBottom: "躲避了吗？",
    homeCopy1: "从简单开始，坚持到便便地狱。",
    homeCopy2: "坚持得越久，速度就越快。",
    easy: "简单",
    normal: "普通",
    hard: "困难",
    hell: "便便地狱",
    best: "最高",
    noclipTitle: "无碰撞模式",
    noclipDescription: "忽略碰撞 · 不保存最高纪录",
    hardModeTitle: "困难模式",
    hardModeDescription: "下落更快 · 便便更多 · 初始道具更少",
    hardModeBadge: "困难",
    startGame: "开始游戏",
    fullscreen: "全屏",
    exitFullscreen: "退出全屏",
    move: "移动",
    pauseEyebrow: "休息一下",
    pauseTitle: "已暂停",
    pauseCopy1: "按Space键继续游戏。",
    pauseCopy2: "按R重新开始，按ESC返回主页。",
    continueGame: "继续游戏",
    exitHome: "返回主页 · ESC",
    gameOverEyebrow: "游戏结束",
    gameOverTitle: "太可惜了！",
    playerDefeated: "{player}被击中了！",
    finalScore: "最终得分",
    recordDefault: "再次挑战最高纪录吧。",
    restart: "再来一次",
    changeDifficulty: "返回主页 · ESC",
    score: "得分",
    fallenPoop: "落地便便",
    newBest: "新纪录！",
    noclipBadge: "无碰撞",
    windBadge: "强风",
    umbrellaActive: "反弹雨伞",
    umbrellaUses: "雨伞次数",
    umbrellaControl: "使用雨伞",
    speedBoostActive: "速度提升",
    speedBoostUses: "加速道具",
    speedBoostControl: "使用加速道具",
    stageUp: "{difficulty}阶段",
    stageProgress: "{difficulty}·{seconds}秒后升级",
    stageFinal: "{difficulty}·最终阶段",
    recordNew: "综合新纪录！",
    recordBest: "最高纪录：{score}",
    homeBest: "最高纪录 {score}",
    runStats: "生存 {time} · 分数 {score}",
    shieldCollected: "护盾已就绪！可抵挡下一次碰撞",
    shieldSaved: "护盾挡住了碰撞",
    umbrellaEmpty: "雨伞次数已用完",
    speedEmpty: "加速道具已用完",
    supplyUmbrella: "30分补给 · 雨伞 +1",
    supplySpeed: "30分补给 · 加速道具 +1",
    supplyShield: "30分补给 · 护盾充能",
    giantWarning: "警告 · 巨型便便来袭！",
    soundOn: "音效已开启",
    soundOff: "音效已关闭",
    magnetActive: "磁铁 {seconds}秒",
    shrinkActive: "缩小 {seconds}秒",
    magnetCollected: "磁铁启动 · 正在吸引道具",
    shrinkCollected: "缩小启动 · 6秒内碰撞范围减小",
    guideLabel: "游戏方法与说明",
    guideEyebrow: "游戏方法与说明",
    guideTitle: "生存指南",
    guideRuleScore: "躲过普通便便得1分，被击中则游戏结束。",
    guideQuickDifficulty: "每30秒按简单→普通→困难→便便地狱升级。",
    guideRuleTarget: "不移动躲过3个后，下一个便便会瞄准玩家。",
    guideBird: "按Space使用雨伞，按Shift使用开局持有的5个加速道具。",
    guideShield: "接住星星可抵挡下一次碰撞，每30分补给1个道具。",
    guidePowerups: "磁铁会吸引道具，泡泡可让碰撞范围缩小6秒。",
    guideMultiplayer: "双人模式任意一人被击中都会结束，双方共享道具。",
  },
};

const DIFFICULTIES = {
  easy: {
    waveSize: () => (game.score >= 10 ? 2 : 1),
    baseSpeed: 340,
    speedGain: 10,
    speedOffsetRange: [-45, 70],
    sizeRange: [34, 48],
  },
  normal: {
    waveSize: () => (Math.random() < 0.35 ? 3 : 2),
    baseSpeed: 470,
    speedGain: 16,
    speedOffsetRange: [-85, 125],
    sizeRange: [33, 56],
  },
  hard: {
    waveSize: () => randomInteger(3, 5),
    baseSpeed: 650,
    speedGain: 24,
    speedOffsetRange: [-120, 160],
    sizeRange: [35, 60],
  },
  hell: {
    waveSize: () => randomInteger(6, 9),
    baseSpeed: 820,
    speedGain: 32,
    speedOffsetRange: [-160, 220],
    sizeRange: [30, 64],
  },
};
const DIFFICULTY_ORDER = ["easy", "normal", "hard", "hell"];
const STAGE_DURATION = 30;
const HARD_STAGE_DURATION = 20;
const STAGE_BANNER_DURATION = 2;
const SUPPLY_SCORE_INTERVAL = 30;
const REWARD_MESSAGE_DURATION = 2.4;
const BONUS_EFFECT_DURATION = 6;
const GIANT_SCORE_INTERVAL = 45;
const HARD_GIANT_SCORE_INTERVAL = 35;
const HELL_ACTIVE_OBSTACLE_LIMIT = 24;
const MAX_FRAME_RATE = 120;
const MIN_FRAME_TIME = 1000 / MAX_FRAME_RATE;
const SOUND_PATTERNS = {
  toggle: [[520, 0, 0.08, "sine", 0.06, 680]],
  countdown: [[330, 0, 0.09, "square", 0.045, 280]],
  go: [[520, 0, 0.1, "triangle", 0.06, 660], [780, 0.09, 0.18, "triangle", 0.07, 980]],
  wave: [[620, 0, 0.06, "sine", 0.035, 720], [820, 0.055, 0.08, "sine", 0.035, 900]],
  bird: [[980, 0, 0.05, "sine", 0.035, 1240], [1120, 0.08, 0.05, "sine", 0.03, 860]],
  birdDrop: [[430, 0, 0.12, "triangle", 0.04, 210]],
  birdPickup: [[720, 0, 0.08, "triangle", 0.06, 920], [980, 0.07, 0.1, "sine", 0.05, 1220]],
  itemSpawn: [[500, 0, 0.08, "sine", 0.04, 760]],
  item: [[760, 0, 0.1, "triangle", 0.06, 980], [1040, 0.08, 0.12, "sine", 0.05, 1240]],
  shield: [[260, 0, 0.18, "square", 0.07, 110], [620, 0.02, 0.2, "sine", 0.045, 320]],
  umbrella: [[360, 0, 0.08, "triangle", 0.055, 620]],
  bounce: [[240, 0, 0.1, "square", 0.04, 480]],
  speed: [[240, 0, 0.08, "sawtooth", 0.045, 680], [680, 0.06, 0.12, "triangle", 0.05, 1040]],
  empty: [[180, 0, 0.08, "square", 0.04, 145], [145, 0.1, 0.1, "square", 0.035, 110]],
  stage: [[440, 0, 0.12, "triangle", 0.05, 560], [660, 0.1, 0.12, "triangle", 0.055, 780], [880, 0.2, 0.18, "sine", 0.06, 1080]],
  warning: [[170, 0, 0.18, "sawtooth", 0.06, 120], [170, 0.25, 0.18, "sawtooth", 0.06, 120]],
  pause: [[520, 0, 0.1, "triangle", 0.045, 390], [390, 0.08, 0.12, "triangle", 0.04, 290]],
  resume: [[390, 0, 0.09, "triangle", 0.045, 520], [520, 0.07, 0.12, "triangle", 0.05, 680]],
  record: [[120, 0, 0.18, "sawtooth", 0.06, 55], [523, 0.2, 0.12, "triangle", 0.06, 620], [659, 0.31, 0.12, "triangle", 0.06, 760], [784, 0.42, 0.28, "sine", 0.07, 980]],
  hit: [[130, 0, 0.32, "sawtooth", 0.08, 55]],
};
const SOUND_COOLDOWNS = { bounce: 0.065, wave: 0.08, birdDrop: 0.15, empty: 0.35 };
const game = {
  state: "start",
  score: 0,
  bestScore: readBestScore(),
  difficulty: "easy",
  stageIndex: 0,
  stageElapsed: 0,
  stageBannerTimer: 0,
  playerCount: 1,
  language: readLanguage(),
  backgroundTheme: readBackgroundTheme(),
  soundEnabled: readSoundPreference(),
  noclip: false,
  hardMode: false,
  windForce: 0,
  windTargetForce: 0,
  windTimer: 0,
  stationaryPasses: 0,
  lastTime: 0,
  animationFrame: null,
  flash: 0,
  birdTimer: random(6, 10),
  umbrellaTimer: 0,
  umbrellaCharges: 3,
  speedBoostTimer: 0,
  speedBoostCharges: 5,
  runElapsed: 0,
  shieldReady: false,
  shieldPickupTimer: random(14, 22),
  nextSupplyScore: SUPPLY_SCORE_INTERVAL,
  rewardTimer: 0,
  rewardMessage: "",
  nextGiantScore: GIANT_SCORE_INTERVAL,
  giantQueued: false,
  magnetTimer: 0,
  shrinkTimer: 0,
  bonusPickupTimer: random(18, 28),
  overlapWaveTimer: 0,
  scorePulse: 0,
};

const player = {
  label: "1P",
  x: WORLD.width / 2,
  y: WORLD.height - 112,
  width: 68,
  height: 96,
  speed: 500,
  velocityX: 0,
  dead: false,
  lean: 0,
  runCycle: 0,
  moveDirection: 0,
  facing: 1,
  shirtColor: "#ff704d",
  hatColor: "#d8ff45",
};

const playerTwo = {
  label: "2P",
  x: (WORLD.width * 2) / 3,
  y: WORLD.height - 112,
  width: 68,
  height: 96,
  speed: 500,
  velocityX: 0,
  dead: false,
  lean: 0,
  runCycle: 0,
  moveDirection: 0,
  facing: -1,
  shirtColor: "#55b8ff",
  hatColor: "#ffd166",
};

let obstacles = [];
let bird = null;
let birdDroppings = [];
let shieldPickup = null;
let bonusPickup = null;
const renderMetrics = { width: 720, height: 900, scale: 1 };
let countdownTimer = 0;
let countdownRunId = 0;
let audioContext = null;
let audioCompressor = null;
let audioMasterGain = null;
const lastSoundTimes = new Map();
let cachedSkyGradient = null;
let cachedSkyGradientTheme = "";
let fullscreenWasActive = Boolean(document.fullscreenElement ?? document.webkitFullscreenElement);

setLanguage(game.language, false);
requestAnimationFrame(resizeWorld);
document.fonts?.ready.then(() => drawScene(performance.now() / 1000));

ui.startButton.addEventListener("click", startGame);
ui.fullscreenButton.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
ui.restartButton.addEventListener("click", startGame);
ui.resumeButton.addEventListener("click", resumeGame);
ui.exitButton.addEventListener("click", showHome);
ui.homeButton.addEventListener("click", showHome);
ui.noclipToggle.addEventListener("click", toggleNoclip);
ui.hardModeToggle.addEventListener("click", toggleHardMode);
ui.soundToggle.addEventListener("click", toggleSound);
ui.languageMenuButton.addEventListener("click", () => {
  setBackgroundMenuOpen(false);
  setLanguageMenuOpen(!ui.languagePicker.classList.contains("is-open"));
});
ui.languageOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setLanguage(option.dataset.language);
    setLanguageMenuOpen(false);
    ui.languageMenuButton.focus({ preventScroll: true });
  });
});
ui.backgroundMenuButton.addEventListener("click", () => {
  setLanguageMenuOpen(false);
  setBackgroundMenuOpen(!ui.backgroundPicker.classList.contains("is-open"));
});
ui.backgroundOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setBackgroundTheme(option.dataset.background);
    setBackgroundMenuOpen(false);
    ui.backgroundMenuButton.focus({ preventScroll: true });
  });
});
document.addEventListener("pointerdown", (event) => {
  if (!ui.languagePicker.contains(event.target)) setLanguageMenuOpen(false);
  if (!ui.backgroundPicker.contains(event.target)) setBackgroundMenuOpen(false);
});
ui.playerCountToggle.addEventListener("click", () => {
  selectPlayerCount(game.playerCount === 1 ? 2 : 1);
});

window.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "Escape", "ShiftLeft", "ShiftRight"].includes(event.code)) {
    event.preventDefault();
  }

  if (event.code === "KeyM" && !event.repeat) {
    toggleSound();
    return;
  }

  if (event.code === "KeyR" && !event.repeat && ["paused", "gameover"].includes(game.state)) {
    startGame();
    return;
  }

  if (event.code === "Escape" && ui.languagePicker.classList.contains("is-open")) {
    setLanguageMenuOpen(false);
    ui.languageMenuButton.focus({ preventScroll: true });
    return;
  }

  if (event.code === "Escape" && ui.backgroundPicker.classList.contains("is-open")) {
    setBackgroundMenuOpen(false);
    ui.backgroundMenuButton.focus({ preventScroll: true });
    return;
  }

  if (event.code === "Escape" && !event.repeat) {
    if (game.state === "playing") pauseGame();
    else if (game.state === "countdown") showHome();
    else if (game.state === "resume-countdown") returnToPauseFromCountdown();
    else if (game.state === "paused") showHome();
    else if (game.state === "gameover") showHome();
    return;
  }

  if (game.state === "playing") {
    if (event.code === "Space" && !event.repeat) {
      activateUmbrella();
      return;
    }
    if (["ShiftLeft", "ShiftRight"].includes(event.code) && !event.repeat) {
      activateSpeedBoost();
      return;
    }
    if (["KeyA", "KeyD", "ArrowLeft", "ArrowRight"].includes(event.code)) {
      pressedKeys.add(event.code);
    }
  }

  if (event.code === "Space" && !event.repeat) {
    if (game.state === "paused") resumeGame();
    else if (["start", "gameover"].includes(game.state)) startGame();
  }
});

window.addEventListener("keyup", (event) => {
  pressedKeys.delete(event.code);
});

window.addEventListener("blur", releaseControls);
window.addEventListener("resize", resizeWorld);
document.addEventListener("visibilitychange", () => {
  if (document.hidden && game.state === "playing") pauseGame();
  else if (document.hidden && game.state === "countdown") showHome();
  else if (document.hidden && game.state === "resume-countdown") returnToPauseFromCountdown();
});

bindHoldControl(ui.moveLeft, "p1Left");
bindHoldControl(ui.moveRight, "p1Right");
ui.useSpeedBoost.addEventListener("pointerdown", (event) => {
  if (game.state !== "playing") return;
  event.preventDefault();
  activateSpeedBoost();
  ui.useSpeedBoost.classList.add("is-active");
  window.setTimeout(() => ui.useSpeedBoost.classList.remove("is-active"), 160);
});
ui.pauseGame.addEventListener("pointerdown", (event) => {
  if (game.state !== "playing") return;
  event.preventDefault();
  pauseGame();
});
ui.useUmbrella.addEventListener("pointerdown", (event) => {
  if (game.state !== "playing") return;
  event.preventDefault();
  activateUmbrella();
  ui.useUmbrella.classList.add("is-active");
  window.setTimeout(() => ui.useUmbrella.classList.remove("is-active"), 160);
});

function selectPlayerCount(count) {
  if (![1, 2].includes(count) || game.state === "playing") return;

  game.playerCount = count;
  ui.playerCountToggle.classList.toggle("is-two-player", count === 2);
  ui.playerCountToggle.setAttribute("aria-checked", String(count === 2));
  ui.soloArrowControls.hidden = count === 2;
  ui.twoPlayerControls.hidden = count === 1;
  positionPlayers();
  drawScene(performance.now() / 1000);
}

async function toggleFullscreen() {
  const fullscreenElement = document.fullscreenElement ?? document.webkitFullscreenElement;

  try {
    if (fullscreenElement) {
      const exitFullscreen = document.exitFullscreen ?? document.webkitExitFullscreen;
      await exitFullscreen?.call(document);
    } else {
      const requestFullscreen = ui.gameStage.requestFullscreen ?? ui.gameStage.webkitRequestFullscreen;
      await requestFullscreen?.call(ui.gameStage);
    }
  } catch {
    // 전체 화면을 지원하지 않거나 브라우저가 요청을 거부하면 현재 화면을 유지합니다.
  }

  updateFullscreenButton();
}

function updateFullscreenButton() {
  const isFullscreen = Boolean(document.fullscreenElement ?? document.webkitFullscreenElement);
  const label = t(isFullscreen ? "exitFullscreen" : "fullscreen");
  ui.fullscreenButton.setAttribute("aria-label", label);
  ui.fullscreenButton.title = label;
}

function handleFullscreenChange() {
  const isFullscreen = Boolean(document.fullscreenElement ?? document.webkitFullscreenElement);
  const exitedDuringPlay = fullscreenWasActive && !isFullscreen && game.state === "playing";
  fullscreenWasActive = isFullscreen;
  updateFullscreenButton();

  if (exitedDuringPlay) pauseGame();
}

function setLanguage(language, persist = true) {
  if (!TRANSLATIONS[language]) return;

  game.language = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : language;
  document.title = t("documentTitle");
  document.querySelector('meta[name="description"]').content = t("description");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });

  ui.languageOptions.forEach((option) => {
    const selected = option.dataset.language === language;
    option.classList.toggle("is-selected", selected);
    if (selected) option.setAttribute("aria-current", "true");
    else option.removeAttribute("aria-current");
  });
  updateNoclipUi();
  updateHardModeUi();
  updateBackgroundThemeUi();
  updateHomeBest();
  updateRunStats();
  updateSoundUi();
  updateFullscreenButton();

  if (persist) {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // 언어 저장이 제한되어도 현재 세션에서는 선택한 언어를 사용합니다.
    }
  }

  drawScene(performance.now() / 1000);
}

function t(key) {
  return TRANSLATIONS[game.language]?.[key] ?? TRANSLATIONS.ko[key] ?? key;
}

function canvasFont(weight, size) {
  const families = {
    en: '"Fredoka", "Arial Rounded MT Bold", "Trebuchet MS", sans-serif',
    ko: '"Jua", "Malgun Gothic", sans-serif',
    ja: '"M PLUS Rounded 1c", "Yu Gothic", sans-serif',
    zh: '"ZCOOL KuaiLe", "Microsoft YaHei", sans-serif',
  };
  const nativeWeight =
    game.language === "ko" || game.language === "zh"
      ? 400
      : game.language === "en"
        ? Math.min(weight, 700)
        : Math.min(weight, 900);
  const family = families[game.language] ?? families.en;
  return `${nativeWeight} ${size}px ${family}`;
}

function setLanguageMenuOpen(open) {
  ui.languagePicker.classList.toggle("is-open", open);
  ui.languageMenuButton.setAttribute("aria-expanded", String(open));
  ui.languageMenu.setAttribute("aria-hidden", String(!open));
}

function setBackgroundMenuOpen(open) {
  ui.backgroundPicker.classList.toggle("is-open", open);
  ui.backgroundMenuButton.setAttribute("aria-expanded", String(open));
  ui.backgroundMenu.setAttribute("aria-hidden", String(!open));
}

function setBackgroundTheme(theme, persist = true) {
  if (!TIME_THEMES[theme]) return;

  game.backgroundTheme = theme;
  cachedSkyGradient = null;
  cachedSkyGradientTheme = "";
  updateBackgroundThemeUi();

  if (persist) {
    try {
      localStorage.setItem(BACKGROUND_STORAGE_KEY, theme);
    } catch {
      // 저장이 제한되어도 현재 세션에서는 선택한 배경을 유지합니다.
    }
  }

  drawScene(performance.now() / 1000);
}

function updateBackgroundThemeUi() {
  const labelKeys = {
    morning: "themeMorning",
    afternoon: "themeAfternoon",
    evening: "themeEvening",
    night: "themeNight",
  };
  ui.backgroundCurrent.textContent = t(labelKeys[game.backgroundTheme]);
  ui.backgroundOptions.forEach((option) => {
    const selected = option.dataset.background === game.backgroundTheme;
    option.classList.toggle("is-selected", selected);
    if (selected) option.setAttribute("aria-current", "true");
    else option.removeAttribute("aria-current");
  });
}

function updateHomeBest() {
  ui.homeBestScore.textContent = formatTranslation("homeBest", {
    score: formatScore(game.bestScore),
  });
}

function toggleSound() {
  game.soundEnabled = !game.soundEnabled;
  updateSoundUi();
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, game.soundEnabled ? "on" : "off");
  } catch {
    // 저장이 제한되어도 현재 세션의 효과음 설정은 유지합니다.
  }

  if (game.soundEnabled) {
    ensureAudio();
    audioMasterGain?.gain.setTargetAtTime(0.72, audioContext.currentTime, 0.015);
    playSound("toggle");
  } else if (audioMasterGain && audioContext) {
    audioMasterGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.012);
  }
}

function updateSoundUi() {
  const label = t(game.soundEnabled ? "soundOn" : "soundOff");
  ui.soundToggle.classList.toggle("is-active", game.soundEnabled);
  ui.soundToggle.setAttribute("aria-checked", String(game.soundEnabled));
  ui.soundToggle.setAttribute("aria-label", label);
  ui.soundToggle.title = label;
  ui.soundIcon.textContent = game.soundEnabled ? "🔊" : "🔇";
}

function ensureAudio() {
  if (!game.soundEnabled) return null;
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextClass) return null;

  try {
    audioContext ??= new AudioContextClass();
    if (!audioCompressor || !audioMasterGain) {
      audioCompressor = audioContext.createDynamicsCompressor();
      audioCompressor.threshold.value = -22;
      audioCompressor.knee.value = 16;
      audioCompressor.ratio.value = 8;
      audioCompressor.attack.value = 0.004;
      audioCompressor.release.value = 0.16;
      audioMasterGain = audioContext.createGain();
      audioMasterGain.gain.value = 0.72;
      audioCompressor.connect(audioMasterGain);
      audioMasterGain.connect(audioContext.destination);
    }
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
    return audioContext;
  } catch {
    return null;
  }
}

function playSound(kind) {
  const audio = ensureAudio();
  if (!audio) return;
  const now = audio.currentTime;
  const cooldown = SOUND_COOLDOWNS[kind] ?? 0;
  const lastPlayed = lastSoundTimes.get(kind) ?? -Infinity;
  if (now - lastPlayed < cooldown) return;
  lastSoundTimes.set(kind, now);

  const pattern = SOUND_PATTERNS[kind] ?? SOUND_PATTERNS.item;
  pattern.forEach(([frequency, offset, duration, type, volume, endFrequency]) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const startAt = now + offset;
    const endAt = startAt + duration;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(45, endFrequency), endAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + Math.min(0.018, duration * 0.3));
    gain.gain.exponentialRampToValueAtTime(0.0001, endAt);
    oscillator.connect(gain);
    gain.connect(audioCompressor);
    oscillator.start(startAt);
    oscillator.stop(endAt + 0.02);
  });
}

function vibrate(pattern) {
  navigator.vibrate?.(pattern);
}

function formatTranslation(key, values) {
  return Object.entries(values).reduce(
    (message, [name, value]) => message.replaceAll(`{${name}}`, String(value)),
    t(key),
  );
}

function toggleNoclip() {
  if (game.state !== "start") return;

  game.noclip = !game.noclip;
  updateNoclipUi();
}

function toggleHardMode() {
  if (game.state !== "start") return;

  game.hardMode = !game.hardMode;
  updateHardModeUi();
}

function updateNoclipUi() {
  ui.noclipToggle.classList.toggle("is-active", game.noclip);
  ui.noclipToggle.setAttribute("aria-checked", String(game.noclip));
}

function updateHardModeUi() {
  ui.hardModeToggle.classList.toggle("is-active", game.hardMode);
  ui.hardModeToggle.setAttribute("aria-checked", String(game.hardMode));
}

function currentStageDuration() {
  return game.hardMode ? HARD_STAGE_DURATION : STAGE_DURATION;
}

function nextBirdDelay() {
  return game.hardMode ? random(3.5, 5.5) : random(6, 10);
}

function nextShieldDelay() {
  return game.hardMode ? random(22, 30) : random(16, 24);
}

function nextBonusDelay() {
  return game.hardMode ? random(24, 34) : random(18, 28);
}

function nextHellWaveDelay() {
  return game.hardMode ? random(0.62, 0.82) : random(0.78, 1.02);
}

function showRewardMessage(messageKey, sound = "item") {
  showRewardText(t(messageKey), sound);
}

function showRewardText(message, sound = "item") {
  game.rewardMessage = message;
  game.rewardTimer = REWARD_MESSAGE_DURATION;
  playSound(sound);
}

function updateRunStats() {
  const message = formatTranslation("runStats", {
    time: formatDuration(game.runElapsed),
    score: formatScore(game.score),
  });
  ui.pauseRunStats.textContent = message;
  ui.finalRunStats.textContent = message;
}

function startGame() {
  cancelAnimationFrame(game.animationFrame);
  cancelStartCountdown();
  releaseControls();
  ensureAudio();

  game.stageIndex = game.hardMode ? DIFFICULTY_ORDER.indexOf("hard") : 0;
  game.difficulty = DIFFICULTY_ORDER[game.stageIndex];

  document.body.classList.add("game-active");
  document.body.classList.remove("game-playing");
  resizeWorld();

  game.state = "countdown";
  game.score = 0;
  game.stageElapsed = 0;
  game.stageBannerTimer = 0;
  game.stationaryPasses = 0;
  game.flash = 0;
  game.birdTimer = nextBirdDelay();
  game.windForce = 0;
  game.windTargetForce = 0;
  resetWind();
  game.umbrellaTimer = 0;
  game.umbrellaCharges = game.hardMode ? 1 : 3;
  game.speedBoostTimer = 0;
  game.speedBoostCharges = game.hardMode ? 2 : 5;
  game.runElapsed = 0;
  game.shieldReady = false;
  game.shieldPickupTimer = nextShieldDelay();
  game.nextSupplyScore = SUPPLY_SCORE_INTERVAL;
  game.rewardTimer = 0;
  game.rewardMessage = "";
  game.nextGiantScore = game.hardMode ? HARD_GIANT_SCORE_INTERVAL : GIANT_SCORE_INTERVAL;
  game.giantQueued = false;
  game.magnetTimer = 0;
  game.shrinkTimer = 0;
  game.bonusPickupTimer = nextBonusDelay();
  game.overlapWaveTimer = 0;
  game.scorePulse = 0;
  updateRunStats();

  positionPlayers();
  for (const character of [player, playerTwo]) {
    character.dead = false;
    character.lean = 0;
    character.runCycle = 0;
    character.moveDirection = 0;
    character.velocityX = 0;
  }

  clearObstacleLayer();

  hideScreen(ui.startScreen);
  hideScreen(ui.pauseScreen, true);
  hideScreen(ui.gameOverScreen);

  drawScene(performance.now() / 1000);
  beginStartCountdown();
}

function beginStartCountdown() {
  beginPlayCountdown("countdown", true);
}

function beginResumeCountdown() {
  beginPlayCountdown("resume-countdown", false);
}

function beginPlayCountdown(expectedState, createInitialWave) {
  const runId = ++countdownRunId;
  const steps = ["3", "2", "1", t("countdownGo")];
  let index = 0;

  ui.countdownOverlay.hidden = false;
  ui.countdownOverlay.classList.remove("is-finishing");

  const advance = () => {
    if (runId !== countdownRunId || game.state !== expectedState) return;

    if (index >= steps.length) {
      ui.countdownOverlay.classList.add("is-finishing");
      countdownTimer = window.setTimeout(() => {
        if (runId !== countdownRunId || game.state !== expectedState) return;
        ui.countdownOverlay.hidden = true;
        ui.countdownOverlay.classList.remove("is-finishing");
        game.state = "playing";
        document.body.classList.add("game-playing");
        game.lastTime = performance.now();
        if (createInitialWave) createWave(true);
        game.animationFrame = requestAnimationFrame(gameLoop);
      }, 220);
      return;
    }

    ui.countdownValue.textContent = steps[index];
    playSound(index === steps.length - 1 ? "go" : "countdown");
    ui.countdownValue.classList.remove("is-ticking");
    void ui.countdownValue.offsetWidth;
    ui.countdownValue.classList.add("is-ticking");
    index += 1;
    countdownTimer = window.setTimeout(advance, index === steps.length ? 520 : 680);
  };

  advance();
}

function cancelStartCountdown() {
  countdownRunId += 1;
  window.clearTimeout(countdownTimer);
  ui.countdownOverlay.hidden = true;
  ui.countdownOverlay.classList.remove("is-finishing");
  ui.countdownValue.classList.remove("is-ticking");
}

function pauseGame() {
  if (game.state !== "playing") return;

  game.state = "paused";
  document.body.classList.remove("game-playing");
  cancelAnimationFrame(game.animationFrame);
  releaseControls();
  updateRunStats();
  playSound("pause");
  showScreen(ui.pauseScreen);
  ui.resumeButton.focus({ preventScroll: true });
}

function resumeGame() {
  if (game.state !== "paused") return;

  game.state = "resume-countdown";
  releaseControls();
  playSound("resume");
  hideScreen(ui.pauseScreen);
  beginResumeCountdown();
}

function returnToPauseFromCountdown() {
  if (game.state !== "resume-countdown") return;

  cancelStartCountdown();
  game.state = "paused";
  document.body.classList.remove("game-playing");
  updateRunStats();
  showScreen(ui.pauseScreen);
  ui.resumeButton.focus({ preventScroll: true });
}

function showHome() {
  cancelAnimationFrame(game.animationFrame);
  cancelStartCountdown();
  releaseControls();
  game.stageIndex = game.hardMode ? DIFFICULTY_ORDER.indexOf("hard") : 0;
  game.difficulty = DIFFICULTY_ORDER[game.stageIndex];
  game.state = "start";
  game.score = 0;
  game.stationaryPasses = 0;
  game.flash = 0;
  game.birdTimer = nextBirdDelay();
  game.windForce = 0;
  game.windTargetForce = 0;
  game.windTimer = 0;
  game.umbrellaTimer = 0;
  game.umbrellaCharges = game.hardMode ? 1 : 3;
  game.speedBoostTimer = 0;
  game.speedBoostCharges = game.hardMode ? 2 : 5;
  game.runElapsed = 0;
  game.shieldReady = false;
  game.shieldPickupTimer = nextShieldDelay();
  game.nextSupplyScore = SUPPLY_SCORE_INTERVAL;
  game.rewardTimer = 0;
  game.rewardMessage = "";
  game.nextGiantScore = game.hardMode ? HARD_GIANT_SCORE_INTERVAL : GIANT_SCORE_INTERVAL;
  game.giantQueued = false;
  game.magnetTimer = 0;
  game.shrinkTimer = 0;
  game.bonusPickupTimer = nextBonusDelay();
  game.overlapWaveTimer = 0;
  game.scorePulse = 0;
  game.stageElapsed = 0;
  game.stageBannerTimer = 0;
  player.dead = false;
  playerTwo.dead = false;
  updateRunStats();
  clearObstacleLayer();
  showScreen(ui.startScreen);
  hideScreen(ui.pauseScreen);
  hideScreen(ui.gameOverScreen);
  document.body.classList.remove("game-active");
  document.body.classList.remove("game-playing");
  requestAnimationFrame(() => {
    resizeWorld();
    positionPlayers();
    drawScene(0);
  });
  ui.startButton.focus({ preventScroll: true });
}

function gameLoop(timestamp) {
  const elapsed = timestamp - game.lastTime;
  if (elapsed + 0.25 < MIN_FRAME_TIME) {
    game.animationFrame = requestAnimationFrame(gameLoop);
    return;
  }

  const delta = Math.min(elapsed / 1000, 0.034);
  game.lastTime = timestamp;

  update(delta);
  drawScene(timestamp / 1000);

  if (game.state === "playing") {
    game.animationFrame = requestAnimationFrame(gameLoop);
  }
}

function update(delta) {
  game.runElapsed += delta;
  game.umbrellaTimer = Math.max(0, game.umbrellaTimer - delta);
  game.speedBoostTimer = Math.max(0, game.speedBoostTimer - delta);
  game.magnetTimer = Math.max(0, game.magnetTimer - delta);
  game.shrinkTimer = Math.max(0, game.shrinkTimer - delta);
  game.stageBannerTimer = Math.max(0, game.stageBannerTimer - delta);
  game.rewardTimer = Math.max(0, game.rewardTimer - delta);
  game.scorePulse = Math.max(0, game.scorePulse - delta);
  game.flash *= Math.exp(-10 * delta);
  if (game.flash < 0.01) game.flash = 0;
  if (game.stageIndex < DIFFICULTY_ORDER.length - 1) {
    game.stageElapsed += delta;
    if (game.stageElapsed >= currentStageDuration()) advanceDifficultyStage();
  }
  updateWind(delta);
  const playerOneLeft = keys.p1Left || pressedKeys.has("KeyA") || (game.playerCount === 1 && pressedKeys.has("ArrowLeft"));
  const playerOneRight = keys.p1Right || pressedKeys.has("KeyD") || (game.playerCount === 1 && pressedKeys.has("ArrowRight"));
  const playerTwoLeft = keys.p2Left || pressedKeys.has("ArrowLeft");
  const playerTwoRight = keys.p2Right || pressedKeys.has("ArrowRight");
  const playerOneMoved = updatePlayerMovement(player, playerOneLeft, playerOneRight, delta);
  const playerTwoMoved = game.playerCount === 2
    ? updatePlayerMovement(playerTwo, playerTwoLeft, playerTwoRight, delta)
    : false;
  const activePlayers = getActivePlayers();
  updateShieldPickup(delta, activePlayers);
  updateBonusPickup(delta, activePlayers);

  if (playerOneMoved || playerTwoMoved) {
    game.stationaryPasses = 0;
  }

  const difficulty = DIFFICULTIES[game.difficulty];
  const scoreSpeed = Math.min(game.score * difficulty.speedGain, game.hardMode ? 420 : 300);
  const hardSpeedMultiplier = game.hardMode ? 1.28 : 1;
  const fallingWaveWasActive = obstacles.some((obstacle) => !obstacle.bounced);

  if (game.difficulty === "hell") {
    game.overlapWaveTimer -= delta;
    if (game.overlapWaveTimer <= 0) {
      const activeFallingCount = obstacles.reduce(
        (count, obstacle) => count + Number(!obstacle.bounced),
        0,
      );
      const availableSlots = HELL_ACTIVE_OBSTACLE_LIMIT - activeFallingCount;
      if (availableSlots >= 6) {
        createWave(false, availableSlots);
        playSound("wave");
      }
      game.overlapWaveTimer = nextHellWaveDelay();
    }
  }

  for (const obstacle of obstacles) {
    if (obstacle.bounced) {
      obstacle.x += obstacle.velocityX * delta;
      obstacle.y += obstacle.velocityY * delta;
      obstacle.velocityY += 320 * delta;
      obstacle.rotation += delta * obstacle.spin;
      continue;
    }

    obstacle.y +=
      (difficulty.baseSpeed + scoreSpeed + obstacle.speedOffset) * hardSpeedMultiplier * delta;
    if (isWindDifficulty()) {
      obstacle.x = clamp(
        obstacle.x + game.windForce * obstacle.windFactor * delta,
        obstacle.radius + 12,
        WORLD.width - obstacle.radius - 12,
      );
    }
    obstacle.rotation += delta * obstacle.spin;
    obstacle.wobble += delta * obstacle.wobbleSpeed;

    const umbrellaOwner = game.umbrellaTimer > 0
      ? activePlayers.find((character) => collidesUmbrella(character, obstacle))
      : null;
    if (umbrellaOwner) {
      bounceObstacle(obstacle, umbrellaOwner);
      playSound("bounce");
      continue;
    }

    const hitPlayer = !game.noclip
      ? activePlayers.find((character) => collides(character, obstacle))
      : null;
    if (hitPlayer) {
      if (game.shieldReady) {
        game.shieldReady = false;
        bounceObstacle(obstacle, hitPlayer);
        showRewardMessage("shieldSaved", "shield");
        vibrate([70, 35, 70]);
        continue;
      }
      endGame(hitPlayer);
      return;
    }

  }

  updateBirdEvent(delta, activePlayers);
  if (game.state !== "playing") return;

  const activeObstacles = [];
  for (const obstacle of obstacles) {
    if (obstacle.clearedByUmbrella) {
      obstacle.element.remove();
    } else if (
      obstacle.bounced &&
      (obstacle.x < -obstacle.radius * 3 ||
        obstacle.x > WORLD.width + obstacle.radius * 3 ||
        obstacle.y < -obstacle.radius * 4 ||
        obstacle.y > WORLD.height + obstacle.radius * 3)
    ) {
      obstacle.element.remove();
    } else if (!obstacle.bounced && obstacle.y - obstacle.radius > WORLD.height) {
      game.stationaryPasses += 1;
      game.score += 1;
      if (game.score % 10 === 0) {
        game.scorePulse = 0.5;
        vibrate(24);
      }
      awardMilestoneSupply();
      queueGiantPoop();
      obstacle.element.remove();
    } else {
      activeObstacles.push(obstacle);
    }
  }
  obstacles = activeObstacles;
  const hasFallingObstacles = obstacles.some((obstacle) => !obstacle.bounced);
  if (fallingWaveWasActive && !hasFallingObstacles && game.difficulty !== "hell") {
    playSound("wave");
    createWave(false);
  }
}

function updatePlayerMovement(character, movingLeft, movingRight, delta) {
  const keyboardDirection = Number(movingRight) - Number(movingLeft);
  const minX = character.width / 2 + 20;
  const maxX = WORLD.width - character.width / 2 - 20;
  const previousX = character.x;
  const itemSpeedMultiplier = game.speedBoostTimer > 0 ? SPEED_BOOST_MULTIPLIER : 1;
  const maxSpeed = character.speed * itemSpeedMultiplier;
  const targetVelocity = keyboardDirection * maxSpeed;
  const direction = Math.sign(targetVelocity);
  const response = direction === 0 ? 18 : 13;
  const velocityBlend = 1 - Math.exp(-response * delta);
  character.velocityX += (targetVelocity - character.velocityX) * velocityBlend;
  if (direction === 0 && Math.abs(character.velocityX) < 1) character.velocityX = 0;

  const nextX = character.x + character.velocityX * delta;
  character.x = clamp(nextX, minX, maxX);
  if (character.x !== nextX) character.velocityX = 0;

  character.moveDirection = Math.abs(character.velocityX) > 1 ? Math.sign(character.velocityX) : 0;
  if (character.moveDirection !== 0) character.facing = character.moveDirection;

  const movementRatio = clamp(character.velocityX / (character.speed * itemSpeedMultiplier), -1, 1);
  character.lean += (movementRatio * 0.12 - character.lean) * (1 - Math.exp(-12 * delta));
  character.runCycle += Math.abs(movementRatio) * delta * 14;
  return Math.abs(character.x - previousX) > 0.01;
}

function getActivePlayers() {
  return game.playerCount === 2 ? [player, playerTwo] : [player];
}

function positionPlayers() {
  player.x = game.playerCount === 2 ? WORLD.width / 3 : WORLD.width / 2;
  playerTwo.x = (WORLD.width * 2) / 3;
  player.y = WORLD.height - 112;
  playerTwo.y = WORLD.height - 112;
  player.velocityX = 0;
  playerTwo.velocityX = 0;
}

function updateWind(delta) {
  if (!isWindDifficulty()) return;

  game.windForce +=
    (game.windTargetForce - game.windForce) * (1 - Math.exp(-2.6 * delta));
  game.windTimer -= delta;
  if (game.windTimer <= 0) resetWind(true);
}

function resetWind(reverseDirection = false) {
  if (!isWindDifficulty()) {
    game.windForce = 0;
    game.windTargetForce = 0;
    game.windTimer = 0;
    return;
  }

  const currentDirection = Math.sign(game.windTargetForce || game.windForce);
  const direction = reverseDirection && currentDirection !== 0
    ? -currentDirection
    : Math.random() < 0.5
      ? -1
      : 1;
  game.windTargetForce = direction * random(70, 125);
  game.windTimer = random(2.4, 4.2);
}

function isWindDifficulty() {
  return game.difficulty === "hard" || game.difficulty === "hell";
}

function advanceDifficultyStage() {
  if (game.stageIndex < 0 || game.stageIndex >= DIFFICULTY_ORDER.length - 1) return;

  game.stageIndex += 1;
  game.difficulty = DIFFICULTY_ORDER[game.stageIndex];
  game.stageElapsed = 0;
  game.stageBannerTimer = STAGE_BANNER_DURATION;
  game.overlapWaveTimer = game.difficulty === "hell" ? nextHellWaveDelay() : 0;
  resetWind();
  playSound("stage");
}

function endGame(defeatedPlayer = player) {
  game.state = "gameover";
  document.body.classList.remove("game-playing");
  game.flash = 1;
  defeatedPlayer.dead = true;
  releaseControls();
  vibrate([120, 50, 160]);

  const previousBest = game.bestScore;
  const isNewRecord = game.score > previousBest;
  playSound(isNewRecord ? "record" : "hit");
  if (isNewRecord) {
    game.bestScore = game.score;
    writeBestScore(game.bestScore);
  }
  updateHomeBest();
  updateRunStats();

  ui.finalScore.textContent = String(game.score);
  ui.gameOverTitle.textContent = game.playerCount === 2
    ? formatTranslation("playerDefeated", { player: defeatedPlayer.label })
    : t("gameOverTitle");
  ui.recordMessage.textContent = isNewRecord
    ? t("recordNew")
    : formatTranslation("recordBest", { score: previousBest });

  drawScene(performance.now() / 1000);
  window.setTimeout(() => {
    if (game.state !== "gameover") return;
    showScreen(ui.gameOverScreen);
    ui.restartButton.focus({ preventScroll: true });
  }, 360);
}

function showScreen(screen) {
  screen.classList.remove("is-leaving", "is-entering");
  screen.hidden = false;
  void screen.offsetWidth;
  screen.classList.add("is-entering");
  window.setTimeout(() => screen.classList.remove("is-entering"), 430);
}

function hideScreen(screen, immediately = false) {
  if (screen.hidden) return;

  screen.classList.remove("is-entering");
  if (immediately) {
    screen.hidden = true;
    screen.classList.remove("is-leaving");
    return;
  }

  screen.classList.add("is-leaving");
  window.setTimeout(() => {
    if (!screen.classList.contains("is-leaving")) return;
    screen.hidden = true;
    screen.classList.remove("is-leaving");
  }, 390);
}

function createWave(firstWave, maximumCount = Number.POSITIVE_INFINITY) {
  const difficulty = DIFFICULTIES[game.difficulty];
  const requestedCount = difficulty.waveSize() + (game.hardMode ? 2 : 0);
  const count = Math.min(requestedCount, Math.max(1, Math.floor(maximumCount)));
  const targetsPlayer = game.stationaryPasses >= (game.hardMode ? 2 : 3);
  const targetIndex = targetsPlayer ? randomInteger(0, count - 1) : -1;
  const activePlayers = getActivePlayers();
  const targetedCharacter = targetsPlayer
    ? activePlayers[randomInteger(0, activePlayers.length - 1)]
    : player;
  const isHard = game.difficulty === "hard";
  const isHell = game.difficulty === "hell";
  const speedOffsets = createDistinctValues(count, difficulty.speedOffsetRange);
  const radii = createDistinctValues(count, difficulty.sizeRange);
  const newObstacles = Array.from({ length: count }, (_, index) => {
    const targetsPlayerThisTime = index === targetIndex;
    const element = document.createElement("span");
    element.className = "poop-obstacle";
    element.textContent = "💩";
    ui.obstacleLayer.append(element);

    return {
      x: targetsPlayerThisTime
        ? clamp(targetedCharacter.x + random(-16, 16), 58, WORLD.width - 58)
        : random(58, WORLD.width - 58),
      y: isHell
        ? -random(70 + index * 18, 190 + index * 30)
        : isHard
        ? -82
        : firstWave
          ? -random(110, 260)
          : -random(70 + index * 28, 250 + index * 50),
      radius: radii[index],
      rotation: random(-0.12, 0.12),
      wobble: random(0, Math.PI * 2),
      wobbleSpeed: isHell ? random(6.2, 8.2) : isHard ? 5.4 : random(3.4, 4.8),
      wobbleAmount: isHell ? random(34, 52) : isHard ? 28 : 7,
      spin: isHell ? random(-0.7, 0.7) : isHard ? 0 : random(-0.35, 0.35),
      speedOffset: speedOffsets[index],
      windFactor: random(0.78, 1.22),
      targetsPlayer: targetsPlayerThisTime,
      element,
    };
  });

  if (game.giantQueued) {
    const element = document.createElement("span");
    element.className = "poop-obstacle giant-poop";
    element.textContent = "💩";
    ui.obstacleLayer.append(element);
    newObstacles.push({
      x: random(90, WORLD.width - 90),
      y: -130,
      radius: random(72, 88),
      rotation: random(-0.08, 0.08),
      wobble: random(0, Math.PI * 2),
      wobbleSpeed: random(1.8, 2.6),
      wobbleAmount: game.hardMode ? 28 : 18,
      spin: random(-0.18, 0.18),
      speedOffset: game.hardMode ? -80 : -120,
      windFactor: 0.68,
      targetsPlayer: false,
      isGiant: true,
      element,
    });
    game.giantQueued = false;
  }
  obstacles.push(...newObstacles);
}

function updateBirdEvent(delta, activePlayers) {
  game.birdTimer -= delta;
  if (!bird) {
    if (game.birdTimer <= 0) createBird();
  } else {
    bird.x -= bird.speed * delta;
    bird.flap += delta * bird.flapSpeed;
    bird.flightPhase += delta * (game.hardMode ? 1.85 : 1.45);
    const flightTargetY =
      bird.baseY +
      Math.sin(bird.flightPhase) * 16 +
      Math.sin(bird.flightPhase * 0.47 + 1.2) * 6;
    bird.y += (flightTargetY - bird.y) * (1 - Math.exp(-3.8 * delta));

    if (!bird.dropped && bird.x <= bird.dropX) {
      createBirdDropping(bird.x, bird.y + 28);
      playSound("birdDrop");
      bird.dropped = true;
    }

    if (bird.x < -bird.radius * 2) {
      bird.element.remove();
      bird = null;
    }
  }

  const activeDroppings = [];
  for (const dropping of birdDroppings) {
    dropping.x += dropping.drift * delta;
    dropping.y += dropping.speed * delta;
    if (game.magnetTimer > 0) attractCollectible(dropping, activePlayers, delta);
    dropping.rotation += dropping.spin * delta;
    dropping.wobble += dropping.wobbleSpeed * delta;

    if (activePlayers.some((character) => collides(character, dropping))) {
      game.umbrellaCharges = Math.min(5, game.umbrellaCharges + 1);
      playSound("birdPickup");
      vibrate(35);
      dropping.element.remove();
      continue;
    }

    if (dropping.y - dropping.radius > WORLD.height) {
      dropping.element.remove();
    } else {
      activeDroppings.push(dropping);
    }
  }
  birdDroppings = activeDroppings;
}

function updateShieldPickup(delta, activePlayers) {
  if (!shieldPickup) {
    game.shieldPickupTimer -= delta;
    if (game.shieldPickupTimer <= 0) createShieldPickup();
    return;
  }

  shieldPickup.y += shieldPickup.speed * delta;
  if (game.magnetTimer > 0) attractCollectible(shieldPickup, activePlayers, delta);
  shieldPickup.rotation += shieldPickup.spin * delta;
  shieldPickup.wobble += shieldPickup.wobbleSpeed * delta;

  if (activePlayers.some((character) => collides(character, shieldPickup))) {
    game.shieldReady = true;
    showRewardMessage("shieldCollected", "item");
    vibrate(35);
    removeShieldPickup();
    return;
  }

  if (shieldPickup.y - shieldPickup.radius > WORLD.height) removeShieldPickup();
}

function createShieldPickup() {
  const element = document.createElement("span");
  element.className = "shield-pickup";
  element.textContent = "⭐";
  ui.obstacleLayer.append(element);
  playSound("itemSpawn");

  shieldPickup = {
    x: random(70, WORLD.width - 70),
    y: -60,
    radius: 27,
    speed: game.hardMode ? 350 : 270,
    rotation: 0,
    spin: random(-0.7, 0.7),
    wobble: random(0, Math.PI * 2),
    wobbleSpeed: random(3.2, 4.4),
    wobbleAmount: 15,
    element,
  };
}

function removeShieldPickup() {
  shieldPickup?.element.remove();
  shieldPickup = null;
  game.shieldPickupTimer = nextShieldDelay();
}

function updateBonusPickup(delta, activePlayers) {
  if (!bonusPickup) {
    game.bonusPickupTimer -= delta;
    if (game.bonusPickupTimer <= 0) createBonusPickup();
    return;
  }

  bonusPickup.y += bonusPickup.speed * delta;
  bonusPickup.rotation += bonusPickup.spin * delta;
  bonusPickup.wobble += bonusPickup.wobbleSpeed * delta;
  if (game.magnetTimer > 0) attractCollectible(bonusPickup, activePlayers, delta);

  if (activePlayers.some((character) => collides(character, bonusPickup))) {
    if (bonusPickup.kind === "magnet") {
      game.magnetTimer = BONUS_EFFECT_DURATION;
      showRewardMessage("magnetCollected", "item");
    } else {
      game.shrinkTimer = BONUS_EFFECT_DURATION;
      showRewardMessage("shrinkCollected", "item");
    }
    vibrate(45);
    removeBonusPickup();
    return;
  }

  if (bonusPickup.y - bonusPickup.radius > WORLD.height) removeBonusPickup();
}

function createBonusPickup() {
  const kind = Math.random() < 0.5 ? "magnet" : "shrink";
  const element = document.createElement("span");
  element.className = `bonus-pickup bonus-${kind}`;
  element.textContent = kind === "magnet" ? "🧲" : "🫧";
  ui.obstacleLayer.append(element);
  playSound("itemSpawn");

  bonusPickup = {
    kind,
    x: random(70, WORLD.width - 70),
    y: -60,
    radius: 27,
    speed: game.hardMode ? 360 : 275,
    rotation: 0,
    spin: random(-0.8, 0.8),
    wobble: random(0, Math.PI * 2),
    wobbleSpeed: random(3, 4.2),
    wobbleAmount: 13,
    element,
  };
}

function removeBonusPickup() {
  bonusPickup?.element.remove();
  bonusPickup = null;
  game.bonusPickupTimer = nextBonusDelay();
}

function attractCollectible(collectible, activePlayers, delta) {
  const collectibleX = obstacleDrawX(collectible);
  const target = activePlayers.reduce((nearest, character) => {
    const distance = Math.hypot(character.x - collectibleX, character.y - collectible.y);
    return !nearest || distance < nearest.distance ? { character, distance } : nearest;
  }, null);
  if (!target || target.distance > 390) return;

  const pull = 1 - target.distance / 390;
  collectible.x += clamp((target.character.x - collectibleX) * 3.8 * pull, -260, 260) * delta;
  collectible.y += clamp((target.character.y - collectible.y) * 1.4 * pull, 0, 180) * delta;
}

function awardMilestoneSupply() {
  while (game.score >= game.nextSupplyScore) {
    let messageKey;
    if (game.umbrellaCharges < 5 && game.umbrellaCharges <= game.speedBoostCharges) {
      game.umbrellaCharges += 1;
      messageKey = "supplyUmbrella";
    } else if (game.speedBoostCharges < 5) {
      game.speedBoostCharges += 1;
      messageKey = "supplySpeed";
    } else {
      game.shieldReady = true;
      messageKey = "supplyShield";
    }
    game.nextSupplyScore += SUPPLY_SCORE_INTERVAL;
    showRewardMessage(messageKey);
  }
}

function queueGiantPoop() {
  let queuedNow = false;
  const interval = game.hardMode ? HARD_GIANT_SCORE_INTERVAL : GIANT_SCORE_INTERVAL;
  while (game.score >= game.nextGiantScore) {
    game.giantQueued = true;
    game.nextGiantScore += interval;
    queuedNow = true;
  }
  if (queuedNow) {
    showRewardMessage("giantWarning", "warning");
    vibrate([40, 35, 40]);
  }
}

function collidesUmbrella(character, obstacle) {
  const obstacleX = obstacleDrawX(obstacle);
  const canopyY = character.y - 92;
  const overlapsX = Math.abs(obstacleX - character.x) < 68 + obstacle.radius * 0.58;
  const overlapsY =
    obstacle.y + obstacle.radius * 0.72 >= canopyY - 14 &&
    obstacle.y - obstacle.radius * 0.36 <= canopyY + 24;
  return overlapsX && overlapsY;
}

function bounceObstacle(obstacle, umbrellaOwner) {
  const obstacleX = obstacleDrawX(obstacle);
  const direction = obstacleX >= umbrellaOwner.x ? 1 : -1;
  obstacle.x = obstacleX;
  obstacle.wobbleAmount = 0;
  obstacle.bounced = true;
  obstacle.velocityX = direction * random(430, 570);
  obstacle.velocityY = -random(720, 860);
  obstacle.spin = direction * random(4.5, 7);
}

function activateUmbrella() {
  if (game.umbrellaTimer > 0) return;
  if (game.umbrellaCharges <= 0) {
    showRewardMessage("umbrellaEmpty", "empty");
    vibrate([18, 28, 18]);
    return;
  }

  game.umbrellaCharges -= 1;
  game.umbrellaTimer = 2;
  playSound("umbrella");
  vibrate(24);
}

function activateSpeedBoost() {
  if (game.speedBoostTimer > 0) return;
  if (game.speedBoostCharges <= 0) {
    showRewardMessage("speedEmpty", "empty");
    vibrate([18, 28, 18]);
    return;
  }

  game.speedBoostCharges -= 1;
  game.speedBoostTimer = SPEED_BOOST_DURATION;
  playSound("speed");
  vibrate(24);
}

function createBird() {
  const birdSpeeds = { easy: 230, normal: 250, hard: 280, hell: 360 };
  const birdIcons = ["🐦"];
  const startY = random(130, 300);
  const element = document.createElement("span");
  element.className = "bird-hazard";
  element.textContent = birdIcons[randomInteger(0, birdIcons.length - 1)];
  ui.obstacleLayer.append(element);
  playSound("bird");

  bird = {
    x: WORLD.width + 80,
    y: startY,
    baseY: startY,
    radius: 42,
    speed: birdSpeeds[game.difficulty] * (game.hardMode ? 1.2 : 1),
    dropX: random(WORLD.width * 0.22, WORLD.width * 0.78),
    dropped: false,
    flap: random(0, Math.PI * 2),
    flapSpeed: game.difficulty === "hell" ? 9 : 7,
    flightPhase: random(0, Math.PI * 2),
    element,
  };
  game.birdTimer = nextBirdDelay();
}

function createBirdDropping(x, y) {
  const droppingSpeeds = { easy: 400, normal: 450, hard: 500, hell: 620 };
  const element = document.createElement("span");
  element.className = "bird-dropping";
  element.textContent = "💩";
  ui.obstacleLayer.append(element);

  birdDroppings.push({
    x,
    y,
    radius: game.difficulty === "hell" ? 27 : 24,
    speed:
      (droppingSpeeds[game.difficulty] + Math.min(game.score * 7, 140)) *
      (game.hardMode ? 1.18 : 1),
    drift: random(-38, 38),
    rotation: random(-0.25, 0.25),
    spin: random(-1.2, 1.2),
    wobble: random(0, Math.PI * 2),
    wobbleSpeed: random(4, 6),
    wobbleAmount: 5,
    element,
  });
}

function drawScene(time) {
  context.clearRect(0, 0, WORLD.width, WORLD.height);
  drawBackground(time);
  drawFallWarnings();
  const activePlayers = getActivePlayers();
  activePlayers.forEach(drawProtectionShield);
  activePlayers.forEach(drawUmbrella);
  activePlayers.forEach(drawPlayer);
  if (game.playerCount === 2) activePlayers.forEach(drawPlayerLabel);
  if (game.state !== "start") drawScore();
  if (game.rewardTimer > 0) drawRewardToast();
  renderObstacleLayer();

  if (game.flash > 0) {
    context.fillStyle = `rgba(255, 109, 74, ${game.flash * 0.25})`;
    context.fillRect(0, 0, WORLD.width, WORLD.height);
  }
}

function drawFallWarnings() {
  context.save();

  for (const obstacle of obstacles) {
    if (!obstacle.bounced) drawFallWarning(obstacle, "255, 109, 74");
  }
  for (const dropping of birdDroppings) {
    drawFallWarning(dropping, "85, 184, 255");
  }
  if (shieldPickup) drawFallWarning(shieldPickup, "255, 209, 102");
  if (bonusPickup) drawFallWarning(bonusPickup, "142, 231, 255");

  context.restore();
}

function drawFallWarning(hazard, color) {
  const progress = clamp((hazard.y + 180) / (WORLD.height + 180), 0, 1);
  if (progress <= 0.05) return;

  const x = obstacleDrawX(hazard);
  const sinkProgress = clamp((hazard.y - PILE_FLOOR_Y + hazard.radius) / 72, 0, 1);
  const visibility = 1 - sinkProgress;
  if (visibility <= 0.02) return;
  const markerWidth = clamp(hazard.radius * (0.75 + progress * 0.8) * (0.72 + visibility * 0.28), 10, 62);
  const markerHeight = Math.max(5, markerWidth * 0.24);
  const markerY = PILE_FLOOR_Y + 3 + sinkProgress * 18;
  context.beginPath();
  context.ellipse(x, markerY, markerWidth, markerHeight, 0, 0, Math.PI * 2);
  context.fillStyle = `rgba(${color}, ${(0.05 + progress * 0.16) * visibility})`;
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = `rgba(${color}, ${(0.2 + progress * 0.58) * visibility})`;
  context.stroke();
}

function drawScore() {
  const panelWidth = 112;
  const panelX = (WORLD.width - panelWidth) / 2;
  const compactHud = WORLD.width < 560;
  const hasNewBest = !game.noclip && game.score > game.bestScore;
  const scorePulse = clamp(game.scorePulse / 0.5, 0, 1);
  let compactBadgeY = 136;

  context.save();
  if (scorePulse > 0) {
    context.shadowColor = "rgba(216, 255, 69, 0.95)";
    context.shadowBlur = 10 + scorePulse * 22;
  }
  context.fillStyle = "rgba(23, 22, 20, 0.84)";
  roundedRect(context, panelX, 24, panelWidth, 64, 14);
  context.fill();
  context.shadowBlur = 0;

  context.fillStyle = "rgba(246, 240, 228, 0.94)";
  context.font = canvasFont(800, 12);
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillText(t("fallenPoop"), panelX + panelWidth / 2, 35);

  context.fillStyle = scorePulse > 0 ? "#d8ff45" : "#f6f0e4";
  context.font = canvasFont(900, 27);
  context.fillText(formatScore(game.score), panelX + panelWidth / 2, 51);

  drawStageProgress();

  if (hasNewBest) {
    const badgeX = compactHud ? (WORLD.width - 102) / 2 : panelX + panelWidth + 12;
    const badgeY = compactHud ? compactBadgeY : 39;
    context.fillStyle = "#d8ff45";
    roundedRect(context, badgeX, badgeY, 102, 34, 17);
    context.fill();

    context.fillStyle = "#171614";
    context.font = canvasFont(900, 13);
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillText(t("newBest"), badgeX + 14, badgeY + 17);
    if (compactHud) compactBadgeY += 42;
  }

  if (game.noclip) {
    const badgeWidth = 92;
    const badgeX = compactHud ? (WORLD.width - badgeWidth) / 2 : panelX - badgeWidth - 12;
    const badgeY = compactHud ? compactBadgeY : 39;
    context.fillStyle = "#a889ff";
    roundedRect(context, badgeX, badgeY, badgeWidth, 34, 17);
    context.fill();

    context.fillStyle = "#171614";
    context.font = canvasFont(900, 12);
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillText(t("noclipBadge"), badgeX + 17, badgeY + 17);
    if (compactHud) compactBadgeY += 42;
  }

  if (game.hardMode) {
    const badgeWidth = 82;
    const badgeX = compactHud ? (WORLD.width - badgeWidth) / 2 : WORLD.width - badgeWidth - 18;
    const badgeY = compactHud ? compactBadgeY : 39;
    context.fillStyle = "#ff6d4a";
    roundedRect(context, badgeX, badgeY, badgeWidth, 34, 17);
    context.fill();

    context.fillStyle = "#171614";
    context.font = canvasFont(900, 12);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(t("hardModeBadge"), badgeX + badgeWidth / 2, badgeY + 17);
    if (compactHud) compactBadgeY += 42;
  }

  if (isWindDifficulty()) {
    const badgeWidth = 116;
    const badgeX = compactHud ? (WORLD.width - badgeWidth) / 2 : WORLD.width - badgeWidth - 18;
    const badgeY = compactHud ? compactBadgeY : game.hardMode ? 81 : 39;
    const arrow = game.windForce < 0 ? "←" : "→";
    context.fillStyle = "#55b8ff";
    roundedRect(context, badgeX, badgeY, badgeWidth, 34, 17);
    context.fill();

    context.fillStyle = "#102025";
    context.font = canvasFont(900, 12);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(`${arrow} ${t("windBadge")} ${arrow}`, badgeX + badgeWidth / 2, badgeY + 17);
    if (compactHud) compactBadgeY += 42;
  }

  if (game.stageBannerTimer > 0) {
    const elapsed = STAGE_BANNER_DURATION - game.stageBannerTimer;
    const alpha = Math.min(1, elapsed / 0.22, game.stageBannerTimer / 0.38);
    const bannerWidth = 190;
    const bannerX = (WORLD.width - bannerWidth) / 2;
    const bannerY = compactHud ? compactBadgeY : 136;

    context.save();
    context.globalAlpha = alpha;
    context.translate(0, (1 - alpha) * 10);
    context.fillStyle = game.difficulty === "hell" ? "#ff6d4a" : "#d8ff45";
    roundedRect(context, bannerX, bannerY, bannerWidth, 42, 21);
    context.fill();
    context.fillStyle = "#171614";
    context.font = canvasFont(900, 14);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      formatTranslation("stageUp", { difficulty: t(game.difficulty) }),
      WORLD.width / 2,
      bannerY + 21,
    );
    context.restore();
  }

  const inventoryWidth = compactHud ? 110 : 144;
  const inventoryX = 12;
  const umbrellaInventoryY = 24;
  const speedInventoryY = 88;
  const inventoryKeyWidth = compactHud ? 32 : 40;
  context.fillStyle = "rgba(23, 22, 20, 0.86)";
  roundedRect(context, inventoryX, umbrellaInventoryY, inventoryWidth, 56, 14);
  context.fill();

  context.fillStyle = "rgba(246, 240, 228, 0.94)";
  context.font = canvasFont(800, compactHud ? 9 : 10);
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText(t("umbrellaUses"), inventoryX + 12, umbrellaInventoryY + 9);
  drawInventoryKey(
    compactHud ? "SPC" : "SPACE",
    inventoryX + inventoryWidth - inventoryKeyWidth - 8,
    umbrellaInventoryY + 6,
    inventoryKeyWidth,
  );

  context.fillStyle = game.umbrellaCharges === 0
    ? "#ff6d4a"
    : game.umbrellaCharges === 1
      ? "#ffd166"
      : "#55b8ff";
  context.font = canvasFont(900, 23);
  context.fillText(`☂ ${game.umbrellaCharges} / 5`, inventoryX + 12, umbrellaInventoryY + 26);

  context.fillStyle = "rgba(23, 22, 20, 0.86)";
  roundedRect(context, inventoryX, speedInventoryY, inventoryWidth, 56, 14);
  context.fill();

  context.fillStyle = "rgba(246, 240, 228, 0.94)";
  context.font = canvasFont(800, compactHud ? 9 : 10);
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText(t("speedBoostUses"), inventoryX + 12, speedInventoryY + 9);
  drawInventoryKey(
    compactHud ? "SFT" : "SHIFT",
    inventoryX + inventoryWidth - inventoryKeyWidth - 8,
    speedInventoryY + 6,
    inventoryKeyWidth,
  );

  context.fillStyle = game.speedBoostCharges === 0
    ? "#ff6d4a"
    : game.speedBoostCharges === 1
      ? "#ffb347"
      : "#ffd166";
  context.font = canvasFont(900, 23);
  context.fillText(`⚡ ${game.speedBoostCharges} / 5`, inventoryX + 12, speedInventoryY + 26);

  context.restore();
  drawActiveEffectDock();
}

function drawActiveEffectDock() {
  const effects = [];
  if (game.umbrellaTimer > 0) {
    effects.push({
      label: `☂ ${t("umbrellaActive")} ${game.umbrellaTimer.toFixed(1)}s`,
      color: "#55b8ff",
      seconds: game.umbrellaTimer,
    });
  }
  if (game.speedBoostTimer > 0) {
    effects.push({
      label: `⚡ ${t("speedBoostActive")} ${game.speedBoostTimer.toFixed(1)}s`,
      color: "#ffd166",
      seconds: game.speedBoostTimer,
    });
  }
  if (game.magnetTimer > 0) {
    effects.push({
      label: `🧲 ${formatTranslation("magnetActive", { seconds: game.magnetTimer.toFixed(1) })}`,
      color: "#8ee7ff",
      seconds: game.magnetTimer,
    });
  }
  if (game.shrinkTimer > 0) {
    effects.push({
      label: `🫧 ${formatTranslation("shrinkActive", { seconds: game.shrinkTimer.toFixed(1) })}`,
      color: "#a889ff",
      seconds: game.shrinkTimer,
    });
  }
  if (effects.length === 0) return;

  const compactHud = WORLD.width < 560;
  const mobileControlsVisible = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const fontSize = compactHud ? 12 : 14;
  const itemGap = compactHud ? 12 : 18;
  const horizontalPadding = 16;
  const panelHeight = 42;
  const labels = effects.map(({ label }) => label);

  context.save();
  context.font = canvasFont(900, fontSize);
  context.textAlign = "left";
  context.textBaseline = "middle";

  const widths = labels.map((label) => context.measureText(label).width);
  const naturalWidth =
    widths.reduce((sum, width) => sum + width, 0) + itemGap * Math.max(0, labels.length - 1);
  const panelWidth = Math.min(WORLD.width - 24, naturalWidth + horizontalPadding * 2);
  const panelX = (WORLD.width - panelWidth) / 2;
  const panelY = mobileControlsVisible ? WORLD.height - 224 : WORLD.height - 58;

  context.fillStyle = "rgba(23, 22, 20, 0.88)";
  roundedRect(context, panelX, panelY, panelWidth, panelHeight, 18);
  context.fill();
  context.strokeStyle = "rgba(246, 240, 228, 0.18)";
  context.lineWidth = 1;
  context.stroke();

  const availableWidth = panelWidth - horizontalPadding * 2;
  const scale = naturalWidth > availableWidth ? availableWidth / naturalWidth : 1;
  context.translate(panelX + horizontalPadding, panelY + panelHeight / 2);
  context.scale(scale, scale);

  let x = 0;
  effects.forEach((effect, index) => {
    context.globalAlpha = effect.seconds < 1
      ? 0.58 + Math.abs(Math.sin(effect.seconds * 18)) * 0.42
      : 1;
    context.fillStyle = effect.color;
    context.fillText(labels[index], x, 0);
    x += widths[index] + itemGap;
  });
  context.globalAlpha = 1;
  context.restore();
}

function drawStageProgress() {
  const stageDuration = currentStageDuration();
  const isFinalStage = game.stageIndex >= DIFFICULTY_ORDER.length - 1;
  const progress = isFinalStage ? 1 : clamp(game.stageElapsed / stageDuration, 0, 1);
  const seconds = Math.max(0, Math.ceil(stageDuration - game.stageElapsed));
  const width = 190;
  const x = (WORLD.width - width) / 2;
  const y = 96;
  const accent = game.difficulty === "hell" ? "#ff6d4a" : game.difficulty === "hard" ? "#ffd166" : "#d8ff45";
  const label = isFinalStage
    ? formatTranslation("stageFinal", { difficulty: t(game.difficulty) })
    : formatTranslation("stageProgress", { difficulty: t(game.difficulty), seconds });

  context.fillStyle = "rgba(23, 22, 20, 0.84)";
  roundedRect(context, x, y, width, 31, 12);
  context.fill();

  context.fillStyle = "rgba(246, 240, 228, 0.98)";
  context.font = canvasFont(900, 11);
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillText(label, WORLD.width / 2, y + 6);

  context.fillStyle = "rgba(246, 240, 228, 0.14)";
  roundedRect(context, x + 10, y + 22, width - 20, 4, 2);
  context.fill();

  if (progress > 0) {
    context.fillStyle = accent;
    roundedRect(context, x + 10, y + 22, (width - 20) * progress, 4, 2);
    context.fill();
  }
}

function drawInventoryKey(label, x, y, width) {
  context.save();
  context.fillStyle = "rgba(246, 240, 228, 0.16)";
  roundedRect(context, x, y, width, 18, 5);
  context.fill();
  context.strokeStyle = "rgba(246, 240, 228, 0.4)";
  context.lineWidth = 1;
  context.stroke();
  context.fillStyle = "#f6f0e4";
  context.font = canvasFont(900, 9);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, x + width / 2, y + 9);
  context.restore();
}

function drawRewardToast() {
  const alpha = Math.min(1, game.rewardTimer / 0.3, (REWARD_MESSAGE_DURATION - game.rewardTimer) / 0.2);
  const width = Math.min(330, WORLD.width - 40);
  const x = (WORLD.width - width) / 2;
  const mobileControlsVisible = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const y = mobileControlsVisible ? WORLD.height - 284 : WORLD.height - 210;

  context.save();
  context.globalAlpha = Math.max(0, alpha);
  context.translate(0, (1 - alpha) * 12);
  context.fillStyle = "rgba(23, 22, 20, 0.9)";
  roundedRect(context, x, y, width, 44, 22);
  context.fill();
  context.strokeStyle = "#ffd166";
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = "#ffd166";
  context.font = canvasFont(900, 13);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(game.rewardMessage, WORLD.width / 2, y + 22);
  context.restore();
}

function drawBackground(time) {
  const themeKey = game.backgroundTheme;
  const theme = TIME_THEMES[themeKey];
  if (!cachedSkyGradient || cachedSkyGradientTheme !== themeKey) {
    cachedSkyGradient = context.createLinearGradient(0, 0, 0, WORLD.height);
    cachedSkyGradient.addColorStop(0, theme.sky[0]);
    cachedSkyGradient.addColorStop(0.7, theme.sky[1]);
    cachedSkyGradient.addColorStop(1, theme.sky[2]);
    cachedSkyGradientTheme = themeKey;
  }
  context.fillStyle = cachedSkyGradient;
  context.fillRect(0, 0, WORLD.width, WORLD.height);

  if (themeKey === "night") drawStars();
  drawBackgroundAtmosphere(time, themeKey);

  context.fillStyle = theme.celestial;
  context.beginPath();
  context.arc(WORLD.width * theme.celestialX, theme.celestialY, themeKey === "night" ? 38 : 48, 0, Math.PI * 2);
  context.fill();

  drawCloud(WORLD.width * 0.2 + Math.sin(time * 0.18) * 18, 210, 1.05, 0.36 * theme.cloudAlpha);
  drawCloud(WORLD.width * 0.76 + Math.sin(time * 0.13 + 1) * 24, 115, 0.75, 0.26 * theme.cloudAlpha);
  drawCloud(WORLD.width * 0.62 + Math.sin(time * 0.1 + 3) * 20, 330, 1.3, 0.18 * theme.cloudAlpha);

  context.fillStyle = theme.hillBack;
  context.beginPath();
  context.moveTo(0, 730);
  context.quadraticCurveTo(WORLD.width * 0.17, 640, WORLD.width * 0.33, 735);
  context.quadraticCurveTo(WORLD.width * 0.5, 605, WORLD.width * 0.69, 735);
  context.quadraticCurveTo(WORLD.width * 0.86, 650, WORLD.width, 720);
  context.lineTo(WORLD.width, 900);
  context.lineTo(0, 900);
  context.closePath();
  context.fill();

  context.fillStyle = theme.hillFront;
  context.beginPath();
  context.moveTo(0, 790);
  context.quadraticCurveTo(WORLD.width * 0.22, 710, WORLD.width * 0.43, 800);
  context.quadraticCurveTo(WORLD.width * 0.72, 700, WORLD.width, 790);
  context.lineTo(WORLD.width, 900);
  context.lineTo(0, 900);
  context.closePath();
  context.fill();

  context.fillStyle = theme.ground;
  context.fillRect(0, 830, WORLD.width, 70);
  context.fillStyle = "rgba(255, 255, 255, 0.12)";
  context.fillRect(0, 830, WORLD.width, 3);
}

function drawStars() {
  context.save();
  context.fillStyle = "rgba(246, 240, 228, 0.72)";

  for (let index = 0; index < 30; index += 1) {
    const x = ((index * 137 + 53) % 997) / 997 * WORLD.width;
    const y = 35 + (((index * 83 + 19) % 311) / 311) * 350;
    const radius = index % 5 === 0 ? 2.2 : 1.2;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawBackgroundAtmosphere(time, themeKey) {
  context.save();

  if (themeKey === "morning") {
    context.fillStyle = "rgba(255, 245, 198, 0.34)";
    for (let index = 0; index < 11; index += 1) {
      const x = (index * 83 + time * (5 + index * 0.22)) % (WORLD.width + 40) - 20;
      const y = 85 + ((index * 67 + Math.sin(time * 0.7 + index) * 22) % 430);
      context.beginPath();
      context.arc(x, y, index % 3 === 0 ? 2.4 : 1.5, 0, Math.PI * 2);
      context.fill();
    }
  } else if (themeKey === "afternoon") {
    [180, 130, 82].forEach((radius, index) => {
      context.fillStyle = `rgba(255, 249, 216, ${0.018 + index * 0.012})`;
      context.beginPath();
      context.arc(WORLD.width * 0.12, 112, radius, 0, Math.PI * 2);
      context.fill();
    });
  } else if (themeKey === "evening") {
    for (let index = 0; index < 12; index += 1) {
      const pulse = 0.22 + (Math.sin(time * 2.1 + index * 1.7) + 1) * 0.18;
      const x = 30 + ((index * 97 + Math.sin(time * 0.35 + index) * 26) % Math.max(80, WORLD.width - 60));
      const y = 360 + ((index * 53) % 310) + Math.sin(time * 0.8 + index) * 15;
      context.fillStyle = `rgba(255, 220, 104, ${pulse})`;
      context.beginPath();
      context.arc(x, y, index % 4 === 0 ? 3 : 2, 0, Math.PI * 2);
      context.fill();
    }
  } else if (themeKey === "night") {
    const cycle = (time % 11) / 11;
    if (cycle < 0.18) {
      const travel = cycle / 0.18;
      const x = WORLD.width * (0.84 - travel * 0.62);
      const y = 90 + travel * 150;
      const trail = context.createLinearGradient(x, y, x + 110, y - 72);
      trail.addColorStop(0, "rgba(246, 240, 228, 0.9)");
      trail.addColorStop(1, "rgba(246, 240, 228, 0)");
      context.strokeStyle = trail;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 110, y - 72);
      context.stroke();
    }
  }

  context.restore();
}

function drawCloud(x, y, scale, alpha) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);
  context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  context.beginPath();
  context.arc(-48, 8, 32, 0, Math.PI * 2);
  context.arc(-10, -8, 42, 0, Math.PI * 2);
  context.arc(36, 6, 34, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function renderObstacleLayer() {
  const bounds = renderMetrics;
  if (bounds.width <= 0 || bounds.height <= 0) return;

  const scale = bounds.scale;
  for (const obstacle of obstacles) {
    const left = (obstacleDrawX(obstacle) / WORLD.width) * bounds.width;
    const top = (obstacle.y / WORLD.height) * bounds.height;
    const size = obstacle.radius * 2.15 * scale;
    renderHazardElement(obstacle, left, top, size, obstacle.rotation);
  }

  if (bird) {
    const left = (bird.x / WORLD.width) * bounds.width;
    const top = (bird.y / WORLD.height) * bounds.height;
    const size = bird.radius * 2.2 * scale;
    const bank = Math.cos(bird.flightPhase) * 0.045;
    const flapScale = 1 + Math.sin(bird.flap) * 0.035;
    renderHazardElement(bird, left, top, size, bank, 1, flapScale);
  }

  for (const dropping of birdDroppings) {
    const left = (obstacleDrawX(dropping) / WORLD.width) * bounds.width;
    const top = (dropping.y / WORLD.height) * bounds.height;
    const size = dropping.radius * 2.1 * scale;
    renderHazardElement(dropping, left, top, size, dropping.rotation);
  }

  if (shieldPickup) {
    const left = (obstacleDrawX(shieldPickup) / WORLD.width) * bounds.width;
    const top = (shieldPickup.y / WORLD.height) * bounds.height;
    const size = shieldPickup.radius * 2.2 * scale;
    renderHazardElement(shieldPickup, left, top, size, shieldPickup.rotation);
  }


  if (bonusPickup) {
    const left = (obstacleDrawX(bonusPickup) / WORLD.width) * bounds.width;
    const top = (bonusPickup.y / WORLD.height) * bounds.height;
    const size = bonusPickup.radius * 2.15 * scale;
    renderHazardElement(bonusPickup, left, top, size, bonusPickup.rotation);
  }
}

function renderHazardElement(hazard, left, top, size, rotation, scaleX = 1, scaleY = 1) {
  if (hazard.renderedSize !== size) {
    hazard.renderedSize = size;
    hazard.element.style.fontSize = `${size.toFixed(2)}px`;
  }
  hazard.element.style.transform =
    `translate3d(${left.toFixed(2)}px, ${top.toFixed(2)}px, 0) ` +
    `translate(-50%, -50%) rotate(${rotation.toFixed(4)}rad) ` +
    `scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
}

function clearObstacleLayer() {
  obstacles.forEach((obstacle) => obstacle.element?.remove());
  bird?.element.remove();
  birdDroppings.forEach((dropping) => dropping.element?.remove());
  shieldPickup?.element.remove();
  bonusPickup?.element.remove();
  obstacles = [];
  bird = null;
  birdDroppings = [];
  shieldPickup = null;
  bonusPickup = null;
  ui.obstacleLayer.replaceChildren();
}

function drawProtectionShield(character) {
  if (!game.shieldReady || character.dead) return;

  const pulse = 1 + Math.sin(game.runElapsed * 5) * 0.025;
  context.save();
  context.translate(character.x, character.y - 12);
  context.scale(pulse, pulse);
  context.fillStyle = "rgba(255, 209, 102, 0.08)";
  context.strokeStyle = "rgba(255, 209, 102, 0.9)";
  context.lineWidth = 4;
  context.shadowColor = "rgba(255, 209, 102, 0.75)";
  context.shadowBlur = 18;
  context.beginPath();
  context.ellipse(0, 0, 58, 78, 0, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.restore();
}

function drawUmbrella(character) {
  const player = character;
  if (game.umbrellaTimer <= 0 || player.dead) return;

  const canopyColor = "#55b8ff";
  const canopyY = player.y - 92;

  context.save();
  context.translate(player.x, canopyY);
  context.lineWidth = 5;
  context.lineJoin = "round";
  context.strokeStyle = "#172025";
  context.fillStyle = canopyColor;
  context.shadowColor = `${canopyColor}99`;
  context.shadowBlur = 18;

  context.beginPath();
  context.moveTo(-70, 8);
  context.quadraticCurveTo(-52, -34, 0, -36);
  context.quadraticCurveTo(52, -34, 70, 8);
  context.quadraticCurveTo(53, -1, 35, 10);
  context.quadraticCurveTo(18, -1, 0, 10);
  context.quadraticCurveTo(-18, -1, -35, 10);
  context.quadraticCurveTo(-53, -1, -70, 8);
  context.closePath();
  context.fill();
  context.stroke();

  context.shadowBlur = 0;
  context.beginPath();
  context.moveTo(0, 10);
  context.lineTo(0, 76);
  context.quadraticCurveTo(0, 88, 13, 88);
  context.quadraticCurveTo(24, 88, 24, 77);
  context.stroke();
  context.restore();
}

function drawPlayer(character) {
  const player = character;
  context.save();
  context.translate(player.x, player.y);
  context.rotate(player.dead ? 1.35 : player.lean);
  if (game.shrinkTimer > 0 && !player.dead) context.scale(0.78, 0.78);
  const holdingUmbrella = game.umbrellaTimer > 0 && !player.dead;

  if (game.speedBoostTimer > 0 && !player.dead && player.moveDirection !== 0) {
    const trailSide = -player.facing;
    context.strokeStyle = "rgba(255, 209, 102, 0.78)";
    context.lineWidth = 5;
    context.lineCap = "round";
    for (let index = 0; index < 3; index += 1) {
      const trailY = -18 + index * 20;
      context.beginPath();
      context.moveTo(trailSide * (42 + index * 7), trailY);
      context.lineTo(trailSide * (67 + index * 10), trailY);
      context.stroke();
    }
  }

  if (game.noclip) {
    context.shadowColor = "rgba(168, 137, 255, 0.9)";
    context.shadowBlur = 24;
  }

  context.fillStyle = "rgba(18, 24, 18, 0.24)";
  context.beginPath();
  context.ellipse(player.dead ? 18 : 0, 48, player.dead ? 58 : 43, 12, 0, 0, Math.PI * 2);
  context.fill();

  const stride = player.dead ? 0 : Math.sin(player.runCycle) * 8;

  context.strokeStyle = "#182124";
  context.lineWidth = 13;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(-13, 23);
  context.lineTo(-17 - stride, 49);
  context.moveTo(13, 23);
  context.lineTo(17 + stride, 49);
  context.stroke();

  context.strokeStyle = player.shirtColor;
  context.lineWidth = 16;
  context.beginPath();
  context.moveTo(-27, -3);
  context.lineTo(-38, 19 + stride * 0.4);
  context.moveTo(27, -3);
  if (holdingUmbrella) {
    context.quadraticCurveTo(40, -4, 24, -15);
  } else {
    context.lineTo(38, 19 - stride * 0.4);
  }
  context.stroke();

  context.fillStyle = player.shirtColor;
  roundedRect(context, -31, -18, 62, 51, 17);
  context.fill();

  if (holdingUmbrella) {
    context.fillStyle = "#ffd1a3";
    context.strokeStyle = "#172025";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(24, -15, 8, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  context.fillStyle = "#f1f0dc";
  roundedRect(context, -16, -10, 32, 9, 4);
  context.fill();

  context.fillStyle = "#ffd1a3";
  context.beginPath();
  context.arc(0, -39, 27, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = player.hatColor;
  context.beginPath();
  context.arc(-5, -50, 27, Math.PI, Math.PI * 2);
  context.lineTo(31, -48);
  context.quadraticCurveTo(10, -59, -5, -50);
  context.fill();

  context.strokeStyle = "#171614";
  context.lineWidth = 3.5;
  context.lineCap = "round";
  if (player.dead) {
    drawCrossEye(-9, -39);
    drawCrossEye(9, -39);
    context.beginPath();
    context.moveTo(-7, -27);
    context.lineTo(7, -27);
    context.stroke();
  } else {
    context.fillStyle = "#171614";
    context.beginPath();
    context.arc(-9, -39, 3.5, 0, Math.PI * 2);
    context.arc(9, -39, 3.5, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(0, -32, 9, 0.2, Math.PI - 0.2);
    context.stroke();
  }

  context.restore();
}

function drawPlayerLabel(character) {
  const labelY = character.y - (game.umbrellaTimer > 0 && !character.dead ? 158 : 84);
  context.save();
  context.fillStyle = character.shirtColor;
  roundedRect(context, character.x - 19, labelY - 12, 38, 24, 12);
  context.fill();
  context.fillStyle = "#171614";
  context.font = canvasFont(900, 12);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(character.label, character.x, labelY);
  context.restore();
}

function drawCrossEye(x, y) {
  context.beginPath();
  context.moveTo(x - 4, y - 4);
  context.lineTo(x + 4, y + 4);
  context.moveTo(x + 4, y - 4);
  context.lineTo(x - 4, y + 4);
  context.stroke();
}

function collides(character, hazard) {
  const hazardX = obstacleDrawX(hazard);
  const hitboxScale = game.shrinkTimer > 0 ? 0.65 : 1;
  const halfWidth = (character.width * hitboxScale) / 2;
  const halfHeight = (character.height * hitboxScale) / 2;
  const closestX = clamp(hazardX, character.x - halfWidth, character.x + halfWidth);
  const closestY = clamp(hazard.y, character.y - halfHeight, character.y + halfHeight);
  const dx = hazardX - closestX;
  const dy = hazard.y - closestY;
  const hitRadius = hazard.radius * 0.76;
  return dx * dx + dy * dy < hitRadius * hitRadius;
}

function obstacleDrawX(obstacle) {
  return obstacle.x + Math.sin(obstacle.wobble) * obstacle.wobbleAmount;
}

function bindHoldControl(button, direction) {
  const press = (event) => {
    if (game.state !== "playing") return;
    event.preventDefault();
    keys[direction] = true;
    button.classList.add("is-active");
    button.setPointerCapture?.(event.pointerId);
  };

  const release = (event) => {
    event.preventDefault();
    keys[direction] = false;
    button.classList.remove("is-active");
  };

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
}

function releaseControls() {
  keys.p1Left = false;
  keys.p1Right = false;
  keys.p2Left = false;
  keys.p2Right = false;
  pressedKeys.clear();
  player.velocityX = 0;
  playerTwo.velocityX = 0;
  player.moveDirection = 0;
  playerTwo.moveDirection = 0;
  ui.moveLeft.classList.remove("is-active");
  ui.useSpeedBoost.classList.remove("is-active");
  ui.useUmbrella.classList.remove("is-active");
  ui.moveRight.classList.remove("is-active");
}

function readBestScore() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedScore = Number.parseInt(saved ?? "", 10);
    if (Number.isFinite(savedScore)) return Math.max(0, savedScore);

    const legacyScores = JSON.parse(localStorage.getItem(LEGACY_SCORES_STORAGE_KEY) ?? "{}");
    const legacyBest = Number.parseInt(localStorage.getItem(LEGACY_STORAGE_KEY) ?? "0", 10) || 0;
    const migratedScores = Object.values(legacyScores).map((score) => Number.parseInt(score, 10) || 0);
    return Math.max(0, legacyBest, ...migratedScores);
  } catch {
    return 0;
  }
}

function writeBestScore(score) {
  try {
    localStorage.setItem(STORAGE_KEY, String(score));
  } catch {
    // 로컬 저장소가 제한된 환경에서도 게임은 계속 진행됩니다.
  }
}

function readLanguage() {
  try {
    const language = localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? "en";
    return TRANSLATIONS[language] ? language : "en";
  } catch {
    return "en";
  }
}

function readBackgroundTheme() {
  try {
    const theme = localStorage.getItem(BACKGROUND_STORAGE_KEY) ?? "afternoon";
    return TIME_THEMES[theme] ? theme : "afternoon";
  } catch {
    return "afternoon";
  }
}

function readSoundPreference() {
  try {
    const saved = localStorage.getItem(SOUND_STORAGE_KEY);
    return saved === null ? true : saved === "on";
  } catch {
    return true;
  }
}

function resizeWorld() {
  const bounds = canvas.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) return;

  const previousWidth = WORLD.width;
  const nextWidth = Math.max(360, Math.round((WORLD.height * bounds.width) / bounds.height));
  const scale = nextWidth / previousWidth;
  const cssScale = bounds.height / WORLD.height;
  const deviceScale = Math.min(window.devicePixelRatio || 1, 2);
  const backingScale = Math.min(2, Math.max(0.75, cssScale * deviceScale));

  WORLD.width = nextWidth;
  canvas.width = Math.round(nextWidth * backingScale);
  canvas.height = Math.round(WORLD.height * backingScale);
  context.setTransform(backingScale, 0, 0, backingScale, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  cachedSkyGradient = null;
  cachedSkyGradientTheme = "";
  renderMetrics.width = bounds.width;
  renderMetrics.height = bounds.height;
  renderMetrics.scale = cssScale;
  player.x = clamp(player.x * scale, player.width / 2 + 20, WORLD.width - player.width / 2 - 20);
  player.y = WORLD.height - 112;
  playerTwo.x = clamp(
    playerTwo.x * scale,
    playerTwo.width / 2 + 20,
    WORLD.width - playerTwo.width / 2 - 20,
  );
  playerTwo.y = WORLD.height - 112;
  obstacles.forEach((obstacle) => {
    obstacle.x = clamp(obstacle.x * scale, 58, WORLD.width - 58);
  });
  if (bird) {
    bird.x *= scale;
    bird.dropX *= scale;
  }
  birdDroppings.forEach((dropping) => {
    dropping.x = clamp(dropping.x * scale, 0, WORLD.width);
  });
  if (shieldPickup) {
    shieldPickup.x = clamp(shieldPickup.x * scale, shieldPickup.radius, WORLD.width - shieldPickup.radius);
  }
  if (bonusPickup) {
    bonusPickup.x = clamp(bonusPickup.x * scale, bonusPickup.radius, WORLD.width - bonusPickup.radius);
  }
  drawScene(performance.now() / 1000);
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function formatScore(score) {
  return String(score).padStart(2, "0");
}

function formatDuration(seconds) {
  const wholeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createDistinctValues(count, range) {
  const [min, max] = range;
  if (count <= 1) return [random(min, max)];

  const step = (max - min) / (count - 1);
  const jitter = step * 0.16;
  const offsets = Array.from({ length: count }, (_, index) =>
    clamp(min + step * index + random(-jitter, jitter), min, max),
  );

  for (let index = offsets.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInteger(0, index);
    [offsets[index], offsets[swapIndex]] = [offsets[swapIndex], offsets[index]];
  }

  return offsets;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
