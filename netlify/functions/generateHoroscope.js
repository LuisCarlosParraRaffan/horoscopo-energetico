const { GoogleGenerativeAI } = require("@google/generative-ai");

function getZodiacSign(birthdate) {
    const date = new Date(birthdate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

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

        if (!process.env.GOOGLE_API_KEY) {
            throw new Error('API Key de Google no encontrada');
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

        // ***CORRECCIÓN CLAVE:  VERIFICAR EL MODELO Y MANEJAR EL ERROR ESPECÍFICAMENTE***
        const modelName = "gemini-1.5-pro-latest"; // Reemplaza con el modelo correcto si es necesario (ej: "gemini-1.5-pro-latest")
        let model;
        try {
            model = genAI.getGenerativeModel({ model: modelName });
        } catch (error) {
            console.error('Error al obtener el modelo:', error);
            if (error.message.includes('404') || error.message.includes('not found')) {
                throw new Error(`Modelo '${modelName}' no encontrado.  Verifica que el nombre del modelo sea correcto y que esté disponible para tu cuenta.`);
            } else {
                throw new Error('Error al obtener el modelo de Gemini: ' + error.message); // Incluye el mensaje original para más información
            }
        }


        const prompt = `¡Hola ${name}! 🌟

El Universo nos ha contado que eres del signo ${zodiacSign} ✨

    El universo (y Klik Energy) nos ha revelado que eres del signo ${zodiacSign}.
    Basado en el signo ${zodiacSign}, crea un mensaje divertido, único y que den ganas de compartirlo en redes sociales y que use emojis que incluya:
    1. Una broma o comparación con un género musical típico del Festival Estéreo Picnic en Bogotá, relacionada con la personalidad de ${zodiacSign}. (Ej: Aries es reguetón porque siempre quiere estar al frente).
    2. Una predicción inesperada pero feliz que esté "por suceder" en el festival. Puede ser absurda, mágica o graciosa.
    3. Un signo zodiacal compatible con ${zodiacSign}, explicando por qué deberían atreverse a algo (tirarse un beso, bailar juntos, irse a un lugar lejano, etc).
    4. Un signo zodiacal nada compatible, con una advertencia graciosa o sarcástica sobre lo que podría pasar si insisten.
    5. Una invitación a etiquetar en Instagram a alguien que no sabe si es compatible, pero "por las dudas, que venga a recargarse contigo".
    6. Mención sutil de Klik Energy como el mensajero cósmico que trae este horóscopo lleno de buena vibra y energía (y energía solar, obvio).
    Usa muchos emojis, separa cada parte con un espacio para facilitar la lectura y mantén un tono divertido, moderno y espontáneo (ideal para stories, reels o carruseles).
  
    Ejemplos:
    Piscis
    El universo (y Klik Energy :battery::sparkles:) nos ha revelado que eres Piscis.
    1. Eres puro dream pop: intensx, emocional y con mirada de "me perdí, pero estoy fluyendo". Si lloras viendo luces del escenario, es válido.
    2. Prepárate para recibir una declaración inesperada en medio del show… ¿real o delirio colectivo? Igual, va a ser hermoso.
    3. Tu match cósmico es Escorpio: intensidad + intensidad = pasión nivel "compartimos batería sin preguntar". Si te vino alguien a la cabeza… ya sabes.
    4. Cuidado con Géminis: un momento están contigo, al siguiente desaparecen a grabar stories con otro grupo. Tus emociones no están listas.
    5. ¿Tienes dudas con alguien? Etiquétalo y que el sol (y el horóscopo) decidan si hay energía o solo glitch astral.
    6. Este mensaje vino directo del universo… con energía solar cortesía de Klik Energy.
    
    Libra
    El universo (y Klik Energy :battery::sparkles:) nos ha revelado que eres Libra.
    1. Eres pop electrónico: equilibradx, cool y con un outfit que claramente fue curado con amor. Siempre entre dos escenarios y sin poder decidir a cuál ir.
    2. Hoy te van a invitar a algo que no planeaste (como subirte a los hombros de alguien que acabas de conocer). Di que sí, el universo aprueba.
    3. Tu match cósmico es Leo: brillan juntxs como luces de escenario. Coquetean, se pierden, se encuentran en Klik cargando el cel. Dale play.
    4. Aléjate de Capricornio… te va a decir que vino a divertirse, pero en el fondo está haciendo networking.
    5. ¿No sabes si esa persona con la que cruzaste miradas es compatible? Etiquétala en IG y que venga a recargarse contigo (y con Klik, obvio).
    6. Este mensaje llega gracias a la energía cósmica... y a la solar de Klik Energy.`;

        console.log('Enviando prompt a Gemini');

        let result; // Declare result outside the try block
        try {
            result = await model.generateContent(prompt);
        } catch (error) {
            console.error('Error al generar contenido:', error);
            throw new Error('Error al generar el contenido con Gemini: ' + error.message);  //Incluye el mensaje original del error
        }


        let response; // Declare response outside the try block
        try {
            response = await result.response;
        } catch (error) {
            console.error('Error al obtener la respuesta:', error);
            throw new Error('Error al obtener la respuesta de Gemini: ' + error.message); //Incluye el mensaje original del error
        }


        const horoscope = response.text();

        console.log('Respuesta de Gemini recibida');

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
