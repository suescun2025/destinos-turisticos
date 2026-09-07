// Elementos interactivos
const virtualSphere = document.getElementById('virtualSphere');
const canvas = document.getElementById('lightFlaresCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// Control de tamaño del canvas
function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Variables de posición del círculo virtual
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

let targetRotateX = 0;
let targetRotateY = 0;
let currentRotateX = 0;
let currentRotateY = 0;

// Variables de control de velocidad y dirección del cursor
let lastMouseX = null;
let lastMouseY = null;
let activeBeams = [];
let lastFlareTime = 0;

// Clase para destellos sutiles, lentos y discretos
class DirectionalLightFlare {
    constructor(originX, originY, moveAngle, speedFactor) {
        this.originX = originX;
        this.originY = originY;

        // Se propaga suavemente en la dirección del movimiento
        this.angle = moveAngle + (Math.random() - 0.5) * 0.35;
        
        // Radio inicial
        this.dist = 145 + Math.random() * 15;
        
        // Velocidad lenta, relajada y pausada
        this.speed = 1.1 + Math.random() * 0.9;
        this.length = 18 + Math.random() * 30;
        this.width = 1.0 + Math.random() * 0.8;
        
        // Opacidad tenue y no invasiva
        this.alpha = 0.45;
        this.decay = 0.010 + Math.random() * 0.008; // Se desvanece de forma gradual
        
        const colors = [
            'rgba(0, 230, 255, ',
            'rgba(120, 210, 255, ',
            'rgba(200, 245, 255, '
        ];
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.dist += this.speed;
        this.alpha -= this.decay;
        return this.alpha > 0;
    }

    draw(ctx, offsetX, offsetY) {
        if (this.alpha <= 0) return;

        const cx = this.originX + offsetX;
        const cy = this.originY + offsetY;

        const x1 = cx + Math.cos(this.angle) * this.dist;
        const y1 = cy + Math.sin(this.angle) * this.dist;

        const x2 = cx + Math.cos(this.angle) * (this.dist + this.length);
        const y2 = cy + Math.sin(this.angle) * (this.dist + this.length);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        // Gradiente tenue y sutil
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, this.colorBase + '0)');
        grad.addColorStop(0.7, this.colorBase + (this.alpha * 0.7) + ')');
        grad.addColorStop(1, 'rgba(255, 255, 255, ' + this.alpha + ')');

        ctx.strokeStyle = grad;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 4;
        ctx.stroke();

        ctx.restore();
    }
}

// Escuchar movimiento activo del cursor
window.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const currentMouseX = e.clientX;
    const currentMouseY = e.clientY;
    const now = Date.now();

    if (lastMouseX !== null && lastMouseY !== null) {
        const dx = currentMouseX - lastMouseX;
        const dy = currentMouseY - lastMouseY;
        const speed = Math.hypot(dx, dy);

        // Disparo moderado y espaciado (máximo un destello cada 90ms y solo hasta 8 destellos en pantalla)
        if (speed > 2.0 && now - lastFlareTime > 90) {
            lastFlareTime = now;
            const moveAngle = Math.atan2(dy, dx);
            
            if (activeBeams.length < 8) {
                activeBeams.push(new DirectionalLightFlare(innerWidth / 2, innerHeight / 2, moveAngle, 1.0));
            }
        }
    }

    lastMouseX = currentMouseX;
    lastMouseY = currentMouseY;

    // Normalizar coordenadas para la inclinación sutil del círculo
    const mouseNormX = (e.clientX / innerWidth - 0.5) * 2;
    const mouseNormY = (e.clientY / innerHeight - 0.5) * 2;

    targetX = mouseNormX * 16;
    targetY = mouseNormY * 16;
    targetRotateY = mouseNormX * 10;
    targetRotateX = -mouseNormY * 10;
});

// Restaurar suavemente al salir de la ventana
window.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    targetRotateX = 0;
    targetRotateY = 0;
    lastMouseX = null;
    lastMouseY = null;
});

