document.addEventListener('DOMContentLoaded', () => {
    const breakTimeDisplay = document.getElementById('break-time');
    const startPomodoroButton = document.getElementById('start-pomodoro-button');
    const startBreakButton = document.getElementById('start-break-button');
    const stopButton = document.getElementById('stop-button');
    const testAlarmButton = document.getElementById('test-alarm-button');
    const pomodoroTimeDisplay = document.getElementById('pomodoro-time');
    const sessionCountDisplay = document.getElementById('session-count');
    const notesDisplay = document.getElementById('notes');
    const noteInput = document.getElementById('note-input');
    const addNoteButton = document.getElementById('add-note-button');

    if (!breakTimeDisplay || !startPomodoroButton || !startBreakButton || !stopButton || !testAlarmButton || !pomodoroTimeDisplay || !sessionCountDisplay || !notesDisplay || !noteInput || !addNoteButton) {
        console.error('One or more elements not found');
        return;
    }

    const workSessionDuration = 25 * 60 * 1000; // 25 minutes in milliseconds
    const breakDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    let timer = null;
    let sessionCount = 0;
    let notes = [];

    // Create an audio object for the alarm sound
    const alarmSound = new Audio('alarm.mp3');

    function startSession(duration, isPomodoro) {
        if (timer) return;

        toggleButtons(true);

        const startTime = Date.now();

        timer = setInterval(() => {
            const timeElapsed = Date.now() - startTime;
            const timeLeft = duration - timeElapsed;
            pomodoroTimeDisplay.textContent = `Time left: ${formatTime(timeLeft)}`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                timer = null;

                // Flash the page
                flashPage();

                // Play sound effect
                playSoundEffect();

                // Display break message if it was a Pomodoro session
                if (isPomodoro) {
                    displayBreakMessage();
                    sessionCount++;
                    updateSessionCount();
                } else {
                    pomodoroTimeDisplay.textContent = 'Break over!';
                }

                toggleButtons(false);
            }
        }, 1000);
    }

    function stopSession() {
        clearInterval(timer);
        timer = null;
        toggleButtons(false);
        pomodoroTimeDisplay.textContent = 'Session stopped.';
    }

    function toggleButtons(isRunning) {
        startPomodoroButton.disabled = isRunning;
        startBreakButton.disabled = isRunning;
        stopButton.disabled = !isRunning;
    }

    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function playSoundEffect() {
        // Play the alarm sound
        alarmSound.play();
    }

    function displayBreakMessage() {
        breakTimeDisplay.textContent = 'Break time! Relax for 5 minutes.';
    }

    function updateSessionCount() {
        sessionCountDisplay.textContent = `Sessions completed: ${sessionCount}`;
    }

    function addNote() {
        const note = noteInput.value.trim();
        if (note) {
            const timestamp = new Date().toLocaleTimeString();
            notes.push({ note, timestamp });
            updateNotesDisplay();
            noteInput.value = '';
        }
    }

    function removeNote(index) {
        notes.splice(index, 1);
        updateNotesDisplay();
    }

    function updateNotesDisplay() {
        notesDisplay.innerHTML = notes.map((noteObj, index) => 
            `<li>${noteObj.note} <span class="timestamp">(${noteObj.timestamp})</span> <button onclick="removeNoteHandler(${index})" class="remove-note-btn">Remove</button></li>`
        ).join('');
    }

    function flashPage() {
        document.body.classList.add('flash');
        setTimeout(() => {
            document.body.classList.remove('flash');
        }, 100);
    }

    function testAlarm() {
        playSoundEffect();
    }

    window.removeNoteHandler = removeNote; // Make removeNote accessible globally

    startPomodoroButton.addEventListener('click', () => startSession(workSessionDuration, true));
    startBreakButton.addEventListener('click', () => startSession(breakDuration, false));
    stopButton.addEventListener('click', stopSession);
    addNoteButton.addEventListener('click', addNote);
    testAlarmButton.addEventListener('click', testAlarm);
});