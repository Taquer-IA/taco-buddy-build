// Diálogos de Taffy
const Taffy_DIALOGS = {
  uso: [
    "Pantalla Principal\n" +
    "Al ingresar al sistema, verás la pantalla de productos.\n" +
    "Cada producto aparece en una tarjeta que incluye:\n" +
    "- Nombre del producto (ejemplo: Taco al pastor).\n" +
    "- Descripción breve.\n" +
    "- Precio.\n" +
    "- Botón \"+ Agregar\" para añadirlo al pedido.",

    "Buscar y Filtrar Productos\n" +
  "En la parte superior de la pantalla encontrarás las opciones para localizar los productos dentro del menú.\n" +
  "1. Barra de búsqueda: En el recuadro que dice \"Buscar producto…\" puedes escribir el nombre o parte del nombre del producto. " +
  "A medida que escribes, el sistema mostrará coincidencias. Ejemplo: si escribes \"Latte\", verás todos los tipos de latte disponibles.\n" +
  "2. Categorías de productos: Debajo de la barra de búsqueda hay botones para filtrar:\n" +
  "- Todo → Muestra todos los productos disponibles.\n" +
  "- Bebidas → Solo se muestran cafés, tés y bebidas.\n" +
  "- Comidas → Platillos disponibles (por ejemplo, sándwiches o desayunos).\n" +
  "- Postres → Pasteles, galletas, cheesecakes, etc.\n" +
  "- Especiales → Promociones o productos destacados.",

    "Lista de productos en la orden\n" +
  "En esta sección puedes ver todos los artículos que el cliente ha pedido:\n" +
  "- Imagen del producto.\n" +
  "- Nombre del producto.\n" +
  "- Precio unitario.\n" +
  "- Cantidad seleccionada.\n" +
  "Cada producto tiene controles:\n" +
  "- Botón \"-\" → Reduce la cantidad en 1.\n" +
  "- Botón \"+\" → Aumenta la cantidad en 1.\n" +
  "- Botón de basura → Elimina ese producto de la orden completa.",

  "Resumen de la orden\n" +
  "En la parte inferior se muestra un desglose automático:\n" +
  "- Subtotal → Suma de los precios sin impuestos.\n" +
  "- IVA (16%) → El sistema lo calcula automáticamente.\n" +
  "- Descuento → Si se aplica un cupón o promoción, aparecerá aquí.\n" +
  "- Total → Cantidad final que el cliente debe pagar.\n\n" +
  "Cuando el cliente confirma que todo está correcto:\n" +
  "1. Presiona el botón \"Finalizar Venta ($XXX.XX)\".\n" +
  "2. El sistema cerrará la orden y pasará a la pantalla de método de pago.\n" +
  "3. Después de seleccionar el pago, la venta quedará registrada en el historial."

  ],
  pagos: [
    "Aceptamos: Efectivo, tarjetas y transferencias",
    "Para pagar con tarjeta: 1) Insértala 2) Espera aprobación 3) Ingresa PIN",
    "El sistema calcula el cambio automáticamente en efectivo"
  ],
  recomendaciones: [
    "Recomiendo el café especial de Colombia ",
    "Prueba nuestro croissant de jamón serrano y brie",
    "El combo desayuno (café + jugo + sandwich) es un éxito"
  ],
  ayuda: [
    "Puedo explicarte cómo usar el sistema o hacer recomendaciones",
    "Di 'silencio' para apagar mi voz o 'habla' para activarla"
  ],
  saludo: [
    "¡Hola! Soy Taquer, ¿en qué puedo ayudarte hoy?",
    "¡Listo para ayudarte! ¿Qué necesitas saber?",
    "¡Hola! Soy Taquer, tu asistente virtual."
  ]
};

// Elementos del DOM de Taffy
const taffyChatBubble = document.getElementById('taffyChatBubble');
const taffyOriginalContent = document.getElementById('taffyOriginalContent');
const taffyTtsToggle = document.getElementById('taffyTtsToggle');
const taffySttBtn = document.getElementById('taffySttBtn');
const taffyButtons = document.querySelectorAll('.taffy-btn');
const taffyImage = document.getElementById('taffyImage');
const taffyBubble = document.getElementById('taffyBubble');
const taffyBubbleText = taffyBubble.querySelector('.taffy-bubble-text');
const taffyCloseBtn = document.getElementById('taffyCloseBtn');

// Estado del asistente Taffy
let taffyIsDragging = false;
let taffyDragOffsetX, taffyDragOffsetY;

// Mostrar/ocultar interfaz de Taffy
taffyChatBubble.addEventListener('click', (e) => {
  if (taffyIsDragging) return; // Evitar que se expanda al soltar después de arrastrar
  
  taffyOriginalContent.classList.remove('hidden');
  setTimeout(() => {
    taffyOriginalContent.classList.add('visible');
    taffyCloseBtn.classList.remove('hidden');
    // Mostrar saludo inicial cuando se abre la interfaz
    taffySetBubble(taffyPickRandom(Taffy_DIALOGS.saludo));
  }, 10);
});