// Bucle principal de animación a 60 FPS
function animate() {
    const ease = 0.06;

    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    currentRotateX += (targetRotateX - currentRotateX) * ease;
    currentRotateY += (targetRotateY - currentRotateY) * ease;

    // Inclinación 3D del círculo virtual
    if (virtualSphere) {
        virtualSphere.style.transform = `
            translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0px)
            rotateX(${currentRotateX.toFixed(2)}deg)
            rotateY(${currentRotateY.toFixed(2)}deg)
        `;
    }

    // Actualizar y dibujar destellos de luz activos
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Actualizar cada destello y eliminar los que ya se apagaron
        activeBeams = activeBeams.filter(beam => {
            const alive = beam.update();
            if (alive) {
                beam.draw(ctx, currentX * 0.7, currentY * 0.7);
            }
            return alive;
        });
    }

    requestAnimationFrame(animate);
}

// =========================================================
// INTERACCIÓN HOVER: MONUMENTO TORRE EIFFEL -> FONDO INMERSIVO
// =========================================================
const monumentEiffel = document.getElementById('monumentEiffel');
const bgEiffel = document.getElementById('bgEiffel');
const bgPostales = document.getElementById('bgPostales');

let isEiffelHovered = false;

function activateEiffelImmersion() {
    if (isEiffelHovered) return;
    isEiffelHovered = true;

    if (bgEiffel) bgEiffel.classList.add('active');
    if (bgPostales) bgPostales.classList.add('dimmed');
    if (monumentEiffel) monumentEiffel.classList.add('hovered');

    // Disparar 3 destellos sutiles al enfocar el monumento
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i + Math.PI * 0.1;
        activeBeams.push(new DirectionalLightFlare(cx, cy, angle, 1.0));
    }
}

function deactivateEiffelImmersion() {
    if (!isEiffelHovered) return;
    isEiffelHovered = false;

    if (bgEiffel) bgEiffel.classList.remove('active');
    if (!isLibertadHovered && !isSpainHovered && (!monumentTutankamon || !monumentTutankamon.classList.contains('closed')) && bgPostales) {
        bgPostales.classList.remove('dimmed');
    }
    if (monumentEiffel) monumentEiffel.classList.remove('hovered');
}

// 1. Escuchadores de eventos directos
if (monumentEiffel) {
    monumentEiffel.addEventListener('mouseenter', activateEiffelImmersion);
    monumentEiffel.addEventListener('mouseover', activateEiffelImmersion);
    monumentEiffel.addEventListener('pointerenter', activateEiffelImmersion);

    monumentEiffel.addEventListener('mouseleave', deactivateEiffelImmersion);
    monumentEiffel.addEventListener('mouseout', (e) => {
        if (!monumentEiffel.contains(e.relatedTarget)) {
            deactivateEiffelImmersion();
        }
    });
    monumentEiffel.addEventListener('pointerleave', deactivateEiffelImmersion);
}

// 2. Comprobación geométrica continua por coordenadas (100% infalible con transforms 3D)
window.addEventListener('mousemove', (e) => {
    if (monumentEiffel) {
        const rect = monumentEiffel.getBoundingClientRect();
        // Margen de tolerancia de interacción
        const pad = 12;
        const inside = (
            e.clientX >= rect.left - pad &&
            e.clientX <= rect.right + pad &&
            e.clientY >= rect.top - pad &&
            e.clientY <= rect.bottom + pad
        );

        if (inside && !isEiffelHovered) {
            activateEiffelImmersion();
        } else if (!inside && isEiffelHovered) {
            deactivateEiffelImmersion();
        }
    }

    if (monumentLibertad) {
        const rect = monumentLibertad.getBoundingClientRect();
        const pad = 12;
        const inside = (
            e.clientX >= rect.left - pad &&
            e.clientX <= rect.right + pad &&
            e.clientY >= rect.top - pad &&
            e.clientY <= rect.bottom + pad
        );

        if (inside && !isLibertadHovered) {
            activateUsaImmersion();
        } else if (!inside && isLibertadHovered) {
            deactivateUsaImmersion();
        }
    }

    if (monumentEspana) {
        const rect = monumentEspana.getBoundingClientRect();
        const pad = 12;
        const inside = (
            e.clientX >= rect.left - pad &&
            e.clientX <= rect.right + pad &&
            e.clientY >= rect.top - pad &&
            e.clientY <= rect.bottom + pad
        );

        if (inside && !isSpainHovered) {
            activateSpainImmersion();
        } else if (!inside && isSpainHovered) {
            deactivateSpainImmersion();
        }
    }
});

