# Multifazético Lyrics Solutions

Aplicación web en español para transcribir canciones y crear karaokes sincronizados directamente en el navegador.

## Funciones

- Carga local de archivos MP3.
- Transcripción en español con Whisper Tiny mediante Transformers.js.
- Procesamiento por fragmentos pequeños para evitar cierres por exceso de memoria.
- Límite de seguridad de 6 minutos y 30 MB por canción.
- Mensajes de error persistentes en español y reintento sin recargar la página.
- Procesamiento privado: el audio no se envía a un servidor propio.
- Editor de letra y tiempos.
- Vista previa de karaoke sincronizada.
- Exportación TXT, SRT y LRC.
- Grabación del karaoke en MP4 cuando el navegador lo admite, con WebM como alternativa.
- Descarga local del video generado.
- Creación de un enlace público para reproducir, compartir o descargar el video en línea.
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

La transcripción procesa el MP3 en el dispositivo. La primera transcripción descarga el modelo de IA y puede tardar. El audio original no se envía al servicio de videos.

Al pulsar **Crear enlace para compartir**, el video final sí se sube a `lyrics.multifazetico.com`. Cualquier persona que tenga el enlace puede reproducirlo o descargarlo. Cada video admite hasta 100 MB y el servicio limita la cantidad de subidas para evitar abusos. La precisión de la transcripción depende de la claridad de la voz, el ruido y la mezcla musical. Usa únicamente audio para el cual tengas los derechos o permisos necesarios.

El código del servicio PHP se conserva en [`share-service/`](share-service/README.md); su despliegue es independiente de GitHub Pages.
