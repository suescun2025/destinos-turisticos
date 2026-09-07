// Script interactivo para la página de Egipto
// Efecto de partículas de polvo dorado y rayos solares en canvas

const canvas = document.getElementById('egyptFxCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Sistema de partículas de polvo de oro ambiental
let goldParticles = [];
const PARTICLE_COUNT = 38;

class GoldDust {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
        this.size = 1.2 + Math.random() * 2.4;
        this.speedY = -(0.35 + Math.random() * 0.7);
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.alpha = 0.1 + Math.random() * 0.6;
        this.maxAlpha = this.alpha;
        this.pulseSpeed = 0.015 + Math.random() * 0.02;
        this.pulse = Math.random() * Math.PI;

        const colors = [
            '255, 215, 0',   // Oro puro
            '255, 180, 0',   // Ámbar
            '255, 235, 140', // Oro brillante
            '220, 160, 40'   // Dorado antiguo
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.pulse += this.pulseSpeed;

        // Ondulación suave de opacidad (centelleo)
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
        ctx.shadowColor = `rgba(255, 215, 0, 0.8)`;
        ctx.shadowBlur = this.size * 3;
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    goldParticles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        goldParticles.push(new GoldDust());
    }
}

function animateGoldDust() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        goldParticles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
    }
    requestAnimationFrame(animateGoldDust);
}

// Iniciar partículas
initParticles();
animateGoldDust();

// ==========================================
// CONTROL DE PESTAÑAS INFORMATIVAS (TABS)
// ==========================================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// ==========================================
// CURIOSIDADES INTERACTIVAS
// ==========================================
const curiosityBtn = document.getElementById('curiosityBtn');
const curiosityBox = document.getElementById('curiosityBox');
const curiosityText = document.getElementById('curiosityText');

const curiosities = [
    "¿Sabías que los constructores de las pirámides no eran esclavos, sino respetados obreros y artesanos remunerados y alimentados con carne y cerveza, enterrados con honores cerca de los monumentos?",
    "¿Sabías que la Gran Pirámide de Keops se mantuvo como la estructura más alta del mundo construida por el ser humano durante más de 3.800 años consecutivos?",
    "¿Sabías que el maquillaje de ojos (kohl) de los antiguos egipcios no solo era estético y espiritual, sino que también los protegía de la radiación solar y de bacterias del desierto?",
    "¿Sabías que los antiguos egipcios inventaron el calendario solar de 365 días, dividido en 12 meses de 30 días, más 5 días epagómenos de celebración sagrada?",
    "¿Sabías que la tumba de Tutankamón contenía una daga de hierro forjada a partir del metal de un meteorito caído del espacio exterior?"
];

let currentCuriosityIndex = 0;

if (curiosityBtn && curiosityBox && curiosityText) {
    curiosityBtn.addEventListener('click', () => {
        // Si no está visible, mostrarla
        if (!curiosityBox.classList.contains('visible')) {
            curiosityBox.classList.add('visible');
        } else {
            // Si ya está visible, pasar a la siguiente curiosidad con animación
            currentCuriosityIndex = (currentCuriosityIndex + 1) % curiosities.length;
            curiosityBox.style.opacity = '0';
            setTimeout(() => {
                curiosityText.textContent = curiosities[currentCuriosityIndex];
                curiosityBox.style.opacity = '1';
            }, 180);
        }
    });
}
