# Verificación del prototipo

## Ejecutado

- Comprobación de sintaxis con `node --check` de los módulos JavaScript.
- Servidor local: respuesta HTTP 200 de la página, la hoja de estilos y los seis módulos JavaScript en `http://127.0.0.1:4173`.
- Resultado actualizado: **34 pruebas automatizadas aprobadas, sin fallos**.
- Pruebas automatizadas de cálculo: lote de 500 y 1000 kg, cobro y gastos, incompatibilidad por calidad/variedad/capacidad, precio faltante, lote sin compradores, cambio de clasificación y tonos por transporte, empate, resultado negativo y aviso de precio mínimo.
- Conversación por reglas: recopilación completa, cantidades en palabras, corrección a 800 kg, mapa, confirmación, explicación calculada, destino distinto del origen, cantidades inválidas y respuesta no entendida.
- Voz con navegador simulado en pruebas: incompatibilidad de reconocimiento, transcripción simulada editable, permiso denegado conservando texto, transcripción sin envío automático y cancelación al salir. Estas pruebas no sustituyen una prueba con micrófono real.

## Límite de verificación visual

Se intentó abrir el navegador integrado, pero su host no estaba disponible. La alternativa de control de Chrome se detuvo porque la herramienta no pudo validar la URL actual. No se pudo inspeccionar la interfaz, la consola del navegador, el renderizado WebGL ni el diseño móvil. No se afirma que los recorridos siguientes se hayan ejecutado visualmente.

## Recorridos manuales recomendados

| Criterio | Pasos y resultado esperado | Cobertura disponible |
|---|---|---|
| A | Ingresar, conversar, confirmar y abrir mapa | Reglas probadas; recorrido UI pendiente |
| B | Cambiar 500 a 1000 kg; cambia el primer comprador de Bodega Santa Tierra a Mercado La Cosecha | Cálculos y reglas probados; sincronía visual pendiente |
| C | Marcar dos compradores; comprobar desglose y diferencia | Cálculos probados; controles UI pendientes |
| D | Con 1000 kg, poner transporte de Mercado La Cosecha en S/ 600; Asociación Buen Campo lidera con S/ 1445 | Cálculos y colores probados; panel UI pendiente |
| E | Cargar voz simulada, corregir a 800 kilos, comprobar que no se envía hasta «Enviar» | Módulo de voz probado con objetos simulados; UI pendiente |
| F | Denegar permiso de voz y escribir por texto | Callback de denegación probado; permiso real pendiente |
| G | Guardar, recargar, ingresar y recuperar simulación | Implementado; persistencia real en navegador pendiente |
| H | Confirmar 100001 kg: ninguna opción comparable | Cálculo probado; presentación UI pendiente |
| I | Revisar ancho 360 px, teclado, diálogo y mapa sin desbordamiento | CSS adaptable implementado; inspección móvil pendiente |
| J | Desactivar WebGL o forzar pérdida de contexto y entrar | Alternativa del mismo modelo y selección de compradores probadas sin WebGL con objetos simulados; prueba real pendiente |

Además: comprobar micrófono sin dispositivo, fin de escucha, lectura de voz, navegación por teclado, 7/30 días, movimiento reducido, borrar datos y funcionamiento con almacenamiento bloqueado.

## Ajuste responsive para PC, tabletas y celulares

Se añadieron reglas en `responsive.css` para escritorio desde 1025 px, tabletas de 601 a 1024 px y celulares hasta 600 px, con ajustes adicionales hasta 380 px. Se amplió el espacio de trabajo en PC, se reorganizó el resumen en tabletas y se ajustaron controles, formularios, textos largos y tablas para pantallas pequeñas. Las herramientas del mapa pasan debajo del mapa en celular.

Pendiente de inspección visual real: anchos 320, 375, 768, 1024, 1366 y 1920 px; orientación horizontal; zoom de texto al 200 %. La validación de la lógica no verifica el renderizado CSS ni garantiza por sí sola ausencia de desbordamientos.

## Revisión de la nueva maqueta

Se sustituyeron los planos anteriores por geometría volumétrica y una cámara ortográfica con profundidad corregida. Se generó e inspeccionó una imagen del modelo utilizando sus mismos vértices, proyección e iluminación, mediante un rasterizador local con búfer de profundidad. La imagen se entrega como alternativa cuando WebGL no está disponible. Esta revisión permite evaluar el modelo y el encuadre, pero no sustituye una captura del navegador ni comprueba la GPU.

Las cuatro pruebas añadidas verifican normales y coordenadas finitas, encuadre completo en cinco proporciones y tres ángulos, orientación de profundidad y selección de compradores sin WebGL. Los marcadores usan posiciones proyectadas del modelo; la información de ejemplo usa la función económica compartida, sin cifras independientes inventadas para la escena.

