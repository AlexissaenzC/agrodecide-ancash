# AgroDecide Áncash

Prototipo local de una aplicación para comparar la venta de un lote completo de papa. **Todos los compradores, ubicaciones, precios y datos históricos son ficticios.** El mapa y la maqueta son ilustrativos; no son cartografía real ni un gemelo digital. No se realizan compras ni contactos con comerciantes.

## Ejecutar

Requiere Node.js 18 o posterior, sin instalar paquetes:

```sh
node server.mjs
```

Abrir **http://127.0.0.1:4173**. Mantener la terminal abierta mientras se usa. Detener con Ctrl+C. El servidor solo escucha en el equipo local. No abrir `index.html` directamente: los módulos ES requieren un servidor HTTP.

Alternativa con Python: `python -m http.server 4173 --bind 127.0.0.1` desde esta carpeta. Los datos guardados pertenecen al origen del navegador: usar siempre la misma dirección y puerto para recuperarlos.

Acceso de demostración: usuario **agricultor**, contraseña **papa123**. No existe autenticación segura. La aplicación no almacena estas credenciales.

## GitHub Pages

El sitio funciona como archivos estáticos desde la raíz de un repositorio: no requiere backend ni compilación. `.nojekyll` permite que GitHub Pages sirva los archivos directamente. Las rutas relativas de hojas de estilo, imágenes y módulos permiten publicarlo bajo la ruta del repositorio. La configuración de Pages usa la rama `main` y la carpeta `/`.

El sitio publicado es una demostración pública; el formulario de ingreso no restringe el acceso. Las preferencias y simulaciones permanecen únicamente en el navegador de cada visitante. El reconocimiento de voz depende del navegador y sus permisos también bajo HTTPS.

## Recorrido

La interfaz es responsive para PC, tabletas y celulares. En PC (desde 1025 px), el producto ocupa una columna lateral y el chat o mapa aprovechan el resto del ancho, con un máximo de 1600 px. En tabletas, el resumen se coloca arriba; en celulares, los paneles y controles se apilan. `responsive.css` contiene estas adaptaciones, además del tema de `styles.css`.

1. Ingresar y escribir «Tengo mil kilos de papa blanca».
2. Elegir calidad, origen simulado y precio mínimo opcional. Confirmar producto.
3. Abrir el mapa. Seleccionar un comprador, consultar su oferta o preguntar por él en el chat.
4. Marcar dos compradores compatibles en la lista y pulsar «Comparar 2 opciones».
5. Abrir el panel de simulación de un comprador para modificar precio, transporte, comisiones y otros gastos. Aplicar los cambios.
6. Volver al chat y preguntar «¿Por qué esta opción me deja más?».
7. Guardar simulación; recargar, ingresar y recuperarla desde «Simulaciones guardadas».

«Corregir datos» permite editar todo el producto. También se reconocen «Son quinientos kilos», «Cambia la cantidad a 800 kilos», «Quiero vender en Huaraz» y «Muéstrame el mapa». El destino solicitado filtra el mapa; no cambia el origen del lote. «Restablecer mapa» elimina ese filtro. El precio mínimo es un aviso y no elimina compradores compatibles.

## Organización y lógica

- `index.html`, `styles.css`: interfaz semántica adaptable, formularios con etiquetas, mensajes de estado, navegación por teclado, diálogo de edición.
- `js/data.js`: ocho compradores de ejemplo con capacidades, variedades, calidades, fecha y estado de oferta.
- `js/domain.js`: cálculos, clasificación, colores y cantidades en palabras.
- `js/conversation.js`: reglas y estados de recopilación progresiva. Sin IA, backend ni claves.
- `js/app.js`: estado compartido, pantallas, mapa SVG, comparación, gráfica sintética y persistencia.
- `js/voice.js`: detección de voz del navegador, errores, transcripción editable, lectura y cancelación.
- `js/scene.js`, `js/valley-model.js`, `js/quotation-tour.js`, `scene.css`: maqueta WebGL, camioncito con carga, recorrido por estados, cámara isométrica, marcadores anclados y negociación ficticia. Alternativa en `assets/valley-fallback.png`, renderizada a partir del mismo modelo.
- `tests/`: pruebas de reglas, cálculos y manejo de voz con objetos simulados.

