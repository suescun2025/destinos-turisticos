/**
 * FOOTER & CONTACT MODAL CONTROLLER
 * Portal de Destinos Turísticos - Yeferson Suescun
 */

document.addEventListener('DOMContentLoaded', () => {
    initContactModal();
    initFooterNavigation();
});

function initFooterNavigation() {
    const hudScrollBtn = document.querySelector('.scroll-down-hud') || document.getElementById('hudScrollBtn');
    const footer = document.getElementById('mainFooter');
    const minimizeBtns = document.querySelectorAll('.js-scroll-to-top, .btn-minimize-footer');

    // Botones de Minimizar / Volver Arriba
    minimizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // Botón flotante inteligente "Perfil & Contacto" en portada
    if (hudScrollBtn) {
        hudScrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const scrollThreshold = (document.documentElement.scrollHeight - window.innerHeight) * 0.65;
            const isNearBottom = window.scrollY >= scrollThreshold;

            if (isNearBottom) {
                // Si ya está abajo, minimiza / vuelve arriba
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else if (footer) {
                // Si está arriba, desplaza suavemente hacia el footer
                footer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        // Actualizar icono y texto del botón según la posición de la pantalla
        window.addEventListener('scroll', () => {
            const scrollThreshold = (document.documentElement.scrollHeight - window.innerHeight) * 0.65;
            const isNearBottom = window.scrollY >= scrollThreshold;
            const textSpan = hudScrollBtn.querySelector('.scroll-btn-text');
            const arrowSpan = hudScrollBtn.querySelector('.scroll-down-arrow');

            if (isNearBottom) {
                if (textSpan) textSpan.textContent = 'Minimizar / Volver Arriba';
                if (arrowSpan) arrowSpan.textContent = '↑';
                hudScrollBtn.classList.add('is-at-bottom');
            } else {
                if (textSpan) textSpan.textContent = 'Perfil & Contacto';
                if (arrowSpan) arrowSpan.textContent = '↓';
                hudScrollBtn.classList.remove('is-at-bottom');
            }
        }, { passive: true });
    }
}

function initContactModal() {
    const modalOverlay = document.getElementById('contactModal');
    const openBtns = document.querySelectorAll('.js-open-contact-modal');
    const closeBtn = document.getElementById('closeContactModal');
    const cancelBtn = document.getElementById('cancelContactModal');
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('contactToast');
    const toastMessage = document.getElementById('toastMessage');

    if (!modalOverlay) return;

    // Abrir Modal
    const openModal = () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        const senderInput = document.getElementById('senderEmail');
        if (senderInput) setTimeout(() => senderInput.focus(), 150);
    };

    // Cerrar Modal
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Cerrar al hacer clic fuera de la tarjeta
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Cerrar con la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Envío del Formulario
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const senderName = document.getElementById('senderName')?.value.trim() || 'Visitante del Portal';
            const senderEmail = document.getElementById('senderEmail')?.value.trim() || '';
            const subject = document.getElementById('msgSubject')?.value.trim() || 'Contacto desde Web de Destinos Turísticos';
            const message = document.getElementById('msgBody')?.value.trim() || '';

            if (!senderEmail || !message) {
                showToast('Por favor completa tu correo y el mensaje.');
                return;
            }

            // Construir enlace mailto
            const recipient = 'suescunyeferson32@gmail.com';
            const mailtoBody = `Hola Yeferson,\n\nMi nombre: ${senderName}\nMi correo: ${senderEmail}\n\nMensaje:\n${message}\n\n---\nEnviado desde el Portal Web de Destinos Turísticos`;
            const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

            // Abrir cliente de correo
            window.location.href = mailtoUrl;

            // Mostrar notificación de éxito
            showToast(`¡Mensaje preparado con éxito para ${recipient}!`);

            // Limpiar y cerrar modal
            contactForm.reset();
            setTimeout(() => {
                closeModal();
            }, 1200);
        });
    }

    // Función para mostrar Toast de Notificación
    function showToast(text) {
        if (!toast) return;
        if (toastMessage) toastMessage.textContent = text;
        toast.classList.add('active');

        setTimeout(() => {
            toast.classList.remove('active');
        }, 4500);
    }
}

