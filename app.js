document.addEventListener("DOMContentLoaded", () => {

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
      d: "Ejemplo: losa, cieloraso aislante, techo de chapa con aislación térmica.",
      g: "grave"
    },
    {
      t: "¿El recinto posee planta superior?",
      d: "La planta superior reduce la transferencia térmica directa.",
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
      t: "¿Posee vegetación / edificios / medianeras al norte?",
      d: "Estos elementos generan sombreado.",
      g: "medio"
    },
    {
      t: "¿Posee vegetación / edificios / medianeras al oeste?",
      d: "Estos elementos generan sombreado.",
      g: "medio"
    }
  ],

  /* BLOQUE 6 – DISEÑO */
  form6: [
    {
      t: "¿Cuenta con aberturas altas para permitir la salida del aire caliente?",
      d: "Aberturas a más de 2 m favorecen la ventilación.",
      g: "leve"
    },
    {
      t: "¿Posee tela mosquitera?",
      d: "Evita ingreso de insectos.",
      g: "leve"
    }
  ],

  /* BLOQUE 7 – SERVICIOS */
  form7: [
    {
      t: "¿El espacio cuenta con disponibilidad de agua fría para el público?",
      d: "Dispenser o botellón refrigerado.",
      g: "muygrave"
    },
    {
      t: "¿Se dispone de un área de reposo o espera?",
      d: "Sillas, bancos o sectores confortables.",
      g: "medio"
    },
    {
      t: "¿Está preparado para futura instalación de energía solar?",
      d: "Espacio físico, estructura y capacidad eléctrica.",
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

  boton.parentElement
    .querySelectorAll(".btn-resp")
    .forEach(b => b.classList.remove("seleccionado"));

  boton.classList.add("seleccionado");
}


/* ============================================================
   NAVEGACIÓN ENTRE PASOS
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
  const m2 = parseFloat(document.getElementById("m2").value) || 0;
  const capacidad = Math.floor(m2 / 3.5);
  document.getElementById("capacidadTexto").innerHTML =
    `<strong>Personas permitidas:</strong> ${capacidad}`;
});


/* ============================================================
   LÓGICAS DE CLASIFICACIÓN
=========================================================== */

function obtenerGravedadFinal(bloque, index, valor) {

  if (bloque === "form7" && index === 0)
    return valor === "si" ? "bueno" : "muygrave";

  if (bloque === "form2" && (index === 2 || index === 3)) {
    const aa = respuestas["form2_2"];
    const vent = respuestas["form2_3"];

    if (aa && vent) {
      if (aa === "no" && vent === "si") return index === 2 ? "medio" : "bueno";
      if (aa === "si" && vent === "si") return "bueno";
      if (aa === "si" && vent === "no") return index === 2 ? "bueno" : "leve";
      if (aa === "no" && vent === "no") return index === 2 ? "medio" : "grave";
    }
  }

  if (bloque === "form4" && index === 1) {
    const techo = respuestas["form4_0"];
    const planta = respuestas["form4_1"];

    if (techo && planta) {
      if (techo === "no") return planta === "no" ? "medio" : "leve";
      if (techo === "si") return planta === "si" ? "bueno" : "leve";
    }
  }

  if (bloque === "form5")
    return valor === "si" ? "bueno" : "leve";

  return valor === "si" ? "bueno" : bloques[bloque][index].g;
}


/* ============================================================
   CLASIFICACIÓN FINAL — ÁREA CLIMATIZADA
=========================================================== */

function clasificarPunto() {

  let muy = 0, gra = 0, med = 0, lev = 0;

  if (respuestas["form7_0"] !== "si") {
    return { estado: "rojo" };
  }

  Object.keys(respuestas).forEach(key => {
    const [b, i] = key.split("_");
    const v = respuestas[key];
    const g = obtenerGravedadFinal(b, parseInt(i), v);

    if (v === "no") {
      if (g === "muygrave") muy++;
      if (g === "grave") gra++;
      if (g === "medio") med++;
      if (g === "leve") lev++;
    }
  });

  const total = Object.keys(respuestas).length;
  const buenas = total - (muy + gra + med + lev);

  if (buenas < 4 || muy >= 1 || gra >= 4 || med >= 6 || lev >= 7)
    return { estado: "rojo" };

  if (gra >= 2 || med >= 3 || lev >= 4)
    return { estado: "amarillo" };

  return { estado: "verde" };
}


/* ============================================================
   RESULTADO FINAL
=========================================================== */

function calcular() {

  const { estado } = clasificarPunto();

  const m2 = parseFloat(document.getElementById("m2").value) || 0;
  const capacidad = Math.floor(m2 / 3.5);

  document.getElementById("resultado").innerHTML = `
    <h2>
      ${estado === "rojo" ? "🟥 Área NO apta como área climatizada" :
        estado === "amarillo" ? "🟡 Área climatizada con mejoras necesarias" :
        "🟢 Área climatizada apta"}
    </h2>

    <p><strong>Área total:</strong> ${m2} m²</p>
    <p><strong>Personas permitidas:</strong> ${capacidad}</p>
  `;

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
        <title>Informe Área Climatizada</title>
        <style>
          body { font-family: 'Public Sans', sans-serif; padding:20px; }
        </style>
      </head>
      <body>${contenido}</body>
    </html>
  `);

  ventana.document.close();
  ventana.print();
}

});
