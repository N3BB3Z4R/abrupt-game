//#############################
//#
//#   CONTROLS
//#
//#
//#############################

import { variables } from "./Config.js"
import { restartGame } from './Utils.js'
import { playSfx } from "./Audio.js"

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

function changeControlOption(gameLoop, incomingOption) {
  // Comprueba si existe el item 'controls_option' en el localStorage
  const option = localStorage.getItem('controls_option');

  // si trae parametro la funcion, usar ese parametro
  if (incomingOption) {
    localStorage.setItem('controls_option', incomingOption);
    variables.controlOption = incomingOption;

  } else {
    if (option) {
      // Si existe, almacénalo en la variable 'variables.controlOption'
      variables.controlOption = option;
    } else {
      // Si no existe, crea el item en localStorage y almacénalo en 'variables.controlOption'
      const defaultOption = 'keyboard'; // el valor predeterminado deseado
      localStorage.setItem('controls_option', defaultOption);
      variables.controlOption = defaultOption;
    }
  }

  // Detener los controles existentes
  stopKeyboardControls();
  stopMouseControls();
  stopMobileControls();

  // Llama a las funciones dependiendo de la variable variables.controlOption
  if (isMobile) {
    setupMobileControls();
  } else {
    if (variables.controlOption === 'keyboard') {
      if (typeof gameLoop === 'function') {
        setupKeyboardControls(gameLoop);
      }
    } else if (variables.controlOption === 'mouse') {
      if (typeof gameLoop === 'function') {
        setupMouseControls(gameLoop);
      }
    }
  }

  // Obtén el elemento con id "controls"
  const controlsPanel = document.getElementById("controls");
  if (isMobile) controlsPanel.style.display = "none";

  // Crear un botón si no existe uno
  let toggleControlButton = document.querySelector("button#toggle-control");
  if (!toggleControlButton) {
    toggleControlButton = document.createElement("button");
    toggleControlButton.id = "toggle-control";
    controlsPanel.appendChild(toggleControlButton);
  }

  // Agrega un evento click al botón
  toggleControlButton.addEventListener("click", () => {
    const currentOption = localStorage.getItem("controls_option");
    const newOption = currentOption === "keyboard" ? "mouse" : "keyboard";
    localStorage.setItem("controls_option", newOption);
    toggleControlButton.textContent = newOption; // Actualiza el texto del botón
    console.log(`Controls changed to ${newOption}`);
    // Reiniciar el juego con los nuevos controles
    restartGame();
  });

  // Configura el texto del botón según la opción actual
  toggleControlButton.textContent = variables.controlOption.toString();


  // Obtén el elemento con id "restart-game"
  let restartGameButton = document.querySelector("button#restart-game");
  if (!restartGameButton) {
    restartGameButton = document.createElement("button");
    restartGameButton.id = "restart-game";
    restartGameButton.textContent = "Restart";
    controlsPanel.appendChild(restartGameButton);
  }

  // Agrega un evento click al botón
  restartGameButton.addEventListener("click", () => {
    restartGame();
  });

}




// Detienen los listener para los controles
function stopKeyboardControls() {
  if (typeof handleKeyboardKeyDown === 'function') {
    document.removeEventListener("keydown", handleKeyboardKeyDown);
  }
  if (typeof handleKeyboardKeyUp === 'function') {
    document.removeEventListener("keyup", handleKeyboardKeyUp);
  }
}


function setupKeyboardControls(gameLoop) {
  // Define manejadores de eventos con nombres específicos
  function handleKeyboardKeyDown(event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      variables.leftKeyPressed = true;
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      variables.rightKeyPressed = true;
    } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      variables.upKeyPressed = true;
    } else if (event.key === " ") {
      if (variables.elapsedTime === 0) {
        playSfx("start");
      } else {
        playSfx("pause");
      }
      variables.gamePaused = !variables.gamePaused;
      if (!variables.gamePaused) {
        requestAnimationFrame(gameLoop);
      } else if (variables.isGameOver) {
        restartGame();
      }
    } else if (event.key === "r" || event.key === "R") {
      restartGame();
    }
  }

  function handleKeyboardKeyUp(event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      variables.leftKeyPressed = false;
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      variables.rightKeyPressed = false;
    } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      variables.upKeyPressed = false;
    }
    // You can add more key-specific logic if needed
  }

  // Agrega manejadores de eventos
  document.addEventListener("keydown", handleKeyboardKeyDown);
  document.addEventListener("keyup", handleKeyboardKeyUp);
}

