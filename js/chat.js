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

// ===== INISIALISASI FIREBASE =====
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

console.log('🔥 Firebase initialized!');

// ==========================================
// STATE
// ==========================================
let currentUsername = '';
let currentMode = 'public';
let currentRoomCode = '';
let messageListenerRef = null;
let messagesRef = null;
let autoClearInterval = null;

// ==========================================
// GENERATE USERNAME - FORMAT: SabdaLekha_userXXXX
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
        console.log('👤 Username baru dibuat:', name);
    }
    return name;
}

function setUsername(name) {
    currentUsername = name;
    localStorage.setItem('sabdaChatUsername', name);
    const el = document.getElementById('current-username');
    if (el) el.textContent = name;
}

// ==========================================
// AUTO CLEAR CHAT - SETIAP 12 JAM
// ==========================================
function startAutoClear() {
    if (autoClearInterval) {
        clearInterval(autoClearInterval);
        autoClearInterval = null;
    }

    const twelveHours = 12 * 60 * 60 * 1000;
    console.log(`⏰ Auto-clear chat dijadwalkan setiap 12 jam`);

    autoClearInterval = setInterval(function() {
        clearAllMessages();
    }, twelveHours);
}

function stopAutoClear() {
    if (autoClearInterval) {
        clearInterval(autoClearInterval);
        autoClearInterval = null;
        console.log('⏹️ Auto-clear chat dihentikan');
    }
}

function clearAllMessages() {
    const messagesRef = database.ref('messages');
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    console.log(`🧹 Menghapus semua pesan (${timeString})...`);
    
    messagesRef.remove()
        .then(() => {
            console.log(`✅ Semua pesan berhasil dihapus! (${timeString})`);
            const container = document.getElementById('messages-container');
            if (container) {
                container.innerHTML = `
                    <div class="text-center text-[#8A8AA8] dark:text-[#8A7F72] text-sm py-8">
                        🧹 Chat telah dibersihkan secara otomatis (${timeString}).
                        <br>Pesan baru akan muncul di sini.
                    </div>
                `;
            }
            notifyInfo(`🧹 Chat dibersihkan otomatis (${timeString})`);
        })
        .catch((error) => {
            console.error('❌ Gagal menghapus pesan:', error);
            notifyError('❌ Gagal membersihkan chat');
        });
}

