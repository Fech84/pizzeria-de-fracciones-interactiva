/* Pizzería de fracciones · versión interactiva 3.0.
   Sitio estático, sin bibliotecas externas, sin servidor y sin recolección de datos. */
'use strict';
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = 'franciscos_pizzeria_interactiva_v3';
const AUDIO_SETTING_KEY = 'franciscos_pizzeria_audio_v1';
const esc = (v) => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = (n) => '$' + Number(n).toLocaleString('es-CO');
const ranks = ['Aprendiz','Pizzero','Especialista','Maestro'];
const SHORT_GOALS = [
  'Representa fracciones seleccionando porciones de pizza.',
  'Llena vasos y compara cantidades de bebida.',
  'Calcula los ingredientes que necesitan varias pizzas.',
  'Reparte cuentas y calcula propinas y descuentos.',
  '¡Demuestra todo lo aprendido en el gran banquete!'
];
const GUIDE_MESSAGES = [
  '¡Toca las porciones que pide el cliente! Tú puedes.',
  '¡Sirvamos cada bebida con la medida correcta!',
  '¡Prepara los ingredientes! Cuenta las partes de taza.',
  '¡Hora de cobrar! Lee con calma cada recibo.',
  '¡Llegó el reto VIP! ¡Vamos por la estrella final!'
];

