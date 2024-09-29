// Definir las constantes
const emotions = [
  { name: 'Alegría', icon: '😄' },
  { name: 'Tristeza', icon: '😢' },
  { name: 'Ira', icon: '😠' },
  { name: 'Miedo', icon: '😨' },
  { name: 'Calma', icon: '😌' },
  { name: 'Curiosidad', icon: '🤔' },
  { name: 'Sorpresa', icon: '😲' },
  { name: 'Amor', icon: '❤️' },
  { name: 'Asco', icon: '🤢' }
];

// Definir las colores
const colors = [
  { name: 'red', value: 2 },
  { name: 'green', value: 3 },
  { name: 'blue', value: 4 },
  { name: 'black', value: 1 }
];

// Definir las funciones
let deck = [];
let playerHand = [];
let cpuHand = [];
let playerScore = 0;
let cpuScore = 0;
let isPlayerTurn = true;
let roundNumber = 1;
let gameSummary = [];
let cpuPlayedCard = null;

// Añade esta variable global al principio del archivo
let isProcessingTurn = false;

const playerHandElement = document.getElementById('player-hand');
const cpuHandElement = document.getElementById('cpu-hand');
const scoreElement = document.getElementById('score');
const turnIndicatorElement = document.getElementById('turn-indicator');
const roundIndicatorElement = document.getElementById('round-indicator');
const messageElement = document.getElementById('message');
const newGameButton = document.getElementById('new-game-button');
const playerPlayedElement = document.getElementById('player-played');
const cpuPlayedElement = document.getElementById('cpu-played');
const deckElement = document.getElementById('deck');
const deckCountElement = document.getElementById('deck-count');
const popupElement = document.getElementById('popup');
const popupTitleElement = document.getElementById('popup-title');
const gameSummaryElement = document.getElementById('game-summary');
const closePopupButton = document.getElementById('close-popup');
const helpButton = document.getElementById('help-button');
const rulesPopup = document.getElementById('rules-popup');
const closeRulesPopupButton = document.getElementById('close-rules-popup');
const rulesText = document.getElementById('rules-text');


/*  `createDeck()` crea una baraja de cartas combinando las 36 opciones posibles
 de emociones, colores y valor de la carta sin repetir las cartas. */
 function createDeck() {
  deck = [];
  for (let color of colors) {
    for (let emotion of emotions) {
      deck.push({ ...emotion, color: color.name, value: color.value });
    }
  }
}

/* `shuffleDeck()` reorganiza aleatoriamente los elementos de la matriz `deck`.
 En otras palabras baraja las cartas de la mazo. */
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

/* `drawCards` Contador, cartas restantes mazo para robar cartas */function drawCards(count) {
  return deck.splice(0, count);
}

/* Esta función de JavaScript, `updateCardDisplay`, actualiza la visualización de un elemento de tarjeta en función de los datos de la tarjeta y la visibilidad proporcionados.
Si la tarjeta existe y es visible, configura el contenido HTML del elemento de tarjeta para mostrar el icono, el nombre y el valor de la tarjeta,
 y agrega una clase CSS basada en el color de la tarjeta.
Si la tarjeta no es visible o no existe, borra el contenido del elemento de tarjeta y restablece su clase CSS a una clase 'tarjeta' predeterminada.*/
function updateCardDisplay(cardElement, card, isVisible = true) {
  if (card && isVisible){
    cardElement.innerHTML = `
      <div class="card-icon">${card.icon}</div>
      <div class="card-name">${card.name}</div>
      <div class="card-value">Valor: ${card.value}</div>
    `;
    cardElement.className = `card ${card.color}`;
  } 
if (card && !isVisible) {
    cardElement.innerHTML = '';
    cardElement.className = 'card';
  }
 
if (!card) {
  cardElement.innerHTML = '';
  cardElement.className = 'card';
}
}

/* `updateHandDisplay`, Muestra u oculta las cartas dependiendo de si el turno es del jugador o de la CPU*/
function updateHandDisplay(handElement, hand, isPlayer) {
  handElement.innerHTML = '';
  hand.forEach((card, index) => {
    const cardElement = document.createElement('div');
    updateCardDisplay(cardElement, card, isPlayer);
    if (isPlayer && isPlayerTurn) {
      cardElement.addEventListener('click', () => playCard(index));
    }
    handElement.appendChild(cardElement);
  });
}

/* Esta función compara dos cartas, `playerCard` y `cpuCard`, y determina el ganador en función de un conjunto de reglas predefinidas. 
Las reglas se definen en el objeto `victoryRules`,que especifica qué tipos de cartas pueden vencer a otras.
 La función devuelve un mensaje que indica si el jugador gana o pierde, y actualiza la puntuación y el turno en consecuencia. */
