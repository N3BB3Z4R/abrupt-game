// Crear una instancia de la clase PlayerControl
// const playerControl = new PlayerControl();

// Obtener el valor del combustible desde fuera de la clase
// const currentFuel = playerControl.getFuel();

// Modificar el valor del combustible desde fuera de la clase
// playerControl.setFuel(currentFuel - 10);


// Clase para el control del jugador
class KeyboardControl {
  constructor() {
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.upKeyPressed = false;
    this.gamePaused = true;
    this.isGameOver = false;
    this.fuel = 100;
  }

  // Agregar métodos para acceder y modificar el valor del combustible
  getFuel() {
    return this.fuel;
  }

  setFuel(newFuel) {
    this.fuel = newFuel;
  }

  handleKeyDown(event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      this.leftKeyPressed = true;
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      this.rightKeyPressed = true;
    } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      this.upKeyPressed = true;
    } else if (event.key === " ") {
      this.togglePause();
    } else if (event.key === "r" || event.key === "R") {
      this.restartGame();
    }
  }

  handleKeyUp(event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      this.leftKeyPressed = false;
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      this.rightKeyPressed = false;
    } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      this.upKeyPressed = false;
    }
  }

  togglePause() {
    this.gamePaused = !this.gamePaused;
    if (!this.gamePaused) {
      requestAnimationFrame(gameLoop);
    } else {
      if (this.isGameOver) {
        this.restartGame();
      } else {
        this.pauseGame();
      }
    }
  }

  // Reiniciar el juego
  restartGame() {
    // FORCE reload page
    location.reload(true);
  }

  pauseGame() {
    // Implementa la lógica de pausa del juego aquí
  }
}

// Clase para el control del ratón
class MouseControl {
  constructor() {
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
  }

  handleMouseDown(event) {
    if (event.button === 0) {
      this.leftKeyPressed = true;
    }
  }

  handleMouseUp(event) {
    if (event.button === 0) {
      this.leftKeyPressed = false;
    }
  }

  handleMouseMove(event) {
    const mouseX = event.clientX;
    const screenHalf = window.innerWidth / 2;

    if (mouseX < screenHalf) {
      this.leftKeyPressed = true;
      this.rightKeyPressed = false;
    } else {
      this.rightKeyPressed = true;
      this.leftKeyPressed = false;
    }
  }
}

// Clase para el control táctil (móvil)
class TouchControl {
  constructor() {
    this.touchStartX = 0;
  }

  handleTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
    // Realiza acciones cuando se inicia el toque (por ejemplo, mover hacia arriba)
  }
}


// // En tu bucle de juego (gameLoop), puedes utilizar las instancias de las clases para controlar la lógica del juego.
// function gameLoop() {
//   if (!playerControl.gamePaused) {
//     // Implementa la lógica del bucle de juego aquí
//   }
//   requestAnimationFrame(gameLoop);
// }

// // Llamar al bucle de juego
// requestAnimationFrame(gameLoop);

// Exporta las clases como módulo

// Exporta la clase Fuel como módulo
const Controls = {
  KeyboardControl,
  MouseControl,
  TouchControl
}
export default Controls;

// // PHYSICS AND CONTROLS
// let spacecraftX = 100; // Posición horizontal inicial de la nave
// let spacecraftY = 50; // Position vertical inicial de la nave
// let velocityX = 0;
// let velocityY = 0;
// let fuel = 100;

// // CONTROLES
// // Variables para rastrear las teclas presionadas por el jugador
// let gamePaused = true; // Inicia el juego en pausa
// let leftKeyPressed = false; // Tecla A
// let rightKeyPressed = false; // Tecla D
// let upKeyPressed = false; // Tecla W

// // CONTROLES TECLADO Agregar eventos de teclado para detectar las teclas presionadas
// document.addEventListener("keydown", function (event) {
//   // añade aqui la variable de movimiento del raton en eje X
//   if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
//     leftKeyPressed = true;
//   } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
//     rightKeyPressed = true;
//   } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
//     upKeyPressed = true;
//   } else if (event.key === " ") {
//     // Tecla Espacio para pausar/reanudar el juego
//     gamePaused = !gamePaused;
//     if (!gamePaused) {
//       // Si se reanuda el juego, solicita un nuevo cuadro de animación
//       requestAnimationFrame(gameLoop);
//     } else {
//       if (isGameOver) {
//         restartGame();
//       } else {
//         pauseGame()
//       }
//     }
//   } else if (event.key === "r" || event.key === "R") {
//     // Tecla R para reiniciar el juego
//     restartGame();
//   }
// });

// // CONTROLES TECLADO Agregar eventos de teclado para detectar las teclas que dejan de ser presionadas
// document.addEventListener("keyup", function (event) {
//   if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
//     leftKeyPressed = false;
//   } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
//     rightKeyPressed = false;
//   } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
//     upKeyPressed = false;
//   } else if (event.key === " ") {
//     // Tecla Espacio liberada
//     // Puedes realizar alguna acción adicional aquí si es necesario
//   } else if (event.key === "r" || event.key === "R") {
//     // Tecla R liberada
//     // Puedes realizar alguna acción adicional aquí si es necesario
//   }
// });

// // CONTROLES RATON Agregar eventos de raton
// document.addEventListener("mousedown", function (event) {
//   // Verifica si se hizo clic en el botón izquierdo del ratón
//   if (event.button === 0) {
//     upKeyPressed = true;
//   }
// })
// document.addEventListener("mouseup", function (event) {
//   // Verifica si se soltó el botón izquierdo del ratón
//   if (event.button === 0) {
//     upKeyPressed = false;
//   }
// });
// document.addEventListener("mousemove", function (event) {
//   // Obtén la posición actual del ratón en el eje X
//   const mouseX = event.clientX;

//   // Define un umbral para determinar la mitad de la pantalla
//   const screenHalf = window.innerWidth / 2;

//   // Comprueba si el ratón está a la izquierda o a la derecha de la mitad de la pantalla
//   if (mouseX < screenHalf) {
//     // El ratón está a la izquierda de la mitad de la pantalla, puedes hacer algo para mover a la izquierda
//     leftKeyPressed = true;
//     rightKeyPressed = false; // Asegúrate de que no se esté presionando la tecla de mover a la derecha
//   } else {
//     // El ratón está a la derecha de la mitad de la pantalla, puedes hacer algo para mover a la derecha
//     rightKeyPressed = true;
//     leftKeyPressed = false; // Asegúrate de que no se esté presionando la tecla de mover a la izquierda
//   }
// });

// // CONTROLES MOVIL
// let touchStartX = 0;
// let touchEndX = 0;

// document.addEventListener("touchstart", function (event) {
//   // Obtén la posición X del primer toque
//   touchStartX = event.touches[0].clientX;

//   // Realiza alguna acción cuando se inicia el toque (por ejemplo, mover hacia arriba)
//   upKeyPressed = true;
// });

// Agregar más eventos táctiles según sea necesario para tu juego