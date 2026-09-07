// Script interactivo para la página de Italia
// Efecto de partículas de luz mediterránea y control de los 5 destinos turísticos

const canvas = document.getElementById('italiaFxCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ==========================================
// CONTROL DE LOS 5 DESTINOS TURÍSTICOS
// ==========================================
const destTabs = document.querySelectorAll('.dest-tab');
const destPanels = document.querySelectorAll('.dest-panel');

destTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const destKey = tab.getAttribute('data-dest');

        // Actualizar pestañas activas
        destTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Mostrar panel correspondiente
        destPanels.forEach(panel => {
            panel.classList.remove('active');
        });

        const targetPanel = document.getElementById(`dest-${destKey}`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

// ==========================================
// EFECTO DE PARTÍCULAS MEDITERRÁNEAS FLOTANTES
// ==========================================
let particles = [];
const PARTICLE_COUNT = 32;

class MediterraneanParticle {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + 15;
        this.size = 1.2 + Math.random() * 2.2;
        this.speedY = -(0.3 + Math.random() * 0.6);
        this.speedX = (Math.random() - 0.45) * 0.5;
        this.alpha = 0.15 + Math.random() * 0.55;
        this.maxAlpha = this.alpha;
        this.pulse = Math.random() * Math.PI;
        this.pulseSpeed = 0.015 + Math.random() * 0.02;

        // Colores cálidos italianos: pétalo fucsia/magenta suave, oro ámbar, luz solar
        const colors = [
            '255, 184, 48',  // Ámbar sol
            '255, 111, 60',  // Terracota
            '235, 70, 150',  // Buganvilia / pétalo
            '255, 230, 160'  // Luz dorada
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.pulse += this.pulseSpeed;

        this.currentAlpha = (Math.sin(this.pulse) * 0.5 + 0.5) * this.maxAlpha;

        if (this.y < -20 || this.x < -20 || (canvas && this.x > canvas.width + 20)) {
            this.reset();
        }
    }

    draw(ctx) {
        if (this.currentAlpha <= 0) return;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(${this.color}, ${this.currentAlpha})`;
        ctx.shadowColor = `rgba(${this.color}, 0.8)`;
        ctx.shadowBlur = this.size * 3;
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new MediterraneanParticle());
    }
}

function renderParticles() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
    }
    requestAnimationFrame(renderParticles);
}

initParticles();
renderParticles();
