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
    { t: "¿El recinto cuenta con temperatura estable?", d: "Considerar que mantiene una temperatura agradable y homogénea.", g: "grave" },
    { t: "¿Hay circulación de aire natural (ventilación cruzada)?", d: "Presencia de ventanas, aberturas o flujo cruzado.", g: "leve" },
    { t: "¿El espacio posee aire acondicionado en funcionamiento?", d: "Aire acondicionado operativo y accesible.", g: "medio" },
    { t: "¿Posee ventiladores funcionando?", d: "Ventiladores operativos y distribuidos adecuadamente.", g: "leve" }
  ],

  /* BLOQUE 3 – DISPOSICIONES EDILICIAS */
  form3: [
    { t: "¿La fachada principal está orientada al norte?", d: "La orientación norte recibe radiación homogénea y controlable.", g: "medio" },
    { t: "¿La menor cantidad de aberturas se orientan al oeste?", d: "La orientación oeste recibe mayor carga térmica.", g: "medio" },
    { t: "¿El área permite el acceso seguro de personas con movilidad reducida?", d: "Rampas, nivelación, accesos amplios.", g: "grave" }
  ],

  /* BLOQUE 4 – ENVOLVENTE TÉRMICA */
  form4: [
    { t: "¿El material del techo evita la transferencia de calor al recinto?", d: "Losa, aislación térmica, cielorraso.", g: "grave" },
    { t: "¿El recinto posee planta superior?", d: "Reduce transferencia térmica directa.", g: "medio" }
  ],

  /* BLOQUE 5 – PROTECCIONES PASIVAS */
  form5: [
    { t: "¿Posee toldos, cortinas o elementos de sombra?", d: "Mitigan radiación solar directa.", g: "leve" },
    { t: "¿Posee vegetación / edificios al norte?", d: "Generan sombreado.", g: "medio" },
    { t: "¿Posee vegetación / edificios al oeste?", d: "Reducen carga térmica.", g: "medio" }
  ],

  /* BLOQUE 6 – DISEÑO */
  form6: [
    { t: "¿Cuenta con aberturas altas para permitir la salida del aire caliente?", d: "Favorecen ventilación.", g: "leve" },
    { t: "¿Posee tela mosquitera?", d: "Mejora condiciones sanitarias.", g: "leve" }
  ],

  /* BLOQUE 7 – SERVICIOS */
  form7: [
    { t: "¿El punto cuenta con disponibilidad de agua fría?", d: "Dispenser, heladera o botellón.", g: "muygrave" },
    { t: "¿Se dispone de un área de reposo o espera?", d: "Sillas, bancos, sectores confortables.", g: "medio" },
    { t: "¿El espacio está preparado para futura instalación de energía solar?", d: "Espacio, estructura y capacidad.", g: "medio" }
  ]
};

/* ============================================================
   GENERACIÓN DE FORMULARIOS
=========================================================== */

function generarFormularios() {
  Object.keys(bloques).forEach(id => {
    const cont = document.getElementById(id);
    if (!cont) return;

    bloques[id].forEach((p, i) => {
      cont.innerHTML += `
        <div class="pregunta">
          <strong>${p.t}</strong>
          <p class="explica">${p.d}</p>
          <div class="opciones">
            <button class="btn-resp" onclick="seleccionarRespuesta('${id}', ${i}, 'si', this)">Sí</button>
            <button class="btn-resp" onclick="seleccionarRespuesta('${id}', ${i}, 'no', this)">No</button>
          </div>
        </div>`;
    });
  });
}

generarFormularios();

/* ============================================================
   RESPUESTAS
=========================================================== */

function seleccionarRespuesta(bloque, index, valor, boton) {
  respuestas[`${bloque}_${index}`] = valor;
  boton.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("seleccionado"));
  boton.classList.add("seleccionado");
}

function setDatoGeneral(campo, valor, boton) {
  datosGenerales[campo] = valor;
  boton.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("seleccionado"));
  boton.classList.add("seleccionado");
}

