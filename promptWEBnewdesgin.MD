# PROMPT MAESTRO — UZBEKISTAN PARTNER INTELLIGENCE · NEW DESIGN 2.0

## Rol y resultado obligatorio

Actúa como un equipo senior compuesto por product designer, data-visualization designer, frontend engineer y QA engineer. Debes rediseñar el dashboard de inteligencia comercial de Cosentino para Uzbekistán y entregar una experiencia estática, profesional y lista para una presentación ante el Comité Ejecutivo de Cosentino.

No hagas una maqueta decorativa ni una simple landing. El resultado debe ser un producto de inteligencia funcional que permita decidir con qué potenciales partners iniciar conversaciones, separando claramente los canales Retail y Proyectos.

Trabaja dentro de esta carpeta:

`C:\Users\Usuario\Desktop\cm\casos\Cosentino identificacion puntos de venta retail\paises\Uzbekistan 2.0`

Conserva intactos los archivos actuales. Crea una implementación nueva dentro de:

`UZ_partner_intelligence_new\`

El punto de entrada será:

`UZ_partner_intelligence_new\index_R_P.html`

Debe poder abrirse directamente en local y también publicarse como sitio estático en Vercel. No debe requerir backend, login ni proceso de compilación para funcionar.

## Antes de escribir código

1. Lee completos `prompt2_0.md`, `data_v3/brand_brief.md`, `report_en_v3.md` y `report_ru_v3.md`.
2. Inspecciona `index.html`, `index_retail.html`, `index_proyectos.html` y la carpeta `index_v2/` para entender y conservar las funciones útiles existentes.
3. Considera `data_v3/` como fuente de verdad más reciente. No sustituyas datos de v3 por versiones anteriores.
4. Inspecciona el esquema real de cada JSON antes de programar. No inventes nombres de campos.
5. Escribe primero un breve plan en `UZ_partner_intelligence_new/IMPLEMENTATION_PLAN.md` con arquitectura, componentes, modelo de estado, algoritmo del mapa y pruebas de aceptación. Después implementa sin esperar otra aprobación.

## Fuentes de datos obligatorias

### Retail

Usa `data_v3/retail_dataset.json`: 169 actores. Sus campos actuales incluyen:

- `id_actor`
- `name`
- `city`
- `typology`
- `typology_detail`
- `channel`
- `canal_secundario`
- `physical_exhibition`
- `exhibition_evidence`
- `price_range`
- `price_signal`
- `service_scope`
- `email`
- `phone`
- `address`
- `main_channel`
- `source_language`
- `source_url`
- `materials_brands_mentioned`
- `key_messages`
- `raw_notes`
- `data_source`
- `tool_used`
- `priority_candidate_v2`
- `_source_file`

### Proyectos

Usa `data_v3/proyectos_dataset.json`: 83 actores, con el mismo esquema base. Incluye developers, contractors, facade installers, architecture studios e interior designers de proyectos.

### Desarrollos

Usa `data_v3/new_tashkent_projects_v3.json`: 20 desarrollos. Sus campos son:

- `project_name`
- `developer`
- `location`
- `status`
- `scale`
- `estimated_delivery`
- `source_url`
- `notes`

No copies manualmente los registros en varios HTML. Centraliza los datos o genera un único archivo JS de datos para evitar divergencias. Mantén 169 Retail, 83 Proyectos y 20 desarrollos salvo que detectes y documentes un error real de la fuente.

## Autoridad y propiedad intelectual visibles

En la cabecera superior de la portada y de todas las pantallas posteriores debe aparecer, inmediatamente después del logotipo/wordmark COSENTINO:

`Market research & dashboard created by Francisco González`

Reglas estrictas:

- `Francisco González` debe aparecer en negrita.
- No relegues esta línea al pie ni debajo del hero.
- Debe permanecer visible al entrar en Retail, Proyectos, Project developments y cualquier vista de detalle.
- COSENTINO debe ser un enlace a `https://www.cosentino.com/`, abierto en una nueva pestaña con `rel="noopener"`.
- Mantén también una atribución discreta en el pie si encaja, pero la cabecera es obligatoria.

## Arquitectura de experiencia

### 1. Portada de selección de canal

Al abrir `index_R_P.html`, muestra una portada ejecutiva con:

- Título suficientemente grande: `Uzbekistan · Partner Intelligence`.
- Mensaje: `From market visibility to the next partner conversation.`
- Dos accesos claros y diferenciados: `Retail intelligence` y `Projects intelligence`.
- Datos de contexto reales: 169 actores Retail, 83 actores de Proyectos, 20 desarrollos y 4 ciudades Retail.
- Un cambio de canal posterior siempre visible (`Channels` o equivalente) sin recargar la página.
- Animación de entrada breve y elegante; nada de efectos continuos que distraigan.