// Cerrar la interfaz de Taffy
taffyCloseBtn.addEventListener('click', () => {
  taffyOriginalContent.classList.remove('visible');
  taffyCloseBtn.classList.add('hidden');
  setTimeout(() => {
    taffyOriginalContent.classList.add('hidden');
  }, 300);
});

// Arrastrar la burbuja de Taffy
taffyChatBubble.addEventListener('mousedown', taffyStartDrag);
taffyChatBubble.addEventListener('touchstart', taffyStartDrag, { passive: true });

function taffyStartDrag(e) {
  taffyIsDragging = true;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  taffyDragOffsetX = clientX - taffyChatBubble.getBoundingClientRect().left;
  taffyDragOffsetY = clientY - taffyChatBubble.getBoundingClientRect().top;
  
  document.addEventListener('mousemove', taffyOnDrag);
  document.addEventListener('touchmove', taffyOnDrag, { passive: true });
  document.addEventListener('mouseup', taffyStopDrag);
  document.addEventListener('touchend', taffyStopDrag);
}

function taffyOnDrag(e) {
  if (!taffyIsDragging) return;
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  const x = clientX - taffyDragOffsetX;
  const y = clientY - taffyDragOffsetY;
  
  // Limitar a los bordes de la ventana
  const maxX = window.innerWidth - taffyChatBubble.offsetWidth;
  const maxY = window.innerHeight - taffyChatBubble.offsetHeight;
  
  taffyChatBubble.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
  taffyChatBubble.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
  taffyChatBubble.style.right = 'auto';
  taffyChatBubble.style.bottom = 'auto';
}

function taffyStopDrag() {
  taffyIsDragging = false;
  document.removeEventListener('mousemove', taffyOnDrag);
  document.removeEventListener('touchmove', taffyOnDrag);
  document.removeEventListener('mouseup', taffyStopDrag);
  document.removeEventListener('touchend', taffyStopDrag);
}

// Configurar burbuja de diálogo de Taffy
function taffySetBubble(text) {
  taffyBubbleText.textContent = text;
  if (taffyTtsToggle.checked) {
    taffySpeak(text);
  }
}

// Hablar con síntesis de voz
function taffySpeak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}

// Botones de acción de Taffy
taffyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    taffySetBubble(taffyPickRandom(Taffy_DIALOGS[action]));
  });
});

// Selección aleatoria de diálogos
function taffyPickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Reconocimiento de voz (opcional)
if ('webkitSpeechRecognition' in window) {
  const taffyRecognition = new webkitSpeechRecognition();
  taffyRecognition.lang = 'es-ES';
  taffyRecognition.continuous = false;
  
  taffySttBtn.addEventListener('click', () => {
    taffyRecognition.start();
    taffySttBtn.innerHTML = '<span class="taffy-icon">🎤</span> <span>Escuchando...</span>';
  });
  
  taffyRecognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript.toLowerCase();
    taffyHandleVoiceCommand(transcript);
    taffySttBtn.innerHTML = '<span class="taffy-icon">🎤</span> <span>Hablar con Taffy</span>';
  };
}

// Comandos de voz de Taffy
function taffyHandleVoiceCommand(text) {
  if (text.includes('uso') || text.includes('sistema')) {
    taffySetBubble(taffyPickRandom(Taffy_DIALOGS.uso));
  } 
  else if (text.includes('pago') || text.includes('tarjeta')) {
    taffySetBubble(taffyPickRandom(Taffy_DIALOGS.pagos));
  }
  else if (text.includes('recomendación') || text.includes('menú')) {
    taffySetBubble(taffyPickRandom(Taffy_DIALOGS.recomendaciones));
  }
  else if (text.includes('ayuda')) {
    taffySetBubble(taffyPickRandom(Taffy_DIALOGS.ayuda));
  }
  else if (text.includes('silencio') || text.includes('callar')) {
    taffyTtsToggle.checked = false;
    taffySetBubble("Voz desactivada. Di 'habla' para activarme");
  }
  else if (text.includes('habla') || text.includes('activar')) {
    taffyTtsToggle.checked = true;
    taffySetBubble("¡Voz activada! ¿En qué te ayudo?");
  }
  else {
    taffySetBubble("No entendí. Prueba diciendo 'ayuda' para ver opciones");
  }
}

// Interacción con la imagen de Taffy
taffyImage.addEventListener('click', () => {
  taffySetBubble(taffyPickRandom(Taffy_DIALOGS.saludo));
});

// Asegurarse de que la burbuja de Taffy esté visible al inicio
window.addEventListener('load', () => {
  // Inicializar la burbuja con posición inicial
  taffyChatBubble.style.bottom = '20px';
  taffyChatBubble.style.right = '20px';
});