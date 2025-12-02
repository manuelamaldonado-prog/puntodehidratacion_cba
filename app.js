/* ============================================================
   APP.JS — PARTE A
   DEFINICIÓN DE BLOQUES Y PREGUNTAS
   ============================================================ */

/* Aquí se guardarán las respuestas en tiempo real */
let respuestas = {};
/* Datos generales adicionales */
let datosGenerales = {
  medico: null
};

/* ============================================================
   DEFINICIÓN DE BLOQUES Y PREGUNTAS
=========================================================== */

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
      t: "¿Hay circulación de aire natural (ventilación cruzada)?",
      d: "Presencia de ventanas, aberturas o flujo cruzado.",
      g: "leve"
    },
    {
      t: "¿El espacio posee aire acondicionado en funcionamiento?",
      d: "Aire acondicionado operativo y accesible.",
      g: "medio"
    },
    {
      t: "¿Posee ventiladores funcionando?",
      d: "Ventiladores operativos y distribuidos adecuadamente.",
      g: "leve"
    }
  ],

  /* ------------------------------------------------------------
     BLOQUE 3 – DISPOSICIONES EDILICIAS
  ------------------------------------------------------------ */
  form3: [
    {
      t: "¿La fachada principal está orientada al norte?",
      d: "La orientación norte recibe radiación homogénea y controlable.",
      g: "medio"
    },
    {
      t: "¿La menor cantidad de aberturas se orientan al oeste?",
      d: "La orientación oeste recibe mayor carga térmica.",
      g: "medio"
    },
    {
      t: "¿El área permite el acceso seguro de personas con movilidad reducida?",
      d: "Considerar rampas, nivelación, ausencia de obstáculos, accesos amplios.",
      g: "grave"
    }
  ],

  /* ------------------------------------------------------------
     BLOQUE 4 – ENVOLVENTE TÉRMICA
  ------------------------------------------------------------ */
  form4: [
    {
      t: "¿El material del techo transfiere calor al recinto?",
      d: "Ejemplo: chapa, madera sin aislación, fibrocemento.",
      g: "grave"    // SI = grave, NO = bueno
    },
    {
      t: "¿Los muros exteriores están pintados en color claro?",
      d: "Los colores claros reflejan la radiación solar.",
      g: "grave"    // SI = bueno, NO = grave
    },
    {
      t: "¿El recinto posee planta superior?",
      d: "La planta superior reduce la transferencia térmica directa desde la cubierta.",
      g: "medio"    // depende de combinación con techo
    }
  ],

  /* ------------------------------------------------------------
     BLOQUE 5 – PROTECCIONES PASIVAS
  ------------------------------------------------------------ */
  form5: [
    {
      t: "¿Posee toldos, cortinas o elementos de sombra?",
      d: "Elementos que mitiguen la radiación solar directa.",
      g: "leve"
    }
  ],

  /* ------------------------------------------------------------
     BLOQUE 6 – DISEÑO
  ------------------------------------------------------------ */
  form6: [
    {
      t: "¿Cuenta con aberturas altas para permitir la salida del aire caliente?",
      d: "Aberturas ubicadas a más de 2 metros favorecen la ventilación.",
      g: "leve"
    },
    {
      t: "¿Posee tela mosquitera?",
      d: "Evita ingreso de insectos y mejora las condiciones sanitarias.",
      g: "leve"
    }
  ],

  /* ------------------------------------------------------------
     BLOQUE 7 – FUNCIONES Y PROVISIONAMIENTO
  ------------------------------------------------------------ */
  form7: [
    {
      t: "¿El punto cuenta con disponibilidad de agua potable?",
      d: "Agua apta para consumo humano.",
      g: "muygrave"
    },
   {
      t: "¿El punto cuenta con disponibilidad de agua fría?",
      d: "Agua fría proveniente de heladera, dispenser o botellón refrigerado.",
      g: "medio"  // NO = medio automático
    },
    {
      t: "¿Se dispone de un área de reposo o espera?",
      d: "Sillas, bancos o sectores confortables.",
      g: "leve"
    },
    {
      t: "¿El espacio está preparado para futura instalación de energía solar?",
      d: "Debe poseer espacio físico, estructura resistente y capacidad eléctrica.",
      g: "medio"
    }
  ]
};

/* ============================================================
   COLORES ASOCIADOS A RESULTADOS
=========================================================== */

const colores = {
  si: "#2ecc71",
  muygrave: "#ff4d4d",
  grave: "#ff6961",
  medio: "#f5a623",
  leve: "#fbd55b"
};

/* ============================================================
   GENERACIÓN DE FORMULARIOS
=========================================================== */

