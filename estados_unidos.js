// Script interactivo para la página de Estados Unidos
// Manejo interactivo de los 5 destinos turísticos

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