const LEVELS = [
  {
    icon:'🍕',title:'Nivel 1 · Pedidos de pizza',short:'Porciones',guide:'Pi-zzaman',seconds:300,
    competency:'Representar fracciones gráficamente y relacionar numerador y denominador en situaciones de porciones de pizza.',
    resource:'Pizza 2D interactiva: cada clic selecciona o retira una porción igual. El estudiante construye la fracción solicitada.',
    story:'Francisco’s acaba de abrir. Varios clientes piden pizzas con cantidades exactas de porciones. ¡Pi-zzaman necesita un ayudante que pueda construir cada pedido!',
    reward:'🧤 Guantes Deluxe: dos intentos adicionales en el primer pedido del Nivel 2.',
    example:'Si una pizza tiene 4 partes iguales y se piden 3, debes seleccionar 3 porciones: 3/4. En el numerador va lo elegido y en el denominador, el total.',
    practice:[
      {q:'Seleccionas 2 porciones de una pizza de 4. ¿Qué fracción preparaste?',opts:['4/2','2/4','2/2'],correct:1,why:'Dos porciones seleccionadas entre cuatro equivalen a 2/4 o 1/2.'},
      {q:'¿Qué significa el denominador de 5/8?',opts:['5 porciones tomadas','8 partes iguales en total','8 pizzas'],correct:1,why:'El 8 señala cuántas partes iguales componen la pizza completa.'}
    ],
    tasks:[
      {type:'pizza',parts:4,target:3,prompt:'Pedido de Ana: «Quiero <b>3/4</b> de una pizza». Toca exactamente las porciones que debes servir.',math:'3 de 4 porciones',why:'Seleccionaste 3 porciones de una pizza dividida en 4: la fracción es 3/4.',hints:['La pizza tiene cuatro partes iguales.','Selecciona tantas partes como indique el número de arriba: 3.','Deben quedar tres porciones marcadas y una sin marcar.']},
      {type:'pizza',parts:8,target:5,prompt:'Pedido familiar: «Necesitamos <b>5/8</b> de pizza». Marca las porciones que se deben empacar.',math:'5 de 8 porciones',why:'5/8 expresa cinco partes elegidas de ocho partes iguales.',hints:['Fíjate en las ocho divisiones.','El numerador es 5: indica las porciones pedidas.','Selecciona cinco triángulos de pizza.']},
      {type:'pizza',parts:6,target:2,prompt:'Pedido pequeño: «Sirve <b>2/6</b> de pizza». Prepara la cantidad exacta.',math:'2 de 6 porciones = 1/3',why:'2/6 son dos de seis porciones; también representan 1/3 de la pizza.',hints:['Cuenta las seis divisiones.','Solo se sirven dos partes.','2/6 equivale a 1/3 del total.']},
      {type:'pizza',parts:8,target:4,prompt:'Reto de equivalencia: la pizza tiene 8 porciones. Un cliente quiere exactamente <b>la mitad (1/2)</b>. ¿Cuántas debes seleccionar?',math:'4/8 = 1/2',why:'La mitad de ocho porciones son cuatro: 4/8 = 1/2.',hints:['La mitad significa repartir en dos grupos iguales.','Divide ocho entre dos.','Marca cuatro de las ocho porciones.']}
    ]
  },
  {
    icon:'🥤',title:'Nivel 2 · Las bebidas',short:'Bebidas',guide:'Pi-zzagirl',seconds:180,
    competency:'Interpretar fracciones como medidas de capacidad; comparar cantidades y reconocer equivalencias de fracciones.',
    resource:'Dispensador virtual con vaso dividido en partes iguales, controles táctiles y comparación visual entre dos vasos.',
    story:'¡Llegó mucha gente a Francisco’s! Pi-zzagirl prepara bebidas. Ayúdala a servir la cantidad justa y a comparar los vasos para evitar desperdicios.',
    reward:'🔔 Alarma «pizza correcta»: dos comprobaciones sin penalización para los pedidos finales.',
    example:'En un vaso marcado con cinco secciones iguales, llenar tres secciones significa 3/5. Si otro vaso tiene 2/5, el primero tiene más porque 3 es mayor que 2.',
    practice:[
      {q:'Un vaso tiene 5 secciones y 4 están llenas. ¿Qué fracción contiene?',opts:['1/5','4/5','5/4'],correct:1,why:'Cuatro de cinco secciones llenas representan 4/5.'},
      {q:'¿Cuál es mayor, 2/5 o 4/5?',opts:['2/5','4/5','Son iguales'],correct:1,why:'Con igual denominador, es mayor la fracción con más partes llenas.'}
    ],
    tasks:[
      {type:'glass',parts:5,target:3,prompt:'Llena el vaso hasta <b>3/5</b> de su capacidad. Toca el vaso o mueve el control.',math:'3/5 del vaso',why:'Serviste tres de cinco partes de capacidad: 3/5.',hints:['El vaso está dividido en cinco tramos iguales.','Tres es la cantidad de tramos que deben quedar llenos.','Deja dos tramos vacíos.']},
      {type:'glass',parts:6,target:4,prompt:'Un cliente quiere <b>4/6</b> de su vaso de jugo. Ajusta el dispensador.',math:'4/6 = 2/3',why:'Serviste 4/6; si divides numerador y denominador entre dos, obtienes 2/3.',hints:['El 6 indica el total de secciones.','Llena cuatro secciones desde la base del vaso.','4/6 equivale a 2/3.']},
      {type:'glass',parts:5,target:4,reference:{parts:5,filled:2},prompt:'Pi-zzagirl te muestra un vaso B con <b>2/5</b>. Sirve <b>4/5</b> en el vaso A para compararlos.',math:'4/5 > 2/5',why:'El vaso A tiene 4/5 y el B tiene 2/5. A contiene más porque 4 es mayor que 2.',hints:['Ambos vasos tienen cinco divisiones.','En el vaso B hay dos partes llenas.','El vaso A debe tener cuatro partes llenas.']},
      {type:'glass',parts:8,target:4,reference:{parts:2,filled:1},prompt:'¡Equivalencia! El vaso B está a <b>1/2</b>. Llena el vaso A, dividido en ocho, hasta la <b>misma cantidad</b>.',math:'4/8 = 1/2',why:'Cuatro de ocho divisiones son la mitad del vaso: 4/8 = 1/2.',hints:['El vaso B está lleno hasta la mitad.','La mitad de ocho divisiones son cuatro.','Marca 4/8 en A para igualar 1/2 en B.']}
    ]
  },
  {
    icon:'🧀',title:'Nivel 3 · Pedidos especiales',short:'Recetas',guide:'Profesor y Pi-zzaman',seconds:300,
    competency:'Utilizar fracciones como operadores y multiplicar números naturales por fracciones en recetas de varias pizzas.',
    resource:'Mesa de preparación 2D con contador de ingredientes y medidas en fracciones de taza. Permite experimentar con la cantidad calculada.',
    story:'¡Una familia pidió varias pizzas iguales! El profesor de la cocina dejó recetas exactas. Pi-zzaman debe multiplicar correctamente los ingredientes para servir a todos.',
    reward:'🧮 Calculadora-comodín: dos ayudas para revisar operaciones de la caja.',
    example:'Para dos pizzas con 3/4 de taza de queso cada una se necesitan 2 × 3/4 = 6/4 = 1 y 1/2 tazas. Cada pulsación del contador representa 1/4 de taza.',
    practice:[
      {q:'Cada pizza usa 1/2 taza de salsa. Para 2 pizzas, ¿cuál es el total?',opts:['1 taza','1/4 de taza','2 tazas'],correct:0,why:'Dos mitades forman una taza completa: 2 × 1/2 = 1.'},
      {q:'Tres pizzas necesitan 2/3 de taza cada una. ¿Cuánto es en total?',opts:['2/9 de taza','2 tazas','3 tazas'],correct:1,why:'3 × 2/3 = 6/3 = 2 tazas.'}
    ],
    tasks:[
      {type:'recipe',ingredient:'🧀',ingredientName:'queso',pizzas:2,num:3,den:4,target:6,prompt:'Cada pizza lleva <b>3/4 de taza de queso</b>. Prepara <b>2 pizzas</b>. Añade al medidor la cantidad total.',math:'2 × 3/4 = 6/4 = 1 1/2 tazas',why:'Al repetir 3/4 dos veces obtienes 6/4, que equivale a una taza y media.',hints:['Se necesitan dos veces tres cuartos.','Cuenta cuartos de taza, no tazas completas.','2 × 3 = 6: suma seis cuartos de taza.']},
      {type:'recipe',ingredient:'🍅',ingredientName:'salsa',pizzas:3,num:2,den:3,target:6,prompt:'La receta usa <b>2/3 de taza de salsa</b> por pizza. Sirve para <b>3 pizzas</b>. Ajusta el medidor.',math:'3 × 2/3 = 6/3 = 2 tazas',why:'Tres grupos de dos tercios equivalen a seis tercios, o dos tazas.',hints:['Son tres pizzas iguales.','Necesitas 2/3 tres veces.','Coloca seis tercios en total.']},
      {type:'recipe',ingredient:'🍄',ingredientName:'champiñones',pizzas:4,num:1,den:2,target:4,prompt:'Cada pizza necesita <b>1/2 taza de champiñones</b>. Para <b>4 pizzas</b>, ¿qué cantidad necesitas?',math:'4 × 1/2 = 4/2 = 2 tazas',why:'Cuatro medias tazas suman dos tazas completas.',hints:['Media taza se repite cuatro veces.','La unidad del contador es media taza.','Añade cuatro medias tazas.']},
      {type:'recipe',ingredient:'🥦',ingredientName:'vegetales',pizzas:5,num:3,den:5,target:15,prompt:'Cada pizza lleva <b>3/5 de taza de vegetales</b>. Hay un pedido de <b>5 pizzas</b>. ¿Cuánto prepararás?',math:'5 × 3/5 = 15/5 = 3 tazas',why:'Cinco grupos de tres quintos equivalen a quince quintos, es decir, tres tazas.',hints:['Calcula cinco veces tres quintos.','Cada clic representa un quinto de taza.','5 × 3 = 15 quintos de taza.']}
    ]
  },
  {
    icon:'🧾',title:'Nivel 4 · Cajero',short:'Caja',guide:'Profesor',seconds:240,
    competency:'Aplicar fracciones como cociente y operador para repartir cuentas, calcular propinas y aplicar descuentos.',
    resource:'Caja registradora interactiva con teclado numérico, recibos y problemas reales de reparto y porcentajes fraccionarios.',
    story:'La jornada termina, pero hay cuentas por cobrar. El profesor necesita que revises propinas, descuentos y pagos compartidos. ¡Francisco’s cuenta contigo!',
    reward:'🏆 Ascenso a Maestro de Francisco’s. Se abre una misión final integradora y el reconocimiento.',
    example:'Si cuatro personas pagan una cuenta de $60.000 en partes iguales, cada una paga 60.000 ÷ 4 = $15.000. Puedes escribir 15000 o 15.000 en la caja.',
    practice:[
      {q:'Una cuenta de $40.000 se divide entre cuatro. ¿Cuánto paga cada persona?',opts:['$10.000','$20.000','$4.000'],correct:0,why:'40.000 ÷ 4 = 10.000 pesos por persona.'},
      {q:'¿Cuánto es 1/10 de una cuenta de $50.000?',opts:['$500','$5.000','$10.000'],correct:1,why:'50.000 ÷ 10 = 5.000 pesos.'}
    ],
    tasks:[
      {type:'cash',total:60000,operation:'Cuenta compartida',detail:'4 amigos / partes iguales',target:15000,prompt:'Cuatro amigos comparten una cuenta de <b>$60.000</b>. ¿Cuántos pesos paga <b>cada persona</b>?',math:'60.000 ÷ 4 = 15.000',why:'Cuatro pagos iguales de $15.000 suman $60.000.',hints:['Hay que dividir el total entre las cuatro personas.','Calcula 60.000 ÷ 4.','Cada persona aporta $15.000.']},
      {type:'cash',total:80000,operation:'Propina',detail:'Propina de 1/10',target:8000,prompt:'Una mesa paga <b>$80.000</b> y deja una propina de <b>1/10</b>. ¿Cuánto corresponde de propina?',math:'80.000 × 1/10 = 8.000',why:'Una décima parte se obtiene dividiendo el total entre diez: $8.000.',hints:['Una décima parte significa dividir entre diez.','Haz 80.000 ÷ 10.','La propina es de $8.000.']},
      {type:'cash',total:100000,operation:'Descuento',detail:'Descuento equivalente a 1/5',target:20000,prompt:'Una familia compra <b>$100.000</b> y gana un descuento de <b>1/5</b>. ¿Cuánto dinero se <b>descuenta</b>?',math:'100.000 × 1/5 = 20.000',why:'Una quinta parte de $100.000 son $20.000 de descuento.',hints:['Se pide el valor descontado, no el valor a pagar.','Divide 100.000 entre cinco.','El descuento es de $20.000.']},
      {type:'cash',total:90000,operation:'Total a pagar',detail:'Descuento de 1/3',target:60000,prompt:'Un pedido vale <b>$90.000</b> y recibe un descuento de <b>1/3</b>. ¿Cuánto debe pagar al final?',math:'90.000 − (90.000 × 1/3) = 60.000',why:'El descuento es $30.000. El total a pagar es $90.000 − $30.000 = $60.000.',hints:['Primero calcula una tercera parte de 90.000.','El descuento es 30.000; después réstalo del precio.','El pago final es de $60.000.']}
    ]
  }
];

