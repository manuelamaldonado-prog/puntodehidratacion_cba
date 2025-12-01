
let currentStep=1;
function showStep(n){
 document.querySelectorAll('.step').forEach(s=>s.classList.remove('active'));
 document.getElementById('step'+n).classList.add('active');
}
function nextStep(){ currentStep++; showStep(currentStep); }
function prevStep(){ currentStep--; showStep(currentStep); }

document.getElementById("m2").addEventListener("input", ()=>{
 let m2=parseFloat(document.getElementById("m2").value)||0;
 let cap=Math.floor(m2/3.5);
 document.getElementById("capacidadTexto").innerText="Capacidad: "+cap+" personas";
});

const bloques = {
  form2: [
    {t:"¿Temperatura interior estable?",d:"Entre 25-28°C",g:"muygrave"},
    {t:"¿Ventilación cruzada?",d:"3-6 renovaciones/h",g:"muygrave"},
    {t:"¿Aire acondicionado?",d:"Debe estar a 24°C",g:"grave"},
    {t:"¿Ventiladores?",d:"Suficientes para el espacio",g:"medio"},
  ],
  form3: [
    {t:"¿Orientación norte?",d:"Aprovecha radiación invernal",g:"medio"},
    {t:"¿Pocas aberturas al oeste?",d:"Evita sobrecalentamiento",g:"leve"},
    {t:"¿Accesibilidad PCD?",d:"Rampas/tipos de acceso",g:"muygrave"}
  ],
  form4: [
    {t:"Mampostería color claro",d:"Reduce absorción térmica",g:"grave"},
    {t:"Techo color claro",d:"Reduce carga térmica",g:"grave"},
    {t:"Aislación térmica",d:"Evita ganancia de calor",g:"grave"},
    {t:"Altura o planta superior",d:"Mejora confort",g:"medio"}
  ],
  form5: [
    {t:"Aleros/toldos/cortinas",d:"Protección solar",g:"medio"},
    {t:"Vegetación norte",d:"Sombra regulada",g:"leve"},
    {t:"Vegetación oeste",d:"Evita sol caliente",g:"leve"}
  ],
  form6: [
    {t:"Aberturas altas",d:"Salida del aire caliente",g:"medio"},
    {t:"Tela mosquitera",d:"Evita insectos",g:"leve"}
  ],
  form7: [
    {t:"Agua potable",d:"Debe ser segura",g:"muygrave"},
    {t:"Agua fresca",d:"Debe mantenerse fría",g:"grave"},
    {t:"Equipamiento de reposo",d:"Debe ser adecuado",g:"medio"}
  ]
};

let respuestas={};

function renderBlock(id){
 let cont=document.getElementById(id);
 bloques[id].forEach((p,i)=>{
   let div=document.createElement("div");
   div.innerHTML=`
   <div class='question'>${p.t}</div>
   <div class='description'>${p.d}</div>
   <div class='btn-group'>
     <button class='si' onclick="seleccionar('${id}',${i},'si',this)">SI</button>
     <button class='no ${p.g}' onclick="seleccionar('${id}',${i},'no',this)">NO</button>
   </div>`;
   cont.appendChild(div);
 });
}

Object.keys(bloques).forEach(renderBlock);

function seleccionar(bloque,i,val,btn){
 respuestas[bloque+"_"+i]=val;
 btn.classList.add("selected");
 let siblings=btn.parentNode.querySelectorAll("button");
 siblings.forEach(b=>{ if(b!==btn) b.classList.remove("selected"); });
}

function calcular(){
 let muy=0,gra=0,med=0,lev=0;

 for(let key in respuestas){
   if(respuestas[key]==="no"){
     let block=key.split("_")[0];
     let index=parseInt(key.split("_")[1]);
     let grav=bloques[block][index].g;
     if(grav==="muygrave")muy++;
     if(grav==="grave")gra++;
     if(grav==="medio")med++;
     if(grav==="leve")lev++;
   }
 }

 let estado="";
 if(muy>=1||gra>=3||med>=5||lev>=7) estado="🔴 ROJO";
 else if(muy===0&&gra<=1&&med<=2&&lev<=3) estado="🟢 VERDE";
 else estado="🟡 AMARILLO";

 document.getElementById("resultado").innerText=estado;

 let m2=parseFloat(document.getElementById("m2").value)||0;
 let cap=Math.floor(m2/3.5);

 fetch("https://script.google.com/macros/s/AKfycbwcHYLpLAtWFro4U0G3sWRDJAqY0kA61pS5ZKL3CdfsCTwXBc8yLjJ9TsGsOBY5uwJ_/exec",{
   method:"POST",
   body:JSON.stringify({
     nombre:document.getElementById("nombre").value,
     persona:document.getElementById("persona").value,
     dias:document.getElementById("dias").value,
     horarios:document.getElementById("horarios").value,
     m2,capacidad:cap,
     estado,respuestas,
     muygrave:muy,grave:gra,medio:med,leve:lev
   }),
   headers:{"Content-Type":"application/json"}
 });

 nextStep();
}
