/* ============================================================
   APP.JS — DEFINICIONES GENERALES
=========================================================== */

let respuestas = {};
let datosGenerales = { medico: null };

/* ============================================================
   DEFINICIÓN DE BLOQUES Y PREGUNTAS
=========================================================== */

const bloques = {

  /* BLOQUE 2 – CONFORT TÉRMICO */
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

  /* BLOQUE 3 – DISPOSICIONES EDILICIAS */
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

  /* BLOQUE 4 – ENVOLVENTE TÉRMICA */
  form4: [
    {
      t: "¿El material del techo evita la trasferencia de calor al recinto?",
      d: "Ejemplo: losa, cieloraso aislante, techo de chapa con aislación térmica, etc.",
      g: "grave"
    },
    {
      t: "¿El recinto posee planta superior?",
      d: "La planta superior reduce la transferencia térmica directa desde la cubierta.",
      g: "medio"
    }
  ],

  /* BLOQUE 5 – PROTECCIONES PASIVAS */
  form5: [
    {
      t: "¿Posee toldos, cortinas o elementos de sombra?",
      d: "Elementos que mitiguen la radiación solar directa.",
      g: "leve"
    },
    {
      t: "¿Posee vegetación / edificios / medianeras, etc al norte?",
      d: "Estos elementos ubicados al norte generan sombreado sobre el recinto.",
      g: "medio"
    },
     {
      t: "¿Posee vegetación / edificios / medianeras, etc? al oeste?",
      d: "Estos elementos ubicados al oeste generan sombreado sobre el recinto.",
      g: "medio"
    }
   ],
     

  /* BLOQUE 6 – DISEÑO */
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

  /* BLOQUE 7 – SERVICIOS */
  form7: [
    {
      t: "¿El punto cuenta con disponibilidad de agua potable?",
      d: "Agua apta para consumo humano.",
      g: "muygrave"
    },
    {
      t: "¿El punto cuenta con disponibilidad de agua fría?",
      d: "Agua fría proveniente de heladera, dispenser o botellón refrigerado.",
      g: "medio"
    },
    {
      t: "¿Se dispone de un área de reposo o espera?",
      d: "Sillas, bancos o sectores confortables.",
      g: "medio"
    },
    {
      t: "¿El espacio está preparado para futura instalación de energía solar?",
      d: "Debe poseer espacio físico, estructura resistente y capacidad eléctrica.",
      g: "medio"
    }
  ]
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
   DATOS GENERALES
=========================================================== */

function setDatoGeneral(campo, valor, boton) {
  datosGenerales[campo] = valor;

  let grupo = boton.parentNode.querySelectorAll("button");
  grupo.forEach(b => b.classList.remove("seleccionado"));

  boton.classList.add("seleccionado");
}


/* ============================================================
   NAVEGACIÓN ENTRE PÁGINAS
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
   LÓGICAS ESPECIALES DE CLASIFICACIÓN
=========================================================== */

function obtenerGravedadFinal(bloque, index, valor) {
  let preg = bloques[bloque][index];
  let base = preg.g;

  /* Agua potable */
  if (bloque === "form7" && index === 0)
    return valor === "si" ? "bueno" : "muygrave";

  /* Agua fría */
  if (bloque === "form7" && index === 1)
    return valor === "si" ? "bueno" : "medio";

  /* Aire + ventiladores */
  if (bloque === "form2" && (index === 2 || index === 3)) {
    let aa = respuestas["form2_2"];
    let vent = respuestas["form2_3"];

    if (aa && vent) {

      if (aa === "no" && vent === "si") {
        if (index === 2) return "medio";
        if (index === 3) return "bueno";
      }

      if (aa === "si" && vent === "si") return "bueno";

      if (aa === "si" && vent === "no") {
        if (index === 2) return "bueno";
        if (index === 3) return "leve";
      }

      if (aa === "no" && vent === "no") {
        if (index === 2) return "medio";
        if (index === 3) return "grave";
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
        if (planta === "si") return "leve";
      }

      if (techo === "si") {
         if (planta === "no") return "leve";
        if (planta === "si") return "bueno";
      }
    }
  }


  /* Protecciones pasivas */
  if (bloque === "form5")
    return valor === "si" ? "bueno" : "leve";

  /* Regla final */
  return valor === "si" ? "bueno" : base;
}


/* ============================================================
   CLASIFICACIÓN GENERAL DEL PUNTO
=========================================================== */
function clasificarPunto() {
  let muy = 0, gra = 0, med = 0, lev = 0;

  let aguaPotNo = respuestas["form7_0"] === "no";
  let aguaFria = respuestas["form7_1"] === "si";

  let tipoEspacio = "";

  // Identificar tipo de espacio
if (!aguaPotNo && aguaFria) {
    tipoEspacio = "Punto de Hidratación";
  } else {
    tipoEspacio = "Área Climatizada";
  }

  // Contar fallas según gravedad final
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

  // PRIORIDAD ABSOLUTA: muy graves ⇒ rojo
  if (muy >= 1) {
    return { estado: "rojo", tipoEspacio, muy, gra, med, lev };
  }

  // Evaluación por fallas graves
  if (gra >= 4) {
    return { estado: "rojo", tipoEspacio, muy, gra, med, lev };
  } 
  if (gra >= 2) {
    return { estado: "amarillo", tipoEspacio, muy, gra, med, lev };
  } 
  if (gra === 1) {
    return { estado: "verde", tipoEspacio, muy, gra, med, lev };
  }

  // Evaluación por fallas medias
  if (med >= 5) {
    return { estado: "rojo", tipoEspacio, muy, gra, med, lev };
  }
  if (med >= 3) {
    return { estado: "amarillo", tipoEspacio, muy, gra, med, lev };
  }
  if (med >= 1) {
    return { estado: "verde", tipoEspacio, muy, gra, med, lev };
  }

  // Evaluación por fallas leves
  if (lev >= 7) {
    return { estado: "rojo", tipoEspacio, muy, gra, med, lev };
  }
  if (lev >= 4) {
    return { estado: "amarillo", tipoEspacio, muy, gra, med, lev };
  }
  if (lev >= 1) {
    return { estado: "verde", tipoEspacio, muy, gra, med, lev };
  }

  // Si no hay fallas
  return { estado: "verde", tipoEspacio, muy, gra, med, lev };
}

/* ============================================================
   GENERAR INFORME FINAL
=========================================================== */

function calcular() {

  const clasif = clasificarPunto();
  let { estado, tipoEspacio, muy, gra, med, lev } = clasif;

  let m2 = parseFloat(document.getElementById("m2").value) || 0;
  let capacidad = Math.floor(m2 / 3.5);

  let aguaFriaDisponible = respuestas["form7_1"] === "si";

  // Empieza el HTML
  let html = `
  <h2>${estado === "rojo" ? "🟥 Condiciones críticas" :
        estado === "amarillo" ? "🟡 Requiere mejoras" :
        "🟢 Buen funcionamiento"}</h2>

  <p><strong>Tipo de espacio:</strong> ${tipoEspacio}</p>
  <p><strong>Área total:</strong> ${m2} m²</p>
  <p><strong>Personas permitidas:</strong> ${capacidad}</p>

  <hr>
  `;

  // ===========================
  // MENSAJES ESPECIALES
  // ===========================

  if (aguaFriaDisponible && estado === "rojo") {
    html += `<h2 style="color:#d40000;">CUMPLE PUNTO DE HIDRATACIÓN</h2>`;
  }

  if (estado === "verde" || estado === "amarillo") {
    html += `<h2 style="color:#0077cc;">CUMPLE ÁREA CLIMATIZADA</h2>`;
  }

  if (aguaFriaDisponible && (estado === "verde" || estado === "amarillo")) {
    html += `<h2 style="color:#22aa22;">CUMPLE PUNTO DE HIDRATACIÓN</h2>`;
  }

  // ===========================

  html += `
  <hr>

  <h3>Datos generales del relevamiento</h3>
  <p><strong>Punto:</strong> ${document.getElementById("nombre").value}</p>
  <p><strong>Responsable del relevamiento:</strong> ${document.getElementById("persona").value}</p>
  <p><strong>Días:</strong> ${document.getElementById("dias").value}</p>
  <p><strong>Horarios:</strong> ${document.getElementById("horarios").value}</p>
  <p><strong>Servicio médico (107):</strong> ${datosGenerales.medico ? datosGenerales.medico.toUpperCase() : "NO DECLARADO"}</p>

  <hr>

  <h3>Resumen de clasificación</h3>
  <ul>
    <li><strong>Muy graves (🚨):</strong> ${muy}</li>
    <li><strong>Graves (🔴):</strong> ${gra}</li>
    <li><strong>Medias (🟠):</strong> ${med}</li>
    <li><strong>Leves (🟡):</strong> ${lev}</li>
    <li><strong>Buenas (🟢):</strong> ${Object.keys(respuestas).length - (muy + gra + med + lev)}</li>
  </ul>

  <hr>

  <h3>Resumen por bloque</h3>
  `;

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
        gravedad === "grave"    ? "🔴" :
        gravedad === "medio"    ? "🟠" :
        gravedad === "leve"     ? "🟡" : "🟢";

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

  // SECCIÓN DE COMENTARIOS Y FOTOS
  html += `
  <h3>Comentarios adicionales</h3>
  <textarea style="width:100%; height:120px;"></textarea>

  <h3>Fotografías (5 máximo)</h3>
  <div style="display:flex; flex-wrap:wrap; gap:10px;">
    <input type="file" accept="image/*">
    <input type="file" accept="image/*">
    <input type="file" accept="image/*">
    <input type="file" accept="image/*">
    <input type="file" accept="image/*">
  </div>
  `;

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
        textarea {
          width: 100%;
          height: 120px;
          border: 1px solid #aaa;
          padding: 8px;
          border-radius: 6px;
        }
      </style>
    </head>
    <body>${contenido}</body></html>
  `);

  ventana.document.close();
  ventana.print();
}