const VIP = {
  icon:'🌟',title:'Misión VIP · El gran banquete',short:'Misión VIP',guide:'Todo el equipo',seconds:0,
  competency:'Integrar representación, equivalencia, operaciones y reparto con fracciones en una situación completa de la pizzería.',
  resource:'Circuito de retos interactivos: pizza, vaso, medidor de recetas y caja registradora, con un informe final de evidencias.',
  story:'¡Una crítica gastronómica llega de incógnito a Francisco’s! Para ganar la estrella final, el equipo deberá resolver un banquete completo: entrada, bebida, receta y cuenta.',
  reward:'⭐ Estrella de Francisco’s y certificado de Maestro Pizzero.',
  example:'Las fracciones aparecen en distintas situaciones: porciones de pizza, cantidades de bebida, ingredientes de recetas y distribución de dinero.',
  practice:LEVELS[3].practice,
  tasks:[
    {type:'pizza',parts:8,target:6,prompt:'La crítica pide <b>3/4 de pizza</b>, pero la cocina la divide en ocho partes iguales. Marca la cantidad equivalente.',math:'6/8 = 3/4',why:'Tres cuartos equivalen a seis octavos: (3 × 2)/(4 × 2) = 6/8.',hints:['Debes transformar 3/4 a octavos.','Multiplica numerador y denominador por dos.','Selecciona seis de ocho porciones.']},
    {type:'glass',parts:6,target:3,reference:{parts:2,filled:1},prompt:'Sirve a la crítica una bebida equivalente a <b>1/2</b> en un vaso dividido en seis secciones.',math:'3/6 = 1/2',why:'Tres partes llenas de seis representan la mitad de la capacidad.',hints:['La cantidad pedida es la mitad.','Divide seis secciones entre dos.','Llena tres secciones.']},
    {type:'recipe',ingredient:'🧀',ingredientName:'queso premium',pizzas:3,num:2,den:3,target:6,prompt:'Para el banquete, cada pizza VIP lleva <b>2/3 de taza de queso</b>. Son <b>3 pizzas</b>. Ajusta el medidor.',math:'3 × 2/3 = 2 tazas',why:'Tres veces dos tercios equivalen a dos tazas completas.',hints:['Multiplica 3 × 2/3.','El contador marca tercios de taza.','Necesitas seis tercios, que son dos tazas.']},
    {type:'cash',total:120000,operation:'Cuenta VIP',detail:'Reparto entre 6 personas',target:20000,prompt:'La cuenta final es de <b>$120.000</b> y la comparten <b>6 personas</b>. ¿Cuánto paga cada una?',math:'120.000 ÷ 6 = 20.000',why:'Cada una de las seis personas aporta $20.000, que suman $120.000.',hints:['Reparte el total entre las seis personas.','Calcula 120.000 ÷ 6.','Cada persona paga $20.000.']}
  ]
};

const getLevel = () => state.stage === 4 ? VIP : LEVELS[state.stage];
const getTask = () => getLevel().tasks[state.task];
const maxAttempts = () => state.stage === 1 && state.task === 0 ? 5 : 3;
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const gcd = (a,b) => b ? gcd(b,a % b) : a;
const fractionText = (num,den) => {
  if(num === 0)return '0';
  const whole = Math.floor(num/den),rest = num % den;
  if(!rest)return String(whole);
  const div=gcd(rest,den),suffix=(rest/div)+'/'+(den/div);
  return whole ? whole+' '+suffix : suffix;
};
const getNewState = (player='',mode='reto') => ({
  version:3,player,mode,page:'play',stage:0,task:0,value:0,selected:[],
  mistakes:0,hintsTask:0,successes:0,errors:0,hints:0,courseUses:0,cards:0,
  alarm:0,calculator:0,seconds:LEVELS[0].seconds,timeEnded:false,
  feedback:null,awaitingNext:false,courseIndex:0,courseTries:0,decor:'clasica',
  completed:[],log:[],cardsByOrder:true,created:new Date().toISOString()
});

function loadState(){
  try{
    const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(!parsed || parsed.version!==3 || !Number.isInteger(parsed.stage) || parsed.stage<0 || parsed.stage>5 ||
       !Array.isArray(parsed.log) || !Array.isArray(parsed.completed) || !Array.isArray(parsed.selected))return null;
    if(!['play','landing','course','ending'].includes(parsed.page))return null;
    if(parsed.stage<5 && (!Number.isInteger(parsed.task) || parsed.task<0 || parsed.task>=(parsed.stage===4?VIP:LEVELS[parsed.stage]).tasks.length))return null;
    // Compatibilidad con partidas de la versión anterior: ahora cada pedido entrega una tarjeta.
    if(!parsed.cardsByOrder){parsed.cards=parsed.log.length;parsed.cardsByOrder=true;}
    return parsed;
  }catch(e){return null;}
}
let state = loadState();
let soundOn=true,volumePct=75,modalCallback=null,toastTimer=null,audioContext=null;
try{
  const prefs=JSON.parse(localStorage.getItem(AUDIO_SETTING_KEY));
  if(typeof prefs?.enabled==='boolean')soundOn=prefs.enabled;
  if(Number.isFinite(prefs?.volume))volumePct=clamp(prefs.volume,0,100);
}catch(e){}
const save = () => {try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){/* Navegación privada: el juego sigue funcionando. */}};
const saveAudio = () => {try{localStorage.setItem(AUDIO_SETTING_KEY,JSON.stringify({enabled:soundOn,volume:volumePct}));}catch(e){}};

