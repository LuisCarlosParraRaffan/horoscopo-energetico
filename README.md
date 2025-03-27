# Horóscopo Energético

Una aplicación web que genera horóscopos personalizados utilizando la API de Google Gemini. La aplicación permite a los usuarios ingresar su nombre y fecha de nacimiento para recibir un horóscopo único y divertido.

## Características

- Captura de datos del usuario (nombre y fecha de nacimiento)
- Cálculo automático del signo zodiacal
- Generación de horóscopos personalizados usando IA
- Diseño responsivo y moderno
- Integración con SendGrid para envío de correos electrónicos

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript
- Netlify Functions
- Google Gemini API
- SendGrid API

## Configuración Local

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
GEMINI_API_KEY=tu_api_key_de_gemini
SENDGRID_API_KEY=tu_api_key_de_sendgrid
```

4. Inicia el servidor de desarrollo:
```bash
netlify dev
```

## Despliegue

El proyecto está configurado para desplegarse automáticamente en Netlify. Para desplegar manualmente:

1. Asegúrate de tener las variables de entorno configuradas en Netlify
2. Ejecuta:
```bash
netlify deploy
```

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 