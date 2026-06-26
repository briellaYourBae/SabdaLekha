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
// AUTO CLEAR JAM 14:00
// ==========================================
function startAutoClear() {
    if (autoClearInterval) {
        clearTimeout(autoClearInterval);
        autoClearInterval = null;
    }

    function scheduleNextClear() {
        const now = new Date();

        let nextClear = new Date();
        nextClear.setHours(14, 0, 0, 0);

        if (now >= nextClear) {
            nextClear.setDate(nextClear.getDate() + 1);
        }

        const delay = nextClear - now;

        console.log("🕑 Jadwal clear:", nextClear.toLocaleString());

        autoClearInterval = setTimeout(() => {
            clearAllMessages();
            scheduleNextClear();
        }, delay);
    }

    scheduleNextClear();
}

function stopAutoClear() {
    if (autoClearInterval) {
        clearTimeout(autoClearInterval);
        autoClearInterval = null;
    }
}

function clearAllMessages() {
    const ref = database.ref('messages');

    const timeString = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });

    ref.remove().then(() => {
        console.log("✅ Chat dibersihkan:", timeString);
    }).catch(err => console.error(err));
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

    const messages = Object.values(data)
        .filter(msg => {
            if (currentMode === 'public') {
                return msg.type === 'public';
            }
            return msg.room === currentRoomCode;
        })
        .sort((a, b) => a.timestamp - b.timestamp);

    container.innerHTML = messages.map(msg => {
        return `<p><b>${msg.username}</b>: ${msg.message}</p>`;
    }).join('');
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
}

function joinRoom(code) {
    currentMode = 'room';
    currentRoomCode = code;
    listenMessages();
}

function setPublicMode() {
    currentMode = 'public';
    currentRoomCode = '';
    listenMessages();
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    currentUsername = getUsername();

    document.getElementById('sendMessageBtn')?.addEventListener('click', sendMessage);

    setPublicMode();
    startAutoClear();

    console.log("✅ Ready");
});