function showToast(message){
  $('toast').textContent=message;$('toast').classList.remove('hidden');
  if(toastTimer)clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>$('toast').classList.add('hidden'),3200);
}
function playSound(type='correct'){
  if(!soundOn||volumePct<=0)return;
  try{
    const Context=window.AudioContext || window.webkitAudioContext;
    if(!Context)return;
    audioContext ||= new Context();
    if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
    const patterns={
      correct:[523.25,659.25],error:[247,196],hint:[440,554.37],
      level:[523.25,659.25,783.99,1046.5],victory:[523.25,659.25,783.99,1046.5,987.77,1318.51]
    };
    const notes=patterns[type]||patterns.correct;
    const duration=type==='victory'?.25:type==='level'?.23:.18;
    const spacing=duration+.035;
    const peak=(volumePct/100)*(type==='error'?.11:.21);
    notes.forEach((hz,i)=>{
      const start=audioContext.currentTime+i*spacing;
      const osc=audioContext.createOscillator(),gain=audioContext.createGain();
      osc.type=type==='error'?'sine':'triangle';osc.frequency.setValueAtTime(hz,start);
      gain.gain.setValueAtTime(.001,start);
      gain.gain.linearRampToValueAtTime(peak,start+.025);
      gain.gain.exponentialRampToValueAtTime(.001,start+duration);
      osc.connect(gain);gain.connect(audioContext.destination);
      osc.start(start);osc.stop(start+duration+.03);
    });
  }catch(e){/* Los efectos son opcionales. */}
}
function playNote(win=true){playSound(win?'correct':'error');}
function updateAudioUI(){
  $('audio-btn').textContent=soundOn?'🔊 Sonido':'🔇 Silenciado';
  $('audio-btn').setAttribute('aria-pressed',String(soundOn));
  $('volume-slider').value=String(volumePct);
  $('volume-readout').textContent=volumePct+'%';
}
function confetti(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const colors=['#f5c640','#dd423a','#62b44f','#49b7da','#e27ac4'];
  for(let i=0;i<33;i++){
    const el=document.createElement('span');el.className='burst';
    el.style.left=Math.random()*100+'vw';el.style.setProperty('--time',(2+Math.random()*2.5)+'s');
    el.style.setProperty('--piece',colors[i%colors.length]);document.body.append(el);
    setTimeout(()=>el.remove(),5000);
  }
}
function showModal({emoji='🍕',eyebrow='',title,description,details='',button='¡Vamos!',callback}){
  modalCallback=callback||null;
  $('modal-emoji').textContent=emoji;$('modal-eyebrow').textContent=eyebrow;
  $('modal-title').textContent=title;$('modal-description').textContent=description;
  $('modal-details').innerHTML=details;$('modal-details').classList.toggle('hidden',!details);
  $('modal-btn').textContent=button;$('overlay').classList.remove('hidden');$('modal-btn').focus();
}
function closeModal(){
  $('overlay').classList.add('hidden');const cb=modalCallback;modalCallback=null;
  if(typeof cb==='function')cb();
}
function showIntro(){
  const lvl=getLevel();
  showModal({emoji:lvl.icon,eyebrow:state.stage===4?'DESAFÍO INTEGRADOR':'COMIENZA UN NUEVO NIVEL',
    title:lvl.title,description:lvl.story,
    details:'<p><b>🎯 Tu misión:</b> '+esc(SHORT_GOALS[state.stage])+'</p><p><b>🎁 Al superarla:</b> '+esc(lvl.reward)+'</p>',
    button:'¡Entrar a la cocina!',callback:()=>{render();}
  });
}
function openLevelInfo(){
  if(!state || state.page!=='play')return;
  const lvl=getLevel(),names=['Integrante 1','Integrante 2','Integrante 3'],n=state.stage%3;
  showModal({emoji:'📚',eyebrow:'INFORMACIÓN PARA ESTUDIANTES Y DOCENTES',
    title:'Así aprendemos en '+lvl.short.toLowerCase(),description:'¡Pi-zzagirl te acompaña! Estos son los aprendizajes, herramientas y roles de la misión.',
    details:'<p><b>🎓 Aprendizaje:</b> '+esc(lvl.competency)+'</p><p><b>🧩 Recurso:</b> '+esc(lvl.resource)+'</p>'+
      '<p><b>👥 Roles para grupos de tres:</b><br>Chef: '+names[n]+' · Lector: '+names[(n+1)%3]+' · Verificador: '+names[(n+2)%3]+'. Los roles rotan al cambiar de nivel.</p>',
    button:'¡Seguir jugando!'
  });
}
function render(){
  const page=state?.page||'landing';
  $('landing').classList.toggle('hidden',page!=='landing');
  $('game').classList.toggle('hidden',page!=='play');
  $('course').classList.toggle('hidden',page!=='course');
  $('ending').classList.toggle('hidden',page!=='ending');
  $('home-btn').hidden=page==='landing';
  $('report-btn').disabled=!state || state.log.length===0;
  if(page==='landing'){renderLanding();return;}
  if(page==='play'){renderDashboard();renderTask();return;}
  if(page==='course'){renderCourse();return;}
  if(page==='ending'){renderEnding();}
}
function renderLanding(){
  $('resume-btn').hidden=!state;
  $('resume-btn').textContent=state?.stage===5?'🏆 Ver reconocimiento':'↪ Continuar partida';
  if(state){$('player-name').value=state.player||'';const mode=document.querySelector('input[name="mode"][value="'+state.mode+'"]');if(mode)mode.checked=true;}
}
function renderDashboard(){
  const lvl=getLevel(),finished=state.stage;
  $('stat-level').textContent=state.stage===4?'VIP':(state.stage+1)+' de 4';
  $('stat-rank').textContent=ranks[clamp(finished,0,3)];
  $('stat-cards').textContent=String(state.cards);
  $('stat-attempts').textContent=(maxAttempts()-state.mistakes)+' de '+maxAttempts();
  $('stat-time').textContent=state.mode==='tranquilo'||state.stage===4?'Sin límite':formatTime(state.seconds);
  $('player-chip').textContent='👩‍🍳 '+escName(state.player);
  const fraction=state.stage===4?100:Math.floor(((state.stage)+(state.task / lvl.tasks.length))/4*100);
  $('fame-fill').style.width=fraction+'%';$('fame-percent').textContent=fraction+'%';
  $('fame-track').setAttribute('aria-valuenow',fraction);
  $('inventory').innerHTML=[
    ['🧤 Guantes Deluxe','Guantes: '+(state.stage>0?'ganados (+2 intentos Nivel 2)':'bloqueados'),state.stage>0],
    ['🔔 Alarma','Alarma: '+state.alarm+' usos',state.alarm>0],
    ['🧮 Calculadora','Calculadora: '+state.calculator+' usos',state.calculator>0],
    ['🎴 Tarjetas','Tarjetas: '+state.cards,state.cards>0]
  ].map(x=>'<span class="'+(x[2]?'earned':'')+'" title="'+esc(x[1])+'">'+x[0]+' '+(x[2]?'✓':'🔒')+'</span>').join('');
  $('journey').innerHTML=[...LEVELS,VIP].map((l,i)=>{
    const done=i<state.stage,live=i===state.stage;
    return '<button type="button" disabled class="'+(done?'completed':live?'current':'')+'" aria-current="'+(live?'step':'false')+'">'+(done?'✓ ':live?'➤ ':'🔒 ')+l.icon+' '+esc(l.short)+'</button>';
  }).join('');
  $('competence-text').textContent=SHORT_GOALS[state.stage];
  const feedback=state.feedback;
  $('coach-name').textContent=feedback?.kind==='success'?'¡Muy bien, pizzero!':feedback?.kind==='error'?'¡Tú puedes!':feedback?.kind==='hint'?'¡Yo te ayudo!':'¡Vamos, pizzero!';
  $('coach-speech').textContent=feedback?.kind==='success'?'¡Excelente trabajo! Ganaste una tarjeta. ¡Vamos al siguiente pedido!':
    feedback?.kind==='error'?'No pasa nada. ¡Respira, observa y vuelve a intentarlo!':
    feedback?.kind==='hint'?'Mira la pista y prueba de nuevo. ¡Estoy contigo!':GUIDE_MESSAGES[state.stage];
}
function escName(name){return name?.trim()?name.trim():'Chef invitado';}
function formatTime(sec){const m=Math.floor(Math.max(sec,0)/60),s=Math.max(sec,0)%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}

