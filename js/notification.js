// ==========================================
// NOTIFICATION SYSTEM - CUSTOM & MODERN
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Buat container untuk notifikasi
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 420px;
        width: 100%;
        pointer-events: none;
    `;
    document.body.appendChild(container);
});

// ==========================================
// TAMPILKAN NOTIFIKASI
// ==========================================
function showNotification(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const config = {
        success: {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30',
            icon: 'text-emerald-400',
            iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`,
            bar: 'from-emerald-500'
        },
        error: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            icon: 'text-red-400',
            iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>`,
            bar: 'from-red-500'
        },
        warning: {
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/30',
            icon: 'text-amber-400',
            iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
            bar: 'from-amber-500'
        },
        info: {
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/30',
            icon: 'text-indigo-400',
            iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
            bar: 'from-indigo-500'
        }
    };

    const style = config[type] || config.info;

    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.style.cssText = `
        pointer-events: auto;
        transform: translateX(calc(100% + 24px));
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 100%;
    `;
    
    notification.className = `bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border ${style.border} overflow-hidden`;

    notification.innerHTML = `
        <div class="flex items-start gap-3 p-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full ${style.bg} flex items-center justify-center ${style.icon}">
                ${style.iconSvg}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">${message}</p>
            </div>
            <button class="close-notification flex-shrink-0 w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>
        <div class="h-0.5 bg-gradient-to-r ${style.bar} via-${style.bar}/50 to-transparent progress-bar" style="width: 100%;"></div>
    `;

    container.appendChild(notification);

    // Animasi masuk
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    });

    // Progress bar
    const progressBar = notification.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.transition = `width ${duration}ms linear`;
        requestAnimationFrame(() => {
            progressBar.style.width = '0%';
        });
    }

    // Tombol close
    const closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
    }

    // Auto close
    let startTime = Date.now();
    let timeout = setTimeout(() => {
        removeNotification(notification);
    }, duration);

    // Hover pause
    notification.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        if (progressBar) {
            const currentWidth = parseFloat(progressBar.style.width) || 0;
            progressBar.style.transition = 'none';
            progressBar.style.width = currentWidth + '%';
        }
    });

    notification.addEventListener('mouseleave', () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(duration - elapsed, 0);
        if (remaining > 0) {
            timeout = setTimeout(() => {
                removeNotification(notification);
            }, remaining);
            if (progressBar) {
                const currentWidth = parseFloat(progressBar.style.width) || 0;
                progressBar.style.transition = `width ${remaining}ms linear`;
                progressBar.style.width = '0%';
            }
        }
    });

    return notification;
}

// ==========================================
// HAPUS NOTIFIKASI
// ==========================================
function removeNotification(notification) {
    if (notification._timeout) {
        clearTimeout(notification._timeout);
    }
    notification.style.transform = 'translateX(calc(100% + 24px))';
    notification.style.opacity = '0';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 500);
}

// ==========================================
// ALIAS UNTUK MEMUDAHKAN PENGGUNAAN
// ==========================================
function notifySuccess(message, duration = 4000) {
    return showNotification(message, 'success', duration);
}

function notifyError(message, duration = 5000) {
    return showNotification(message, 'error', duration);
}

function notifyWarning(message, duration = 4000) {
    return showNotification(message, 'warning', duration);
}

function notifyInfo(message, duration = 3000) {
    return showNotification(message, 'info', duration);
}