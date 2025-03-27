document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('horoscopeForm');
    const resultContainer = document.getElementById('result');
    const horoscopeContent = document.getElementById('horoscopeContent');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const birthdate = document.getElementById('birthdate').value;
        
        // Mostrar indicador de carga
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Generando tu horóscopo...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/.netlify/functions/generateHoroscope', {
                method: 'POST',
                body: JSON.stringify({ name, birthdate })
            });

            if (!response.ok) {
                throw new Error('Error al generar el horóscopo');
            }

            const data = await response.json();
            
            // Actualizar el contenido
            document.getElementById('userName').textContent = name;
            document.getElementById('userZodiac').textContent = data.zodiacSign;
            document.getElementById('horoscopeText').textContent = data.horoscope;
            
            // Mostrar el resultado
            document.getElementById('result').style.display = 'block';
            
            // Scroll suave al resultado
            document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al generar tu horóscopo. Por favor, intenta nuevamente.');
        } finally {
            // Restaurar el botón
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}); 