document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('horoscope-form');
    const initialForm = document.getElementById('initial-form');
    const horoscopeResult = document.getElementById('horoscope-result');
    const userName = document.getElementById('user-name');
    const horoscopeText = document.getElementById('horoscope-text');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitButton.disabled = true;
        submitButton.textContent = 'Conectando con las estrellas... ✨';
        
        const nameInput = document.getElementById('name');
        const birthdateInput = document.getElementById('birthdate');
        
        const name = nameInput.value.trim();
        const birthdate = birthdateInput.value;
        
        if (!name || !birthdate) {
            alert('Por favor completa todos los campos');
            submitButton.disabled = false;
            submitButton.textContent = 'Conéctate';
            return;
        }

        try {
            console.log('Iniciando solicitud de horóscopo:', { name, birthdate });
            
            const response = await fetch('/.netlify/functions/generateHoroscope', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, birthdate }),
            });

            console.log('Estado de la respuesta:', response.status);
            const data = await response.json();
            console.log('Datos recibidos:', data);

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Error desconocido');
            }

            if (!data.horoscope) {
                throw new Error('No se recibió el horóscopo en la respuesta');
            }
            
            userName.textContent = name;
            horoscopeText.textContent = data.horoscope;
            
            initialForm.style.opacity = '0';
            setTimeout(() => {
                initialForm.style.display = 'none';
                horoscopeResult.style.display = 'block';
                horoscopeResult.offsetHeight; // Forzar reflow
                horoscopeResult.style.opacity = '1';
            }, 300);

        } catch (error) {
            console.error('Error detallado:', error);
            alert(`Lo sentimos, hubo un problema al generar tu horóscopo: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Conéctate';
        }
    });
});

function getZodiacSign(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Tauro";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Géminis";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cáncer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitario";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricornio";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Acuario";
    return "Piscis";
} 