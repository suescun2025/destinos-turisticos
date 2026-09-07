// Script interactivo para la página de Francia / París
// Manejo de los 5 destinos turísticos y efecto de ráfaga de tráfico nocturno

const canvas = document.getElementById('parisFxCanvas');
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
// EFECTO DE RÁFAGA DE TRÁFICO NOCTURNO
// ==========================================
let trafficTrails = [];
let animationRunning = false;

function launchTraffic() {
    if (!canvas || !ctx) return;
    
    trafficTrails = [];
    const w = canvas.width;
    const h = canvas.height;
    const roadY = h * 0.86;

    // Carril Izquierdo (Luces Blancas hacia la izquierda)
    for (let i = 0; i < 22; i++) {
        trafficTrails.push({
            x: (w * 0.44) - (i * 24) + (Math.random() * 15),
            y: roadY + (Math.random() * 30 - 8),
            length: 120 + Math.random() * 150,
            width: 2.2 + Math.random() * 2.2,
            speed: -(16 + Math.random() * 9),
            alpha: 1.0,
            decay: 0.016 + Math.random() * 0.006,
            glowColor: 'rgba(230, 250, 255, 0.95)',
            blurColor: '#00e5ff'
        });
    }

    // Carril Derecho (Luces Rojas hacia la derecha)
    for (let i = 0; i < 24; i++) {
        trafficTrails.push({
            x: (w * 0.54) + (i * 24) + (Math.random() * 15),
            y: roadY + (Math.random() * 30 - 8),
            length: 130 + Math.random() * 170,
            width: 2.2 + Math.random() * 2.5,
            speed: 16 + Math.random() * 10,
            alpha: 1.0,
            decay: 0.015 + Math.random() * 0.006,
            glowColor: 'rgba(255, 50, 75, 0.95)',
            blurColor: '#ff2a55'
        });
    }

    if (!animationRunning) {
        animationRunning = true;
        requestAnimationFrame(renderLoop);
    }
}

function renderLoop() {
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let anyAlive = false;

    trafficTrails.forEach(t => {
        t.x += t.speed;
        t.alpha -= t.decay;

        if (t.alpha > 0) {
            anyAlive = true;
            ctx.save();
            ctx.globalAlpha = Math.max(0, t.alpha);

            const xEnd = t.x + (t.speed > 0 ? -t.length : t.length);

            const grad = ctx.createLinearGradient(t.x, t.y, xEnd, t.y);
            grad.addColorStop(0, t.glowColor);
            grad.addColorStop(0.3, t.glowColor);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.strokeStyle = grad;
            ctx.lineWidth = t.width;
            ctx.lineCap = 'round';
            ctx.shadowColor = t.blurColor;
            ctx.shadowBlur = 10;

            ctx.beginPath();
            ctx.moveTo(t.x, t.y);
            ctx.lineTo(xEnd, t.y);
            ctx.stroke();

            ctx.restore();
        }
    });

    if (anyAlive) {
        requestAnimationFrame(renderLoop);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationRunning = false;
    }
}

// Iniciar automáticamente una sola vez al entrar a la página
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(launchTraffic, 200);
});
setTimeout(launchTraffic, 200);