function pizzaSVG(parts,selected){
  const cx=150,cy=150,r=114,delta=2*Math.PI/parts;
  let slices='';
  for(let i=0;i<parts;i++){
    const a=-Math.PI/2+i*delta,b=a+delta;
    const x1=cx+r*Math.cos(a),y1=cy+r*Math.sin(a),x2=cx+r*Math.cos(b),y2=cy+r*Math.sin(b);
    const active=selected.includes(i),middle=(a+b)/2;
    const tx=cx+71*Math.cos(middle),ty=cy+71*Math.sin(middle);
    const path='M '+cx+' '+cy+' L '+x1.toFixed(2)+' '+y1.toFixed(2)+' A '+r+' '+r+' 0 '+(delta>Math.PI?1:0)+' 1 '+x2.toFixed(2)+' '+y2.toFixed(2)+' Z';
    slices+='<path d="'+path+'" data-slice="'+i+'" class="pizza-slice '+(active?'selected':'')+'" role="button" tabindex="0" aria-pressed="'+active+'" aria-label="Porción '+(i+1)+(active?', seleccionada':', sin seleccionar')+'" fill="'+(active?'#ffcf4a':'#f9e4c0')+'" stroke="#bf703a" stroke-width="3" />';
    if(active)slices+='<circle cx="'+tx.toFixed(1)+'" cy="'+ty.toFixed(1)+'" r="8" fill="#c64735" pointer-events="none"/><circle cx="'+(tx+10).toFixed(1)+'" cy="'+(ty-11).toFixed(1)+'" r="4" fill="#4a994e" pointer-events="none"/>';
  }
  return '<svg class="pizza-svg" viewBox="0 0 300 300" role="group" aria-label="Pizza dividida en '+parts+' porciones. Activa las porciones con clic o teclado."><circle cx="150" cy="150" r="131" fill="#b67932"/><circle cx="150" cy="150" r="123" fill="#f5b962"/>'+slices+'<circle cx="150" cy="150" r="7" fill="#cc8f4f" pointer-events="none"/></svg>';
}
function renderGlass(parts,filled,interactive=false,title='Vaso A'){
  const segments=Array.from({length:parts},(_,i)=>{
    const y=100/parts*i;
    return '<div class="glass-segment '+(i<filled?'filled':'')+(interactive?' clickable':'')+'"'+
      ' style="bottom:'+y+'%;height:'+(100/parts)+'%"'+(interactive?' data-fill="'+(i+1)+'" title="Llenar '+(i+1)+' de '+parts+' partes"':'')+'></div>';
  }).join('');
  return '<div class="glass-col"><div class="glass-container" role="img" aria-label="'+title+': '+filled+' de '+parts+' partes llenas">'+segments+'</div><div class="glass-title">'+title+': '+filled+'/'+parts+'</div></div>';
}
function renderTask(){
  const lvl=getLevel(),task=getTask();
  $('level-title').textContent=lvl.title;
  $('topic').textContent=lvl.competency;
  $('order-indicator').textContent='PEDIDO '+(state.task+1)+' DE '+lvl.tasks.length;
  $('order-prompt').innerHTML=task.prompt;
  $('clock-stamp').textContent=task.type==='pizza'?'🍕':task.type==='glass'?'🥤':task.type==='recipe'?'👨‍🍳':'🧾';
  $('preview-btn').hidden=!(state.stage>=2 && state.alarm>0) || state.awaitingNext;
  $('preview-btn').textContent='🔔 Alarma ('+state.alarm+')';
  $('calc-btn').hidden=!(state.stage>=3 && state.calculator>0) || state.awaitingNext;
  $('calc-btn').textContent='🧮 Calculadora ('+state.calculator+')';
  $('hint-btn').hidden=state.awaitingNext;
  $('check-btn').textContent=state.awaitingNext?'Siguiente pedido ➜':'✓ Entregar pedido';
  $('task-progress').innerHTML=lvl.tasks.map((_,i)=>'<span class="'+(i<state.task?'done':i===state.task?'current':'')+'" title="Pedido '+(i+1)+'"></span>').join('');
  renderInteraction();
  renderFeedback();
}
function renderInteraction(){
  const task=getTask();let html='';
  switch(task.type){
    case 'pizza':{
      const count=state.selected.length;
      html='<div class="pizza-board">'+pizzaSVG(task.parts,state.selected)+
        '<p class="visual-note">Toca las porciones para marcarlas o retirarlas. También puedes usar Tab + Enter.</p></div>';
      $('live-value').textContent='🍕 Tu pizza: '+count+'/'+task.parts+' de sus porciones seleccionadas';break;
    }
    case 'glass':{
      const value=Number(state.value)||0;
      html='<div class="glass-board">'+renderGlass(task.parts,value,true,'Vaso A')+
        (task.reference?renderGlass(task.reference.parts,task.reference.filled,false,'Vaso B'):'')+'</div>'+
        '<div class="glass-control"><input id="glass-slider" aria-label="Cantidad de líquido del vaso A" type="range" min="0" max="'+task.parts+'" step="1" value="'+value+'"><div class="range-ends"><span>Vacío</span><span>Lleno</span></div><div class="glass-meter">Vaso A: '+value+'/'+task.parts+'</div></div>';
      $('live-value').textContent='🥤 Bebida servida: '+value+'/'+task.parts;break;
    }
    case 'recipe':{
      const value=Number(state.value)||0;
      html='<div class="recipe-station"><div class="ingredient-box"><div class="ingredient-icon">'+task.ingredient+'</div><div class="ingredient-caption">'+task.ingredientName+'</div><div class="mini-card"><strong>'+task.pizzas+' pizzas × '+task.num+'/'+task.den+'</strong><small>taza por pizza</small></div></div>'+
        '<div class="recipe-count"><b>Medidor de ingredientes</b><small>Cada clic añade o quita 1/'+task.den+' de taza</small><div class="counter"><button type="button" data-step="-1" aria-label="Quitar un '+task.den+'avo">−</button><output aria-live="polite">'+fractionText(value,task.den)+'</output><button type="button" data-step="1" aria-label="Añadir un '+task.den+'avo">+</button></div><small>Usaste '+value+'/'+task.den+' de taza</small><div class="recipe-pieces">'+Array.from({length:Math.min(value,22)},()=>'<span>🥄</span>').join('')+'</div></div></div>';
      $('live-value').textContent='🧀 Preparaste '+value+'/'+task.den+' de taza = '+fractionText(value,task.den)+' taza(s)';break;
    }
    case 'cash':{
      const value=String(state.value||'');
      html='<div class="receipt"><h3>🧾 Caja de Francisco’s</h3><div class="receipt-row"><span>Total de referencia</span><span>'+money(task.total)+'</span></div><div class="receipt-row"><span>Operación</span><span>'+esc(task.operation)+'</span></div><div class="receipt-row"><span>Condición</span><span>'+esc(task.detail)+'</span></div><label for="cash-amount" class="sr">Resultado en pesos colombianos</label><input id="cash-amount" class="cash-input" autocomplete="off" inputmode="numeric" maxlength="11" placeholder="$ Tu respuesta" value="'+esc(value)+'"><div class="keypad">'+['1','2','3','4','5','6','7','8','9','Borrar','0','⌫'].map(d=>'<button type="button" data-key="'+esc(d)+'" class="'+(d==='⌫'||d==='Borrar'?'erase':'')+'">'+d+'</button>').join('')+'</div><div class="reference-receipt">Puedes escribir el valor con el teclado o pulsar los botones.</div></div>';
      $('live-value').textContent='💰 Valor ingresado: '+(value?money(Number(value)):'—');break;
    }
  }
  if(state.hintsTask>0 && ['pizza','glass'].includes(task.type)){
    const filled=task.type==='pizza'?task.target:task.target;
    const total=task.parts;
    html+='<div class="hint-visual"><b>🔎 Pista visual: observa las partes del pedido</b><div class="hint-cells">'+
      Array.from({length:total},(_,i)=>'<i class="'+(i<filled?'filled':'')+'" aria-hidden="true"></i>').join('')+'</div><small>Las casillas coloreadas representan la cantidad solicitada.</small></div>';
  }
  if(state.hintsTask>0 && task.type==='recipe'){
    html+='<div class="hint-visual"><b>🔎 Pista visual: repite la receta</b><div class="hint-cells">'+
      Array.from({length:task.pizzas},()=>'<span class="mini-card">🍕 '+task.num+'/'+task.den+'</span>').join('')+'</div><small>Junta las cantidades de cada pizza.</small></div>';
  }
  $('interaction').innerHTML=html;
  if(state.awaitingNext){$('interaction').style.pointerEvents='none';$('interaction').style.opacity='.78';}
  else{$('interaction').style.pointerEvents='auto';$('interaction').style.opacity='1';}
}
function renderFeedback(){
  const el=$('feedback');
  if(!state.feedback){el.className='feedback hidden';el.innerHTML='';return;}
  const withTeacher=state.feedback.kind==='hint' && state.feedback.teacher===true;
  el.className='feedback '+state.feedback.kind+(withTeacher?' with-teacher':'');
  const message='<strong>'+esc(state.feedback.title)+'</strong><span>'+esc(state.feedback.text)+'</span>';
  el.innerHTML=withTeacher?
    '<div class="teacher-tip"><img src="profesor_hd.png" alt="Profesor de Francisco’s" width="90" height="90"><div class="teacher-tip-text">'+message+'</div></div>':message;
}

