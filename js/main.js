document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ SabdaLekha loaded!');

    createParticles();

    const tahunSekarang = new Date().getFullYear();
    const tahunFooter = document.getElementById('tahun-footer');
    const tahunMobile = document.getElementById('tahun-mobile');
    if (tahunFooter) tahunFooter.textContent = tahunSekarang;
    if (tahunMobile) tahunMobile.textContent = tahunSekarang;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in-section').forEach(el => {
        observer.observe(el);
    });

    window.scrollToSection = function(id) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
});

function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}