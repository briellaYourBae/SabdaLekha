document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 Navbar loaded!');

    // ===== DROPDOWN =====
    const dropdownWrapper = document.querySelector('.dropdown-wrapper');
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (dropdownWrapper && dropdownTrigger && dropdownMenu) {
        dropdownTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const isOpen = dropdownMenu.classList.contains('show');

            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('show');
                    menu.closest('.dropdown-wrapper')?.classList.remove('open');
                }
            });

            if (isOpen) {
                dropdownMenu.classList.remove('show');
                dropdownWrapper.classList.remove('open');
            } else {
                dropdownMenu.classList.add('show');
                dropdownWrapper.classList.add('open');
            }
        });

        document.addEventListener('click', function(e) {
            if (!dropdownWrapper.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                dropdownWrapper.classList.remove('open');
            }
        });

        dropdownMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                dropdownMenu.classList.remove('show');
                dropdownWrapper.classList.remove('open');
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdownMenu.classList.remove('show');
                dropdownWrapper.classList.remove('open');
            }
        });
    }

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
        console.log('✅ Burger Premium ditemukan!');

        burgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔄 Burger DIKLIK!');

            if (mobileMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }

            if (dropdownMenu) {
                dropdownMenu.classList.remove('show');
                if (dropdownWrapper) dropdownWrapper.classList.remove('open');
            }
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
    } else {
        console.error('❌ Burger Premium TIDAK DITEMUKAN!');
    }

    // ===== DARK MODE =====
    const darkToggle = document.getElementById('toggleDark');
    const darkToggleMobile = document.getElementById('toggleDarkMobile');

    function toggleDark() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDark ? 'true' : 'false');

        if (darkToggle) darkToggle.textContent = isDark ? '☀️' : '🌙';
        if (darkToggleMobile) {
            darkToggleMobile.querySelector('.link-text').textContent = isDark ? 'Light Mode' : 'Dark Mode';
            darkToggleMobile.querySelector('.link-icon').textContent = isDark ? '☀️' : '🌙';
        }
        console.log('🌓 Dark mode:', isDark ? 'ON' : 'OFF');
    }

    const saved = localStorage.getItem('darkMode');
    if (saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        if (darkToggle) darkToggle.textContent = '☀️';
        if (darkToggleMobile) {
            darkToggleMobile.querySelector('.link-text').textContent = 'Light Mode';
            darkToggleMobile.querySelector('.link-icon').textContent = '☀️';
        }
    }

    if (darkToggle) darkToggle.addEventListener('click', toggleDark);
    if (darkToggleMobile) darkToggleMobile.addEventListener('click', toggleDark);

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    console.log('✅ Navbar Premium initialized!');
    console.log('📱 Lebar layar:', window.innerWidth);
    console.log('🍔 Burger visible:', window.innerWidth <= 1024);
});