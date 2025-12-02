/* ============================================================
   APP.JS — PARTE A
   DEFINICIÓN DE BLOQUES Y PREGUNTAS
   ============================================================ */

/* Aquí se guardarán las respuestas en tiempo real */
let respuestas = {};
/* DATO GENERAL ADICIONAL: SERVICIO MÉDICO */
let datosGenerales = {
  medico: null
};


/* ============================================================
   DEFINICIÓN DE BLOQUES Y PREGUNTAS
   Cada bloque contiene objetos { t: texto, d: detalle, g: gravedad }
   La gravedad base puede ajustarse después según reglas especiales.
   ============================================================ */

const bloques = {

  /* ------------------------------------------------------------
     BLOQUE 2 – CONFORT TÉRMICO
     ------------------------------------------------------------ */
  form2: [
    {
      t: "¿El recinto cuenta con temperatura estable?",
      d: "Considerar que mantiene una temperatura agradable y homogénea.",
      g: "grave"
    },
    {
      t: "¿Hay circulación de aire natural?",
      d: "Presencia de ventanas, aberturas o flujo cruzado.",
      g: "leve"
    },

    /* Pregunta clave: AGUA */
    {
      t: "¿El punto cuenta con disponibilidad de agua fría?",
      d: "Agua fría (heladera, dispenser, botellón refrigerado, etc).",
      g: "medio"      /* NO = MEDIO, pero activa lógica especial */
    },

    /* Climatización */
    {
      t: "¿El espacio posee aire acondicionado en funcionamiento?",
      d: "Aire acondicionado operativo y accesible.",
      g: "medio"   /* Será ajustado por lógica AA/Ventilador */
    },
    {
      t: "¿Posee ventiladores funcionando?",
      d: "Ventiladores operativos y distribuidos adecuadamente.",
      g: "leve"   /* Será ajustado por lógica AA/Ventilador */
    }
  ],


  /* ------------------------------------------------------------
     BLOQUE 3 – ACCESIBILIDAD Y ORIENTACIÓN
     ------------------------------------------------------------ */
  form3: [
    {
      t: "¿El punto está señalizado?",
      d: "Cartelería visible y accesible.",
      g: "medio"
    },
    {
      t: "¿Es de fácil acceso para todas las edades?",
      d: "Accesibilidad sin obstáculos.",
      g: "leve"
    }
  ],


  /* ------------------------------------------------------------
     BLOQUE 4 – ENVOLVENTE TÉRMICA
     ------------------------------------------------------------ */
  form4: [
    {
      t: "¿El material del techo transfiere calor al recinto?",
      d: "Ej: chapa, madera sin aislación, fibrocemento, etc.",
      g: "grave"     /* SI = GRAVE, NO = VERDE */
    },
    {
      t: "¿Los muros exteriores están pintados en color claro?",
      d: "Colores claros reflejan mejor la radiación solar.",
      g: "grave"     /* SI = verde, NO = grave */
    },
    {
      t: "¿El recinto posee planta superior?",
      d: "La planta superior actúa reduciendo transferencia térmica directa.",
      g: "medio"     /* Clasificación ajustada por relación con pregunta 1 */
    }
  ],


  /* ------------------------------------------------------------
     BLOQUE 5 – PROTECCIONES PASIVAS
     ------------------------------------------------------------ */
  form5: [
    {
      t: "¿Posee toldos, cortinas o elementos de sombra?",
      d: "Elementos que mitiguen la radiación solar directa.",
      g: "leve"     /* SI = verde, NO = leve */
    }
  ],


  /* ------------------------------------------------------------
     BLOQUE 6 – CONDICIONES INTERNAS
     ------------------------------------------------------------ */
  form6: [
    {
      t: "¿Cuenta con superficie para sentarse o esperar?",
      d: "Sillas, bancos o espacios confortables.",
      g: "leve"
    },
    {
      t: "¿Tiene iluminación adecuada?",
      d: "Visibilidad suficiente durante todo el horario de uso.",
      g: "leve"
    }
  ],


  /* ------------------------------------------------------------
     BLOQUE 7 – SERVICIOS
     ------------------------------------------------------------ */
  form7: [
    {
      t: "¿Hay disponibilidad de sanitarios cercanos?",
      d: "Corresponde a sanitarios accesibles dentro del predio o inmediaciones.",
      g: "medio"
    },
    {
      t: "¿Cuenta con contenedores o cestos para residuos?",
      d: "Cestos accesibles y en número adecuado.",
      g: "leve"
    },

    /* Pregunta adicional */
    {
      t: "¿El espacio está preparado para futura instalación de energía solar?",
      d: "Poseer espacio físico, sistema eléctrico, estructura resistente, etc.",
      g: "medio"
    }
  ]
};


