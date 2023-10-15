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

function changeControlOption(option) {
  variables.controlOption = option
}

function setupKeyboardControls(gameLoop) {
  if (variables.controlOption === "keyboard" && !isMobile) {
    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        variables.leftKeyPressed = true;
      } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        variables.rightKeyPressed = true;
      } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
        variables.upKeyPressed = true;
      } else if (event.key === " ") {

        if (variables.elapsedTime === 0) {
          playSfx("start")
        } else {
          playSfx("pause")
        }

        variables.gamePaused = !variables.gamePaused;
        if (!variables.gamePaused) {
          requestAnimationFrame(gameLoop);
        } else if (variables.isGameOver) {
          restartGame()
        }
      } else if (event.key === "r" || event.key === "R") {
        restartGame()
      }
    });

    document.addEventListener("keyup", function (event) {
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        variables.leftKeyPressed = false;
      } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        variables.rightKeyPressed = false;
      } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
        variables.upKeyPressed = false;
      } else if (event.key === " ") {
        // Tecla Espacio liberada
      } else if (event.key === "r" || event.key === "R") {
        // Tecla R liberada
      }
    });
  }
}

function setupMouseControls() {
  if (variables.controlOption === "mouse" && !isMobile) {
    document.addEventListener("mousedown", function (event) {
      if (event.button === 0) {
        variables.upKeyPressed = true;
      }
    });

    document.addEventListener("mouseup", function (event) {
      if (event.button === 0) {
        variables.upKeyPressed = false;
      }
    });

    document.addEventListener("mousemove", function (event) {
      const mouseX = event.clientX;
      const screenHalf = window.innerWidth / 2;

      if (mouseX < screenHalf) {
        variables.leftKeyPressed = true;
        variables.rightKeyPressed = false;
      } else {
        variables.rightKeyPressed = true;
        variables.leftKeyPressed = false;
      }
    });
  }
}

function setupMobileControls() {
  if (isMobile) {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener("touchstart", function (event) {
      touchStartX = event.touches[0].clientX;
      variables.upKeyPressed = true;
    });

    document.addEventListener("touchend", function (event) {
      touchEndX = event.changedTouches[0].clientX;
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
      }

      variables.upKeyPressed = false;
    });

    document.body.addEventListener("touchmove", function (event) {
      event.preventDefault();
    });
  }
}

export { changeControlOption, setupKeyboardControls, setupMouseControls, setupMobileControls };
