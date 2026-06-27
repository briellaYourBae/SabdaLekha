// ==========================================
// KONFIGURASI FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCGdzl8qpG2gKZsygyzV-t-giNMwifOrOw1M",
    authDomain: "sabdalekha.firebaseapp.com",
    databaseURL: "https://sabdalekha-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "sabdalekha",
    storageBucket: "sabdalekha.firebasestorage.app",
    messagingSenderId: "741419307493",
    appId: "1:741419307493:web:4f8eea88e74f06b4c9df0c"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let currentUsername = '';
let currentMode = 'public';
let currentRoomCode = '';
let messageListenerRef = null;
let messagesRef = null;
let autoClearInterval = null;

// ==========================================
// USERNAME
// ==========================================
function generateUsername() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomChars = '';
    for (let i = 0; i < 4; i++) {
        randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `SabdaLekha_user${randomChars}`;
}

function getUsername() {
    let name = localStorage.getItem('sabdaChatUsername');
    if (!name) {
        name = generateUsername();
        localStorage.setItem('sabdaChatUsername', name);
    }
    return name;
}

function setUsername(name) {
    currentUsername = name;
    localStorage.setItem('sabdaChatUsername', name);
}

// ==========================================
// AUTO CLEAR - HAPUS PESAN > 1 MENIT (TESTING)
// ==========================================
const MAX_MESSAGE_AGE = 1 * 60 * 1000; // 🔥 1 MENIT (untuk testing)
const CHECK_INTERVAL = 5 * 1000; // Cek setiap 5 detik

function startAutoClear() {
    if (autoClearInterval) {
        clearInterval(autoClearInterval);
        autoClearInterval = null;
    }

    // Jalankan pengecekan setiap 5 detik
    autoClearInterval = setInterval(() => {
        clearOldMessages();
    }, CHECK_INTERVAL);

    // Jalankan pertama kali setelah 2 detik
    setTimeout(clearOldMessages, 2000);

    console.log('🔄 AUTO-CLEAR TESTING: pesan > 1 menit akan dihapus otomatis');
    console.log(`⏱️  Cek setiap ${CHECK_INTERVAL / 1000} detik`);
}

function stopAutoClear() {
    if (autoClearInterval) {
        clearInterval(autoClearInterval);
        autoClearInterval = null;
        console.log('⏹️ Auto-clear dihentikan');
    }
}

function clearOldMessages() {
    const ref = database.ref('messages');
    const now = Date.now();
    const cutoff = now - MAX_MESSAGE_AGE;

    // Ambil semua pesan
    ref.once('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const toRemove = [];
        let count = 0;

        // Cari pesan yang sudah > 1 menit
        Object.keys(data).forEach(key => {
            const msg = data[key];
            if (msg.timestamp && msg.timestamp < cutoff) {
                toRemove.push(key);
                count++;
            }
        });

        if (toRemove.length === 0) {
            // Tidak ada pesan yang perlu dihapus
            return;
        }

        console.log(`🧹 Menghapus ${count} pesan lama (umur > 1 menit)...`);

        // Hapus pesan satu per satu
        toRemove.forEach(key => {
            ref.child(key).remove().catch(err => {
                console.error(`❌ Gagal hapus pesan ${key}:`, err);
            });
        });

        // Tampilkan notifikasi jika banyak pesan terhapus
        if (count > 0 && typeof notifyInfo === 'function') {
            notifyInfo(`🧹 ${count} pesan lama otomatis dihapus (testing 1 menit)`, 2000);
        }

        // Update UI jika pesan dihapus
        const container = document.getElementById('messages-container');
        if (container && container.children.length <= count) {
            container.innerHTML = "Belum ada pesan";
        }

    }).catch(err => {
        console.error('❌ Gagal cek pesan lama:', err);
    });
}

// ==========================================
// RENDER
// ==========================================
function renderMessages(snapshot) {
    const container = document.getElementById('messages-container');
    if (!container) return;

    const data = snapshot.val();
    if (!data) {
        container.innerHTML = "Belum ada pesan";
        return;
    }

    const now = Date.now();
    const cutoff = now - MAX_MESSAGE_AGE;

    // Filter: hanya pesan yang masih berlaku (belum > 1 menit)
    const messages = Object.values(data)
        .filter(msg => {
            // Cek umur pesan
            if (msg.timestamp && msg.timestamp < cutoff) {
                return false; // Pesan sudah kedaluwarsa
            }
            
            // Cek mode (public atau room)
            if (currentMode === 'public') {
                return msg.type === 'public';
            }
            return msg.room === currentRoomCode;
        })
        .sort((a, b) => a.timestamp - b.timestamp);

    if (messages.length === 0) {
        container.innerHTML = "Belum ada pesan";
        return;
    }

    // Render pesan dengan bubble style
    container.innerHTML = messages.map(msg => {
        const isOwn = msg.username === currentUsername;
        const bubbleClass = isOwn 
            ? 'message-bubble message-own ml-auto' 
            : 'message-bubble message-other';
        
        // Format waktu
        const time = new Date(msg.timestamp);
        const timeStr = time.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // Hitung umur pesan dalam detik
        const ageInSeconds = Math.floor((now - msg.timestamp) / 1000);
        const ageText = ageInSeconds < 60 
            ? `${ageInSeconds}d yang lalu` 
            : `${Math.floor(ageInSeconds / 60)}m ${ageInSeconds % 60}d yang lalu`;

        return `
            <div class="${bubbleClass}" style="max-width:80%;margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:0.7rem;color:${isOwn ? 'rgba(255,255,255,0.6)' : '#8A8AA8'};">
                    <strong>${msg.username}</strong>
                    <span style="opacity:0.6;">${timeStr}</span>
                    <span style="opacity:0.4;font-size:0.6rem;">⏱️ ${ageText}</span>
                </div>
                <div>${escapeHtml(msg.message)}</div>
            </div>
        `;
    }).join('');

    // Scroll ke bawah
    container.scrollTop = container.scrollHeight;
}

