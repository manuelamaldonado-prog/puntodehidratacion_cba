/**********************************************************************
 * NAVEGACIÓN ENTRE PASOS
 **********************************************************************/

let currentStep = 1;

function showStep(n) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById("step" + n).classList.add("active");
}

function nextStep() {
  currentStep++;
  showStep(currentStep);
}

function prevStep() {
  currentStep--;
  showStep(currentStep);
}

/**********************************************************************
 * CÁLCULO DE PERSONAS SEGÚN METROS CUADRADOS
 **********************************************************************/

document.getElementById("m2").addEventListener("input", () => {
  const m2 = parseFloat(document.getElementById("m2").value) || 0;
  const capacidad = Math.floor(m2 / 3.5);
  document.getElementById("capacidadTexto").innerText =
    "Capacidad estimada: " + capacidad + " personas";
});

/**********************************************************************
 * PREGUNTAS DE CADA BLOQUE
 **********************************************************************/

const bloques = {
  form2: [
    { t: "¿Posee temperatura interior estable?", d: "Entre 25–28 °C y 50–60% HR.", g: "muygrave" },
    { t: "¿Ventilación cruzada?", d: "3 a 6 renovaciones por hora.", g: "muygrave" },
    { t: "¿Aire acondicionado operativo?", d: "Regulado a 24 °C.", g: "grave" },
    { t: "¿Ventiladores disponibles?", d: "Cantidad adecuada según superficie.", g: "medio" }
  ],
  form3: [
    { t: "¿Orientación norte predominante?", d: "Optimiza el confort térmico.", g: "medio" },
    { t: "¿Pocas aberturas al oeste?", d: "Reduce sobrecalentamiento.", g: "leve" },
    { t: "¿Acceso adecuado para PCD?", d: "Rampas y medidas de accesibilidad.", g: "muygrave" }
  ],
  form4: [
    { t: "¿Muros de color claro?", d: "Reduce absorción de calor.", g: "grave" },
    { t: "¿Techo de color claro?", d: "Disminuye carga térmica.", g: "grave" },
    { t: "¿Aislación térmica?", d: "Evita ganancia solar excesiva.", g: "grave" },
    { t: "¿Buena altura interior?", d: "Permite acumulación superior del aire caliente.", g: "medio" }
  ],
  form5: [
    { t: "¿Aleros / toldos / cortinas?", d: "Protección solar pasiva.", g: "medio" },
    { t: "¿Vegetación al norte?", d: "Sombra regulada.", g: "leve" },
    { t: "¿Vegetación al oeste?", d: "Evita radiación caliente de la tarde.", g: "leve" }
  ],
  form6: [
    { t: "¿Aberturas altas?", d: "Permiten salida del aire caliente.", g: "medio" },
    { t: "¿Tela mosquitera?", d: "Evita ingreso de insectos.", g: "leve" }
  ],
  form7: [
    { t: "¿Agua potable segura?", d: "Debe ser apta para consumo.", g: "muygrave" },
    { t: "¿Agua fresca disponible?", d: "Temperatura baja garantizada.", g: "grave" },
    { t: "¿Equipamiento de reposo?", d: "Sillas, reparo y sombra.", g: "medio" }
  ]
};

let respuestas = {};

/**********************************************************************
 * RENDERIZADO DE PREGUNTAS
 **********************************************************************/