// =========================================================
// INTERACCIÓN: TORRE DE PISA (ANIMACIÓN AL HOVER / CLIC Y APERTURA DE ITALIA)
// =========================================================
const monumentPisa = document.getElementById('monumentPisa');

if (monumentPisa) {
    monumentPisa.addEventListener('mouseenter', () => {
        if (!monumentPisa.classList.contains('animating')) {
            monumentPisa.classList.add('animating');
        }
    });

    monumentPisa.addEventListener('animationend', () => {
        monumentPisa.classList.remove('animating');
    });

    // Clic interactivo: Dispara animación de enderezarse, destellos y abre italia.html en nueva ventana
    monumentPisa.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Forzar animación
        monumentPisa.classList.remove('animating');
        void monumentPisa.offsetWidth; // Trigger reflow
        monumentPisa.classList.add('animating');

        // Disparar destellos de luz ámbar/dorada
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 / 4) * i + Math.PI * 0.15;
            activeBeams.push(new DirectionalLightFlare(cx, cy, angle, 1.0));
        }

        // Abrir la web de Italia en una nueva ventana
        setTimeout(() => {
            window.open('italia.html', '_blank');
        }, 650);
    });
}

// =========================================================
// INTERACCIÓN HOVER: ESTATUA DE LA LIBERTAD -> FONDO INMERSIVO TIMES SQUARE
// =========================================================
const monumentLibertad = document.getElementById('monumentLibertad');
const bgUsa = document.getElementById('bgUsa');

let isLibertadHovered = false;

function activateUsaImmersion() {
    if (isLibertadHovered) return;
    isLibertadHovered = true;

    if (bgUsa) bgUsa.classList.add('active');
    if (bgPostales) bgPostales.classList.add('dimmed');
    if (monumentLibertad) monumentLibertad.classList.add('hovered');

    // Disparar 3 destellos sutiles al enfocar el monumento
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i + Math.PI * 0.85;
        activeBeams.push(new DirectionalLightFlare(cx, cy, angle, 1.0));
    }
}

function deactivateUsaImmersion() {
    if (!isLibertadHovered) return;
    isLibertadHovered = false;

    if (bgUsa) bgUsa.classList.remove('active');
    if (!isEiffelHovered && !isSpainHovered && (!monumentTutankamon || !monumentTutankamon.classList.contains('closed')) && bgPostales) {
        bgPostales.classList.remove('dimmed');
    }
    if (monumentLibertad) monumentLibertad.classList.remove('hovered');
}

