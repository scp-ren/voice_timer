let timerId = null;
let remainingSeconds = 0;
let isRunning = false;
let hasStarted = false;
let initialSeconds = 0;

const timeDisplay = document.getElementById("timeDisplay");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  speechSynthesis.speak(utterance);
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds); // 0未満は0として扱う
  const m = Math.floor(safeSeconds / 60).toString().padStart(2, '0');
  const s = (safeSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(remainingSeconds);
}

function startTimer() {
  if (timerId !== null) return;

  if (!hasStarted) {
    initialSeconds = remainingSeconds;
    hasStarted = true;
    speak("スタート");
  }

  timerId = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds === 30 * 60) speak("残り30分です");
    if (remainingSeconds === 10 * 60) speak("残り10分です");
    if (remainingSeconds === 5 * 60) speak("残り5分です");
    if (remainingSeconds === 1 * 60) speak("残り1分です");

    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      updateDisplay();
      clearInterval(timerId);
      timerId = null;
      isRunning = false;
      hasStarted = false;
      speak("時間になりました");
    } else {
      updateDisplay();
    }
  }, 1000);

  isRunning = true;
  updateDisplay();
}

function pauseTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
    isRunning = false;
  }
}

function resetTimer() {
  if (timerId !== null) clearInterval(timerId);
  timerId = null;
  isRunning = false;
  hasStarted = false;
  remainingSeconds = initialSeconds;
  updateDisplay();
}

function adjustTime(secondsToAdjust) {
  remainingSeconds += secondsToAdjust;
  if (remainingSeconds < 0) remainingSeconds = 0;
  updateDisplay();
}

// ボタンイベント
startButton.addEventListener("click", () => {
  if (!isRunning) startTimer();
  else pauseTimer();
});
resetButton.addEventListener("click", resetTimer);

document.getElementById("add10min").addEventListener("click", () => adjustTime(600));
document.getElementById("sub10min").addEventListener("click", () => adjustTime(-600));
document.getElementById("add1min").addEventListener("click", () => adjustTime(60));
document.getElementById("sub1min").addEventListener("click", () => adjustTime(-60));
document.getElementById("add10sec").addEventListener("click", () => adjustTime(10));
document.getElementById("sub10sec").addEventListener("click", () => adjustTime(-10));