/* ============================================================
   COLORES DE BOTONES
   ============================================================ */

const colores = {
  si: "#2ecc71",

  muygrave: "#ff4d4d",
  grave: "#ff6961",
  medio: "#f5a623",
  leve: "#fbd55b"
};
/* ============================================================
   APP.JS — PARTE B
   GENERACIÓN DE FORMULARIOS Y MANEJO DE RESPUESTAS
   ============================================================ */

/* Función que construye cada formulario dinámicamente */
function generarFormularios() {
  Object.keys(bloques).forEach(idBloque => {
    const contenedor = document.getElementById(idBloque);
    if (!contenedor) return;

    bloques[idBloque].forEach((preg, index) => {
      const gravedad = preg.g;

      const div = document.createElement("div");
      div.className = "pregunta";

      div.innerHTML = `
        <strong>${preg.t}</strong>
        <p class="explica">${preg.d}</p>

        <div class="opciones">

          <!-- BOTÓN SI -->
          <button class="btn-resp btn-si"
                  onclick="seleccionarRespuesta('${idBloque}', ${index}, 'si', this)">
            Sí
          </button>

          <!-- BOTÓN NO -->
          <button class="btn-resp btn-no-${gravedad}"
                  onclick="seleccionarRespuesta('${idBloque}', ${index}, 'no', this)">
            No
          </button>

        </div>
      `;

      contenedor.appendChild(div);
    });
  });
}

/* Ejecutamos la generación al cargar */
generarFormularios();



/* ============================================================
   GUARDAR RESPUESTAS Y MARCAR BOTONES
   ============================================================ */

function seleccionarRespuesta(bloque, index, valor, boton) {
  const key = `${bloque}_${index}`;
  respuestas[key] = valor;

  /* Quitar selección previa */
  const grupo = boton.parentElement.querySelectorAll(".btn-resp");
  grupo.forEach(b => b.classList.remove("seleccionado"));

  /* Marcar el botón actual */
  boton.classList.add("seleccionado");
}

/* ============================================================
   GUARDAR DATO GENERAL (SERVICIO MÉDICO)
   ============================================================ */
function setDatoGeneral(campo, valor, boton) {
  datosGenerales[campo] = valor;

  // quitar selección previa
  let grupo = boton.parentNode.querySelectorAll("button");
  grupo.forEach(b => b.classList.remove("seleccionado"));

  // marcar botón seleccionado
  boton.classList.add("seleccionado");
}

/* ============================================================
   NAVEGACIÓN ENTRE PANTALLAS (Siguiente y Volver)
   ============================================================ */

let pasoActual = 1;

function mostrarPaso(num) {
  document.querySelectorAll(".step").forEach(div => div.classList.remove("active"));
  document.getElementById("step" + num).classList.add("active");
}

function nextStep() {
  pasoActual++;
  mostrarPaso(pasoActual);
}

function prevStep() {
  pasoActual--;
  mostrarPaso(pasoActual);
}



/* ============================================================
   CÁLCULO EN TIEMPO REAL DE PERSONAS PERMITIDAS
   ============================================================ */

