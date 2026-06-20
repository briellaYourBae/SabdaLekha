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

const kamusKata = {
    'aku': '../assets/images/kata/aku.png',
    'lapar': '../assets/images/kata/lapar.png',
    'makan': '../assets/images/kata/makan.png',
    'minum': '../assets/images/kata/minum.png',
    'belajar': '../assets/images/kata/belajar.png',
    'sekolah': '../assets/images/kata/sekolah.png',
    'saya': '../assets/images/kata/saya.png',
    'kamu': '../assets/images/kata/kamu.png',
    'mereka': '../assets/images/kata/mereka.png',
    'suka': '../assets/images/kata/suka.png',
    'senang': '../assets/images/kata/senang.png',
    'mau': '../assets/images/kata/mau.png',
    'ingin': '../assets/images/kata/ingin.png',
    'bisa': '../assets/images/kata/bisa.png',
    'tidak': '../assets/images/kata/tidak.png',
    'ya': '../assets/images/kata/ya.png',
    'halo': '../assets/images/kata/halo.png',
    'terima kasih': '../assets/images/kata/terima-kasih.png',
    'maaf': '../assets/images/kata/maaf.png',
    'tolong': '../assets/images/kata/tolong.png',
    'nama': '../assets/images/kata/nama.png',
    'umur': '../assets/images/kata/umur.png',
    'rumah': '../assets/images/kata/rumah.png',
    'keluarga': '../assets/images/kata/keluarga.png',
    'teman': '../assets/images/kata/teman.png',
    'guru': '../assets/images/kata/guru.png',
    'dosen': '../assets/images/kata/dosen.png',
    'mahasiswa': '../assets/images/kata/mahasiswa.png',
    'pelajar': '../assets/images/kata/pelajar.png',
    'sehat': '../assets/images/kata/sehat.png',
    'sakit': '../assets/images/kata/sakit.png',
    'sedih': '../assets/images/kata/sedih.png',
    'marah': '../assets/images/kata/marah.png',
    'takut': '../assets/images/kata/takut.png'
};

function tampilkanEjaanHuruf(kata, container) {
    const kataWrapper = document.createElement('div');
    kataWrapper.className = 'flex flex-col items-center p-4 bg-indigo-500/5 rounded-xl border-2 border-dashed border-indigo-500/20';

    const labelKata = document.createElement('div');
    labelKata.className = 'text-center mb-2';
    const kataSpan = document.createElement('span');
    kataSpan.className = 'text-sm font-semibold text-indigo-400';
    kataSpan.textContent = `"${kata}" (dieja)`;
    labelKata.appendChild(kataSpan);

    const hurufContainer = document.createElement('div');
    hurufContainer.className = 'flex flex-wrap gap-2 justify-center';

    kata.toUpperCase().split('').forEach(huruf => {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex flex-col items-center';

        const img = document.createElement('img');
        const path = kamusHuruf[huruf];

        if (path) {
            img.src = path;
            img.alt = `Huruf ${huruf}`;
            img.className = 'w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-indigo-500/20';
            img.loading = 'lazy';
            img.onerror = function() {
                this.src = getPlaceholder(`Huruf ${huruf}`, '3F3D9C', 'ffffff');
            };
        } else {
            img.src = getPlaceholder(`Huruf ${huruf}`, '3F3D9C', 'ffffff');
            img.className = 'w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg';
        }

        const label = document.createElement('span');
        label.className = 'text-xs text-gray-500 mt-1';
        label.textContent = huruf;

        wrapper.appendChild(img);
        wrapper.appendChild(label);
        hurufContainer.appendChild(wrapper);
    });

    kataWrapper.appendChild(labelKata);
    kataWrapper.appendChild(hurufContainer);
    container.appendChild(kataWrapper);
}

function terjemahkan() {
    const input = document.getElementById('input-kata');
    const hasil = document.getElementById('hasil-terjemahan');
    const teks = input.value.trim();

    if (!teks) {
        hasil.innerHTML = `<div class="w-full text-center text-gray-500 py-8">⚠️ Silakan ketik kata atau kalimat terlebih dahulu</div>`;
        hasil.classList.remove('has-results');
        return;
    }

    const kataArray = teks.toLowerCase().split(/\s+/);
    hasil.innerHTML = '';
    hasil.classList.add('has-results');

    kataArray.forEach(kata => {
        const kataBersih = kata.replace(/[.,!?;:()'"-]/g, '');
        if (kataBersih.length === 0) return;

        if (kamusKata[kataBersih]) {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex flex-col items-center transition-all duration-300 hover:scale-105';

            const img = document.createElement('img');
            img.src = kamusKata[kataBersih];
            img.alt = `Bahasa isyarat untuk ${kataBersih}`;
            img.className = 'hasil-img';
            img.loading = 'lazy';
            img.onerror = function() {
                this.parentElement.remove();
                tampilkanEjaanHuruf(kataBersih, hasil);
            };

            const label = document.createElement('span');
            label.className = 'text-sm text-gray-400 mt-2';
            label.textContent = kataBersih;

            wrapper.appendChild(img);
            wrapper.appendChild(label);
            hasil.appendChild(wrapper);
        } else {
            tampilkanEjaanHuruf(kataBersih, hasil);
        }
    });

    if (hasil.children.length === 0) {
        hasil.innerHTML = `<div class="w-full text-center text-gray-500 py-8">⚠️ Tidak ada kata yang valid</div>`;
    }
}

function setExample(text) {
    const input = document.getElementById('input-kata');
    if (input) {
        input.value = text;
        terjemahkan();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('input-kata');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                terjemahkan();
            }
        });
    }
});