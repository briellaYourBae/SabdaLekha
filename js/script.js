// ==========================================
// PLACEHOLDER API
// ==========================================
function getPlaceholder(text, bgColor = '1a237e', textColor = 'ffffff') {
    return `https://via.placeholder.com/300x300/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
}

// ==========================================
// KAMUS HURUF A-Z
// ==========================================
const kamusHuruf = {};
for (let i = 65; i <= 90; i++) {
    const huruf = String.fromCharCode(i);
    kamusHuruf[huruf] = getPlaceholder(`Huruf ${huruf}`, '1a237e', 'ffffff');
}

// ==========================================
// KAMUS KATA
// ==========================================
const kataList = [
    'aku', 'lapar', 'makan', 'minum', 'belajar', 'sekolah',
    'saya', 'kamu', 'mereka', 'suka', 'senang', 'mau',
    'ingin', 'bisa', 'tidak', 'ya', 'halo', 'terima kasih',
    'maaf', 'tolong', 'nama', 'umur', 'rumah', 'keluarga',
    'teman', 'guru', 'dosen', 'mahasiswa', 'pelajar',
    'sehat', 'sakit', 'sedih', 'marah', 'takut'
];

const kamusKata = {};
const colors = ['1a237e', '2e7d32', 'c62828', 'e65100', '4a148c', '00695c', '283593', 'ad1457', '0d47a1'];
kataList.forEach((kata, index) => {
    kamusKata[kata] = getPlaceholder(kata, colors[index % colors.length], 'ffffff');
});

// ==========================================
// GENERATE TOMBOL HURUF
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('huruf-container');
    const previewImg = document.getElementById('gambar-huruf');
    const previewText = document.getElementById('nama-huruf');
    const previewKeterangan = document.getElementById('keterangan-huruf');

    for (let i = 65; i <= 90; i++) {
        const huruf = String.fromCharCode(i);
        const btn = document.createElement('button');
        btn.textContent = huruf;
        btn.className = 'huruf-btn';
        btn.addEventListener('click', function() {
            previewImg.src = kamusHuruf[huruf];
            previewImg.classList.remove('hidden');
            previewText.textContent = `Huruf ${huruf}`;
            previewKeterangan.textContent = '✅ Placeholder - Ganti dengan gambar asli nanti';
            previewKeterangan.className = 'text-sm text-green-600 dark:text-green-400 mt-2';
        });
        container.appendChild(btn);
    }
});

// ==========================================
// FITUR TERJEMAH
// ==========================================
function terjemahkan() {
    const input = document.getElementById('input-kata');
    const hasil = document.getElementById('hasil-terjemahan');
    const teks = input.value.trim();

    if (!teks) {
        hasil.innerHTML = `<div class="w-full text-center text-gray-400 dark:text-gray-500 py-8">⚠️ Silakan ketik kata atau kalimat terlebih dahulu</div>`;
        return;
    }

    const kataArray = teks.toLowerCase().split(/\s+/);
    hasil.innerHTML = '';

    kataArray.forEach(kata => {
        const kataBersih = kata.replace(/[.,!?;:()'"-]/g, '');
        if (kataBersih.length === 0) return;

        if (kamusKata[kataBersih]) {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex flex-col items-center';
            const img = document.createElement('img');
            img.src = kamusKata[kataBersih];
            img.className = 'hasil-img';
            const label = document.createElement('span');
            label.className = 'text-sm text-gray-600 dark:text-gray-400 mt-2';
            label.textContent = kataBersih;
            wrapper.appendChild(img);
            wrapper.appendChild(label);
            hasil.appendChild(wrapper);
        } else {
            // Finger spelling
            const wrapper = document.createElement('div');
            wrapper.className = 'flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-dashed border-yellow-400 dark:border-yellow-600';
            const textDiv = document.createElement('div');
            textDiv.className = 'text-center';
            const kataSpan = document.createElement('span');
            kataSpan.className = 'text-lg font-bold text-yellow-700 dark:text-yellow-400';
            kataSpan.textContent = kataBersih;
            textDiv.appendChild(kataSpan);
            const infoSpan = document.createElement('span');
            infoSpan.className = 'block text-sm text-yellow-600 dark:text-yellow-500 mt-1';
            infoSpan.textContent = '🔤 Belum tersedia, dieja per huruf';
            textDiv.appendChild(infoSpan);
            const spellDiv = document.createElement('div');
            spellDiv.className = 'flex flex-wrap gap-2 mt-3 justify-center';
            kataBersih.toUpperCase().split('').forEach(huruf => {
                const span = document.createElement('span');
                span.className = 'px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold text-lg';
                span.textContent = huruf;
                spellDiv.appendChild(span);
            });
            wrapper.appendChild(textDiv);
            wrapper.appendChild(spellDiv);
            hasil.appendChild(wrapper);
        }
    });
}

function setExample(text) {
    document.getElementById('input-kata').value = text;
    terjemahkan();
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// DARK MODE
// ==========================================
const toggleDark = document.getElementById('toggleDark');
const toggleDarkMobile = document.getElementById('toggleDarkMobile');

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    toggleDark.textContent = isDark ? '☀️' : '🌙';
    toggleDarkMobile.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
}

if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
    toggleDark.textContent = '☀️';
    toggleDarkMobile.textContent = '☀️ Light Mode';
}

toggleDark.addEventListener('click', toggleDarkMode);
toggleDarkMobile.addEventListener('click', toggleDarkMode);

// ==========================================
// MOBILE MENU
// ==========================================
document.getElementById('mobileMenuBtn').addEventListener('click', function() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
});

document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => document.getElementById('mobileMenu').classList.add('hidden'));
});

// ==========================================
// SPEECH-TO-TEXT
// ==========================================
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
    };

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                hasilSTT.textContent = transcript;
                document.getElementById('input-kata').value = transcript;
            }
        }
        if (!event.results[event.results.length - 1].isFinal) {
            hasilSTT.textContent = transcript + '...';
        }
    };

    recognition.onerror = (event) => {
        let msg = `❌ Error: ${event.error}`;
        if (event.error === 'not-allowed') msg = '❌ Izin mikrofon ditolak.';
        if (event.error === 'no-speech') msg = '🔇 Tidak ada suara. Coba lagi.';
        hasilSTT.textContent = msg;
        stopRecording();
    };

    recognition.onend = () => {
        stopRecording();
    };
} else {
    btnRekam.disabled = true;
    btnRekam.textContent = '❌ Browser tidak mendukung';
    hasilSTT.textContent = '⚠️ Gunakan Chrome atau Edge';
}

function mulaiRekam() {
    if (!recognition) return;
    if (isRecording) { stopRecording(); return; }
    try { recognition.start(); } catch (e) { console.error(e); }
}

function stopRecording() {
    isRecording = false;
    btnRekam.textContent = '🎙️ Mulai Rekam';
    btnRekam.classList.remove('recording');
    try { recognition.stop(); } catch (e) {}
}

btnRekam.addEventListener('click', mulaiRekam);