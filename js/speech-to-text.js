document.addEventListener('DOMContentLoaded', function() {
    const btnRekam = document.getElementById('btn-rekam');
    const hasilSTT = document.getElementById('hasil-stt');
    let recognition = null;
    let isRecording = false;

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'id-ID';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
            isRecording = true;
            btnRekam.textContent = '⏹️ Berhenti';
            btnRekam.classList.add('recording');
            hasilSTT.textContent = '🎤 Mendengarkan...';
            hasilSTT.className = 'mt-6 p-6 bg-indigo-500/10 rounded-2xl min-h-[120px] text-xl text-indigo-400 flex items-center justify-center border-2 border-indigo-500/50 listening';
        };

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    hasilSTT.textContent = transcript;
                    hasilSTT.className = 'mt-6 p-6 bg-green-500/10 rounded-2xl min-h-[120px] text-xl text-green-400 flex items-center justify-center border-2 border-green-500/50 success';

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
            let msg = `❌ Error: ${event.error}`;
            if (event.error === 'not-allowed') msg = '❌ Izin mikrofon ditolak. Izinkan akses mikrofon.';
            if (event.error === 'no-speech') msg = '🔇 Tidak ada suara terdeteksi. Coba lagi.';
            if (event.error === 'audio-capture') msg = '❌ Mikrofon tidak terdeteksi. Periksa koneksi.';
            hasilSTT.textContent = msg;
            hasilSTT.className = 'mt-6 p-6 bg-red-500/10 rounded-2xl min-h-[120px] text-xl text-red-400 flex items-center justify-center border-2 border-red-500/50 error';
            stopRecording();
        };

        recognition.onend = () => {
            stopRecording();
        };
    } else {
        if (btnRekam) {
            btnRekam.disabled = true;
            btnRekam.textContent = '❌ Browser tidak mendukung';
            btnRekam.className = 'px-12 py-6 text-2xl font-bold rounded-full text-white shadow-lg bg-gray-600 cursor-not-allowed';
        }
        if (hasilSTT) {
            hasilSTT.textContent = '⚠️ Gunakan Chrome atau Edge untuk fitur ini';
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
            btnRekam.textContent = '🎙️ Mulai Rekam';
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