function setInteractionValue(value,rerender=true){
  if(state.awaitingNext)return;
  const task=getTask();
  state.value=task.type==='cash'?String(value).replace(/\D/g,'').slice(0,11):clamp(Number(value)||0,0,task.type==='glass'?task.parts:30);
  save();
  if(rerender)renderInteraction();
}
function handleTaskCheck(){
  if(state.awaitingNext){advanceTask();return;}
  const task=getTask();
  const given=task.type==='pizza'?state.selected.length:Number(state.value);
  if(task.type==='cash' && String(state.value).trim()===''){
    state.feedback={kind:'hint',title:'Falta una cantidad',text:'Escribe el resultado en pesos en la caja y vuelve a intentarlo.'};
    save();renderFeedback();return;
  }
  if(given===task.target){
    playNote(true);
    state.successes++;
    state.cards++;
    const evidence={stage:state.stage,level:getLevel().title,task:state.task+1,type:task.type,competence:getLevel().competency,description:task.prompt.replace(/<[^>]+>/g,''),answer:task.math,attempts:state.mistakes+1,hints:state.hintsTask,finished:new Date().toISOString()};
    state.log.push(evidence);
    state.awaitingNext=true;
    state.feedback={kind:'success',title:'🎉 ¡Pedido correcto! +1 tarjeta',text:task.why+' Pi-zzagirl te felicita. ¡Sigue así!'};
    save();render();confetti();
    return;
  }
  playNote(false);
  state.mistakes++;state.errors++;
  if(state.mistakes>=maxAttempts()){
    state.courseUses++;state.courseIndex=0;state.courseTries=0;state.feedback=null;
    state.page='course';save();render();showToast('¡Vamos al Curso de pizzero! Tu progreso está a salvo.');return;
  }
  const remaining=maxAttempts()-state.mistakes;
  state.feedback={kind:'error',title:'🧠 Probemos otra vez',text:'Tu preparación todavía no corresponde al pedido. '+genericExplanation(task)+' Te quedan '+remaining+' intentos antes de recibir práctica guiada.'};
  save();render();
}
function genericExplanation(task){
  switch(task.type){
    case 'pizza':return 'El número de arriba indica las porciones que debes marcar; el de abajo, el total de partes iguales.';
    case 'glass':return 'Observa cuántas de las secciones del vaso están llenas y compáralas con las solicitadas.';
    case 'recipe':return 'Repite la fracción de la receta tantas veces como pizzas se prepararán.';
    default:return 'Decide primero si tienes que dividir, calcular una fracción del precio o restar un descuento.';
  }
}
function giveHint(){
  if(state.awaitingNext)return;
  const task=getTask();
  const text=task.hints[Math.min(state.hintsTask,task.hints.length-1)];
  state.hintsTask++;state.hints++;
  state.feedback={kind:'hint',title:'💡 Consejo del profesor',text,teacher:true};
  save();renderDashboard();renderTask();
}
function tryAlarm(){
  if(state.alarm<=0 || state.awaitingNext || state.stage<2)return;
  const task=getTask(),given=task.type==='pizza'?state.selected.length:Number(state.value);
  state.alarm--;
  state.feedback={kind:'hint',title:'🔔 Alarma «pizza correcta»',text:given===task.target?'¡La cantidad está bien calculada! Puedes entregar el pedido.':'Revisa tu preparación antes de enviarla. La alarma no consume intentos.'};
  save();renderDashboard();renderTask();
}
function useCalculator(){
  if(state.calculator<=0 || state.awaitingNext || state.stage<3)return;
  state.calculator--;
  state.feedback={kind:'hint',title:'🧮 Calculadora-comodín',text:'Comprobación: '+getTask().math+'. Revisa que hayas escrito el resultado en pesos.'};
  save();renderDashboard();renderTask();
}
function resetTask(){
  state.value=0;state.selected=[];state.mistakes=0;state.hintsTask=0;
  state.feedback=null;state.awaitingNext=false;
}
function advanceTask(){
  const lvl=getLevel();
  if(state.task<lvl.tasks.length-1){state.task++;resetTask();save();render();return;}
  completeLevel();
}
function completeLevel(){
  const lvl=getLevel(),already=state.completed.includes(state.stage);
  if(!already){
    state.completed.push(state.stage);
    if(state.stage===1)state.alarm+=2;
    if(state.stage===2)state.calculator+=2;
  }
  save();playSound('level');confetti();
  showModal({emoji:state.stage===4?'🏆':'🎉',eyebrow:'¡NIVEL SUPERADO!',
    title:state.stage===4?'¡La crítica nos dio una estrella!':'¡Excelente trabajo!',
    description:state.stage===4?'Completaste el banquete con todas las competencias de fracciones. ¡Francisco’s vuelve a brillar!':'Has resuelto los cuatro pedidos de '+lvl.short.toLowerCase()+'. Tu fama aumenta y te espera una nueva misión.',
    details:'<p><b>🎓 Aprendizaje demostrado:</b> '+esc(lvl.competency)+'</p><p><b>🎁 Recompensa:</b> '+esc(lvl.reward)+'</p><p><b>📊 Evidencia:</b> '+lvl.tasks.length+' retos prácticos completados. Tu progreso queda guardado.</p>',
    button:state.stage===4?'Ver mi reconocimiento':'Continuar al siguiente nivel',
    callback:()=>{
      if(state.stage===4){state.stage=5;state.page='ending';save();render();playSound('victory');confetti();return;}
      state.stage++;state.task=0;resetTask();state.seconds=getLevel().seconds;state.timeEnded=false;
      state.page='play';save();render();showIntro();
    }
  });
}

function renderCourse(){
  const lvl=getLevel(),practice=lvl.practice[state.courseIndex];
  $('course-intro').textContent='¡Tranquilo, chef! Equivocarse es parte del aprendizaje. Nadie queda eliminado ni pierde niveles. El profesor te explica y después te invita a practicar dos ejercicios.';
  $('course-example').innerHTML='<b>👨‍🏫 Explicación guiada:</b> '+esc(lvl.example)+
    '<p><b>Lo que estamos practicando:</b> '+esc(lvl.competency)+'</p>';
  $('course-exercise').innerHTML='<div class="eyebrow">PRÁCTICA '+(state.courseIndex+1)+' DE '+lvl.practice.length+'</div><h3>'+esc(practice.q)+'</h3><div class="course-choices">'+practice.opts.map((o,i)=>'<button type="button" data-practice="'+i+'">'+esc(o)+'</button>').join('')+'</div>';
  $('course-feedback').textContent='';
}
function answerCourse(index){
  const lvl=getLevel(),p=lvl.practice[state.courseIndex];
  if(index!==p.correct){state.courseTries++;$('course-feedback').textContent='Aún no. '+p.why+' Intenta elegir la respuesta correcta.';playNote(false);save();return;}
  playNote(true);
  state.courseIndex++;
  if(state.courseIndex<lvl.practice.length){save();renderCourse();showToast('¡Bien hecho! Vamos con otro ejemplo.');return;}
  state.page='play';state.courseIndex=0;state.mistakes=0;state.value=0;state.selected=[];
  state.feedback={kind:'hint',title:'👨‍🏫 ¡Curso completado!',text:'Ya reforzaste el procedimiento. Puedes repetir el mismo pedido, conservando todos tus logros.'};
  save();render();showToast('¡Regresaste al pedido con nuevos intentos!');
}