function renderBlock(id) {
  const cont = document.getElementById(id);

  bloques[id].forEach((p, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="question">${p.t}</div>
      <div class="description">${p.d}</div>
      <div class="btn-group">
        <button class="si" onclick="seleccionar('${id}', ${i}, 'si', this)">SI</button>
        <button class="no ${p.g}" onclick="seleccionar('${id}', ${i}, 'no', this)">NO</button>
      </div>
    `;
    cont.appendChild(div);
  });
}

Object.keys(bloques).forEach(renderBlock);

/**********************************************************************
 * REGISTRO DE RESPUESTAS
 **********************************************************************/

function seleccionar(bloque, index, valor, boton) {
  respuestas[`${bloque}_${index}`] = valor;

  const grupo = boton.parentNode.querySelectorAll("button");
  grupo.forEach(b => b.classList.remove("selected"));

  boton.classList.add("selected");
}

/**********************************************************************
 * FUNCIÓN PRINCIPAL: CALCULAR RESULTADO FINAL
 **********************************************************************/

function calcular() {
  let muy = 0, gra = 0, med = 0, lev = 0;
  const resumenRespuestas = [];
  const prioridades = [];

  for (let key in respuestas) {
    const block = key.split("_")[0];
    const index = parseInt(key.split("_")[1]);
    const pregunta = bloques[block][index];
    const respuesta = respuestas[key];
    const gravedad = pregunta.g;

    if (respuesta === "no") {
      if (gravedad === "muygrave") muy++;
      if (gravedad === "grave") gra++;
      if (gravedad === "medio") med++;
      if (gravedad === "leve") lev++;
    }

    let emoji = "";
    if (respuesta === "no") {
      if (gravedad === "muygrave") emoji = "🚨";
      if (gravedad === "grave") emoji = "🔴";
      if (gravedad === "medio") emoji = "🟠";
      if (gravedad === "leve") emoji = "🟡";
    }

    const textoRespuesta = `
      <p><strong>${pregunta.t}</strong><br>
      Respuesta: ${respuesta.toUpperCase()}
      ${respuesta === "no" ? ` – ${gravedad.toUpperCase()} ${emoji}` : ""}
      <br><small>${pregunta.d}</small></p>
    `;

    resumenRespuestas.push({ block, html: textoRespuesta });

    if (respuesta === "no") {
      prioridades.push({
        gravedad,
        emoji,
        texto: `${pregunta.t} — ${gravedad.toUpperCase()} ${emoji}`
      });
    }
  }

  let estado = "";
  if (muy >= 1 || gra >= 3 || med >= 5 || lev >= 7)
    estado = "🔴 ROJO – Condiciones críticas";
  else if (muy === 0 && gra <= 1 && med <= 2 && lev <= 3)
    estado = "🟢 VERDE – Buen funcionamiento";
  else
    estado = "🟡 AMARILLO – Requiere mejoras";

  const m2 = parseFloat(document.getElementById("m2").value) || 0;
  const capacidad = Math.floor(m2 / 3.5);

  const orden = { muygrave: 1, grave: 2, medio: 3, leve: 4 };
  prioridades.sort((a, b) => orden[a.gravedad] - orden[b.gravedad]);

  let htmlFinal = `
    <h2>${estado}</h2>
    <p><strong>Capacidad permitida:</strong> ${capacidad} personas</p>
    <p><strong>Área total:</strong> ${m2} m²</p>
    <hr>
    <h3>Datos generales</h3>
    <p><strong>Punto:</strong> ${document.getElementById("nombre").value}</p>
    <p><strong>Responsable:</strong> ${document.getElementById("persona").value}</p>
    <p><strong>Días:</strong> ${document.getElementById("dias").value}</p>
    <p><strong>Horarios:</strong> ${document.getElementById("horarios").value}</p>
    <hr>
    <h3>Medidas urgentes</h3>
  `;

  if (prioridades.length === 0) {
    htmlFinal += `<p>No hay medidas urgentes.</p>`;
  } else {
    prioridades.forEach(p => {
      htmlFinal += `<p>• ${p.texto}</p>`;
    });
  }

  htmlFinal += `<hr><h3>Respuestas por bloque</h3>`;

  const nombresBloques = {
    form2: "Bloque 2 – Confort térmico",
    form3: "Bloque 3 – Accesibilidad y orientación",
    form4: "Bloque 4 – Envolvente térmica",
    form5: "Bloque 5 – Protecciones pasivas",
    form6: "Bloque 6 – Condiciones internas",
    form7: "Bloque 7 – Servicios"
  };

  Object.keys(bloques).forEach(id => {
    htmlFinal += `<h4>${nombresBloques[id]}</h4>`;
    resumenRespuestas
      .filter(r => r.block === id)
      .forEach(r => htmlFinal += r.html);
    htmlFinal += `<hr>`;
  });

  document.getElementById("resultado").innerHTML = htmlFinal;

  nextStep();
}

/**********************************************************************
 * GENERAR PDF
 **********************************************************************/

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
            line-height: 1.6;
          }
          h2 { margin-top: 0; }
          h3 {
            margin-top: 30px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 6px;
          }
          h4 {
            margin-top: 20px;
            color: #444;
          }
          p { margin: 8px 0; }
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
