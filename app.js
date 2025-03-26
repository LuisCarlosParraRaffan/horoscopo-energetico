document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('horoscopeForm');
    const resultContainer = document.getElementById('result');
    const horoscopeContent = document.getElementById('horoscopeContent');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            birthdate: document.getElementById('birthdate').value,
            email: document.getElementById('email').value
        };

        try {
            // Mostrar indicador de carga
            horoscopeContent.innerHTML = `
                <div class="loading">
                    <p>✨ Generando tu horóscopo energético... ⚡️</p>
                    <div class="spinner"></div>
                </div>
            `;
            resultContainer.classList.remove('hidden');

            // Llamar a la función de Netlify
            const response = await fetch('/.netlify/functions/generateHoroscope', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error al generar el horóscopo');
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.details || data.error);
            }
            
            // Mostrar el resultado
            horoscopeContent.innerHTML = `
                <div class="horoscope-result">
                    <div class="welcome-message">
                        <h3>¡Hola ${formData.name}! 🌟</h3>
                        <p>¡Gracias por compartir tu nombre y fecha de nacimiento! Según nuestros cálculos, eres del signo ${data.zodiacSign} ✨</p>
                    </div>
                    <div class="horoscope-message">
                        <p class="horoscope-text">${data.horoscope}</p>
                    </div>
                    <p class="success-message">¡Tu horóscopo ha sido enviado a tu correo electrónico! 📧</p>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            horoscopeContent.innerHTML = `
                <div class="error-message">
                    <p>Lo sentimos, hubo un error al generar tu horóscopo.</p>
                    <p>Detalles: ${error.message}</p>
                    <p>Por favor, intenta nuevamente.</p>
                </div>
            `;
        }
    });
}); 