// ==========================================
// RENDER PESAN
// ==========================================
function renderMessages(snapshot) {
    const container = document.getElementById('messages-container');
    if (!container) {
        console.warn('⚠️ Container messages tidak ditemukan');
        return;
    }
    
    const data = snapshot.val();
    console.log('📥 Data dari Firebase:', data);
    
    if (!data) {
        container.innerHTML = `<div class="text-center text-[#8A8AA8] dark:text-[#8A7F72] text-sm py-8">💬 Belum ada pesan. Mulai chat!</div>`;
        return;
    }

    const messagesArray = Object.values(data);
    console.log('📨 Total pesan di database:', messagesArray.length);
    console.log('🔍 Mode saat ini:', currentMode, 'Room:', currentRoomCode);

    const filteredMessages = messagesArray.filter(msg => {
        if (currentMode === 'public') {
            return msg.type === 'public' || (msg.type === 'room' && !msg.room);
        } else {
            return msg.type === 'room' && msg.room === currentRoomCode;
        }
    });

    console.log('📨 Pesan setelah filter:', filteredMessages.length);

    if (filteredMessages.length === 0) {
        const modeText = currentMode === 'public' ? 'Public Chat' : 'Room ' + currentRoomCode;
        container.innerHTML = `<div class="text-center text-[#8A8AA8] dark:text-[#8A7F72] text-sm py-8">💬 Belum ada pesan di ${modeText}.</div>`;
        return;
    }

    filteredMessages.sort((a, b) => a.timestamp - b.timestamp);

    let html = '';
    filteredMessages.forEach(msg => {
        const isOwn = msg.username === currentUsername;
        const time = new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        const modeTag = msg.type === 'room' ? `🔒 ${msg.room}` : '🌐 Public';
        
        html += `
            <div class="flex flex-col ${isOwn ? 'items-end' : 'items-start'}">
                <div class="flex items-center gap-2 text-xs text-[#8A8AA8] dark:text-[#8A7F72] mb-1">
                    <span class="font-semibold ${isOwn ? 'text-[#3F3D9C] dark:text-[#C8A951]' : 'text-[#4A4A6A] dark:text-[#B8B8D0]'}">${msg.username}</span>
                    <span>•</span>
                    <span>${time}</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700">${modeTag}</span>
                </div>
                <div class="max-w-[80%] px-4 py-2.5 rounded-2xl ${isOwn ? 'bg-[#3F3D9C] dark:bg-[#C8A951] text-white rounded-br-none' : 'bg-white dark:bg-[#1A1A2E] border border-[#3F3D9C]/10 dark:border-[#C8A951]/10 rounded-bl-none'}">
                    <p class="text-sm break-words">${msg.message}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
}

// ==========================================
// LISTEN MESSAGES (REALTIME)
// ==========================================
function listenMessages() {
    if (messagesRef && messageListenerRef) {
        try {
            messagesRef.off('value', messageListenerRef);
            console.log('🔄 Listener lama dihapus');
        } catch (e) {
            console.warn('⚠️ Gagal menghapus listener:', e);
        }
        messageListenerRef = null;
        messagesRef = null;
    }

    messagesRef = database.ref('messages');
    messageListenerRef = renderMessages;
    messagesRef.on('value', messageListenerRef);
    
    console.log('📡 Listening to messages...');
}

// ==========================================
// KIRIM PESAN
// ==========================================
function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) {
        console.warn('⚠️ Pesan kosong');
        return;
    }

    console.log('📤 Mengirim pesan dengan mode:', currentMode, 'Room:', currentRoomCode);

    const message = {
        type: currentMode,
        room: currentRoomCode || '',
        username: currentUsername,
        message: text,
        timestamp: Date.now()
    };

    console.log('📤 Data pesan:', message);

    database.ref('messages').push(message)
        .then(() => {
            console.log('✅ Pesan berhasil dikirim!');
        })
        .catch((error) => {
            console.error('❌ Gagal kirim pesan:', error);
            notifyError('❌ Gagal mengirim pesan');
        });
    
    input.value = '';
    input.focus();
}

// ==========================================
// ENTER KEY
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('messageInput');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// ==========================================
// SET MODE PUBLIC
// ==========================================
function setPublicMode() {
    console.log('🔄 Beralih ke Public Chat');
    currentMode = 'public';
    currentRoomCode = '';
    
    const roomInfo = document.getElementById('room-info');
    if (roomInfo) roomInfo.classList.add('hidden');
    
    const inputCode = document.getElementById('roomCodeInput');
    if (inputCode) inputCode.value = '';
    
    const btnPublic = document.getElementById('btnPublic');
    const btnCreate = document.getElementById('btnCreateRoom');
    
    if (btnPublic) {
        btnPublic.className = 'px-6 py-3 bg-[#3F3D9C] hover:bg-[#33318A] dark:bg-[#C8A951] dark:hover:bg-[#B89A40] text-white rounded-full transition shadow-lg hover:shadow-xl flex-1 sm:flex-none';
    }
    if (btnCreate) {
        btnCreate.className = 'px-6 py-3 bg-[#3F3D9C]/10 hover:bg-[#3F3D9C]/20 dark:bg-[#C8A951]/10 dark:hover:bg-[#C8A951]/20 border border-[#3F3D9C]/20 dark:border-[#C8A951]/20 text-[#3F3D9C] dark:text-[#C8A951] rounded-full transition flex-1 sm:flex-none';
    }
    
    notifyInfo('🌐 Beralih ke Public Chat');
    listenMessages();
}

// ==========================================
// CREATE ROOM
// ==========================================
function createRoom() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    console.log('🆕 Room baru dibuat:', code);
    notifySuccess(`✨ Room berhasil dibuat! Kode: ${code}`);
    joinRoom(code);
}

// ==========================================
// JOIN ROOM
// ==========================================
function joinRoom(code) {
    if (!code || code.length !== 6) {
        notifyWarning('⚠️ Kode room harus 6 karakter!');
        return;
    }
    
    console.log('🔗 Join room:', code);
    currentMode = 'room';
    currentRoomCode = code.toUpperCase();
    
    const roomInfo = document.getElementById('room-info');
    const roomCodeEl = document.getElementById('current-room-code');
    const inputCode = document.getElementById('roomCodeInput');
    
    if (roomInfo) roomInfo.classList.remove('hidden');
    if (roomCodeEl) roomCodeEl.textContent = currentRoomCode;
    if (inputCode) inputCode.value = '';
    
    const btnPublic = document.getElementById('btnPublic');
    const btnCreate = document.getElementById('btnCreateRoom');
    
    if (btnPublic) {
        btnPublic.className = 'px-6 py-3 bg-[#3F3D9C]/10 hover:bg-[#3F3D9C]/20 dark:bg-[#C8A951]/10 dark:hover:bg-[#C8A951]/20 border border-[#3F3D9C]/20 dark:border-[#C8A951]/20 text-[#3F3D9C] dark:text-[#C8A951] rounded-full transition flex-1 sm:flex-none';
    }
    if (btnCreate) {
        btnCreate.className = 'px-6 py-3 bg-[#3F3D9C]/10 hover:bg-[#3F3D9C]/20 dark:bg-[#C8A951]/10 dark:hover:bg-[#C8A951]/20 border border-[#3F3D9C]/20 dark:border-[#C8A951]/20 text-[#3F3D9C] dark:text-[#C8A951] rounded-full transition flex-1 sm:flex-none';
    }
    
    notifySuccess(`✅ Berhasil join room: ${currentRoomCode}`);
    listenMessages();
}

// ==========================================
// LEAVE ROOM
// ==========================================
function leaveRoom() {
    if (confirm('Keluar dari room ini?')) {
        setPublicMode();
        notifyInfo('🚪 Keluar dari room');
    }
}

// ==========================================
// COPY ROOM CODE
// ==========================================
function copyRoomCode() {
    const code = document.getElementById('current-room-code');
    if (!code) return;
    
    navigator.clipboard.writeText(code.textContent).then(() => {
        notifySuccess(`📋 Kode room disalin: ${code.textContent}`);
    }).catch(() => {
        const input = document.createElement('input');
        input.value = code.textContent;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        notifySuccess(`📋 Kode room disalin: ${code.textContent}`);
    });
}

// ==========================================
// REFRESH USERNAME
// ==========================================
function refreshUsername() {
    const newName = generateUsername();
    setUsername(newName);
    notifySuccess(`🔄 Username berhasil diganti menjadi: ${newName}`);
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // ===== SET USERNAME OTOMATIS =====
    currentUsername = getUsername();
    const usernameEl = document.getElementById('current-username');
    if (usernameEl) usernameEl.textContent = currentUsername;

    console.log('👤 Username:', currentUsername);

    // Event listeners
    const btnPublic = document.getElementById('btnPublic');
    const btnCreate = document.getElementById('btnCreateRoom');
    const btnJoin = document.getElementById('btnJoinRoom');
    const btnSend = document.getElementById('sendMessageBtn');
    const btnLeave = document.getElementById('leaveRoom');
    const btnCopy = document.getElementById('copyRoomCode');
    const btnRefresh = document.getElementById('refreshUsername');
    const inputCode = document.getElementById('roomCodeInput');
    const inputMessage = document.getElementById('messageInput');

    if (btnPublic) btnPublic.addEventListener('click', setPublicMode);
    if (btnCreate) btnCreate.addEventListener('click', createRoom);
    if (btnJoin) {
        btnJoin.addEventListener('click', function() {
            const code = inputCode ? inputCode.value.trim() : '';
            joinRoom(code);
        });
    }
    if (btnSend) btnSend.addEventListener('click', sendMessage);
    if (btnLeave) btnLeave.addEventListener('click', leaveRoom);
    if (btnCopy) btnCopy.addEventListener('click', copyRoomCode);
    if (btnRefresh) btnRefresh.addEventListener('click', refreshUsername);

    if (inputMessage) {
        inputMessage.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    if (inputCode) {
        inputCode.addEventListener('input', function() {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
        });
    }

    setPublicMode();
    startAutoClear();

    console.log('✅ SabdaChat initialized!');
    console.log('🔥 Firebase connected!');
    console.log('⏰ Chat akan otomatis dibersihkan setiap 12 jam');
    console.log('👤 Username:', currentUsername);
});