Para un comprador que acepta variedad, calidad y **todo** el lote:

```
Cobro = kilos × precio por kilo
Gastos de venta = transporte + comisiones + otros gastos
Dinero restante = cobro − gastos de venta
```

Se redondea a céntimos. No se descuentan los costes de producción: el monto restante **no es la ganancia**. Las opciones incompatibles o sin precio se excluyen del orden económico y aparecen grises. La disponibilidad es independiente: una oferta «por confirmar» puede tener el mayor monto. Los empates se informan; los montos negativos indican que los gastos superan el cobro.

El tono verde usa una interpolación entre el mínimo y máximo neto de las opciones visibles compatibles con precio; un empate total usa un tono común. Se vuelve a calcular al cambiar cantidad, gastos o filtros. Cada punto incluye monto y disponibilidad. La comparación muestra los importes de cada componente y la diferencia absoluta entre dos opciones.

Los transportes son cantidades fijas de ejemplo editables; no se calculan rutas ni distancias reales. El origen sirve para describir el lote. Las ofertas son estáticas con fecha explícita, no información comercial actualizada.

Cantidades: enteros y palabras comunes en español hasta miles; puntos, comas, alternativas, medias unidades o toneladas piden aclaración en kilos enteros. La conversación no interpreta lenguaje libre de forma general.

La gráfica secundaria usa 30 valores sintéticos: `redondear(1.35 + díaDesdeCero × 0.004 + sin(díaDesdeCero × 0.8) × 0.055, 2)`. Permite mostrar los últimos 7 o 30 días numerados y tiene valores equivalentes en texto. No incluye pronóstico ni porcentajes de precisión.

## Voz, escena y privacidad

El micrófono solo se inicia al pulsar «Voz». Usa `SpeechRecognition`/`webkitSpeechRecognition` si existe; requiere localhost o HTTPS y depende del navegador, idioma y servicio disponible. El proveedor del navegador podría procesar audio remotamente: no se promete funcionamiento offline. Hay manejo de permiso denegado, ausencia de micrófono, red, falta de habla y un límite de escucha de 20 segundos. Detener, cambiar de pantalla, ocultar la pestaña o salir aborta la captura. La transcripción siempre se revisa en el cuadro antes de enviar. «Probar conversación de voz simulada» solo carga una frase de ejemplo: no escucha audio. `speechSynthesis` lee respuestas si el usuario lo activa; existe un botón para detenerla.

La escena usa WebGL nativo, sin Three.js ni dependencias. La base tiene espesor, las montañas tienen volumen y se ubican detrás de los cultivos; hay un río, puente, caminos, casas de acopio y un vehículo. La iluminación distingue las caras. La cámara utiliza ejes ortogonales y profundidad coherente; ajusta el encuadre para conservar el modelo completo al cambiar el ancho. Limita resolución a 1.5 veces la densidad de píxeles, solo anima al cambiar de ángulo, responde a puntero/tacto y respeta `prefers-reduced-motion`. Sin WebGL, si falla la compilación o se pierde el contexto, permanece una imagen del mismo modelo con puntos informativos y el acceso sigue disponible. Los puntos se pueden activar con teclado. Las ubicaciones son esquemáticas.

El ingreso muestra un **recorrido de cotización y negociación** con 1000 kg de papa blanca de primera. El camión cargado recorre caminos, gira al cambiar de dirección y visita Carhuaz (S/ 1360 después de gastos), Marcará (S/ 1445) y Huaraz (S/ 1490). Las cotizaciones se acumulan y se destaca la mejor visitada. Tras comparar las tres, negocia con el mayor monto; si esa opción quedó atrás, regresa a ella. La propuesta programada añade S/ 0,08 por kilo: en este ejemplo, la respuesta ficticia acepta S/ 1,80 y deja S/ 1570 después de gastos, S/ 80 más que antes de negociar. No se presenta como ganancia ni se confirma una compra real.