### 2. Dos propuestas visuales reales

Entrega dos propuestas completas, no dos cambios de color:

- `proposal_A.html` — **Executive Intelligence**: claro, mineral, editorial, sobrio, abundante espacio negativo y jerarquía tipográfica de nivel consejo de administración.
- `proposal_B.html` — **Market Command Center**: oscuro, inmersivo, preciso, con sensación de inteligencia viva y señales luminosas controladas.

`index_R_P.html` debe permitir elegir qué propuesta abrir e indicar que A es la recomendada para Comité Ejecutivo. Ambas deben compartir datos, lógica de filtros, accesibilidad y funcionalidades; solo difiere la dirección visual/composición. Incluye `Switch proposal` para cambiar entre ellas conservando, cuando sea razonable, canal y filtros.

## Navegación y vistas de inteligencia

Dentro de Retail y Proyectos incluye esta navegación horizontal, con botones reales:

1. `Positioning map`
2. `Account list`
3. `Priority shortlist`
4. `Coverage`
5. `Competitive landscape`

En Proyectos añade además:

6. `Project developments`

Cada botón debe llevar a una sección funcional y actualizar una indicación visual de vista activa. No uses pestañas falsas.

No presentes esta navegación como cinco botones pequeños agrupados a la izquierda. Debe aprovechar todo el ancho disponible como una banda de cinco módulos equivalentes. Cada módulo incluirá número, título, una descripción corta y una señal de acción/estado activo. En desktop tendrá aproximadamente 72–88 px de altura; en móvil se convertirá en carrusel horizontal accesible. El módulo activo debe integrarse con el lenguaje visual de cada propuesta.

## Filtros

Los filtros son una función central, no secundaria. Deben aparecer como controles compactos tipo chip/pill seleccionable con `aria-pressed`, no como una cuadrícula de checkboxes. Deben poder combinarse entre sí y disponer de `Reset`.

Filtros Retail:

- búsqueda por nombre, dirección, teléfono, email, marca/material y mensaje clave;
- ciudad: Tashkent, Namangan, Samarkand, Andijan;
- tipología;
- prioridad;
- price range;
- physical exhibition/showroom: confirmed, not confirmed, not determinable;
- competitive signal: cuenta con marca/material comparable evidenciado;
- canal secundario cuando exista.

Filtros Proyectos:

- búsqueda;
- ciudad/área;
- tipología: Developer, Contractor, Facade Installer, Architecture Studio, Interior Designer (Projects) y las categorías reales presentes;
- prioridad;
- price range cuando proceda;
- physical exhibition/show-flat/sample space;
- competitive/material signal;
- canal secundario.

Los KPI, el recuento de resultados, el mapa, la shortlist y la tabla deben reaccionar de forma sincronizada a los filtros. En móvil, los filtros deben abrirse como panel o drawer accesible.

Los KPI también son accesos directos: total abre/restablece la lista completa; high priority filtra y abre la lista prioritaria; showroom filtra y abre los espacios preparados para muestras; cities lleva a Coverage. Toda la tarjeta debe ser clicable y operable con teclado, con texto de acción e indicador proporcional, no solo una cifra pasiva.

## Showroom / physical exhibition

Esta variable debe tener alta prominencia porque identifica dónde se pueden colocar muestras y materiales Cosentino:

- KPI visible de espacios con exposición confirmada.
- Filtro destacado.
- Doble anillo o símbolo adicional en el mapa, nunca solo color.
- Campo y evidencia explícitos en la ficha lateral.
- No conviertas `No determinable` en `No`.

## Positioning map — requisito crítico de no solapamiento

El mapa debe ayudar a priorizar, no ser un scatter plot ilegible.

- Usa un eje vertical de fit/potential/priority y un eje horizontal coherente con positioning, service breadth o readiness. Explica los ejes en la interfaz.
- Separa visualmente ciudades o segmentos cuando mejore la lectura.
- No permitas que dos círculos queden dibujados uno encima de otro ni prácticamente pegados.
- Implementa un algoritmo determinista de collision avoidance: jitter controlado, beeswarm, force layout con límites o búsqueda greedy de posiciones.
- Establece y prueba una separación mínima aproximada de 20–24 píxeles entre centros a tamaño desktop.
- Mantén cada punto cerca de su valor verdadero; el desplazamiento visual vertical no puede alterar su interpretación. Si aplicas jitter, explícalo.
- El tamaño visible del punto y su área clicable deben permitir seleccionarlo con facilidad. Objetivo de interacción: al menos 22–28 px aunque el círculo dibujado sea menor.
- Hover y foco deben mostrar nombre, puntuación, ciudad y showroom.
- La selección debe elevar el punto, mantenerlo visible y abrir la ficha a la derecha.
- Recalcula posiciones después de filtrar; el resultado debe seguir sin colisiones.
- Añade una prueba automática de distancia mínima entre todos los puntos de cada lane/segmento.