function compareCards(playerCard, cpuCard) {
  const victoryRules = {
    'Alegría': ['Tristeza', 'Ira', 'Miedo', 'Asco'],
    'Tristeza': ['Ira', 'Miedo', 'Sorpresa', 'Asco'],
    'Ira': ['Miedo', 'Curiosidad','Sorpresa', 'Asco'],
    'Miedo': ['Calma', 'Curiosidad', 'Sorpresa', 'Asco'],
    'Calma': ['Alegría', 'Tristeza', 'Ira', 'Amor'],
    'Curiosidad': ['Alegría', 'Tristeza', 'Calma', 'Amor'],
    'Sorpresa': ['Alegría', 'Calma', 'Curiosidad', 'Amor'],
    'Amor': ['Alegría', 'Tristeza', 'Ira', 'Miedo'],
    'Asco': ['Calma', 'Curiosidad', 'Sorpresa', 'Amor'],
  };

  let isTie = playerCard.name == cpuCard.name;
  let isPlayerCardValueGreater = playerCard.value > cpuCard.value;
  let playerCardWins = victoryRules[playerCard.name].includes(cpuCard.name);
  if (isTie && isPlayerCardValueGreater) {
    playerScore += playerCard.value + cpuCard.value;
    isPlayerTurn = true;
    return `¡Ganaste! Usaste: ${playerCard.name} con valor ${playerCard.value} vence a ${cpuCard.name} con valor ${cpuCard.value}.`;
  } 
  if (isTie && !isPlayerCardValueGreater) {
      cpuScore += cpuCard.value + playerCard.value;
      isPlayerTurn = false;
      return `Perdiste. ${cpuCard.name} con valor ${cpuCard.value} vence a ${playerCard.name} con valor ${playerCard.value}.`;
  }
  if (!isTie && playerCardWins) {
    playerScore += (playerCard.value + cpuCard.value);
    isPlayerTurn = true;
    return `¡Ganaste! ${playerCard.name} vence a ${cpuCard.name}.`;
  } 
  if (!isTie && !playerCardWins) {
    cpuScore += cpuCard.value + playerCard.value;
    isPlayerTurn = false;
    return `Perdiste. ${cpuCard.name} vence a ${playerCard.name}.`;
  }
}
/* Esta función, `playCard`, se utiliza para jugar una carta de la mano del jugador en un índice especificado. A continuación, se ofrece una breve descripción general de lo que hace:

1. Comprueba si es el turno del jugador. Si no es así, regresa sin hacer nada.
2. Retira la carta del índice especificado de la mano del jugador y la muestra.
3. Si la CPU ya ha jugado una carta, compara la carta del jugador con la de la CPU,
 actualiza la puntuación y el resumen del juego y, a continuación,
  espera 2 segundos antes de borrar las cartas jugadas, sacar nuevas cartas y avanzar a la siguiente ronda.
4. Si la CPU aún no ha jugado una carta, espera 1 segundo, luego juega una carta al azar de la mano de la CPU,
 la compara con la carta del jugador, actualiza la puntuación y el resumen del juego y, a continuación, 
 espera 2 segundos antes de borrar las cartas jugadas, sacar nuevas cartas y avanzar a la siguiente ronda.
5. Por último, actualiza la visualización de las manos del jugador y de la CPU.

Esta función parece ser parte de un juego de cartas en el que el jugador y la CPU se turnan para jugar a las cartas,
 y el juego lleva un registro de la puntuación y del historial de juego. */
