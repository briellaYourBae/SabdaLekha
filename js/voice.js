// ==========================================
// VOICE NOTE - SPEECH-TO-TEXT
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceIndicator = document.getElementById('voiceIndicator');
    const stopRecordingBtn = document.getElementById('stopRecordingBtn');
    const cancelRecordingBtn = document.getElementById('cancelRecordingBtn');
    const recordingTimer = document.getElementById('recordingTimer');
    const messageInput = document.getElementById('messageInput');

    let recognition = null;
    let isRecording = false;
    let recordingInterval = null;
    let seconds = 0;
    let finalTranscript = '';

    // ===== CEK DUKUNGAN BROWSER =====
    function isSpeechSupported() {
        return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }

    if (!isSpeechSupported()) {
        voiceBtn.style.opacity = '0.5';
        voiceBtn.title = 'Browser tidak mendukung Speech-to-Text';
        voiceBtn.disabled = true;
        console.warn('⚠️ Browser tidak mendukung Speech Recognition');
        return;
    }

    console.log('🎤 Voice Note siap digunakan!');

    // ===== INISIALISASI RECOGNITION =====
    function initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = function(event) {
            let interimTranscript = '';
            finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Update input dengan hasil sementara
            if (interimTranscript) {
                messageInput.value = interimTranscript;
                messageInput.style.borderColor = '#C8A951';
                messageInput.style.borderWidth = '3px';
            }
        };

        recognition.onerror = function(event) {
            console.error('❌ Speech recognition error:', event.error);
            
            let errorMsg = 'Terjadi kesalahan: ';
            if (event.error === 'not-allowed') {
                errorMsg = '❌ Izin mikrofon ditolak. Izinkan akses mikrofon.';
            } else if (event.error === 'no-speech') {
                errorMsg = '🔇 Tidak ada suara terdeteksi. Coba lagi.';
            } else if (event.error === 'audio-capture') {
                errorMsg = '❌ Mikrofon tidak terdeteksi. Periksa koneksi.';
            } else {
                errorMsg += event.error;
            }
            
            messageInput.placeholder = errorMsg;
            stopRecording();
        };

        recognition.onend = function() {
            // Jika ada hasil final, kirim otomatis
            if (finalTranscript.trim()) {
                messageInput.value = finalTranscript.trim();
                messageInput.style.borderColor = '#22C55E';
                messageInput.style.borderWidth = '2px';
                
                // Auto send setelah voice note selesai
                setTimeout(() => {
                    if (typeof sendMessage === 'function') {
                        sendMessage();
                    }
                }, 500);
            }
            stopRecording();
        };
    }

    // ===== START RECORDING =====
    function startRecording() {
        if (isRecording) return;

        if (!recognition) {
            initRecognition();
        }

        finalTranscript = '';
        seconds = 0;
        recordingTimer.textContent = '00:00';
        voiceIndicator.classList.remove('hidden');
        
        // Reset input
        messageInput.value = '';
        messageInput.style.borderColor = '#C8A951';
        messageInput.style.borderWidth = '3px';
        messageInput.placeholder = '🎤 Merekam suara...';

        try {
            recognition.start();
            isRecording = true;
            console.log('🎤 Recording started...');

            // Timer
            recordingInterval = setInterval(() => {
                seconds++;
                const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
                const secs = String(seconds % 60).padStart(2, '0');
                recordingTimer.textContent = `${mins}:${secs}`;
            }, 1000);

        } catch (e) {
            console.error('❌ Gagal memulai rekaman:', e);
            voiceIndicator.classList.add('hidden');
            messageInput.placeholder = '❌ Gagal memulai rekaman';
        }
    }

    // ===== STOP RECORDING =====
    function stopRecording() {
        if (!isRecording) return;

        isRecording = false;
        if (recognition) {
            try {
                recognition.stop();
            } catch (e) {}
        }

        if (recordingInterval) {
            clearInterval(recordingInterval);
            recordingInterval = null;
        }

        voiceIndicator.classList.add('hidden');
        messageInput.style.borderColor = '';

        // Jika tidak ada hasil, reset placeholder
        if (!messageInput.value.trim()) {
            messageInput.placeholder = 'Ketik pesan atau rekam suara...';
        }

        console.log('⏹️ Recording stopped');
    }

    // ===== CANCEL RECORDING =====
    function cancelRecording() {
        if (recognition) {
            try {
                recognition.abort();
            } catch (e) {}
        }
        isRecording = false;
        if (recordingInterval) {
            clearInterval(recordingInterval);
            recordingInterval = null;
        }
        voiceIndicator.classList.add('hidden');
        messageInput.value = '';
        messageInput.style.borderColor = '';
        messageInput.placeholder = 'Ketik pesan atau rekam suara...';
        console.log('❌ Recording cancelled');
    }

    // ===== EVENT LISTENERS =====
    if (voiceBtn) {
        voiceBtn.addEventListener('click', startRecording);
    }

    if (stopRecordingBtn) {
        stopRecordingBtn.addEventListener('click', function() {
            if (recognition) {
                try {
                    recognition.stop();
                } catch (e) {}
            }
            stopRecording();
        });
    }

    if (cancelRecordingBtn) {
        cancelRecordingBtn.addEventListener('click', cancelRecording);
    }

    // ===== KEYBOARD SHORTCUT: Ctrl+Shift+V =====
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && (e.key === 'v' || e.key === 'V')) {
            e.preventDefault();
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        }
    });

    // ===== INIT =====
    initRecognition();

    console.log('✅ Voice Note initialized!');
    console.log('💡 Klik ikon 🎤 atau tekan Ctrl+Shift+V untuk merekam suara');
});