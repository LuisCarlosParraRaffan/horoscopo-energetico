const dayjs = require('dayjs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Función para determinar el signo zodiacal
function getZodiacSign(birthdate) {
    const date = dayjs(birthdate);
    const month = date.month() + 1;
    const day = date.date();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Tauro';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Géminis';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cáncer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Escorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagitario';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricornio';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Acuario';
    return 'Piscis';
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { name, birthdate } = JSON.parse(event.body);
        console.log('Datos recibidos:', { name, birthdate });

        const zodiacSign = getZodiacSign(birthdate);
        console.log('Signo zodiacal calculado:', zodiacSign);

        // Verificar la API Key de Google
        if (!process.env.GOOGLE_API_KEY) {
            console.error('API Key de Google no encontrada');
            throw new Error('API Key de Google no encontrada. Asegúrate de que la variable de entorno GOOGLE_API_KEY esté configurada.');
        }

        console.log('API Key de Gemini:', process.env.GOOGLE_API_KEY ? 'Presente' : 'No encontrada');

        // Inicializar el cliente de Gemini
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        
        // Configurar el modelo con parámetros específicos
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.9,
                topK: 1,
                topP: 1,
                maxOutputTokens: 2048,
            },
        });

        // Crear el prompt para el horóscopo
        const prompt = `¡Hola ${name}! 🌟

¡Gracias por compartir tu nombre y fecha de nacimiento! Según nuestros cálculos, eres del signo ${zodiacSign} ✨

Basado en tu signo zodiacal, crea un mensaje divertido y energético que:
1. Haga una broma sobre la compatibilidad de ${zodiacSign} con algún género musical
2. Mencione un signo zodiacal compatible con ${zodiacSign}
3. Invite a etiquetar en Instagram a alguien de ese signo compatible para bailar juntos en el Festival Estéreo Picnic
4. Incluya emojis y sea muy divertido y energético

El mensaje debe ser corto, creativo y muy divertido.`;

        console.log('Prompt a enviar a Gemini:', prompt);

        // Generar contenido
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const horoscope = response.text();

        console.log('Respuesta de Gemini:', horoscope);

        return {
            statusCode: 200,
            body: JSON.stringify({
                horoscope,
                zodiacSign
            }),
        };
    } catch (error) {
        console.error('Error completo:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error interno del servidor',
                details: error.message
            }),
        };
    }
}; 