## Ficha lateral derecha al seleccionar una cuenta

Al hacer clic o pulsar Enter/Espacio sobre cualquier punto, fila o elemento de shortlist, abre un drawer por la derecha. Debe cerrarse con botón, Escape o clic en overlay y debe mover el foco correctamente.

La ficha debe mostrar, con los nombres reales de los campos disponibles:

- cuenta y ciudad;
- tipología y canal;
- score/prioridad con explicación del modelo;
- showroom/physical exhibition y `exhibition_evidence`;
- price range y `price_signal`;
- service scope;
- dirección;
- teléfono y email accionables;
- web/fuente (`source_url`) accionable;
- `materials_brands_mentioned` como bloque `Competitive signal`;
- `key_messages`;
- `raw_notes` solo cuando aporte evidencia útil;
- procedencia de datos (`data_source`, `tool_used`, `_source_file`);
- recomendación concreta de siguiente acción comercial, claramente marcada como recomendación y no como dato verificado.

Regla fundamental: no inventes webs, direcciones, marcas, relaciones comerciales, estados ni contactos. Si no hay evidencia, muestra `Not evidenced in current research` / traducción rusa equivalente. Distingue visualmente:

- **Verified evidence**: contenido procedente del dataset o fuente.
- **Commercial recommendation**: inferencia/acción sugerida que debe validarse con el equipo local.

Las menciones de marcas similares son importantes. Nunca las ocultes dentro de notas genéricas.

## Priority model y shortlist

Construye una puntuación transparente y reproducible a partir de los campos disponibles. No la presentes como dato de ventas. Debe poder auditarse y documentarse en una sección `About the model`.

Retail debe valorar especialmente:

- encaje de tipología;
- exposición física confirmada;
- price positioning;
- amplitud de servicio;
- señal competitiva/materiales;
- calidad de contacto/evidencia.

Proyectos debe valorar especialmente:

- capacidad de especificación y escala;
- developer/contractor/facade installer fit;
- vínculo con New Tashkent o desarrollos relevantes;
- estado y horizonte temporal;
- encaje Dekton para fachadas/cladding;
- evidencia y contactabilidad.

La shortlist debe explicar `Why now` y proponer `Next action`. Evita rankings opacos.

## Project developments

Crea una vista específica para los 20 registros de `new_tashkent_projects_v3.json`, diferente de la lista de actores. Incluye:

- nombre del desarrollo;
- developer;
- ubicación;
- estado;
- escala;
- fecha estimada;
- notas y fuente;
- filtros por estado, developer y horizonte;
- detalle lateral al seleccionar;
- una lectura de timing comercial sin convertir estimaciones en hechos confirmados.

## Competitive landscape y coverage

`Competitive landscape` debe usar datos reales de `materials_brands_mentioned`, `price_signal`, tipología y mensajes. Incluye resúmenes por marca/material, tipología y ciudad. Permite seleccionar una señal para filtrar las cuentas relacionadas.

`Coverage` debe mostrar cobertura por ciudad, tipología, price range y exposición física. Utiliza barras o matriz compacta, no una colección de tarjetas repetitivas.

## Marcas Cosentino

Incluye en la portada un módulo visual compacto, sin dominarla, con enlaces a:

- Silestone: `https://www.cosentino.com/en-gb/colours/silestone`
- Dekton: `https://www.cosentino.com/en-gb/colours/dekton`
- Eclos: `https://www.cosentino.com/en-gb/colours/eclos`
- Sensa: `https://www.cosentino.com/en-gb/colours/sensa`

Usa imágenes descargadas de las páginas oficiales de Cosentino o assets locales ya documentados. Conserva su proporción, añade texto alternativo, cachea los ficheros localmente en `UZ_partner_intelligence_new/assets/` y no dependas de hotlinks. Aunque no puedas descargar las imágenes en la primera pasada, deja implementado el componente y documenta con precisión dónde colocar los cuatro assets; no sustituyas imágenes ausentes por imágenes inventadas con IA.

## Idiomas

La portada y toda la aplicación deben disponer de EN/RU usando un único sistema de diccionario, no dos copias divergentes del HTML. La preferencia debe conservarse durante la sesión. Traduce también:

- filtros y estados;
- vacíos/no evidenciado;
- accesibilidad (`aria-label` cuando proceda);
- ficha lateral;
- explicación del modelo;
- exportación.

