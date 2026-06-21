function getPlaceholder(text, bgColor = '3F3D9C', textColor = 'ffffff') {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=${bgColor}&color=${textColor}&size=300&bold=true`;
}

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

            previewText.textContent = `Huruf ${huruf}`;
            previewArea.classList.add('active');
            previewImg.style.opacity = '0';
            previewImg.classList.remove('hidden');

            // ✅ Pasang handler SEBELUM set src
            previewImg.onerror = function() {
                this.src = getPlaceholder(`Huruf ${huruf}`, '3F3D9C', 'ffffff');
                previewKeterangan.innerHTML = '<span class="inline-flex items-center gap-1.5 justify-center"><svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.6 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>PNG tidak ditemukan, pakai placeholder</span></span>';
                previewKeterangan.className = 'text-sm text-yellow-500 dark:text-yellow-400 mt-2';
                previewStatus.textContent = 'Gunakan gambar placeholder';
                previewStatus.className = 'text-xs text-yellow-500 dark:text-yellow-400 mt-1';
                setTimeout(() => { previewImg.style.opacity = '1'; }, 50);
            };

            previewImg.onload = function() {
                previewKeterangan.textContent = '';
                previewKeterangan.className = 'text-sm text-green-500 dark:text-green-400 mt-2';
                previewStatus.textContent = "Thanks to AI for generating the image, sorry if it's not perfect!";
                previewStatus.className = 'text-xs text-green-500 dark:text-green-400 mt-1';
                setTimeout(() => { previewImg.style.opacity = '1'; }, 50);
            };

            // ✅ Set src SETELAH handler terpasang
            previewImg.src = path;
            previewImg.alt = `Bahasa isyarat huruf ${huruf}`;
        });

        container.appendChild(btn);
    }
});