function getSummary(){
  return [
    ['Pedidos resueltos',state.log.length],['Errores corregidos',state.errors],
    ['Pistas utilizadas',state.hints],['Cursos de pizzero',state.courseUses]
  ];
}
const RECOGNITION_STYLES={
  clasica:{name:'Clásica',garland:'🍕 · 🍅 · 🧀 · 🍕',motto:'¡El sabor del esfuerzo!'},
  jardin:{name:'Jardín',garland:'🌿 · 🌻 · 🌼 · 🍃',motto:'¡Tus conocimientos florecieron!'},
  fiesta:{name:'Fiesta',garland:'🎉 · 🎈 · ⭐ · 🎊',motto:'¡Hoy celebramos todo lo que aprendiste!'}
};
function recognitionStyle(){return RECOGNITION_STYLES[state.decor]?state.decor:'clasica';}
function renderEnding(){
  const player=esc(escName(state.player));
  $('ending-story').textContent='¡Felicitaciones, '+escName(state.player)+'! Atendiste todos los pedidos. ¡Pi-zzagirl, Pi-zzaman y el profesor celebran tu esfuerzo!';
  $('ending-stats').innerHTML=[
    ['🎴 Tarjetas',state.cards],['💰 Propinas simbólicas',money(getSymbolicTips())],['📚 Retos superados',state.log.length]
  ].map(([name,n])=>'<div><b>'+esc(n)+'</b>'+esc(name)+'</div>').join('');
  $('certificate').innerHTML='<div class="certificate-garland" aria-hidden="true"></div>'+ 
    '<div class="certificate-label">🏆 RECONOCIMIENTO DE FRANCISCO’S</div><h2>Maestro Pizzero de Fracciones</h2><div class="honoree">'+player+'</div>'+ 
    '<p>Por representar, comparar y aplicar fracciones en pedidos, recetas y situaciones de compra.</p>'+ 
    '<small>«Aprender también es volver a intentarlo» · '+new Date().toLocaleDateString('es-CO')+'</small>'+ 
    '<div class="certificate-motto"></div>';
  updateDecor();
}
function getSymbolicTips(){return state.log.length*2000+state.completed.length*1000;}
function updateDecor(){
  const decor=recognitionStyle(),style=RECOGNITION_STYLES[decor];
  document.querySelectorAll('[data-decor]').forEach(btn=>{
    const selected=btn.dataset.decor===decor;
    btn.classList.toggle('selected',selected);
    btn.setAttribute('aria-pressed',String(selected));
  });
  const scene=$('decor-scene');scene.className='decor-scene '+decor;
  scene.textContent=decor==='jardin'?'🌿 🍕 🪴 🌱 🧑‍🍳 🍹 🌿':decor==='fiesta'?'🎉 🍕 🎊 🧑‍🍳 🍰 🎈 🎉':'🍕 🧑‍🍳 🍅 🧀 🥤 🍕';
  const certificate=$('certificate');certificate.className='certificate decor-'+decor;
  const garland=certificate.querySelector('.certificate-garland');
  const motto=certificate.querySelector('.certificate-motto');
  if(garland)garland.textContent=style.garland;
  if(motto)motto.textContent=style.motto;
}