## Camión, cotizaciones y negociación simulada

Se añadió un camión volumétrico con carga y un recorrido sobre los caminos por Carhuaz, Marcará y Huaraz. El controlador separa desplazamiento, cotización, propuesta, respuesta y acuerdo ficticio. Se revisó un render local del modelo con el camión durante el trayecto, usando la geometría, posición, orientación y sombreado de la escena. No es una captura del navegador.

Las pruebas adicionales verifican: visita de las tres paradas y comparación por monto después de gastos; regreso a un comprador anterior cuando resulte mejor; cálculo de la mejora negociada; ausencia de cambios en las ofertas originales; reinicio; avance manual; continuidad de rutas; geometría del camión; y controles de pausa, continuación y final con DOM y reloj simulados. También se completó la secuencia con movimiento reducido usando los controles, sin WebGL. El resultado de demostración es S/ 1490 antes y S/ 1570 después de la negociación, con un aumento de S/ 80.

Pendiente en navegador real: fluidez de la animación, profundidad WebGL con el camión en movimiento, tamaño y ubicación del único marcador en cada ancho y comportamiento al ocultar la pestaña. Las pruebas de control usan objetos simulados, no un navegador ni permisos reales.

### Reproducción continua y escena despejada

El controlador de la escena usa un bucle con regreso al campo, sin detenerse al finalizar el acuerdo ni al enfocar el formulario. Se conservan la pausa explícita y la alternativa de movimiento reducido. Las pruebas verifican el regreso por la ruta, una nueva ronda automática, que avanzar un paso no pause la reproducción, que los carteles y el diálogo estén ocultos en viaje y que solo el cartel de la ciudad visitada aparezca al detenerse. La ruta discontinua se proyecta con la misma cámara y también funciona en la alternativa sin WebGL.

### Diálogo breve sobre la escena e ingreso compacto

El diálogo vuelve a la maqueta, solo en las paradas, con un ancho máximo de 158 px (140 px en celular). La posición evita el camión y el nombre de la ciudad mediante comparación de áreas superpuestas y conserva el globo dentro del encuadre. Dos pruebas adicionales cubren límites en escenas de 300×180, 375×220, 600×268 y 900×400, y una posición sin superposición con camión y etiqueta. El controlador también comprueba coordenadas del globo durante la cotización con DOM simulado.

Se compactó la pantalla de ingreso y el detalle extenso se hizo desplegable. La altura de la maqueta se adapta al alto disponible; no se usa recorte de página ni bloqueo de desplazamiento. Se volvió a intentar abrir la vista previa integrada, pero su host seguía no disponible. Por ello queda pendiente verificar en un navegador real la altura total del ingreso y su ajuste a ventanas de PC, tableta y celular. Las pruebas geométricas no sustituyen esa revisión visual.

## Pantallas internas compactas e interactivas

Se adaptaron chat, mapa, ofertas, comparación y precios al estilo del ingreso. Se añadieron indicadores del estado compartido, progreso del lote, acceso a un ejemplo, opción de abrir el mejor comprador, respuesta en procesamiento, selección contada de dos compradores, diálogos de oferta/comparación y consulta de puntos de la gráfica. En celular, el resumen del lote es desplegable; en PC, conversación y lista aprovechan paneles con desplazamiento interno.

Tres pruebas nuevas verifican progreso frente a confirmación, actualización de indicadores por cantidad/transporte y estadísticas de la serie sintética. Una prueba de integración importa y ejecuta el `app.js` real con un DOM local simulado: ingreso, despliegue del resumen móvil, conversación y procesamiento, carga del ejemplo, apertura de la mejor oferta, aumento del transporte, cambio del mayor monto, comparación de dos compradores, cierre de diálogos, periodos 7/30, selección de un precio, corrección del lote por chat, guardado y salida. Detectó y permitió corregir la inicialización booleana del estado de confirmación/precio mínimo.

Esta integración no es una prueba de navegador: el DOM de prueba no dibuja CSS ni reproduce foco nativo, WebGL, micrófono o el comportamiento visual de los diálogos. Sigue pendiente la inspección visual real de estas pantallas y de su altura en distintas ventanas.

### Corrección del tamaño del mapa y del chat

Se eliminó la distribución que dividía el mapa y los compradores en dos columnas. El mapa ahora usa todo el ancho principal, con 460–740 px de alto en PC y 400 px de gráfico en celular, con sus herramientas debajo. El chat usa casi toda la altura disponible, mensajes de 16 px y el cuadro de escritura al pie. Los indicadores pasan a un resumen desplegable. Se volvió a ejecutar la prueba de integración completa, que pasó. Sigue pendiente verificar el renderizado real de estos ajustes.
