function getPlaceholder(text, bgColor = '3F3D9C', textColor = 'ffffff') {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=${bgColor}&color=${textColor}&size=300&bold=true`;
}

const kamusHuruf = {
    'A': '../assets/images/huruf/a.png',
    'B': '../assets/images/huruf/b.png',
    'C': '../assets/images/huruf/c.png',
    'D': '../assets/images/huruf/d.png',
    'E': '../assets/images/huruf/e.png',
    'F': '../assets/images/huruf/f.png',
    'G': '../assets/images/huruf/g.png',
    'H': '../assets/images/huruf/h.png',
    'I': '../assets/images/huruf/i.png',
    'J': '../assets/images/huruf/j.png',
    'K': '../assets/images/huruf/k.png',
    'L': '../assets/images/huruf/l.png',
    'M': '../assets/images/huruf/m.png',
    'N': '../assets/images/huruf/n.png',
    'O': '../assets/images/huruf/o.png',
    'P': '../assets/images/huruf/p.png',
    'Q': '../assets/images/huruf/q.png',
    'R': '../assets/images/huruf/r.png',
    'S': '../assets/images/huruf/s.png',
    'T': '../assets/images/huruf/t.png',
    'U': '../assets/images/huruf/u.png',
    'V': '../assets/images/huruf/v.png',
    'W': '../assets/images/huruf/w.png',
    'X': '../assets/images/huruf/x.png',
    'Y': '../assets/images/huruf/y.png',
    'Z': '../assets/images/huruf/z.png'
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

            previewImg.src = path;
            previewImg.alt = `Bahasa isyarat huruf ${huruf}`;
            previewImg.classList.remove('hidden');
            previewImg.style.opacity = '0';

            previewText.textContent = `Huruf ${huruf}`;
            previewArea.classList.add('active');

            previewImg.onerror = function() {
                this.src = getPlaceholder(`Huruf ${huruf}`, '3F3D9C', 'ffffff');
                previewKeterangan.textContent = '⚠️ PNG tidak ditemukan, pakai placeholder';
                previewKeterangan.className = 'text-sm text-yellow-500 dark:text-yellow-400 mt-2';
                previewStatus.textContent = 'Gunakan gambar placeholder';
                previewStatus.className = 'text-xs text-yellow-500 dark:text-yellow-400 mt-1';
            };

            previewImg.onload = function() {
                previewKeterangan.textContent = '✅ Gambar berhasil dimuat';
                previewKeterangan.className = 'text-sm text-green-500 dark:text-green-400 mt-2';
                previewStatus.textContent = 'Gambar asli dari folder assets';
                previewStatus.className = 'text-xs text-green-500 dark:text-green-400 mt-1';
            };

            setTimeout(() => {
                previewImg.style.opacity = '1';
            }, 50);
        });

        container.appendChild(btn);
    }
});