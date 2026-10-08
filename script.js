// ═══════════════════════════════════════
//  D20 — DADO DEL DESTINO
//  Lógica de lanzamiento y historial
// ═══════════════════════════════════════

const MAX_HISTORY = 5;
const ROLL_DURATION = 500; // ms de animación

let history = [];
let isRolling = false;

// Referencias al DOM
const diceNumber = document.getElementById('diceNumber');
const diceLabel  = document.getElementById('diceLabel');
const diceFace   = document.getElementById('diceFace');
const rollBtn    = document.getElementById('rollBtn');
const historyList = document.getElementById('historyList');

/**
 * Lanza el dado D20
 */
function rollDice() {
  if (isRolling) return;
  isRolling = true;
  rollBtn.disabled = true;

  // Limpiar clases de estado anterior
  diceFace.classList.remove('critical', 'fumble', 'rolling');
  diceNumber.classList.remove('critical-color', 'fumble-color', 'flash');
  diceLabel.style.color = '';

  // Activar animación de sacudida
  diceFace.classList.add('rolling');

  // Animación de números aleatorios intermedios
  const spinInterval = setInterval(() => {
    const tempNum = Math.floor(Math.random() * 20) + 1;
    diceNumber.textContent = tempNum;
  }, 60);

  // Resultado final tras ROLL_DURATION ms
  setTimeout(() => {
    clearInterval(spinInterval);
    const result = Math.floor(Math.random() * 20) + 1;

    // Actualizar número con flash
    diceNumber.textContent = result;
    diceNumber.classList.add('flash');
    setTimeout(() => diceNumber.classList.remove('flash'), 400);

    // Quitar sacudida
    diceFace.classList.remove('rolling');

    // Aplicar estado especial
    applyResultState(result);

    // Añadir al historial
    addToHistory(result);

    // Desbloquear
    isRolling = false;
    rollBtn.disabled = false;
  }, ROLL_DURATION);
}

/**
 * Aplica colores y etiquetas especiales según el resultado
 */
function applyResultState(result) {
  if (result === 20) {
    diceFace.classList.add('critical');
    diceNumber.classList.add('critical-color');
    diceLabel.textContent = '★ GOLPE CRÍTICO ★';
    diceLabel.style.color = 'var(--critical-hit)';
  } else if (result === 1) {
    diceFace.classList.add('fumble');
    diceNumber.classList.add('fumble-color');
    diceLabel.textContent = '✕ PIFIA TOTAL ✕';
    diceLabel.style.color = 'var(--critical-fail)';
  } else if (result >= 15) {
    diceLabel.textContent = 'ÉXITO MAYOR';
  } else if (result >= 10) {
    diceLabel.textContent = 'RESULTADO NORMAL';
  } else {
    diceLabel.textContent = 'RESULTADO BAJO';
  }
}

/**
 * Añade el resultado al historial (máx. 5 entradas)
 */
function addToHistory(result) {
  // Insertar al principio
  history.unshift(result);
  if (history.length > MAX_HISTORY) history.pop();

  renderHistory();
}

/**
 * Renderiza la lista de historial en el DOM
 */
function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = '<span class="history-empty">Sin tiradas aún...</span>';
    return;
  }

  historyList.innerHTML = '';

  history.forEach((value, index) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.textContent = value;
    item.title = `Tirada ${history.length - index}`;

    // El más reciente resaltado
    if (index === 0) item.classList.add('newest');

    // Estados especiales en el historial
    if (value === 20) item.classList.add('is-critical');
    if (value === 1)  item.classList.add('is-fumble');

    historyList.appendChild(item);
  });
}

// Lanzar también con la tecla Espacio o Enter
document.addEventListener('keydown', (e) => {
  if ((e.code === 'Space' || e.code === 'Enter') && !isRolling) {
    e.preventDefault();
    rollDice();
  }
});
