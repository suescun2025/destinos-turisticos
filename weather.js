/**
 * LIVE WEATHER CONTROLLER (Open-Meteo API)
 * Portal de Destinos Turísticos - Yeferson Suescun
 */

document.addEventListener('DOMContentLoaded', () => {
    initWeatherWidgets();
});

// Códigos Meteorológicos WMO (Organización Meteorológica Mundial)
const WMO_WEATHER_CODES = {
    0: { label: 'Cielo Despejado', iconDay: '☀️', iconNight: '🌙' },
    1: { label: 'Principalmente Despejado', iconDay: '🌤️', iconNight: '🌤️' },
    2: { label: 'Parcialmente Nublado', iconDay: '⛅', iconNight: '☁️' },
    3: { label: 'Cielo Cubierto / Nublado', iconDay: '☁️', iconNight: '☁️' },
    45: { label: 'Niebla / Neblina', iconDay: '🌫️', iconNight: '🌫️' },
    48: { label: 'Niebla con Escarcha', iconDay: '🌫️', iconNight: '🌫️' },
    51: { label: 'Llovizna Ligera', iconDay: '🌦️', iconNight: '🌦️' },
    53: { label: 'Llovizna Moderada', iconDay: '🌦️', iconNight: '🌦️' },
    55: { label: 'Llovizna Densa', iconDay: '🌧️', iconNight: '🌧️' },
    61: { label: 'Lluvia Ligera', iconDay: '🌧️', iconNight: '🌧️' },
    63: { label: 'Lluvia Moderada', iconDay: '🌧️', iconNight: '🌧️' },
    65: { label: 'Lluvia Fuerte', iconDay: '🌧️', iconNight: '🌧️' },
    71: { label: 'Nevada Ligera', iconDay: '🌨️', iconNight: '🌨️' },
    73: { label: 'Nevada Moderada', iconDay: '🌨️', iconNight: '🌨️' },
    75: { label: 'Nevada Intensa', iconDay: '❄️', iconNight: '❄️' },
    77: { label: 'Granizo Menudo', iconDay: '🌨️', iconNight: '🌨️' },
    80: { label: 'Chubascos Ligeros', iconDay: '🌦️', iconNight: '🌦️' },
    81: { label: 'Chubascos Moderados', iconDay: '🌧️', iconNight: '🌧️' },
    82: { label: 'Chubascos Violentos', iconDay: '⛈️', iconNight: '⛈️' },
    85: { label: 'Chubascos de Nieve', iconDay: '🌨️', iconNight: '🌨️' },
    86: { label: 'Chubascos Fuertes de Nieve', iconDay: '❄️', iconNight: '❄️' },
    95: { label: 'Tormenta Eléctrica', iconDay: '⛈️', iconNight: '⛈️' },
    96: { label: 'Tormenta con Granizo Ligero', iconDay: '⛈️', iconNight: '⛈️' },
    99: { label: 'Tormenta con Granizo Fuerte', iconDay: '⛈️', iconNight: '⛈️' }
};

function initWeatherWidgets() {
    const widgets = document.querySelectorAll('.weather-widget');
    if (!widgets.length) return;

    widgets.forEach(widget => {
        const lat = widget.getAttribute('data-lat') || '48.8566';
        const lon = widget.getAttribute('data-lon') || '2.3522';
        
        loadWeatherData(widget, lat, lon);

        const refreshBtn = widget.querySelector('.weather-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loadWeatherData(widget, lat, lon);
            });
        }
    });
}

async function loadWeatherData(widget, lat, lon) {
    widget.classList.add('loading');

    const tempEl = widget.querySelector('.weather-temp-value');
    const conditionEl = widget.querySelector('.weather-condition');
    const iconEl = widget.querySelector('.weather-icon-wrap');
    const feelsLikeEl = widget.querySelector('.metric-feels-like');
    const humidityEl = widget.querySelector('.metric-humidity');
    const windEl = widget.querySelector('.metric-wind');
    const precipEl = widget.querySelector('.metric-precip');

    try {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error al consultar la API de Open-Meteo');

        const data = await response.json();
        const current = data.current;

        const isDay = current.is_day === 1;
        const weatherInfo = WMO_WEATHER_CODES[current.weather_code] || { label: 'Clima Variable', iconDay: '🌤️', iconNight: '🌤️' };

        // Actualizar Valores en la UI
        if (tempEl) tempEl.textContent = Math.round(current.temperature_2m);
        if (conditionEl) conditionEl.textContent = weatherInfo.label;
        if (iconEl) iconEl.textContent = isDay ? weatherInfo.iconDay : weatherInfo.iconNight;
        if (feelsLikeEl) feelsLikeEl.textContent = `${Math.round(current.apparent_temperature)}°C`;
        if (humidityEl) humidityEl.textContent = `${current.relative_humidity_2m}%`;
        if (windEl) windEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
        if (precipEl) precipEl.textContent = `${current.precipitation.toFixed(1)} mm`;

    } catch (error) {
        console.warn('No se pudo cargar el clima en vivo:', error);
        if (conditionEl) conditionEl.textContent = 'Información no disponible';
    } finally {
        widget.classList.remove('loading');
    }
}