function buildPrintArea(){
  const rows=LEVELS.map((lvl,index)=>{
    const list=state.log.filter(e=>e.stage===index);
    return '<tr><td>'+esc(lvl.short)+'</td><td>'+esc(lvl.competency)+'</td><td>'+list.length+' / '+lvl.tasks.length+'</td><td>'+esc(lvl.resource)+'</td></tr>';
  }).join('');
  const vip=state.log.filter(e=>e.stage===4).length;
  const metrics=getSummary().map(([name,n])=>'<li>'+esc(name)+': '+n+'</li>').join('');
  $('print-area').innerHTML='<h1>Informe de aprendizaje · Pizzería de fracciones</h1><p><b>Estudiante:</b> '+esc(escName(state.player))+'</p>'+ 
    '<p><b>Fecha del informe:</b> '+new Date().toLocaleDateString('es-CO')+' · <b>Modalidad:</b> '+(state.mode==='reto'?'Reto orientativo con reloj':'Tranquila, sin reloj')+'</p>'+
    (state.stage===5?'<div class="print-badge"><h2>Reconocimiento</h2><strong>Maestro de las fracciones</strong><p>Completó cuatro niveles y una misión integradora.</p></div>':'<p>Proceso en curso. Los avances son evidencias de esta sesión y no una calificación automática.</p>')+
    '<h2>Competencias y recursos por nivel</h2><table><thead><tr><th>Nivel</th><th>Competencia</th><th>Pedidos</th><th>Recurso aplicado</th></tr></thead><tbody>'+rows+'</tbody></table>'+
    '<p><b>Misión VIP:</b> '+vip+' / '+VIP.tasks.length+' retos resueltos.</p><h2>Indicadores del proceso</h2><ul>'+metrics+'</ul>'+
    '<p><b>Retroalimentación y recuperación:</b> El juego explica cada respuesta y activa el Curso de pizzero tras agotar los intentos. Los avances anteriores se conservan.</p>'+
    '<p><b>Nota:</b> Los datos se guardan únicamente en el navegador de este dispositivo. El estudiante puede enviar este informe manualmente por Classroom o AVA.</p>';
}
function buildPrintCertificate(){
  const player=esc(escName(state.player));
  const decor=recognitionStyle(),style=RECOGNITION_STYLES[decor];
  $('print-area').innerHTML='<div class="print-ceremony"><p>🏆 CEREMONIA DE RECONOCIMIENTO 🏆</p>'+ 
    '<h1>¡Francisco’s tiene un Maestro Pizzero!</h1>'+
    '<p>¡Atendiste todos los pedidos y demostraste lo que sabes de las fracciones!</p>'+
    '<img src="medidor.png" alt="Medidor de fama de Francisco’s: Aprendiz, Pizzero, Especialista, Maestro">'+
    '<div class="print-rewards"><span>🎴 <b>'+state.cards+'</b> tarjetas</span><span>💰 <b>'+money(getSymbolicTips())+'</b> propinas simbólicas</span><span>📚 <b>'+state.log.length+'</b> retos</span></div>'+
    '<div class="print-diploma decor-'+decor+'"><div class="certificate-garland">'+style.garland+'</div>'+ 
    '<div>RECONOCIMIENTO DE FRANCISCO’S</div><strong>Maestro Pizzero de Fracciones</strong><div class="student">'+player+'</div>'+ 
    '<p>Por representar, comparar y aplicar fracciones en pedidos, recetas y situaciones de compra.</p><small>«Aprender también es volver a intentarlo» · '+new Date().toLocaleDateString('es-CO')+'</small>'+ 
    '<div class="certificate-motto">'+style.motto+'</div></div>'+ 
    '<p>🎉 ¡La pizzería celebra tu esfuerzo!</p><small>Las propinas simbólicas son puntos del juego, no dinero real.</small></div>';
}
function downloadCSV(){
  if(!state || !state.log.length){showToast('Resuelve al menos un pedido para generar un informe.');return;}
  const safeCSV=value=>{
    let s=String(value??'').replace(/\r|\n/g,' ');
    if(/^[=+\-@]/.test(s))s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  };
  const header=['Estudiante','Nivel','Pedido','Competencia','Evidencia','Respuesta explicada','Intentos','Pistas','Fecha'];
  const rows=[header,...state.log.map(e=>[escName(state.player),e.level,e.task,e.competence,e.description,e.answer,e.attempts,e.hints,e.finished])];
  const csv='\uFEFF'+rows.map(row=>row.map(safeCSV).join(';')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='informe_franciscos_fracciones.csv';
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function printReport(){
  if(!state?.log.length)return;
  buildPrintArea();window.print();
}
function printCertificate(){
  if(!state || state.stage!==5)return;
  buildPrintCertificate();window.print();
}
function startNewGame(){
  if(state && state.log.length && !confirm('Ya tienes una partida guardada. ¿Deseas comenzar otra? Esto reemplazará el avance guardado en este navegador.'))return;
  const player=$('player-name').value.trim().slice(0,35);
  const mode=document.querySelector('input[name="mode"]:checked')?.value||'reto';
  state=getNewState(player,mode);save();render();showIntro();
}
function resumeGame(){
  if(!state)return;
  state.page=state.stage===5?'ending':state.returnPage==='course'?'course':'play';
  delete state.returnPage;save();render();
  showToast(state.stage===5?'¡Bienvenido de nuevo, Maestro!':'¡Bienvenido de nuevo! Continúa donde ibas.');
}
function goHome(){
  if(!state)return;
  state.returnPage=state.page;state.page='landing';save();render();
}
function restart(){
  if(!confirm('¿Comenzar una nueva aventura? La partida actual será sustituida en este navegador.'))return;
  const previousName=state.player;
  state=null;
  try{localStorage.removeItem(STORAGE_KEY);}catch(e){}
  render();$('player-name').value=previousName;
  window.scrollTo({top:0,behavior:'smooth'});
}

/* Delegación de eventos: mantiene operativos los controles tras cada cambio de reto. */
document.addEventListener('click',(event)=>{
  if(!state || state.awaitingNext || state.page!=='play')return;
  const slice=event.target.closest('[data-slice]');
  if(slice && getTask().type==='pizza'){
    const index=Number(slice.dataset.slice);
    state.selected=state.selected.includes(index)?state.selected.filter(x=>x!==index):[...state.selected,index];
    save();renderInteraction();$('interaction').querySelector('[data-slice="'+index+'"]')?.focus();return;
  }
  const glass=event.target.closest('[data-fill]');
  if(glass && getTask().type==='glass'){setInteractionValue(glass.dataset.fill);return;}
  const step=event.target.closest('[data-step]');
  if(step && getTask().type==='recipe'){setInteractionValue(Number(state.value)+Number(step.dataset.step));return;}
  const key=event.target.closest('[data-key]');
  if(key && getTask().type==='cash'){
    let value=String(state.value||'');
    if(key.dataset.key==='Borrar')value='';
    else if(key.dataset.key==='⌫')value=value.slice(0,-1);
    else value=(value+key.dataset.key).slice(0,11);
    setInteractionValue(value);$('cash-amount')?.focus();return;
  }
});
document.addEventListener('keydown',(event)=>{
  const slice=event.target.closest?.('[data-slice]');
  if(slice && (event.key==='Enter'||event.key===' ')){
    event.preventDefault();slice.click();
  }
});
document.addEventListener('input',(event)=>{
  if(!state || state.page!=='play' || state.awaitingNext)return;
  if(event.target.id==='glass-slider' && getTask().type==='glass'){
    const value=Number(event.target.value);
    setInteractionValue(value,false);
    $('interaction').querySelectorAll('.glass-col:first-child .glass-segment').forEach((el,i)=>el.classList.toggle('filled',i<value));
    const glass=$('interaction').querySelector('.glass-col:first-child .glass-container');
    if(glass)glass.setAttribute('aria-label','Vaso A: '+value+' de '+getTask().parts+' partes llenas');
    const title=$('interaction').querySelector('.glass-col:first-child .glass-title');if(title)title.textContent='Vaso A: '+value+'/'+getTask().parts;
    const meter=$('interaction').querySelector('.glass-meter');if(meter)meter.textContent='Vaso A: '+value+'/'+getTask().parts;
    $('live-value').textContent='🥤 Bebida servida: '+value+'/'+getTask().parts;
  }
  if(event.target.id==='cash-amount' && getTask().type==='cash'){
    setInteractionValue(event.target.value,false);
    $('live-value').textContent='💰 Valor ingresado: '+(state.value?money(Number(state.value)):'—');
  }
});
document.addEventListener('click',(event)=>{
  const choice=event.target.closest('[data-practice]');
  if(choice && state?.page==='course')answerCourse(Number(choice.dataset.practice));
  const decor=event.target.closest('[data-decor]');
  if(decor && state?.page==='ending'){state.decor=decor.dataset.decor;save();updateDecor();}
});

$('start-btn').addEventListener('click',startNewGame);
$('resume-btn').addEventListener('click',resumeGame);
$('home-btn').addEventListener('click',goHome);
$('check-btn').addEventListener('click',handleTaskCheck);
$('hint-btn').addEventListener('click',giveHint);
$('preview-btn').addEventListener('click',tryAlarm);
$('calc-btn').addEventListener('click',useCalculator);
$('details-btn').addEventListener('click',openLevelInfo);
$('modal-btn').addEventListener('click',closeModal);
$('audio-btn').addEventListener('click',()=>{
  soundOn=!soundOn;saveAudio();updateAudioUI();if(soundOn)playSound('hint');
});
$('volume-slider').addEventListener('input',event=>{
  volumePct=clamp(Number(event.target.value)||0,0,100);
  saveAudio();updateAudioUI();
});
$('volume-slider').addEventListener('change',()=>{if(soundOn)playSound('hint');});
$('report-btn').addEventListener('click',printReport);
$('print-btn').addEventListener('click',printCertificate);
$('csv-btn').addEventListener('click',downloadCSV);
$('restart-btn').addEventListener('click',restart);

/* El reloj propone un reto, pero no elimina a nadie ni borra su progreso. */
setInterval(()=>{
  if(!state || state.page!=='play' || state.mode!=='reto' || state.stage>=4 ||
     state.awaitingNext || state.timeEnded || !$('overlay').classList.contains('hidden') || document.hidden)return;
  state.seconds=Math.max(0,state.seconds-1);
  $('stat-time').textContent=formatTime(state.seconds);
  if(state.seconds<=0){state.timeEnded=true;showToast('⏱️ Terminó el tiempo orientativo. ¡Puedes seguir aprendiendo sin penalización!');save();}
  else if(state.seconds%5===0)save();
},1000);

/* Iniciamos en la portada para que el estudiante decida continuar o comenzar. */
if(state){state.returnPage=state.page==='landing'?(state.returnPage||'play'):state.page;state.page='landing';}
updateAudioUI();
render();