No traduzcas nombres propios, marcas, emails, URLs ni contenido de fuente si alteraría la evidencia; puedes presentar una etiqueta de idioma original.

## Exportación

Mantén exportación CSV de la vista filtrada actual. El CSV debe corresponder al canal y filtros visibles, conservar UTF-8 y escapar correctamente comas, comillas y saltos de línea. En Project developments exporta proyectos, no actores.

## Dirección visual

Evita el aspecto de plantilla genérica de dashboard. No uses una cuadrícula interminable de tarjetas redondeadas, gradientes morados, iconos decorativos o glassmorphism indiscriminado.

Propuesta A:

- blanco mineral, negro carbón, grises piedra y un acento controlado;
- tipografía grotesca/editorial con escalas grandes y alineación estricta;
- paneles con bordes finos y radios mínimos;
- aire, precisión y legibilidad en pantalla de comité.

Propuesta B:

- carbón profundo, texto neutral, grid mineral sutil y señal luminosa controlada;
- composición espacial centrada en el campo de oportunidades;
- sensación de sistema vivo sin animación continua;
- alto contraste y jerarquía estable.

En ambas: el contenido y las decisiones mandan sobre la decoración.

## Accesibilidad y responsive

- HTML semántico y orden correcto de headings.
- Navegación completa por teclado.
- Foco visible.
- Contraste WCAG AA.
- Ningún estado comunicado solo mediante color.
- `prefers-reduced-motion` respetado.
- Drawer con gestión de foco y Escape.
- Tablas usables con scroll horizontal.
- Verificación mínima en 1440×900, 1280×800, 768×1024 y 390×844.
- La línea de autoría debe seguir visible en móvil, pudiendo ocupar una segunda línea de cabecera.

## Arquitectura técnica recomendada

Puedes usar HTML/CSS/JavaScript puro. Estructura sugerida:

- `index_R_P.html`
- `proposal_A.html`
- `proposal_B.html`
- `base.css`
- `proposal_A.css`
- `proposal_B.css`
- `data.js`
- `app-core.js`
- `assets/`
- `tests/`
- `README.md`

Comparte toda la lógica entre propuestas. Evita duplicar datasets y funciones. No uses CDN para dependencias críticas. Si empleas una librería, almacénala localmente y justifica por qué es necesaria; prioriza una solución sin librerías.

## Pruebas obligatorias

Antes de declarar terminado:

1. Verifica exactamente 169 actores Retail, 83 actores Proyectos y 20 desarrollos.
2. Verifica que IDs son únicos dentro de cada dataset y que ningún registro desaparece al resetear filtros.
3. Prueba combinaciones de búsqueda + ciudad + tipología + showroom + prioridad.
4. Prueba que KPI, mapa, shortlist, tabla y contador coinciden.
5. Prueba separación mínima de puntos para el dataset completo y después de filtros.
6. Haz clic en puntos de alta densidad y confirma que todos son accesibles.
7. Comprueba que la ficha muestra marcas/evidencia cuando existen y `Not evidenced in current research` cuando no.
8. Comprueba apertura/cierre del drawer por ratón y teclado.
9. Comprueba EN/RU y persistencia.
10. Comprueba exportación CSV filtrada en ambos canales y en desarrollos.
11. Comprueba enlaces oficiales Cosentino y enlaces de fuentes.
12. Comprueba funcionamiento abriendo localmente `index_R_P.html` y mediante servidor HTTP estático.
13. Captura screenshots desktop y móvil de portada, Retail map con drawer, Proyectos y Project developments para revisar visualmente.
14. No aceptes la entrega si la consola muestra errores JavaScript.

## Criterios finales de aceptación

La entrega solo está completa si:

- la portada permite elegir Retail o Proyectos;
- existen dos propuestas visuales materialmente distintas y completas;
- la autoría aparece arriba, inmediatamente después de COSENTINO, en todas las pantallas;
- COSENTINO enlaza a su web oficial;
- los filtros son controles profesionales tipo chip y funcionan combinados;
- showroom/exposición tiene protagonismo real;
- el positioning map no presenta círculos solapados y cada cuenta es seleccionable;
- seleccionar cualquier cuenta abre un dossier derecho con competencia, evidencia, fuente y siguiente acción;
- no se ha inventado información ausente;
- Retail, Proyectos y los 20 desarrollos usan los datasets v3 correctos;
- EN/RU, exportación, teclado, móvil y reduced motion funcionan;
- todos los tests pasan y las capturas demuestran la calidad visual.

Al terminar, entrega un resumen breve con archivos creados, decisiones de diseño, pruebas ejecutadas y cualquier dato no evidenciado que convenga completar mediante investigación adicional. No publiques ni hagas push a GitHub sin autorización expresa de Francisco González.
