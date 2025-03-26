const sgMail = require('@sendgrid/mail');
const dayjs = require('dayjs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
        const { name, birthdate, email } = JSON.parse(event.body);
        const zodiacSign = getZodiacSign(birthdate);

        if (!process.env.GOOGLE_API_KEY) {
            throw new Error('API Key de Google no encontrada');
        }

        console.log('API Key:', process.env.GOOGLE_API_KEY ? 'Presente' : 'No encontrada');
        console.log('Generando horóscopo para:', name, 'signo:', zodiacSign);

        // Generar horóscopo usando la API de Gemini
        const prompt = `¡Hola ${name}! 🌟

¡Gracias por compartir tu nombre y fecha de nacimiento! Según nuestros cálculos, eres del signo ${zodiacSign} ✨

Basado en tu signo zodiacal, crea un mensaje divertido y energético que:
1. Haga una broma sobre la compatibilidad de ${zodiacSign} con algún género musical
2. Mencione un signo zodiacal compatible con ${zodiacSign}
3. Invite a etiquetar en Instagram a alguien de ese signo compatible para bailar juntos en el Festival Estéreo Picnic
4. Incluya emojis y sea muy divertido y energético

El mensaje debe ser corto, creativo y muy divertido.`;

        console.log('Enviando prompt a Gemini:', prompt);

        // Inicializar el cliente de Gemini con manejo de errores
        let genAI;
        try {
            genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        } catch (error) {
            console.error('Error al inicializar Gemini:', error);
            throw new Error('Error al inicializar el cliente de Gemini');
        }

        // Obtener el modelo con manejo de errores
        let model;
        try {
            model = genAI.getGenerativeModel({ model: "gemini-pro" });
        } catch (error) {
            console.error('Error al obtener el modelo:', error);
            throw new Error('Error al obtener el modelo de Gemini');
        }

        // Generar contenido con manejo de errores
        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (error) {
            console.error('Error al generar contenido:', error);
            throw new Error('Error al generar el contenido con Gemini');
        }

        // Obtener la respuesta con manejo de errores
        let response;
        try {
            response = await result.response;
        } catch (error) {
            console.error('Error al obtener la respuesta:', error);
            throw new Error('Error al obtener la respuesta de Gemini');
        }

        const horoscope = response.text();
        console.log('Respuesta de Gemini:', horoscope);

        // Enviar email
        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: `¡${name}, descubre tu Horóscopo Energético único ⚡️🌟`,
            html: `
                <h2>Hola, ${name}:</h2>
                <p>${horoscope}</p>
                <p>¿Te gustaría explorar cómo Klik Energy puede llevar estas vibes sostenibles y positivas a tu empresa? ¡Conecta con nosotros y juntos transformemos la energía en un activo estratégico para tu organización!</p>
                <br>
                <p>Con energía renovada,<br>El equipo Klik Energy</p>
            `,
        };

        await sgMail.send(msg);

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