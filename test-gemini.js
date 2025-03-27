require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGeminiAPI() {
    try {
        // Verificar que tenemos la API key
        if (!process.env.GOOGLE_API_KEY) {
            console.error('❌ Error: No se encontró la API key de Google');
            console.log('Por favor, asegúrate de tener la variable GOOGLE_API_KEY en tu archivo .env');
            return;
        }

        console.log('✅ API Key encontrada');

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

        // Crear un prompt de prueba para el horóscopo
        const name = "Juan";
        const zodiacSign = "Aries";
        const prompt = `¡Hola ${name}! 🌟

¡Gracias por compartir tu nombre y fecha de nacimiento! Según nuestros cálculos, eres del signo ${zodiacSign} ✨

Basado en tu signo zodiacal, crea un mensaje divertido y energético que:
1. Haga una broma sobre la compatibilidad de ${zodiacSign} con algún género musical
2. Mencione un signo zodiacal compatible con ${zodiacSign}
3. Invite a etiquetar en Instagram a alguien de ese signo compatible para bailar juntos en el Festival Estéreo Picnic
4. Incluya emojis y sea muy divertido y energético

El mensaje debe ser corto, creativo y muy divertido.`;

        console.log('\n📤 Enviando prompt a Gemini...');
        console.log('Prompt:', prompt);

        // Generar contenido
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('\n📥 Respuesta recibida de Gemini:');
        console.log(text);

    } catch (error) {
        console.error('\n❌ Error al comunicarse con Gemini:');
        console.error(error.message);
        if (error.response) {
            console.error('Detalles del error:', error.response);
        }
    }
}

// Ejecutar la prueba
console.log('🚀 Iniciando prueba de comunicación con Gemini...\n');
testGeminiAPI(); 