document.getElementById("m2").addEventListener("input", () => {
  let m2 = parseFloat(document.getElementById("m2").value) || 0;
  let capacidad = Math.floor(m2 / 3.5);

  document.getElementById("capacidadTexto").innerHTML =
    `<strong>Personas permitidas:</strong> ${capacidad}`;
});
/* ============================================================
   APP.JS — PARTE C
   LÓGICAS ESPECIALES + CLASIFICACIÓN FINAL
   ============================================================ */

/* Obtiene gravedad ajustada según reglas especiales */
function obtenerGravedadFinal(bloque, index, valor) {
  let pregunta = bloques[bloque][index];
  let base = pregunta.g;

  /* ------------------------------------------------------------
     1) REGLA ESPECIAL — AGUA
     Si la pregunta de agua es NO → Muy Grave Automático (y corte final en cálculo)
     ------------------------------------------------------------ */
  if (bloque === "form2" && index === 2) {   // pregunta de agua
    if (valor === "no") return "muygrave";
    if (valor === "si") return "bueno";
  }

  /* ------------------------------------------------------------
     2) REGLA ESPECIAL — AIRE + VENTILADOR
     form2 index 3 = Aire Acondicionado
     form2 index 4 = Ventilador
     ------------------------------------------------------------ */
  if (bloque === "form2" && (index === 3 || index === 4)) {
    let valorAA = respuestas["form2_3"];
    let valorVent = respuestas["form2_4"];

    /* Solo aplicamos si ambas preguntas fueron respondidas */
    if (valorAA && valorVent) {

      // CASO 1: NO AA + SI ventilador
      if (valorAA === "no" && valorVent === "si") {
        if (index === 3) return "medio"; // AA
        if (index === 4) return "bueno"; // ventilador
      }

      // CASO 2: SI AA + SI ventilador
      if (valorAA === "si" && valorVent === "si") {
        return "bueno";
      }

      // CASO 3: SI AA + NO ventilador
      if (valorAA === "si" && valorVent === "no") {
        if (index === 3) return "bueno";  // AA
        if (index === 4) return "leve";   // ventilador
      }

      // CASO 4: NO AA + NO ventilador
      if (valorAA === "no" && valorVent === "no") {
        if (index === 3) return "medio";  // AA
        if (index === 4) return "grave";  // ventilador
      }
    }
  }

  /* ------------------------------------------------------------
     3) REGLA ESPECIAL — ENVOLVENTE TÉRMICA
     form4 index 0 = techo transfiere calor
     form4 index 2 = planta superior
     ------------------------------------------------------------ */
  if (bloque === "form4" && index === 2) {
    let techo = respuestas["form4_0"];
    let planta = respuestas["form4_2"];

    if (techo && planta) {
      // SI techo NO transfiere calor
      if (techo === "no") {
        if (planta === "no") return "medio";
        if (planta === "si") return "bueno";
      }

      // SI techo SÍ transfiere calor
      if (techo === "si") {
        if (planta === "no") return "grave";
        if (planta === "si") return "bueno";
      }
    }
  }

  /* ------------------------------------------------------------
     4) REGLA PROTECCIONES PASIVAS (simple)
     ------------------------ ------------------------------- */
  if (bloque === "form5" && index === 0) {
    if (valor === "si") return "bueno";
    if (valor === "no") return "leve";
  }

  /* ------------------------------------------------------------
     5) REGLA MUROS CLAROS (simple)
     ------------------------------------------------------------ */
  if (bloque === "form4" && index === 1) {
    if (valor === "si") return "bueno";
    if (valor === "no") return "grave";
  }

  /* ------------------------------------------------------------
     6) REGLA GENERAL: SI = bueno
        Si NO = gravedad base definida en el bloque
     ------------------------------------------------------------ */
  if (valor === "si") return "bueno";
  return base;
}



/* ============================================================
   CÁLCULO FINAL DEL ESTADO (VERDE / AMARILLO / ROJO)
   ============================================================ */