/* ============================================================
   NAVEGACIÓN
=========================================================== */

let pasoActual = 1;

function mostrarPaso(n) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById("step" + n).classList.add("active");
}

function nextStep() { pasoActual++; mostrarPaso(pasoActual); }
function prevStep() { pasoActual--; mostrarPaso(pasoActual); }

/* ============================================================
   CAPACIDAD
=========================================================== */

document.getElementById("m2").addEventListener("input", () => {
  const m2 = parseFloat(document.getElementById("m2").value) || 0;
  document.getElementById("capacidadTexto").innerHTML =
    `<strong>Personas permitidas:</strong> ${Math.floor(m2 / 3.5)}`;
});

/* ============================================================
   CLASIFICACIÓN
=========================================================== */

function obtenerGravedadFinal(b, i, v) {
  if (b === "form7" && i === 0) return v === "si" ? "bueno" : "muygrave";
  return v === "si" ? "bueno" : bloques[b][i].g;
}

function clasificarPunto() {
  let muy = 0, gra = 0, med = 0, lev = 0;

  Object.keys(respuestas).forEach(k => {
    const [b, i] = k.split("_");
    const g = obtenerGravedadFinal(b, +i, respuestas[k]);
    if (respuestas[k] === "no") {
      if (g === "muygrave") muy++;
      else if (g === "grave") gra++;
      else if (g === "medio") med++;
      else lev++;
    }
  });

  const total = Object.keys(respuestas).length;
  const buenas = total - (muy + gra + med + lev);

  // REGLA DE MÍNIMAS CONDICIONES FAVORABLES
  if (buenas < 4) {
    return { estado: "rojo", muy, gra, med, lev, buenas };
  }

  if (muy >= 1) return { estado: "rojo", muy, gra, med, lev, buenas };
  if (gra >= 4) return { estado: "rojo", muy, gra, med, lev, buenas };
  if (gra >= 2 || med >= 3) return { estado: "amarillo", muy, gra, med, lev, buenas };

  return { estado: "verde", muy, gra, med, lev, buenas };
}

/* ============================================================
   INFORME FINAL
=========================================================== */

function calcular() {
  const r = clasificarPunto();
  const m2 = parseFloat(document.getElementById("m2").value) || 0;
  const cap = Math.floor(m2 / 3.5);

  let html = `
    <h2>${r.estado === "rojo" ? "🟥 Área NO apta como área climatizada" :
      r.estado === "amarillo" ? "🟡 Área climatizada con mejoras necesarias" :
      "🟢 Área climatizada apta"}</h2>

    <p><strong>Área total:</strong> ${m2} m²</p>
    <p><strong>Personas permitidas:</strong> ${cap}</p>

    <hr>

    <h3>Datos generales del relevamiento</h3>
    <p><strong>Punto:</strong> ${document.getElementById("nombre").value}</p>
    <p><strong>Responsable:</strong> ${document.getElementById("persona").value}</p>
    <p><strong>Días:</strong> ${document.getElementById("dias").value}</p>
    <p><strong>Horarios:</strong> ${document.getElementById("horarios").value}</p>
    <p><strong>Servicio médico (107):</strong> ${datosGenerales.medico ? datosGenerales.medico.toUpperCase() : "NO DECLARADO"}</p>

    <hr>

    <h3>Resumen de clasificación</h3>
    <ul>
      <li>Muy graves: ${r.muy}</li>
      <li>Graves: ${r.gra}</li>
      <li>Medias: ${r.med}</li>
      <li>Leves: ${r.lev}</li>
      <li>Buenas: ${r.buenas}</li>
    </ul>
  `;

  document.getElementById("resultado").innerHTML = html;
  nextStep();
}

/* ============================================================
   PDF
=========================================================== */

function descargarPDF() {
  const v = window.open("", "_blank");
  v.document.write(`<html><body>${document.getElementById("resultado").innerHTML}</body></html>`);
  v.print();
}
