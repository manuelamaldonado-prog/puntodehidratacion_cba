
let currentStep = 1;
function nextStep(){ document.getElementById("step"+currentStep).classList.remove("active"); currentStep++; document.getElementById("step"+currentStep).classList.add("active"); }
function prevStep(){ document.getElementById("step"+currentStep).classList.remove("active"); currentStep--; document.getElementById("step"+currentStep).classList.add("active"); }

document.getElementById("m2").addEventListener("input", ()=>{
 let m2 = parseFloat(document.getElementById("m2").value)||0;
 let cap = Math.floor(m2/3.5);
 document.getElementById("capacidadTexto").innerText = "Capacidad calculada: "+cap+" personas";
});

const preguntas=[
{t:"¿Posee Temperatura Interior Estable dentro del recinto?",d:"Entre 25-28°C y humedad 50-60%",g:"muygrave"},
{t:"¿Posee ventilación natural cruzada?",d:"3 a 6 renovaciones por hora",g:"muygrave"},
{t:"¿Posee sistema de aire acondicionado?",d:"Debe estar en 24°C",g:"grave"},
];

let respuestas=Array(preguntas.length).fill(null);
const cont=document.getElementById("formulario");

preguntas.forEach((p,i)=>{
 let div=document.createElement("div");
 div.innerHTML=`
  <div class='question'>${p.t}</div>
  <div class='description'>${p.d}</div>
  <div class='btn-group'>
    <button class='si' onclick="seleccionar(${i},'si',this)">SI</button>
    <button class='no ${p.g}' onclick="seleccionar(${i},'no',this)">NO</button>
  </div>
 `;
 cont.appendChild(div);
});

function seleccionar(i,val,btn){
 respuestas[i]=val;
 btn.classList.add("selected");
 let siblings=btn.parentNode.querySelectorAll("button");
 siblings.forEach(b=>{ if(b!==btn) b.classList.remove("selected"); });
}

function calcular(){
 let muy=0,gra=0,med=0,lev=0;
 respuestas.forEach((r,i)=>{
  if(r==="no"){
    let g=preguntas[i].g;
    if(g==="muygrave") muy++;
    if(g==="grave") gra++;
    if(g==="medio") med++;
    if(g==="leve") lev++;
  }
 });
 let estado="";
 if(muy>=1||gra>=3||med>=5||lev>=7) estado="ROJO";
 else if(muy===0&&gra<=1&&med<=2&&lev<=3) estado="VERDE";
 else estado="AMARILLO";

 document.getElementById("resultado").innerText=estado;

 // SEND TO SHEETS
 fetch("https://script.google.com/macros/s/AKfycbwcHYLpLAtWFro4U0G3sWRDJAqY0kA61pS5ZKL3CdfsCTwXBc8yLjJ9TsGsOBY5uwJ_/exec",{
  method:"POST",
  body:JSON.stringify({
    nombre:document.getElementById("nombre").value,
    persona:document.getElementById("persona").value,
    dias:document.getElementById("dias").value,
    horarios:document.getElementById("horarios").value,
    m2:document.getElementById("m2").value,
    capacidad:Math.floor((parseFloat(document.getElementById("m2").value)||0)/3.5),
    estado,respuestas,
    muygrave:muy,grave:gra,medio:med,leve:lev
  }),
  headers:{"Content-Type":"application/json"}
 });

 nextStep();
}