if (monumentLibertad) {
    monumentLibertad.addEventListener('mouseenter', activateUsaImmersion);
    monumentLibertad.addEventListener('mouseover', activateUsaImmersion);
    monumentLibertad.addEventListener('pointerenter', activateUsaImmersion);

    monumentLibertad.addEventListener('mouseleave', deactivateUsaImmersion);
    monumentLibertad.addEventListener('mouseout', (e) => {
        if (!monumentLibertad.contains(e.relatedTarget)) {
            deactivateUsaImmersion();
        }
    });
    monumentLibertad.addEventListener('pointerleave', deactivateUsaImmersion);

    // Clic interactivo: Dispara animación cinemática de viaje de cámara y abre estados_unidos.html en nueva ventana
    monumentLibertad.addEventListener('click', (e) => {
        e.stopPropagation();

        // Forzar reinicio de animación
        monumentLibertad.classList.remove('launching');
        if (bgUsa) bgUsa.classList.remove('launching');
        void monumentLibertad.offsetWidth; // Trigger reflow

        // Activar estado inmersivo y animación de viaje a alta velocidad
        activateUsaImmersion();
        monumentLibertad.classList.add('launching');
        if (bgUsa) bgUsa.classList.add('launching');

        // Disparar ráfagas continuas de destellos y haces de luz en intervalos
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        
        const shootBeams = (count, speed) => {
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 / count) * i + Math.random() * 0.4;
                activeBeams.push(new DirectionalLightFlare(cx, cy, angle, speed));
            }
        };

        shootBeams(8, 1.4);
        setTimeout(() => shootBeams(8, 1.6), 300);
        setTimeout(() => shootBeams(10, 1.8), 650);

        // Abrir la web de Estados Unidos tras completar el viaje de cámara
        setTimeout(() => {
            window.open('estados_unidos.html', '_blank');
            setTimeout(() => {
                monumentLibertad.classList.remove('launching');
                if (bgUsa) bgUsa.classList.remove('launching');
            }, 600);
        }, 1250);
    });
}

// =========================================================
// INTERACCIÓN HOVER: EDIFICIO METRÓPOLIS -> FONDO INMERSIVO DE ESPAÑA
// =========================================================
const monumentEspana = document.getElementById('monumentEspana');
const bgSpain = document.getElementById('bgSpain');

let isSpainHovered = false;

function activateSpainImmersion() {
    if (isSpainHovered) return;
    isSpainHovered = true;

    if (bgSpain) bgSpain.classList.add('active');
    if (bgPostales) bgPostales.classList.add('dimmed');
    if (monumentEspana) monumentEspana.classList.add('hovered');

    // Disparar 3 destellos sutiles al enfocar el monumento
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i + Math.PI * 0.45;
        activeBeams.push(new DirectionalLightFlare(cx, cy, angle, 1.0));
    }
}

function deactivateSpainImmersion() {
    if (!isSpainHovered) return;
    isSpainHovered = false;

    if (bgSpain) bgSpain.classList.remove('active');
    if (!isEiffelHovered && !isLibertadHovered && (!monumentTutankamon || !monumentTutankamon.classList.contains('closed')) && bgPostales) {
        bgPostales.classList.remove('dimmed');
    }
    if (monumentEspana) monumentEspana.classList.remove('hovered');
}

if (monumentEspana) {
    monumentEspana.addEventListener('mouseenter', activateSpainImmersion);
    monumentEspana.addEventListener('mouseover', activateSpainImmersion);
    monumentEspana.addEventListener('pointerenter', activateSpainImmersion);

    monumentEspana.addEventListener('mouseleave', deactivateSpainImmersion);
    monumentEspana.addEventListener('mouseout', (e) => {
        if (!monumentEspana.contains(e.relatedTarget)) {
            deactivateSpainImmersion();
        }
    });
    monumentEspana.addEventListener('pointerleave', deactivateSpainImmersion);

    // Clic interactivo: Ráfagas de luz y apertura de página de España
    monumentEspana.addEventListener('click', (e) => {
        e.stopPropagation();

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i + Math.PI * 0.2;
            activeBeams.push(new DirectionalLightFlare(cx, cy, angle, 1.2));
        }

        setTimeout(() => {
            window.open('espana.html', '_blank');
        }, 500);
    });
}

// =========================================================
// INTERACCIÓN: PIRÁMIDES Y SARCÓFAGO -> FONDO INMERSIVO DE EGIPTO
// =========================================================
const monumentPiramides = document.getElementById('monumentPiramides');
const monumentTutankamon = document.getElementById('monumentTutankamon');
const bgEgypt = document.getElementById('bgEgypt');

