// ==========================================
// FUNCTIONS/INDEX.JS - FIREBASE FUNCTIONS
// AUTO DELETE PESAN > 6 JAM
// ==========================================

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// ==========================================
// KONFIGURASI
// ==========================================
const MAX_MESSAGE_AGE = 6 * 60 * 60 * 1000; // 6 JAM

// ==========================================
// AUTO DELETE PESAN > 6 JAM
// ==========================================
exports.clearOldMessages = functions.pubsub
    .schedule('every 5 minutes')
    .timeZone('Asia/Jakarta')
    .onRun(async (context) => {
        const now = Date.now();
        const cutoff = now - MAX_MESSAGE_AGE;
        
        const ref = admin.database().ref('messages');
        const snapshot = await ref.once('value');
        const data = snapshot.val();
        
        if (!data) {
            console.log('📭 Tidak ada pesan');
            return null;
        }
        
        const toRemove = [];
        Object.keys(data).forEach(key => {
            const msg = data[key];
            if (msg.timestamp && msg.timestamp < cutoff) {
                toRemove.push(key);
            }
        });
        
        if (toRemove.length === 0) {
            console.log('✅ Tidak ada pesan > 6 jam');
            return null;
        }
        
        const updates = {};
        toRemove.forEach(key => {
            updates[key] = null;
        });
        await ref.update(updates);
        
        console.log(`🧹 ${toRemove.length} pesan lama (> 6 jam) dihapus`);
        return null;
    });

// ==========================================
// HAPUS SEMUA CHAT JAM 00:00 (OPSIONAL)
// ==========================================
exports.clearAllChatDaily = functions.pubsub
    .schedule('0 0 * * *')
    .timeZone('Asia/Jakarta')
    .onRun(async (context) => {
        const ref = admin.database().ref('messages');
        await ref.remove();
        console.log('🧹 Semua chat dihapus (daily cleanup)');
        return null;
    });