function playCard(index) {
  // Añade esta comprobación al principio de la función
  if (!isPlayerTurn || isProcessingTurn) return;

  // Establece isProcessingTurn a true al inicio del turno
  isProcessingTurn = true;

  const playerCard = playerHand.splice(index, 1)[0];
  updateCardDisplay(playerPlayedElement, playerCard);

  let result;
  if (cpuPlayedCard) {
    result = compareCards(playerCard, cpuPlayedCard);
    messageElement.textContent = result;
    scoreElement.textContent = `Puntuación Jugador: ${playerScore} | Puntuación CPU: ${cpuScore}`;

    gameSummary.push(`Ronda ${roundNumber}: ${result}`);

    setTimeout(() => {
      playerPlayedElement.innerHTML = '';
      cpuPlayedElement.innerHTML = '';
      cpuPlayedCard = null;
      drawNewCards();
      nextRound();
      // Restablece isProcessingTurn a false al final del turno
      isProcessingTurn = false;
    }, 2000);
  } else {
    messageElement.textContent = 'Esperando la jugada de la CPU...';
    setTimeout(() => {
      const cpuCardIndex = Math.floor(Math.random() * cpuHand.length);
      cpuPlayedCard = cpuHand.splice(cpuCardIndex, 1)[0];
      updateCardDisplay(cpuPlayedElement, cpuPlayedCard, true);

      result = compareCards(playerCard, cpuPlayedCard);
      messageElement.textContent = result;
      scoreElement.textContent = `Puntuación Jugador: ${playerScore} | Puntuación CPU: ${cpuScore}`;

      gameSummary.push(`Ronda ${roundNumber}: ${result}`);

      setTimeout(() => {
        playerPlayedElement.innerHTML = '';
        cpuPlayedElement.innerHTML = '';
        cpuPlayedCard = null;
        drawNewCards();
        nextRound();
        // Restablece isProcessingTurn a false al final del turno
        isProcessingTurn = false;
      }, 2000);
    }, 1000);
  }

  updateHandDisplay(playerHandElement, playerHand, true);
  updateHandDisplay(cpuHandElement, cpuHand, false);
}
/* Esta función, drawNewCards, garantiza que tanto la mano del jugador como la mano de la CPU tengan 3 cartas,
extrayendo cartas del mazo si es necesario.*/
function drawNewCards() {
  if (deck.length > 0) {
    while (playerHand.length < 3 && deck.length > 0) {
      playerHand.push(drawCards(1)[0]);
    }
    while (cpuHand.length < 3 && deck.length > 0) {
      cpuHand.push(drawCards(1)[0]);
    }
    updateDeckCount();
  }

  // Si el mazo se ha quedado sin cartas y alguna de las manos está vacía, el juego termina.
  if (deck.length === 0 && (playerHand.length === 0 || cpuHand.length === 0)) {
    endGame();
  }
}

/* Esta función actualiza el indicador de turno del juego y la visibilidad de la mano en función de quién es el turno (`isPlayerTurn`).
 Si es el turno del jugador, muestra la mano del jugador y oculta la mano de la CPU, y viceversa. */
function updateTurnIndicator() {
  turnIndicatorElement.textContent = `Turno Actual: ${isPlayerTurn ? 'Jugador' : 'CPU'}`;

  // Si es el turno del jugador, mostrar la mano del jugador y ocultar la mano de la CPU.
  // Si es el turno de la CPU, mostrar la mano de la CPU y ocultar la mano del jugador.
  playerHandElement.style.display = isPlayerTurn ? '' : 'none';
  cpuHandElement.style.display = isPlayerTurn ? 'none' : '';
}

/* Esta función actualiza la pantalla del indicador de ronda con el número de ronda actual y muestra un mensaje motivador cada 3 rondas.
El mensaje se muestra cuando el `roundNumber` es divisible por 3, como lo indica la condición `roundNumber % 3 === 0`. */
function updateRoundIndicator() {
  roundIndicatorElement.textContent = `Ronda: ${roundNumber}`;
  if (roundNumber % 3 === 0) {
    messageElement.textContent = 'Llevas 3 rondas jugando, ¡sigue adelante!';
  }
}

/* Esta función `nextRound` hace avanzar el juego a la siguiente ronda.
 Incrementa el número de ronda, actualiza los indicadores de turno y ronda, y actualiza las pantallas de manos del jugador y de la CPU. Si es el turno de la CPU,
 programa el turno de la CPU para que ocurra después de un retraso de 1,5 segundos; de lo contrario, le indica al jugador que juegue su turno.*/
function nextRound() {
  roundNumber++;
  updateTurnIndicator();
  updateRoundIndicator();

  updateHandDisplay(playerHandElement, playerHand, true);
  updateHandDisplay(cpuHandElement, cpuHand, false);

  (!isPlayerTurn)? setTimeout(cpuTurn, 1500) : messageElement.textContent = 'Tu turno. Elige una carta para jugar.'; 
}

/* Esta es la función `cpuTurn`, que simula el turno de la CPU en un juego de cartas. Esto es lo que hace:

1. Comprueba si es el turno del jugador; si es así, sale de la función.
2. Selecciona aleatoriamente una carta de la mano de la CPU y la juega.
3. Actualiza la pantalla para mostrar la carta jugada y la mano restante de la CPU.
4. Muestra un mensaje que indica que la CPU ha jugado y ahora es el turno del jugador.
5. Después de un retraso de 1,5 segundos, actualiza la pantalla para solicitarle al jugador que responda al movimiento de la CPU y establece `isPlayerTurn` en `true`. */
function cpuTurn() {
  if (isPlayerTurn) return;

  const cpuCardIndex = Math.floor(Math.random() * cpuHand.length);
  cpuPlayedCard = cpuHand.splice(cpuCardIndex, 1)[0];
  updateCardDisplay(cpuPlayedElement, cpuPlayedCard, true);

  messageElement.textContent = 'CPU ha jugado. Es tu turno. Elige una carta para responder.';
  updateHandDisplay(cpuHandElement, cpuHand, false);

  setTimeout(() => {
    messageElement.textContent = 'Elige una carta para responder a la CPU.';
    isPlayerTurn = true;
    updateTurnIndicator();
    updateHandDisplay(playerHandElement, playerHand, true);
  }, 1500);
}