La escena se reproduce en bucle: tras mostrar el acuerdo, el camión vuelve al campo por el camino y empieza otra ronda. Completar el formulario o consultar la oferta visible no interrumpe el recorrido. Se conserva una pausa explícita, continuación, avance por pasos y reinicio; reiniciar vuelve a reproducir automáticamente. No consume animación con la pestaña oculta o al salir del ingreso. Con movimiento reducido no se reproduce automáticamente y los controles avanzan por etapas sin desplazamiento animado. Sin WebGL se conserva el recorrido sobre la imagen con un indicador de camión y los mismos cálculos, controles y mensajes.

Durante el viaje se ocultan todos los carteles y se traza una línea discontinua discreta del camino que sigue el camión. Al llegar, aparece únicamente el nombre pequeño de esa ciudad y un globo de diálogo corto junto al camión. El globo elige una posición que evite el vehículo y el nombre, permanece dentro del encuadre y limita su ancho a 158 px (140 px en celular). La narración completa queda en «Ver explicación de la cotización». El ejemplo no modifica el lote, los precios ni la disponibilidad del chat; toda la negociación está claramente marcada como ficticia.

`login.css` compacta el ingreso según el alto y el ancho disponibles: reduce encabezado, títulos, márgenes, formulario y comparación; ajusta la altura de la escena al viewport y mantiene dos columnas desde 761 px. No bloquea el scroll ni recorta contenido: al ampliar texto, abrir el detalle o usar ventanas pequeñas sigue siendo posible desplazarse. En celular conserva una columna, controles legibles y menos separación vertical.

## Pantallas después del ingreso

`workspace.css` extiende el estilo compacto del ingreso al chat, al mapa y a los precios. El encabezado muestra el lote actual, las opciones con precio que reciben todo el lote y el mayor monto después de gastos. Estos indicadores y la barra de avance se calculan con el estado compartido y se actualizan al cambiar cantidad, calidad o gastos. «Probar con 1000 kg» carga un lote de demostración para explorar el recorrido; «Ver opción» abre la oferta con el mayor monto.

El chat ocupa la mayor parte de la altura disponible, con mensajes de 16 px, desplazamiento dentro de la conversación y el cuadro de escritura en la parte inferior. Los indicadores superiores están en «Resumen del lote y mejor oferta» para dejar espacio a la conversación y al mapa. El mapa usa todo el ancho del panel principal, con una altura de 460 a 740 px en PC; la lista de compradores queda debajo. Las ofertas y la comparación se consultan en diálogos que se cierran con su botón o Escape. En ventanas intermedias y celulares, «Ver o corregir mi lote» despliega el resumen cuando hace falta. No se bloquea el desplazamiento general en ventanas cortas o con texto ampliado.

El chat indica cuándo prepara una respuesta programada y muestra opciones que cambian con cada dato. La lista indica cuántos compradores se han elegido y solo habilita la comparación cuando son dos. Los precios sintéticos tienen controles de 7 y 30 días, mínimo, promedio y máximo calculados; cada punto admite foco con teclado o selección para leer su valor, y la tabla de valores está en un desplegable. Las transiciones y cambios de indicadores respetan movimiento reducido. No hay datos comerciales reales ni pronósticos.

`localStorage` conserva solo preferencias de lectura, último producto confirmado, ofertas editadas y hasta 20 simulaciones. La conversación y su texto libre no se guardan. No se guarda audio, contraseñas ni geolocalización. «Borrar datos de demostración» elimina estos datos de la aplicación en ese navegador. Almacenamiento bloqueado muestra aviso y permite continuar sin persistencia. Reiniciar conversación no elimina las simulaciones guardadas ni el último lote confirmado; para eliminar todo se usa el botón específico.

No hay dependencias JavaScript, fuentes remotas ni recursos externos necesarios. No hay pasos de compilación, cuentas ni servicios de pago. Fuentes del sistema como alternativa visual.

## Comprobaciones

```sh
node --test tests/*.test.js
```

En PowerShell también se puede usar `npm.cmd test` (evita depender de la política que bloquea `npm.ps1`).

Ver `VERIFICACION.md` para resultados ejecutados y recorridos pendientes de comprobación en un navegador real.
