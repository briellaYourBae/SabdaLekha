const kamusHuruf = {
    'A': '../assets/images/huruf/A.png',
    'B': '../assets/images/huruf/B.png',
    'C': '../assets/images/huruf/C.jpg',
    'D': '../assets/images/huruf/D.png',
    'E': '../assets/images/huruf/E.png',
    'F': '../assets/images/huruf/F.png',
    'G': '../assets/images/huruf/G.png',
    'H': '../assets/images/huruf/H.png',
    'I': '../assets/images/huruf/I.png',
    'J': '../assets/images/huruf/J.png',
    'K': '../assets/images/huruf/K.png',
    'L': '../assets/images/huruf/L.png',
    'M': '../assets/images/huruf/M.png',
    'N': '../assets/images/huruf/N.png',
    'O': '../assets/images/huruf/O.png',
    'P': '../assets/images/huruf/P.png',
    'Q': '../assets/images/huruf/Q.png',
    'R': '../assets/images/huruf/R.png',
    'S': '../assets/images/huruf/S.png',
    'T': '../assets/images/huruf/T.png',
    'U': '../assets/images/huruf/U.png',
    'V': '../assets/images/huruf/V.png',
    'W': '../assets/images/huruf/W.png',
    'X': '../assets/images/huruf/X.png',
    'Y': '../assets/images/huruf/Y.png',
    'Z': '../assets/images/huruf/Z.png'
};

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('huruf-container');
    const previewArea = document.getElementById('preview-area');
    const previewImg = document.getElementById('gambar-huruf');
    const previewText = document.getElementById('nama-huruf');
    const previewKeterangan = document.getElementById('keterangan-huruf');
    const previewStatus = document.getElementById('status-huruf');

    if (!container) return;

    for (let i = 65; i <= 90; i++) {
        const huruf = String.fromCharCode(i);
        const btn = document.createElement('button');
        btn.className = 'huruf-btn';
        const span = document.createElement('span');
        span.textContent = huruf;
        btn.appendChild(span);

        btn.addEventListener('click', function() {
            const path = kamusHuruf[huruf];

            // Reset dulu semua
            previewImg.src = '';
            previewImg.onerror = null;
            previewImg.onload = null;
            previewKeterangan.textContent = '';
            previewKeterangan.className = '';
            previewStatus.textContent = '';
            previewStatus.className = '';

            previewText.textContent = `Huruf ${huruf}`;
            previewArea.classList.add('active');
            previewImg.style.opacity = '0';
            previewImg.classList.remove('hidden');

            // Gunakan Image() baru untuk cek apakah file ada
            const testImg = new Image();

            testImg.onload = function() {
                // Gambar asli berhasil load
                previewImg.onload = function() {
                    previewImg.style.opacity = '1';
                    previewStatus.textContent = "Thanks to AI for generating the image, sorry if it's not perfect!";
                    previewStatus.className = 'text-xs text-green-500 dark:text-green-400 mt-1';
                };
                previewImg.src = path;
            };

            testImg.onerror = function() {
                // Gambar tidak ada
                previewImg.classList.add('hidden');
                previewImg.style.opacity = '1';
                previewKeterangan.textContent = `Gambar untuk huruf ${huruf} belum tersedia`;
                previewKeterangan.className = 'text-sm text-[#8A8AA8] dark:text-[#8A7F72] mt-2';
            };

            // Cache busting supaya tidak pakai hasil cache lama
            testImg.src = path + '?v=' + Date.now();
        });

        container.appendChild(btn);
    }
});