function clasificarPunto() {
  let muy = 0, gra = 0, med = 0, lev = 0;
  let aguaNo = false;
  let aire = respuestas["form2_3"] === "si";
  let tipoEspacio = "";

  /* ------------------------------------------------------------
     IDENTIFICACIÓN DEL TIPO DE ESPACIO
     ------------------------------------------------------------ */

  // Si no hay agua → NO APTO
  if (respuestas["form2_2"] === "no") {
    aguaNo = true;
    tipoEspacio = "No apto – No posee agua fría";
  }

  // Si tiene AA → área climatizada
  else if (aire) {
    tipoEspacio = "Área climatizada";
  }

  // Si tiene agua pero sin AA → Punto de Hidratación
  else {
    tipoEspacio = "Punto de Hidratación";
  }


  /* ------------------------------------------------------------
     RECORRER TODAS LAS RESPUESTAS Y AJUSTAR GRAVEDADES
     ------------------------------------------------------------ */
  Object.keys(respuestas).forEach(key => {
    let [bloque, idx] = key.split("_");
    let index = parseInt(idx);
    let valor = respuestas[key];

    let gravedad = obtenerGravedadFinal(bloque, index, valor);

    if (valor === "no") {
      if (gravedad === "muygrave") muy++;
      if (gravedad === "grave") gra++;
      if (gravedad === "medio") med++;
      if (gravedad === "leve") lev++;
    }
  });

  /* ------------------------------------------------------------
     REGLA FINAL DE CORTE POR AGUA
     ------------------------------------------------------------ */
  if (aguaNo) {
    return { estado: "rojo", tipoEspacio, muy, gra, med, lev };
  }

  /* ------------------------------------------------------------
     CLASIFICACIÓN POR UMBRALES
     ------------------------------------------------------------ */

  // ROJO
  if (muy >= 1 || gra >= 3 || med >= 5 || lev >= 7) {
    return { estado: "rojo", tipoEspacio, muy, gra, med, lev };
  }

  // VERDE
  if (muy === 0 && gra <= 1 && med <= 2 && lev <= 3) {
    return { estado: "verde", tipoEspacio, muy, gra, med, lev };
  }

  // AMARILLO
  return { estado: "amarillo", tipoEspacio, muy, gra, med, lev };
}
/* ============================================================
   APP.JS — PARTE D
   GENERACIÓN DEL INFORME FINAL + PDF + MOSTRAR RESULTADO
   ============================================================ */