// Helper untuk escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// LISTEN
// ==========================================
function listenMessages() {
    if (messagesRef && messageListenerRef) {
        messagesRef.off('value', messageListenerRef);
    }

    messagesRef = database.ref('messages');
    messageListenerRef = renderMessages;
    messagesRef.on('value', messageListenerRef);
}

// ==========================================
// SEND
// ==========================================
function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    const message = {
        type: currentMode,
        room: currentRoomCode,
        username: currentUsername,
        message: text,
        timestamp: Date.now()
    };

    database.ref('messages').push(message);
    input.value = '';
}

// ==========================================
// ROOM
// ==========================================
function createRoom() {
    let code = Math.random().toString(36).substring(2, 8).toUpperCase();
    joinRoom(code);
    
    if (typeof notifySuccess === 'function') {
        notifySuccess(`🔑 Room berhasil dibuat: ${code}`, 3000);
    }
}

function joinRoom(code) {
    currentMode = 'room';
    currentRoomCode = code.toUpperCase();
    
    // Update UI
    const roomInfo = document.getElementById('room-info');
    const roomCodeDisplay = document.getElementById('current-room-code');
    if (roomInfo) roomInfo.classList.remove('hidden');
    if (roomCodeDisplay) roomCodeDisplay.textContent = currentRoomCode;
    
    listenMessages();
}

function setPublicMode() {
    currentMode = 'public';
    currentRoomCode = '';
    
    // Sembunyikan info room
    const roomInfo = document.getElementById('room-info');
    if (roomInfo) roomInfo.classList.add('hidden');
    
    listenMessages();
}

// ==========================================
// COPY ROOM CODE
// ==========================================
function copyRoomCode() {
    if (!currentRoomCode) return;
    
    navigator.clipboard.writeText(currentRoomCode).then(() => {
        if (typeof notifySuccess === 'function') {
            notifySuccess('📋 Kode room disalin!', 2000);
        }
    }).catch(() => {
        // Fallback
        const input = document.createElement('input');
        input.value = currentRoomCode;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
        if (typeof notifySuccess === 'function') {
            notifySuccess('📋 Kode room disalin!', 2000);
        }
    });
}

function leaveRoom() {
    setPublicMode();
    if (typeof notifyInfo === 'function') {
        notifyInfo('🚪 Keluar dari room', 2000);
    }
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    currentUsername = getUsername();

    // Tampilkan username
    const usernameDisplay = document.getElementById('current-username');
    if (usernameDisplay) {
        usernameDisplay.textContent = currentUsername;
    }

    // Event listeners
    document.getElementById('sendMessageBtn')?.addEventListener('click', sendMessage);
    document.getElementById('messageInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Mode buttons
    document.getElementById('btnPublic')?.addEventListener('click', setPublicMode);
    document.getElementById('btnCreateRoom')?.addEventListener('click', createRoom);
    document.getElementById('btnJoinRoom')?.addEventListener('click', function() {
        const input = document.getElementById('roomCodeInput');
        if (input && input.value.trim()) {
            joinRoom(input.value.trim());
            input.value = '';
        } else {
            if (typeof notifyWarning === 'function') {
                notifyWarning('⚠️ Masukkan kode room terlebih dahulu', 2000);
            }
        }
    });

    // Room code input - auto join with Enter
    document.getElementById('roomCodeInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('btnJoinRoom')?.click();
        }
    });

    // Copy room code
    document.getElementById('copyRoomCode')?.addEventListener('click', copyRoomCode);
    document.getElementById('leaveRoom')?.addEventListener('click', leaveRoom);

    // Refresh username
    document.getElementById('refreshUsername')?.addEventListener('click', function() {
        const newName = generateUsername();
        setUsername(newName);
        if (usernameDisplay) {
            usernameDisplay.textContent = newName;
        }
        if (typeof notifyInfo === 'function') {
            notifyInfo(`👤 Username diganti: ${newName}`, 2000);
        }
    });

    // Start auto-clear
    startAutoClear();

    // Start listening
    setPublicMode();

    console.log('✅ Chat siap! (TESTING MODE: 1 menit)');
    console.log(`👤 Username: ${currentUsername}`);
    console.log(`⏱️  Pesan otomatis dihapus setelah 1 menit (TESTING)`);
});