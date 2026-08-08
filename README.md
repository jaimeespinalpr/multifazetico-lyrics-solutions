# Multifazético Lyrics Solutions

Aplicación web en español para transcribir canciones y crear karaokes sincronizados directamente en el navegador.

## Funciones

- Carga local de archivos MP3.
- Transcripción en español con Whisper Tiny mediante Transformers.js.
- Procesamiento privado: el audio no se envía a un servidor propio.
- Editor de letra y tiempos.
- Vista previa de karaoke sincronizada.
- Exportación TXT, SRT y LRC.
- Grabación del karaoke en MP4 cuando el navegador lo admite, con WebM como alternativa.
- Diseño adaptable para teléfono y computadora.

## Uso local

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080`. Los módulos ES no funcionan correctamente abriendo `index.html` mediante `file://`.

## Pruebas

```bash
npm test
npm run check
```

## GitHub Pages

El flujo `.github/workflows/pages.yml` ejecuta las pruebas y publica automáticamente `main`.

## Privacidad y limitaciones

La aplicación funciona sin backend y procesa el MP3 en el dispositivo. La primera transcripción descarga el modelo de IA y puede tardar. La precisión depende de la claridad de la voz, el ruido y la mezcla musical. Usa únicamente audio para el cual tengas los derechos o permisos necesarios.
