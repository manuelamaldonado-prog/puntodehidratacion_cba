
const preguntas = [
{ texto:"¿Posee una Temperatura Interior Estable dentro del recinto?", descripcion:"Se necesita entre 25°C y 28°C y humedad 50–60%.", gravedad:"muygrave" },
{ texto:"¿Posee Ventilación Natural Cruzada dentro del recinto?", descripcion:"Ventilación natural recomendada.", gravedad:"muygrave" },
{ texto:"¿Posee Sistema de Aire Acondicionado?", descripcion:"Debe poseer aire acondicionado regulado.", gravedad:"grave" },
{ texto:"¿Posee Ventiladores?", descripcion:"Debe poseer ventilación artificial.", gravedad:"medio" },
{ texto:"¿El espacio está preparado para una futura instalación de Energía Renovable?", gravedad:"leve", descripcion:"Debe estar preparado para sistemas renovables." },
{ texto:"¿La Orientación de la fachada es hacia el norte?", gravedad:"medio", descripcion:"Fachada norte aprovecha radiación invernal." },
{ texto:"¿La menor cantidad de aberturas son hacia el Oeste?", gravedad:"leve", descripcion:"Evitar aberturas oeste por sol caliente." },
{ texto:"¿Posee accesibilidad para personas discapacitadas?", gravedad:"muygrave", descripcion:"Debe poseer rampas o ascensores." },
{ texto:"¿La mampostería está pintada de color claro?", gravedad:"grave", descripcion:"Reduce ganancia solar." },
{ texto:"¿El techo está pintado de color claro?", gravedad:"grave", descripcion:"Reduce carga térmica." },
{ texto:"¿El recinto tiene techo alto o planta superior?", gravedad:"medio", descripcion:"Reduce calor." },
{ texto:"¿El techo posee aislación térmica?", gravedad:"grave", descripcion:"Aislante reduce ganancia térmica." },
{ texto:"¿Cuenta con aleros/toldos/cortinas?", gravedad:"medio", descripcion:"Control solar pasivo." },
{ texto:"¿Posee vegetación al Norte?", gravedad:"leve", descripcion:"Sombra vegetal regulada." },
{ texto:"¿Posee vegetación al Oeste?", gravedad:"leve", descripcion:"Evita sol caliente." },
{ texto:"¿Posee aberturas altas?", gravedad:"medio", descripcion:"Favorece salida de aire caliente." },
{ texto:"¿Cuenta con tela mosquitera?", gravedad:"leve", descripcion:"Evita insectos." },
{ texto:"¿Hay agua potable disponible?", gravedad:"muygrave", descripcion:"Debe proveer agua potable." },
{ texto:"¿El agua potable es fresca?", gravedad:"grave", descripcion:"Debe mantenerse fresca." },
{ texto:"¿Hay equipamiento de reposo?", gravedad:"medio", descripcion:"Debe haber reposo seguro." }
];

const cont = document.getElementById("formulario");
let respuestas = Array(preguntas.length).fill(null);

preguntas.forEach((p,i)=>{
 let b=document.createElement("div");
 b.innerHTML = `
 <div class='question'>${p.texto}</div>
 <div class='description'>${p.descripcion}</div>
 <div class='btn-group'>
   <button class='si' onclick="respuesta(${i},'si')">SI</button>
   <button class='no ${p.gravedad}' onclick="respuesta(${i},'no')">NO</button>
 </div>`;
 cont.appendChild(b);
});

function respuesta(i,v){ respuestas[i]=v; }

document.getElementById("calcular").addEventListener("click", ()=>{
 let muy=0, gra=0, med=0, lev=0;
 respuestas.forEach((r,i)=>{
   if(r==="no"){
     let g=preguntas[i].gravedad;
     if(g==="muygrave") muy++;
     else if(g==="grave") gra++;
     else if(g==="medio") med++;
     else if(g==="leve") lev++;
   }
 });
 let estado="";

 if(muy>=1 || gra>=3 || med>=5 || lev>=7){
   estado="🔴 ROJO";
 }
 else if(muy===0 && gra<=1 && med<=2 && lev<=3){
   estado="🟢 VERDE";
 }
 else {
   estado="🟡 AMARILLO";
 }

 document.getElementById("resultado").innerHTML = estado;

 fetch("https://script.google.com/macros/s/AKfycbwcHYLpLAtWFro4U0G3sWRDJAqY0kA61pS5ZKL3CdfsCTwXBc8yLjJ9TsGsOBY5uwJ_/exec", {
   method:"POST",
   body:JSON.stringify({ estado,respuestas,muygrave:muy,grave:gra,medio:med,leve:lev }),
   headers:{"Content-Type":"application/json"}
 });
});
