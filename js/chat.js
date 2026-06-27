// ==========================================
// CHAT.JS - FRONTEND CHAT
// AUTO DELETE PESAN > 6 JAM + TIMER REAL-TIME + REPLY
// ==========================================

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
let timerInterval = null;
let replyTarget = null;

// ==========================================
// KONFIGURASI AUTO DELETE
// ==========================================
const MAX_MESSAGE_AGE = 6 * 60 * 60 * 1000; // 6 JAM
const CHECK_INTERVAL = 2 * 60 * 1000; // Cek setiap 2 menit

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
// FORMAT AGE
// ==========================================
function formatAge(seconds) {
    if (seconds < 0) return '0d yang lalu';
    
    if (seconds < 60) {
        return `${seconds}d yang lalu`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes < 60) {
        return `${minutes}m ${remainingSeconds}d yang lalu`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours < 24) {
        return `${hours}j ${remainingMinutes}m yang lalu`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}h ${remainingHours}j yang lalu`;
}

// ==========================================
// TIMER REAL-TIME - UPDATE SETIAP DETIK
// ==========================================
function startTimerRealtime() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    timerInterval = setInterval(() => {
        updateMessageTimers();
    }, 1000);
}

function stopTimerRealtime() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateMessageTimers() {
    const container = document.getElementById('messages-container');
    if (!container) return;
    
    const now = Date.now();
    const cutoff = now - MAX_MESSAGE_AGE;
    
    const messageElements = container.querySelectorAll('[data-timestamp]');
    
    messageElements.forEach(el => {
        const timestamp = parseInt(el.getAttribute('data-timestamp'));
        if (isNaN(timestamp)) return;
        
        if (timestamp < cutoff) {
            el.style.display = 'none';
            return;
        }
        
        const ageInSeconds = Math.floor((now - timestamp) / 1000);
        const ageText = formatAge(ageInSeconds);
        
        const timerSpan = el.querySelector('.timer-age');
        if (timerSpan) {
            timerSpan.textContent = `⏱️ ${ageText}`;
        }
    });
}

// ==========================================
// AUTO CLEAR - HAPUS PESAN > 6 JAM
// ==========================================
function startAutoClear() {
    if (autoClearInterval) {
        clearInterval(autoClearInterval);
        autoClearInterval = null;
    }

    autoClearInterval = setInterval(() => {
        clearOldMessages();
    }, CHECK_INTERVAL);

    setTimeout(clearOldMessages, 5000);

    console.log('🔄 AUTO-CLEAR: pesan > 6 jam akan dihapus otomatis');
    console.log(`⏱️  Cek setiap ${CHECK_INTERVAL / 1000 / 60} menit`);
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

    ref.once('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const toRemove = [];
        let count = 0;

        Object.keys(data).forEach(key => {
            const msg = data[key];
            if (msg.timestamp && msg.timestamp < cutoff) {
                toRemove.push(key);
                count++;
            }
        });

        if (toRemove.length === 0) return;

        console.log(`🧹 Menghapus ${count} pesan lama (umur > 6 jam)...`);

        toRemove.forEach(key => {
            ref.child(key).remove().catch(err => {
                console.error(`❌ Gagal hapus pesan ${key}:`, err);
            });
        });

        if (count > 3 && typeof notifyInfo === 'function') {
            notifyInfo(`🧹 ${count} pesan lama otomatis dihapus (umur > 6 jam)`, 3000);
        }

        const container = document.getElementById('messages-container');
        if (container && container.children.length <= count) {
            container.innerHTML = "Belum ada pesan";
        }

    }).catch(err => {
        console.error('❌ Gagal cek pesan lama:', err);
    });
}

// ==========================================
// REPLY SYSTEM
// ==========================================
function openReplyModal(messageData) {
    replyTarget = messageData;
    
    const previewMsg = document.getElementById('replyMessagePreview');
    const previewUser = document.getElementById('replyUsernamePreview');
    
    if (previewMsg) {
        previewMsg.textContent = messageData.message || '(pesan tidak tersedia)';
    }
    if (previewUser) {
        previewUser.textContent = `— ${messageData.username}`;
    }
    
    const modal = document.getElementById('replyModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
    
    const input = document.getElementById('replyInput');
    if (input) {
        setTimeout(() => input.focus(), 100);
    }
}

function closeReplyModal() {
    const modal = document.getElementById('replyModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    replyTarget = null;
    const input = document.getElementById('replyInput');
    if (input) {
        input.value = '';
    }
}

function sendReply() {
    const input = document.getElementById('replyInput');
    const text = input.value.trim();
    if (!text || !replyTarget) return;
    
    const message = {
        type: currentMode,
        room: currentRoomCode,
        username: currentUsername,
        message: text,
        timestamp: Date.now(),
        replyTo: {
            username: replyTarget.username,
            message: replyTarget.message,
            timestamp: replyTarget.timestamp
        }
    };
    
    database.ref('messages').push(message);
    input.value = '';
    closeReplyModal();
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

    const messages = Object.values(data)
        .filter(msg => {
            if (msg.timestamp && msg.timestamp < cutoff) {
                return false;
            }
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

    container.innerHTML = messages.map((msg) => {
        const isOwn = msg.username === currentUsername;
        const bubbleClass = isOwn 
            ? 'message-bubble message-own ml-auto' 
            : 'message-bubble message-other';
        
        const time = new Date(msg.timestamp);
        const timeStr = time.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const ageInSeconds = Math.floor((now - msg.timestamp) / 1000);
        const ageText = formatAge(ageInSeconds);

        // Build reply preview if exists
        let replyHtml = '';
        if (msg.replyTo) {
            replyHtml = `
                <div class="reply-preview">
                    <span class="reply-username">${escapeHtml(msg.replyTo.username)}</span>
                    <span style="opacity:0.6;">: ${escapeHtml(msg.replyTo.message)}</span>
                </div>
            `;
        }

        // Escape message data for safe attribute
        const safeMessage = escapeHtml(msg.message);
        const safeUsername = escapeHtml(msg.username);
        const safeReplyUsername = msg.replyTo ? escapeHtml(msg.replyTo.username) : '';
        const safeReplyMessage = msg.replyTo ? escapeHtml(msg.replyTo.message) : '';

        return `
            <div class="${bubbleClass}" style="max-width:80%;margin-bottom:8px;" data-timestamp="${msg.timestamp}">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:0.7rem;color:${isOwn ? 'rgba(255,255,255,0.6)' : '#8A8AA8'};">
                    <strong>${safeUsername}</strong>
                    <span style="opacity:0.6;">${timeStr}</span>
                    <span class="timer-age" style="opacity:0.4;font-size:0.6rem;">⏱️ ${ageText}</span>
                </div>
                ${replyHtml}
                <div>${safeMessage}</div>
                <div style="display:flex;justify-content:flex-end;margin-top:4px;">
                    <button class="reply-btn" onclick="openReplyModal({
                        username: '${safeUsername.replace(/'/g, "\\'")}',
                        message: '${safeMessage.replace(/'/g, "\\'")}',
                        timestamp: ${msg.timestamp}
                    })">
                        💬 Balas
                    </button>
                </div>
            </div>
        `;
    }).join('');

    container.scrollTop = container.scrollHeight;
}

// ==========================================
// HELPERS
// ==========================================
function escapeHtml(text) {
    if (!text) return '';
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
    
    const roomInfo = document.getElementById('room-info');
    const roomCodeDisplay = document.getElementById('current-room-code');
    if (roomInfo) roomInfo.classList.remove('hidden');
    if (roomCodeDisplay) roomCodeDisplay.textContent = currentRoomCode;
    
    listenMessages();
}

function setPublicMode() {
    currentMode = 'public';
    currentRoomCode = '';
    
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

    const usernameDisplay = document.getElementById('current-username');
    if (usernameDisplay) {
        usernameDisplay.textContent = currentUsername;
    }

    // Send message
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

    document.getElementById('roomCodeInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('btnJoinRoom')?.click();
        }
    });

    // Room controls
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

    // Reply modal
    document.getElementById('closeReplyModal')?.addEventListener('click', closeReplyModal);
    document.getElementById('sendReplyBtn')?.addEventListener('click', sendReply);
    document.getElementById('replyInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendReply();
        }
    });
    
    // Close modal on overlay click
    document.getElementById('replyModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeReplyModal();
        }
    });

    // Start services
    startAutoClear();
    startTimerRealtime();
    setPublicMode();

    console.log('✅ Chat siap!');
    console.log(`👤 Username: ${currentUsername}`);
    console.log(`⏱️  Pesan otomatis dihapus setelah 6 jam`);
    console.log(`⏱️  Timer umur pesan update real-time setiap detik`);
    console.log(`💬  Fitur Reply aktif! Hover pesan lalu klik "Balas"`);
});