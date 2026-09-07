// Script interactivo para la página de España
// Manejo interactivo de los 5 destinos turísticos y efectos visuales

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
// AMBIENT PARTICLES (CANVAS DESTELLOS DORADOS)
// ==========================================
const canvas = document.getElementById('spainFxCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Sparkle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2.2 + 0.8;
            this.speedY = -(Math.random() * 0.4 + 0.15);
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.alpha = Math.random() * 0.6 + 0.2;
            this.pulse = Math.random() * 0.03 + 0.01;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.alpha += Math.sin(Date.now() * 0.002) * 0.01;

            if (this.y < -10 || this.x < -10 || this.x > width + 10) {
                this.reset();
                this.y = height + 10;
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 218, 121, ${Math.max(0, Math.min(1, this.alpha))})`;
            ctx.shadowColor = '#f5af19';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.restore();
        }
    }

    const sparkles = Array.from({ length: 32 }, () => new Sparkle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        sparkles.forEach(s => {
            s.update();
            s.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}
