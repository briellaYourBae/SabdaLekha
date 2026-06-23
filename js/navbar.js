// ==========================================
// NAVBAR PREMIUM - SCROLL EFFECT
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 Navbar Premium loaded!');

    const navbar = document.getElementById('navbar');

    // ===== SCROLL EFFECT =====
    let lastScrollY = 0;
    let ticking = false;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (currentScrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===== DROPDOWN =====
    const dropdownWrappers = document.querySelectorAll('.dropdown-wrapper');

    dropdownWrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector('.dropdown-trigger');
        const menu = wrapper.querySelector('.dropdown-menu');

        if (trigger && menu) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const isOpen = menu.classList.contains('show');

                document.querySelectorAll('.dropdown-menu.show').forEach(m => {
                    if (m !== menu) {
                        m.classList.remove('show');
                        m.closest('.dropdown-wrapper')?.classList.remove('open');
                    }
                });

                if (isOpen) {
                    menu.classList.remove('show');
                    wrapper.classList.remove('open');
                } else {
                    menu.classList.add('show');
                    wrapper.classList.add('open');
                }
            });

            document.addEventListener('click', function(e) {
                if (!wrapper.contains(e.target)) {
                    menu.classList.remove('show');
                    wrapper.classList.remove('open');
                }
            });

            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    menu.classList.remove('show');
                    wrapper.classList.remove('open');
                });
            });
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
                menu.closest('.dropdown-wrapper')?.classList.remove('open');
            });
        }
    });

    // ===== BURGER MENU =====
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('closeMenuBtn');

    function openMenu() {
        mobileMenu.classList.add('open');
        burgerBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('📱 Menu DIBUKA');
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        burgerBtn.classList.remove('active');
        document.body.style.overflow = '';
        console.log('📱 Menu DITUTUP');
    }

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (mobileMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }

            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
                menu.closest('.dropdown-wrapper')?.classList.remove('open');
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                closeMenu();
            });
        }

        const overlay = mobileMenu.querySelector('.mobile-menu-overlay');
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                e.preventDefault();
                closeMenu();
            });
        }

        mobileMenu.querySelectorAll('a, button').forEach(item => {
            item.addEventListener('click', function() {
                closeMenu();
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (mobileMenu.classList.contains('open')) {
                    closeMenu();
                }
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1025) {
                closeMenu();
            }
        });
    }

    // ===== DARK MODE =====
    const darkToggleDesktop = document.getElementById('toggleDark');
    const darkToggleMobileMenu = document.getElementById('toggleDarkMobileMenu');

    function toggleDark() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDark ? 'true' : 'false');

        if (darkToggleMobileMenu) {
            const textSpan = darkToggleMobileMenu.querySelector('.link-text');
            if (textSpan) textSpan.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }

        console.log('🌓 Dark mode:', isDark ? 'ON' : 'OFF');
    }

    const saved = localStorage.getItem('darkMode');
    if (saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        if (darkToggleMobileMenu) {
            const textSpan = darkToggleMobileMenu.querySelector('.link-text');
            if (textSpan) textSpan.textContent = 'Light Mode';
        }
    }

    if (darkToggleDesktop) darkToggleDesktop.addEventListener('click', toggleDark);
    if (darkToggleMobileMenu) darkToggleMobileMenu.addEventListener('click', toggleDark);

    console.log('✅ Navbar Premium initialized!');
});