function calcular() {

  /* Obtener clasificación general */
  const clasif = clasificarPunto();
  let { estado, tipoEspacio, muy, gra, med, lev } = clasif;

  /* Cálculo de personas permitidas */
  let m2 = parseFloat(document.getElementById("m2").value) || 0;
  let capacidad = Math.floor(m2 / 3.5);

  /* ============================================================
     MEDIDAS URGENTES (ordenadas por gravedad real)
     ============================================================ */
  let prioridades = [];

  Object.keys(respuestas).forEach(key => {
    let [bloque, idx] = key.split("_");
    let index = parseInt(idx);
    let valor = respuestas[key];

    let gravedadFinal = obtenerGravedadFinal(bloque, index, valor);

    if (valor === "no") {
      let emoji =
        gravedadFinal === "muygrave" ? "🚨" :
        gravedadFinal === "grave"    ? "🔴" :
        gravedadFinal === "medio"    ? "🟠" :
        gravedadFinal === "leve"     ? "🟡" : "";

      prioridades.push({
        gravedad: gravedadFinal,
        texto: bloques[bloque][index].t,
        emoji
      });
    }
  });

  /* Ordenar de grave a leve */
  const orden = { muygrave: 1, grave: 2, medio: 3, leve: 4, bueno: 5 };
  prioridades.sort((a, b) => orden[a.gravedad] - orden[b.gravedad]);



  /* ============================================================
     CONSTRUCCIÓN DEL INFORME FINAL VISUAL
     ============================================================ */

  /* Título por color */
  let tituloColor =
    estado === "rojo"     ? "🟥 Condiciones críticas" :
    estado === "amarillo" ? "🟡 Requiere mejoras" :
    "🟢 Buen funcionamiento";

  let recomendaciones =
    estado === "rojo"
      ? "Para habilitar este punto deben resolverse las MEDIDAS GRAVES y MUY GRAVES. Si no posee agua fría, no puede funcionar como punto de hidratación."
      : estado === "amarillo"
      ? "Para pasar a verde deben resolverse las MEDIDAS MEDIAS y LEVES."
      : "Este punto es apto y se recomienda mantener sus condiciones actuales.";

  let html = `
    <h2>${tituloColor}</h2>
    <p><strong>Tipo de espacio:</strong> ${tipoEspacio}</p>
    <p><strong>Área total:</strong> ${m2} m²</p>
    <p><strong>Personas permitidas:</strong> ${capacidad}</p>

    <hr>

    <h3>Datos generales del relevamiento</h3>
    <p><strong>Punto:</strong> ${document.getElementById("nombre").value}</p>
    <p><strong>Responsable del relevamiento:</strong> ${document.getElementById("persona").value}</p>
    <p><strong>Días:</strong> ${document.getElementById("dias").value}</p>
    <p><strong>Horarios:</strong> ${document.getElementById("horarios").value}</p>

    <hr>

    <h3>Medidas urgentes</h3>
  `;

  if (prioridades.length === 0) {
    html += `<p>No hay medidas urgentes.</p>`;
  } else {
    prioridades.forEach(p => {
      html += `<p>• <strong>${p.texto}</strong> — ${p.gravedad.toUpperCase()} ${p.emoji}</p>`;
    });
  }

  html += `
    <hr>
    <h3>Resumen por bloque</h3>
  `;


  /* NOMENCLATURA PARA INFORME */
  const nombresBloques = {
    form2: "Bloque 2 – Confort térmico",
    form3: "Bloque 3 – Accesibilidad y orientación",
    form4: "Bloque 4 – Envolvente térmica",
    form5: "Bloque 5 – Protecciones pasivas",
    form6: "Bloque 6 – Condiciones internas",
    form7: "Bloque 7 – Servicios"
  };


  /* Listar todas las respuestas por bloque */
  Object.keys(bloques).forEach(bloque => {
    html += `<h4>${nombresBloques[bloque]}</h4>`;

    bloques[bloque].forEach((pregunta, index) => {
      let key = `${bloque}_${index}`;
      let resp = respuestas[key];

      if (!resp) {
        html += `<p><strong>${pregunta.t}</strong><br>Sin respuesta</p>`;
        return;
      }

      let gravedad = obtenerGravedadFinal(bloque, index, resp);
      let emoji =
        gravedad === "muygrave" ? "🚨" :
        gravedad === "grave"    ? "🔴" :
        gravedad === "medio"    ? "🟠" :
        gravedad === "leve"     ? "🟡" : "🟢";

      html += `
        <p>
          <strong>${pregunta.t}</strong><br>
          Respuesta: ${resp.toUpperCase()} — ${gravedad.toUpperCase()} ${emoji}<br>
          <small>${pregunta.d}</small>
        </p>
      `;
    });

    html += `<hr>`;
  });


  /* Insertar resultado en la pantalla */
  document.getElementById("resultado").innerHTML = html;

  nextStep();
}



/* ============================================================
   GENERACIÓN DE PDF
   ============================================================ */

function descargarPDF() {
  const contenido = document.getElementById("resultado").innerHTML;

  const ventana = window.open("", "_blank");
  ventana.document.write(`
    <html>
    <head>
      <title>Informe Punto de Hidratación</title>
      <style>
        body {
          font-family: 'Public Sans', sans-serif;
          padding: 20px;
          color: #222;
          line-height: 1.5;
        }
        h3 {
          border-bottom: 2px solid #ddd;
          padding-bottom: 4px;
        }
        h4 {
          margin-top: 20px;
          color: #444;
        }
      </style>
    </head>
    <body>
      ${contenido}
    </body>
    </html>
  `);

  ventana.document.close();
  ventana.print();
}
