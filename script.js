// Elements
const timerDisplay     = document.querySelector('.timer');
const modeDisplay      = document.querySelector('.mode');
const sessionsSpan     = document.getElementById('sessions');
const startBtn         = document.getElementById('start');
const pauseBtn         = document.getElementById('pause');
const resetBtn         = document.getElementById('reset');
const timerContainer   = document.getElementById('timerContainer');
const toggleBtn        = document.getElementById('toggleTimer');
const showText         = toggleBtn.querySelector('.show-text');
const hideText         = toggleBtn.querySelector('.hide-text');
const floatingTimer    = document.getElementById('floatingTimer');
const floatingTime     = document.getElementById('floatingTime');

// Timer state
let timeLeft    = 25 * 60;
let isRunning   = false;
let isWork      = true;
let sessionCount = 0;
let interval    = null;

const WORK_TIME    = 25 * 60;
const SHORT_BREAK  =  5 * 60;
const LONG_BREAK   = 15 * 60;

// Update displays
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;

  // Main timer (only if visible)
  if (timerDisplay && !timerContainer.classList.contains('hidden')) {
    timerDisplay.textContent = timeString;
  }

  // Floating indicator
  if (floatingTime) {
    floatingTime.textContent = timeString;
  }

  // Tab title
  document.title = `${timeString} - ${isWork ? 'Focus' : 'Break'}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  interval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(interval);
      isRunning = false;

      if (isWork) {
        sessionCount++;
        if (sessionsSpan) sessionsSpan.textContent = sessionCount;
        timeLeft = (sessionCount % 4 === 0) ? LONG_BREAK : SHORT_BREAK;
        if (modeDisplay) modeDisplay.textContent = (sessionCount % 4 === 0) ? "Long Break" : "Short Break";
        isWork = false;
      } else {
        timeLeft = WORK_TIME;
        if (modeDisplay) modeDisplay.textContent = "Work Time";
        isWork = true;
      }

      updateDisplay();
      alert(isWork ? "Back to work!" : "Take a break~");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
  updateDisplay();
}

function resetTimer() {
  pauseTimer();
  timeLeft = WORK_TIME;
  isWork = true;
  sessionCount = 0;
  if (sessionsSpan) sessionsSpan.textContent = "0";
  if (modeDisplay) modeDisplay.textContent = "Work Time";
  updateDisplay();
  document.title = "Pomodoro Timer";
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Toggle visibility
toggleBtn.addEventListener('click', () => {
  const willBeHidden = !timerContainer.classList.contains('hidden');

  timerContainer.classList.toggle('hidden');

  if (willBeHidden) {
    floatingTimer.classList.add('visible');
    showText.style.display = 'none';
    hideText.style.display = 'inline';
  } else {
    floatingTimer.classList.remove('visible');
    showText.style.display = 'inline';
    hideText.style.display = 'none';
  }

  if (!willBeHidden) updateDisplay();
});

// Click floating timer to show main
floatingTimer.addEventListener('click', () => {
  timerContainer.classList.remove('hidden');
  floatingTimer.classList.remove('visible');
  showText.style.display = 'none';
  hideText.style.display = 'inline';
  updateDisplay();
});

// Initial
updateDisplay();