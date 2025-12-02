function calcular() {
  let muy = 0, gra = 0, med = 0, lev = 0;

  // Recopilamos todas las respuestas
  let resumenRespuestas = [];
  let prioridades = [];

  for (let key in respuestas) {
    let block = key.split("_")[0];
    let index = parseInt(key.split("_")[1]);
    let pregunta = bloques[block][index];

    let respuesta = respuestas[key];
    let gravedad = pregunta.g;

    // Contador
    if (respuesta === "no") {
      if (gravedad === "muygrave") muy++;
      if (gravedad === "grave") gra++;
      if (gravedad === "medio") med++;
      if (gravedad === "leve") lev++;
    }

    // Emoji según gravedad
    let emoji = "";
    if (respuesta === "si") emoji = "";
    else {
      if (gravedad === "muygrave") emoji = "🚨";
      if (gravedad === "grave") emoji = "🔴";
      if (gravedad === "medio") emoji = "🟠";
      if (gravedad === "leve") emoji = "🟡";
    }

    // Texto visible de respuesta
    let textoRespuesta = `
      <p><strong>${pregunta.t}</strong><br>
      Respuesta: ${respuesta.toUpperCase()} 
      ${respuesta === "no" ? `– ${gravedad.toUpperCase()} ${emoji}` : ""}
      <br><small>${pregunta.d}</small></p>
    `;

    resumenRespuestas.push({ block, html: textoRespuesta });

    // Para la sección "Medidas urgentes"
    if (respuesta === "no") {
      prioridades.push({
        gravedad,
        emoji,
        texto: `${pregunta.t} — ${gravedad.toUpperCase()} ${emoji}`
      });
    }
  }

  // Determinar estado general
  let estado = "";
  if (muy >= 1 || gra >= 3 || med >= 5 || lev >= 7)
    estado = "🔴 ROJO – Condiciones críticas";
  else if (muy === 0 && gra <= 1 && med <= 2 && lev <= 3)
    estado = "🟢 VERDE – Buen funcionamiento";
  else
    estado = "🟡 AMARILLO – Requiere mejoras";

  // Cálculo de capacidad
  let m2 = parseFloat(document.getElementById("m2").value) || 0;
  let capacidad = Math.floor(m2 / 3.5);

  // Ordenar las prioridades (muygrave → grave → medio → leve)
  const orden = { muygrave: 1, grave: 2, medio: 3, leve: 4 };
  prioridades.sort((a, b) => orden[a.gravedad] - orden[b.gravedad]);

  // Generar HTML final por bloques
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

  // Separar por bloques con títulos
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

  // Insertar todo en pantalla
  document.getElementById("resultado").innerHTML = htmlFinal;

  // Enviar a GSheets
  fetch(
    "https://script.google.com/macros/s/AKfycbwcHYLpLAtWFro4U0G3sWRDJAqY0kA61pS5ZKL3CdfsCTwXBc8yLjJ9TsGsOBY5uwJ_/exec",
    {
      method: "POST",
      body: JSON.stringify({
        nombre: document.getElementById("nombre").value,
        persona: document.getElementById("persona").value,
        dias: document.getElementById("dias").value,
        horarios: document.getElementById("horarios").value,
        m2,
        capacidad,
        estado,
        respuestas,
        muygrave: muy,
        grave: gra,
        medio: med,
        leve: lev
      }),
      headers: { "Content-Type": "application/json" }
    }
  );

  nextStep();
}

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
          h2 {
            margin-top: 0;
          }
          h3 {
            margin-top: 25px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 4px;
          }
          h4 {
            margin-top: 20px;
            color: #444;
          }
          p {
            margin: 6px 0;
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