function generarFormularios() {
  Object.keys(bloques).forEach(idBloque => {
    const cont = document.getElementById(idBloque);
    if (!cont) return;

    bloques[idBloque].forEach((preg, index) => {
      const div = document.createElement("div");
      div.className = "pregunta";

      div.innerHTML = `
        <strong>${preg.t}</strong>
        <p class="explica">${preg.d}</p>

        <div class="opciones">
          <button class="btn-resp btn-si"
            onclick="seleccionarRespuesta('${idBloque}', ${index}, 'si', this)">
            Sí
          </button>

          <button class="btn-resp btn-no-${preg.g}"
            onclick="seleccionarRespuesta('${idBloque}', ${index}, 'no', this)">
            No
          </button>
        </div>
      `;

      cont.appendChild(div);
    });
  });
}

generarFormularios();

/* ============================================================
   GUARDAR RESPUESTAS
=========================================================== */

function seleccionarRespuesta(bloque, index, valor, boton) {
  const key = `${bloque}_${index}`;
  respuestas[key] = valor;

  const grupo = boton.parentElement.querySelectorAll(".btn-resp");
  grupo.forEach(b => b.classList.remove("seleccionado"));

  boton.classList.add("seleccionado");
}

/* ============================================================
   GUARDAR DATOS GENERALES
=========================================================== */
function setDatoGeneral(campo, valor, boton) {
  datosGenerales[campo] = valor;

  let grupo = boton.parentNode.querySelectorAll("button");
  grupo.forEach(b => b.classList.remove("seleccionado"));

  boton.classList.add("seleccionado");
}

/* ============================================================
   NAVEGACIÓN
=========================================================== */

let pasoActual = 1;

function mostrarPaso(n) {
  document.querySelectorAll(".step")
    .forEach(div => div.classList.remove("active"));
  document.getElementById("step" + n).classList.add("active");
}

function nextStep() { pasoActual++; mostrarPaso(pasoActual); }
function prevStep() { pasoActual--; mostrarPaso(pasoActual); }

/* ============================================================
   CAPACIDAD EN TIEMPO REAL
=========================================================== */

document.getElementById("m2").addEventListener("input", () => {
  let m2 = parseFloat(document.getElementById("m2").value) || 0;
  let capacidad = Math.floor(m2 / 3.5);

  document.getElementById("capacidadTexto").innerHTML =
    `<strong>Personas permitidas:</strong> ${capacidad}`;
});

/* ============================================================
   LÓGICAS ESPECIALES
=========================================================== */

function obtenerGravedadFinal(bloque, index, valor) {
  let preg = bloques[bloque][index];
  let base = preg.g;

  /* Agua fría */
  if (bloque === "form2" && index === 2) {
    if (valor === "no") return "muygrave";
    return "bueno";
  }

  /* Agua potable */
  if (bloque === "form7" && index === 0) {
    if (valor === "no") return "muygrave";
    return "bueno";
  }

  /* Aire + ventilador */
  if (bloque === "form2" && (index === 3 || index === 4)) {
    let aa = respuestas["form2_3"];
    let vent = respuestas["form2_4"];

    if (aa && vent) {
      if (aa === "no" && vent === "si") {
        if (index === 3) return "medio";
        if (index === 4) return "bueno";
      }

      if (aa === "si" && vent === "si") return "bueno";

      if (aa === "si" && vent === "no") {
        if (index === 3) return "bueno";
        if (index === 4) return "leve";
      }

      if (aa === "no" && vent === "no") {
        if (index === 3) return "medio";
        if (index === 4) return "grave";
      }
    }
  }

  /* Techo + planta superior */
  if (bloque === "form4" && index === 2) {
    let techo = respuestas["form4_0"];
    let planta = respuestas["form4_2"];

    if (techo && planta) {
      if (techo === "no") {
        if (planta === "no") return "medio";
        if (planta === "si") return "bueno";
      }

      if (techo === "si") {
        if (planta === "no") return "grave";
        if (planta === "si") return "bueno";
      }
    }
  }

  /* Muros claros */
  if (bloque === "form4" && index === 1) {
    if (valor === "si") return "bueno";
    return "grave";
  }

  /* Protecciones pasivas */
  if (bloque === "form5" && index === 0) {
    if (valor === "si") return "bueno";
    return "leve";
  }

  /* Regla general */
  if (valor === "si") return "bueno";
  return base;
}

/* ============================================================
   CLASIFICACIÓN FINAL
=========================================================== */

function clasificarPunto() {
  let muy = 0, gra = 0, med = 0, lev = 0;

  let aguaFriaNo = respuestas["form2_2"] === "no";
  let aguaPotNo  = respuestas["form7_0"] === "no";
  let aire = respuestas["form2_3"] === "si";

  let tipoEspacio = "";

  if (aguaPotNo) {
    tipoEspacio = "NO APTO – No posee agua potable";
  } else if (aire) {
    tipoEspacio = "Área climatizada";
  } else if (!aguaFriaNo) {
    tipoEspacio = "Punto de hidratación";
  }

  Object.keys(respuestas).forEach(key => {
    let [b, idx] = key.split("_");
    let v = respuestas[key];
    let gravedad = obtenerGravedadFinal(b, parseInt(idx), v);

    if (v === "no") {
      if (gravedad === "muygrave") muy++;
      if (gravedad === "grave") gra++;
      if (gravedad === "medio") med++;
      if (gravedad === "leve") lev++;
    }
  });

  if (aguaPotNo) return { estado: "rojo", tipoEspacio, muy, gra, med, lev };

  if (muy >= 1 || gra >= 3 || med >= 5 || lev >= 7)
    return { estado: "rojo", tipoEspacio, muy, gra, med, lev };

  if (muy === 0 && gra <= 1 && med <= 2 && lev <= 3)
    return { estado: "verde", tipoEspacio, muy, gra, med, lev };

  return { estado: "amarillo", tipoEspacio, muy, gra, med, lev };
}