/*Esta función `endGame` determina el ganador del juego en función de las variables `playerScore` y `cpuScore`.
 Luego, actualiza la interfaz de usuario del juego para mostrar el mensaje del ganador, el resumen del juego y muestra el botón "Nuevo juego". */
function endGame() {
  let winner = playerScore > cpuScore ? "¡Felicidades! Has ganado el juego." : "La CPU ha ganado el juego.";
  popupTitleElement.textContent = winner;
  gameSummaryElement.innerHTML = gameSummary.join('<br>');
  popupElement.style.display = 'block';
  newGameButton.style.display = 'inline-block';
}

/* Esta función, `startNewGame`, inicializa un nuevo juego mediante:
* Crear y barajar un mazo de cartas
* Repartir 3 cartas al jugador y a la CPU
* Restablecer puntajes, indicadores de turno y estado del juego
* Actualizar la pantalla para mostrar el nuevo estado del juego
* Ocultar el botón "Nuevo juego" */

function startNewGame() {
  createDeck();
  shuffleDeck();
  playerHand = drawCards(3);
  cpuHand = drawCards(3);
  playerScore = 0;
  cpuScore = 0;
  isPlayerTurn = true;
  roundNumber = 1;
  gameSummary = [];
  cpuPlayedCard = null;

  updateHandDisplay(playerHandElement, playerHand, true);
  updateHandDisplay(cpuHandElement, cpuHand, false);

  scoreElement.textContent = 'Puntuación Jugador: 0 | Puntuación CPU: 0';
  updateTurnIndicator();
  updateRoundIndicator();
  messageElement.textContent = 'Nuevo juego comenzado. Es tu turno, elige una carta para jugar.';

  playerPlayedElement.innerHTML = '';
  cpuPlayedElement.innerHTML = '';

  newGameButton.style.display = 'none';

  updateDeckCount();
}

/*Esta función actualiza la visualización de las cartas restantes en la baraja.
 Establece el contenido de texto de dos elementos HTML (`deckElement` y `deckCountElement`) a la longitud actual de la matriz `deck`,
 mostrando efectivamente la cantidad de cartas que quedan en la baraja. */
function updateDeckCount() {
  deckElement.textContent = deck.length;
  deckCountElement.textContent = `Cartas en el Mazo: ${deck.length}`;
}

// Función para mostrar las reglas del juego
function showRules() {
    rulesText.innerHTML = `
        <h3>Cómo jugar a War of Elements:</h3>
        <ol>
            <li>Cada jugador recibe 3 cartas al inicio del juego.</li>
            <li>Las cartas tienen una emoción, un color y un valor.</li>
            <li>En tu turno, elige una carta para jugar.</li>
            <li>La CPU jugará una carta después de ti.</li>
            <li>Las cartas se comparan según estas reglas:
                <ul>
                    <li>Alegría vence a Tristeza, Ira, Miedo y Asco</li>
                    <li>Tristeza vence a Ira, Miedo, Sorpresa y Asco</li>
                    <li>Ira vence a Miedo, Curiosidad, Sorpresa y Asco</li>
                    <li>Miedo vence a Calma, Curiosidad, Sorpresa y Asco</li>
                    <li>Calma vence a Alegría, Tristeza, Ira y Amor</li>
                    <li>Curiosidad vence a Alegría, Tristeza, Calma y Amor</li>
                    <li>Sorpresa vence a Alegría, Calma, Curiosidad y Amor</li>
                    <li>Amor vence a Alegría, Tristeza, Ira y Miedo</li>
                    <li>Asco vence a Calma, Curiosidad, Sorpresa y Amor</li>
                </ul>
            </li>
            <li>Si las emociones son iguales, gana la carta con mayor valor.</li>
            <li>El ganador de cada ronda suma los valores de ambas cartas a su puntuación.</li>
            <li>El juego termina cuando se acaban las cartas del mazo y un jugador se queda sin cartas.</li>
            <li>El jugador con mayor puntuación al final del juego gana.</li>
        </ol>
    `;
    rulesPopup.style.display = 'block';
}

// Event listeners para los botones de ayuda
helpButton.addEventListener('click', showRules);
closeRulesPopupButton.addEventListener('click', () => {
    rulesPopup.style.display = 'none';
});

newGameButton.addEventListener('click', startNewGame);
closePopupButton.addEventListener('click', () => {
  popupElement.style.display = 'none';
});

startNewGame();