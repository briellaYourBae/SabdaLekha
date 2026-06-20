document.addEventListener('DOMContentLoaded', function() {
    const btnRekam = document.getElementById('btn-rekam');
    const hasilSTT = document.getElementById('hasil-stt');
    let recognition = null;
    let isRecording = false;

    const ICON_MIC = '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
    const ICON_MIC_LG = '<svg class="icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
    const ICON_SQUARE = '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
    const ICON_CHECK = '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    const ICON_ERROR = '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    const ICON_MIC_OFF = '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><path d="M9 9v3a3 3 0 0 0 5.1 2.1M15 9.3V5a3 3 0 0 0-5.9-.6"/><path d="M5 10v2a7 7 0 0 0 11.7 5.2"/><path d="M19 10v2c0 .8-.1 1.6-.4 2.3"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
    const ICON_WARNING = '<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.6 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

    function setStatus(icon, text) {
        hasilSTT.innerHTML = `<span class="inline-flex items-center gap-2 justify-center">${icon}<span>${text}</span></span>`;
    }

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'id-ID';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
            isRecording = true;
            btnRekam.innerHTML = `${ICON_SQUARE} Berhenti`;
            btnRekam.classList.add('recording');
            setStatus(ICON_MIC, 'Mendengarkan...');
            hasilSTT.className = 'mt-6 p-6 bg-indigo-500/10 rounded-2xl min-h-[120px] text-xl text-indigo-400 flex items-center justify-center gap-2 border-2 border-indigo-500/50 listening';
        };

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    hasilSTT.textContent = transcript;
                    hasilSTT.className = 'mt-6 p-6 bg-green-500/10 rounded-2xl min-h-[120px] text-xl text-green-400 flex items-center justify-center gap-2 border-2 border-green-500/50 success';

                    const inputKata = document.getElementById('input-kata');
                    if (inputKata) {
                        inputKata.value = transcript;
                    }
                }
            }
            if (!event.results[event.results.length - 1].isFinal) {
                hasilSTT.textContent = transcript + '...';
            }
        };

        recognition.onerror = (event) => {
            let icon = ICON_ERROR;
            let msg = `Error: ${event.error}`;
            if (event.error === 'not-allowed') msg = 'Izin mikrofon ditolak. Izinkan akses mikrofon.';
            if (event.error === 'no-speech') { icon = ICON_MIC_OFF; msg = 'Tidak ada suara terdeteksi. Coba lagi.'; }
            if (event.error === 'audio-capture') msg = 'Mikrofon tidak terdeteksi. Periksa koneksi.';
            setStatus(icon, msg);
            hasilSTT.className = 'mt-6 p-6 bg-red-500/10 rounded-2xl min-h-[120px] text-xl text-red-400 flex items-center justify-center gap-2 border-2 border-red-500/50 error';
            stopRecording();
        };

        recognition.onend = () => {
            stopRecording();
        };
    } else {
        if (btnRekam) {
            btnRekam.disabled = true;
            btnRekam.innerHTML = `${ICON_WARNING} Browser tidak mendukung`;
            btnRekam.className = 'px-12 py-6 text-2xl font-bold rounded-full text-white shadow-lg bg-gray-600 cursor-not-allowed inline-flex items-center gap-3';
        }
        if (hasilSTT) {
            setStatus(ICON_WARNING, 'Gunakan Chrome atau Edge untuk fitur ini');
        }
    }

    function mulaiRekam() {
        if (!recognition) return;
        if (isRecording) {
            stopRecording();
            return;
        }
        try {
            recognition.start();
        } catch (e) {
            if (e.message.includes('already started')) {
                stopRecording();
                setTimeout(() => recognition.start(), 300);
            }
        }
    }

    function stopRecording() {
        isRecording = false;
        if (btnRekam) {
            btnRekam.innerHTML = `${ICON_MIC_LG} Mulai Rekam`;
            btnRekam.classList.remove('recording');
        }
        try {
            if (recognition) recognition.stop();
        } catch (e) {}
    }

    if (btnRekam) {
        btnRekam.addEventListener('click', mulaiRekam);
    }
});