/* ============================================================
   GENERAR INFORME
=========================================================== */

function calcular() {

  const clasif = clasificarPunto();
  let { estado, tipoEspacio, muy, gra, med, lev } = clasif;

  let m2 = parseFloat(document.getElementById("m2").value) || 0;
  let capacidad = Math.floor(m2 / 3.5);

  let prioridades = [];

  Object.keys(respuestas).forEach(key => {
    let [b, idx] = key.split("_");
    let valor = respuestas[key];
    let gravedadFinal = obtenerGravedadFinal(b, parseInt(idx), valor);

    if (valor === "no") {
      let emoji =
        gravedadFinal === "muygrave" ? "🚨" :
        gravedadFinal === "grave"    ? "🔴" :
        gravedadFinal === "medio"    ? "🟠" :
        gravedadFinal === "leve"     ? "🟡" : "";

      prioridades.push({
        gravedad: gravedadFinal,
        texto: bloques[b][idx].t,
        emoji
      });
    }
  });

  const orden = { muygrave: 1, grave: 2, medio: 3, leve: 4, bueno: 5 };
  prioridades.sort((a, b) => orden[a.gravedad] - orden[b.gravedad]);

  let titulo =
    estado === "rojo" ? "🟥 Condiciones críticas" :
    estado === "amarillo" ? "🟡 Requiere mejoras" :
    "🟢 Buen funcionamiento";

  let recomendaciones =
    estado === "rojo"
      ? "Para habilitar este punto deben resolverse las MEDIDAS GRAVES y MUY GRAVES."
      : estado === "amarillo"
      ? "Para pasar a verde deben resolverse las MEDIDAS MEDIAS y LEVES."
      : "Este punto es apto y se recomienda mantener sus condiciones actuales.";

  let html = `
    <h2>${titulo}</h2>
    <p><strong>Tipo de espacio:</strong> ${tipoEspacio}</p>
    <p><strong>Área total:</strong> ${m2} m²</p>
    <p><strong>Personas permitidas:</strong> ${capacidad}</p>

    <hr>

    <h3>Datos generales del relevamiento</h3>
    <p><strong>Punto:</strong> ${document.getElementById("nombre").value}</p>
    <p><strong>Responsable del relevamiento:</strong> ${document.getElementById("persona").value}</p>
    <p><strong>Días:</strong> ${document.getElementById("dias").value}</p>
    <p><strong>Horarios:</strong> ${document.getElementById("horarios").value}</p>
    <p><strong>Servicio médico (107):</strong> ${datosGenerales.medico ? datosGenerales.medico.toUpperCase() : "NO DECLARADO"}</p>

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

  html += `<hr><h3>Resumen por bloque</h3>`;

  const nombresBloques = {
    form2: "Bloque 2 – Confort térmico",
    form3: "Bloque 3 – Disposiciones edilicias",
    form4: "Bloque 4 – Envolvente térmica",
    form5: "Bloque 5 – Protecciones pasivas",
    form6: "Bloque 6 – Diseño",
    form7: "Bloque 7 – Funciones y provisionamiento"
  };

  Object.keys(bloques).forEach(b => {
    html += `<h4>${nombresBloques[b]}</h4>`;

    bloques[b].forEach((pregunta, idx) => {
      let key = `${b}_${idx}`;
      let valor = respuestas[key];

      if (!valor) {
        html += `<p><strong>${pregunta.t}</strong><br>Sin respuesta</p>`;
        return;
      }

      let gravedad = obtenerGravedadFinal(b, idx, valor);

      let emoji =
        gravedad === "muygrave" ? "🚨" :
        gravedad === "grave" ? "🔴" :
        gravedad === "medio" ? "🟠" :
        gravedad === "leve" ? "🟡" : "🟢";

      html += `
        <p>
          <strong>${pregunta.t}</strong><br>
          Respuesta: ${valor.toUpperCase()} — ${gravedad.toUpperCase()} ${emoji}<br>
          <small>${pregunta.d}</small>
        </p>
      `;
    });

    html += `<hr>`;
  });

  document.getElementById("resultado").innerHTML = html;

  nextStep();
}

/* ============================================================
   PDF
=========================================================== */

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
        }
      </style>
    </head>
    <body>${contenido}</body></html>
  `);

  ventana.document.close();
  ventana.print();
}
