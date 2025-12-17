function descargarPDF() {
  const contenido = document.getElementById("resultado").innerHTML;

  const ventana = window.open("", "_blank");
  ventana.document.write(`
    <html>
    <head>
      <title>Informe Área Climatizada</title>
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
    <body>${contenido}</body>
    </html>
  `);

  ventana.document.close();
  ventana.print();
}
