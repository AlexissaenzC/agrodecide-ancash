export function setupVoice({input,status,onTranscription}){
 const mic=document.querySelector('#mic'),speak=document.querySelector('#speak');let recognition=null,listening=false,timer;
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 function stop(){clearTimeout(timer);if(recognition){recognition.onend=null;try{recognition.abort();}catch{}recognition=null;}listening=false;mic.textContent='🎙 Voz';mic.setAttribute('aria-label','Iniciar micrófono');}
 function error(message){stop();status.textContent=message+' Puedes seguir escribiendo.';}
 mic.onclick=()=>{if(listening){stop();status.textContent='Micrófono detenido. Revisa el texto antes de enviarlo.';return;}if(!Recognition){status.textContent='Este navegador no reconoce voz. Usa texto o la prueba de voz simulada.';return;}
  try{recognition=new Recognition();recognition.lang='es-PE';recognition.continuous=false;recognition.interimResults=true;recognition.onstart=()=>{listening=true;mic.textContent='■ Detener';mic.setAttribute('aria-label','Detener micrófono');status.textContent='Escuchando… Al terminar podrás corregir y confirmar el texto.';};recognition.onresult=e=>{input.value=Array.from(e.results).map(r=>r[0].transcript).join(' ');onTranscription?.();};recognition.onerror=e=>error(({'not-allowed':'Permiso de micrófono denegado.','audio-capture':'No hay un micrófono disponible.','no-speech':'No se escuchó una respuesta.','network':'La conexión de reconocimiento falló.','service-not-allowed':'El navegador no permite este servicio.'})[e.error]||'No se pudo reconocer la voz.');recognition.onend=()=>{stop();status.textContent='Escucha terminada. Corrige la transcripción y pulsa «Enviar» para confirmarla.';input.focus();};recognition.start();timer=setTimeout(()=>error('Se terminó el tiempo de escucha.'),20000);}catch{error('No se pudo iniciar el micrófono.');}
 };
 document.querySelector('#voice-demo').onclick=()=>{stop();input.value='Tengo mil kilos de papa blanca';input.focus();status.textContent='Transcripción SIMULADA, sin grabar audio. Puedes corregirla y confirmarla con «Enviar».';onTranscription?.();};
 document.querySelector('#stop-speech').onclick=()=>{window.speechSynthesis?.cancel();status.textContent='Reproducción detenida. Puedes continuar por texto.';};
 if(!('speechSynthesis'in window)){speak.disabled=true;speak.parentElement.title='Lectura de voz no disponible en este navegador';}
 function say(text){if(speak.checked&&window.speechSynthesis){window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='es-PE';utterance.onerror=()=>{status.textContent='No se pudo leer la respuesta. Continúa con el texto.';};window.speechSynthesis.speak(utterance);}}
 function leave(){stop();window.speechSynthesis?.cancel();}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)leave();});window.addEventListener('pagehide',leave);
 return {say,stop:leave};
}