function stopMouseControls() {
  if (typeof handleMouseMouseDown === 'function') {
    document.removeEventListener("mousedown", handleMouseMouseDown);
  }
  if (typeof handleMouseUp === 'function') {
    document.removeEventListener("mouseup", handleMouseUp);
  }
  if (typeof handleMouseMove === 'function') {
    document.removeEventListener("mousemove", handleMouseMove);
  }
}

function setupMouseControls(gameLoop) {
  // Define manejadores de eventos con nombres específicos
  function handleMouseDown(event) {
    if (event.button === 0) {
      variables.upKeyPressed = true;
    }
    if (event.button === 1) {
      if (variables.elapsedTime === 0) {
        playSfx("start");
      } else {
        playSfx("pause");
      }
      variables.gamePaused = !variables.gamePaused;
      if (!variables.gamePaused) {
        requestAnimationFrame(gameLoop);
      } else if (variables.isGameOver) {
        restartGame();
      }
    }
  }

  function handleMouseUp(event) {
    if (event.button === 0) {
      variables.upKeyPressed = false;
    }
  }

  function handleMouseMove(event) {
    const mouseX = event.clientX;
    const screenHalf = window.innerWidth / 2;

    if (mouseX < screenHalf) {
      variables.leftKeyPressed = true;
      variables.rightKeyPressed = false;
    } else {
      variables.rightKeyPressed = true;
      variables.leftKeyPressed = false;
    }
  }

  // Agrega manejadores de eventos
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("mousemove", handleMouseMove);
}

function stopMobileControls() {
  if (typeof handleTouchStart === 'function') {
    document.removeEventListener("touchstart", handleTouchStart);
  }
  if (typeof handleTouchEnd === 'function') {
    document.removeEventListener("touchend", handleTouchEnd);
  }
  if (typeof handleTouchMove === 'function') {
    document.body.removeEventListener("touchmove", handleTouchMove);
  }
}

function setupMobileControls() {
  // Define manejadores de eventos con nombres específicos
  function handleTouchStart(event) {
    let touchStartX = event.touches[0].clientX;
    variables.upKeyPressed = true;
  }

  function handleTouchEnd(event) {
    let touchEndX = event.changedTouches[0].clientX;
    const touchDistanceX = touchEndX - touchStartX;
    const swipeThreshold = 50;

    if (touchDistanceX < -swipeThreshold) {
      variables.leftKeyPressed = true;
      variables.rightKeyPressed = false;
    } else if (touchDistanceX > swipeThreshold) {
      variables.rightKeyPressed = true;
      variables.leftKeyPressed = false;
    } else {
      // Realiza alguna acción personalizada si el deslizamiento no supera el umbral
      const mouseX = event.clientX;
      const screenHalf = window.innerWidth / 2;

      if (mouseX < screenHalf) {
        variables.leftKeyPressed = true;
        variables.rightKeyPressed = false;
      } else {
        variables.rightKeyPressed = true;
        variables.leftKeyPressed = false;
      }
    }

    variables.upKeyPressed = false;
  }

  // Agrega manejadores de eventos
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchend", handleTouchEnd);

  // Captura eventos de clic del botón central del ratón (botón 1)
  document.addEventListener("mousedown", function (event) {
    if (event.button === 1) {
      if (variables.elapsedTime === 0) {
        playSfx("start");
      } else {
        playSfx("pause");
      }

      variables.gamePaused = !variables.gamePaused;
      if (!variables.gamePaused) {
        requestAnimationFrame(gameLoop);
      } else if (variables.isGameOver) {
        restartGame();
      }
    }
  });
}


export { changeControlOption, setupKeyboardControls, setupMouseControls, setupMobileControls };
