const startButton = document.getElementById('start-pomodoro');
const stopButton = document.getElementById('stop-pomodoro');
const pomodoroTimeDisplay = document.getElementById('pomodoro-time');
const breakTimeDisplay = document.getElementById('break-time');

let timer = null;
let workSession = 25 * 60 * 1000; // 25 minutes in milliseconds
let breakTime = 5 * 60 * 1000; // 5 minutes in milliseconds

function startPomodoro() {
    if (timer) return;

    startButton.disabled = true;
    stopButton.disabled = false;

    timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeLeft = workSession - (currentTime - workSession);
        pomodoroTimeDisplay.textContent = `Time left: ${formatTime(timeLeft)}`;

        if (timeLeft <= 0) {
            break;
            clearInterval(timer);

            // Play sound effect
            playSoundEffect();

            // Display break message
            displayBreakMessage();
        }
    }, 1000);
}

function stopPomodoro() {
    clearInterval(timer);
    startButton.disabled = false;
    stopButton.disabled = true;

    // Stop sound effect and break message
    stopSoundEffect();
    hideBreakMessage();
}

function playSoundEffect() {
    const audio = new Audio('pomodoro-tone.mp3');
    audio.play();
}

function displayBreakMessage() {
    breakTimeDisplay.textContent = 'Take a 5-minute break!';
}

function hideBreakMessage() {
    breakTimeDisplay.textContent = '';
}

function formatTime(timeLeft) {
    const hours = Math.floor(timeLeft / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startButton.addEventListener('click', startPomodoro);
stopButton.addEventListener('click', stopPomodoro);