let tutankamonTimeout = null;

function showTutankamon() {
    if (tutankamonTimeout) clearTimeout(tutankamonTimeout);
    if (monumentTutankamon) monumentTutankamon.classList.add('active');
}

function hideTutankamon() {
    tutankamonTimeout = setTimeout(() => {
        // Solo replegar si el sarcófago no está en estado cerrado/inmersivo
        if (monumentTutankamon && !monumentTutankamon.classList.contains('closed')) {
            monumentTutankamon.classList.remove('active');
        }
    }, 150);
}

function toggleEgyptImmersion() {
    if (!monumentTutankamon) return;
    
    // Alternar clase closed
    monumentTutankamon.classList.toggle('closed');
    const isClosed = monumentTutankamon.classList.contains('closed');

    if (isClosed) {
        // Activar fondo inmersivo de Egipto y atenuar fondo base
        if (bgEgypt) bgEgypt.classList.add('active');
        if (bgPostales) bgPostales.classList.add('dimmed');
        
        // Destellos sutiles de luz dorada ambiental
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 / 4) * i + Math.PI * 0.25;
            activeBeams.push(new DirectionalLightFlare(cx, cy, angle, 1.0));
        }

        // Abrir la web informativa de Egipto en una nueva ventana tras apreciar la animación de cierre
        setTimeout(() => {
            window.open('egipto.html', '_blank');
        }, 750);
    } else {
        // Desactivar fondo inmersivo de Egipto y restaurar fondo base
        if (bgEgypt) bgEgypt.classList.remove('active');
        if (!isEiffelHovered && !isLibertadHovered && !isSpainHovered && bgPostales) {
            bgPostales.classList.remove('dimmed');
        }
    }
}

if (monumentPiramides) {
    monumentPiramides.addEventListener('mouseenter', showTutankamon);
    monumentPiramides.addEventListener('mouseleave', hideTutankamon);
    monumentPiramides.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleEgyptImmersion();
    });
}

if (monumentTutankamon) {
    monumentTutankamon.addEventListener('mouseenter', showTutankamon);
    monumentTutankamon.addEventListener('mouseleave', hideTutankamon);

    // Clic interactivo: Cierra el sarcófago, despliega el fondo inmersivo y abre la web informativa
    monumentTutankamon.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleEgyptImmersion();
    });
}

// =========================================================
// INTERACCIÓN HUD: TÍTULO DESTINOS TURÍSTICOS (ENCENDIDO LÁSER)
// =========================================================
const hudBrandHeader = document.getElementById('hudBrandHeader') || document.getElementById('hudTitleText');
if (hudBrandHeader) {
    function triggerHudIgnition() {
        hudBrandHeader.classList.remove('ignited');
        void hudBrandHeader.offsetWidth; // Forzar reflow para reiniciar animación
        hudBrandHeader.classList.add('ignited');

        // Disparar destellos de luz láser azul electricidad desde el título
        const rect = hudBrandHeader.getBoundingClientRect();
        const originX = rect.left + rect.width * 0.45;
        const originY = rect.top + rect.height * 0.5;

        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 0.5) * (i / 3) - Math.PI * 0.15;
            activeBeams.push(new DirectionalLightFlare(originX, originY, angle, 1.2));
        }
    }

    hudBrandHeader.addEventListener('mouseenter', triggerHudIgnition);
    hudBrandHeader.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerHudIgnition();

        // Disparar ráfaga extra en clic
        const rect = hudBrandHeader.getBoundingClientRect();
        const originX = rect.left + rect.width * 0.5;
        const originY = rect.top + rect.height * 0.5;
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            activeBeams.push(new DirectionalLightFlare(originX, originY, angle, 1.5));
        }
    });
}

// Iniciar ciclo de animación
animate();

