//#############################
//#
//#   HUD
//#
//#
//#############################

import { variables, constants } from "./Config"
import { displayWrapper } from './main'

// DRAW HUD
export function drawHUD(crashed, crushed, landed, velocityY, fuel, spacecraftX, spacecraftY, flightTime) {
  const hud = document.getElementById("hud")
  const dataPlaying = `<span>Fuel: ${fuel.toFixed(2)}<br />
                      Falling velocity: ${velocityY - 0 ? velocityY.toFixed(2) : 0}<br />
                      Position: ${spacecraftX.toFixed(2)}, ${spacecraftY.toFixed(2)}<br />
                      Flight time: ${flightTime.toFixed(2)} seconds</span>`

  const dataLanded = "<span class=\"land-success\">¡Aterrizaje exitoso!</span>"
  const dataForceLanded = "<span class=\"land-success\">¡Aterrizaje exitoso pero con daños!</span>"
  const dataCrashed = "<span class=\"land-fail\">¡Demasiado rápido!</span>"
  const dataCrushed = "<span class=\"land-fail\">¡Derribado por un meteorito!</span>"
  const dataNoFuel = "<span class=\"land-fail\">¡Sin combustible!</span>"
  // termina el juego
  if (landed && !crushed) {
    hud.innerHTML = dataLanded
  } else if (landed && crushed) {
    hud.innerHTML = dataForceLanded
  } else if (crashed) {
    hud.innerHTML = dataCrashed
  } else if (crushed) {
    hud.innerHTML = dataCrushed
  } else if (fuel <= 0) {
    hud.innerHTML = dataNoFuel
  } else {
    hud.innerHTML = dataPlaying
  }
}

export function drawPausedText(text, canvas, context) {
  context.font = "30px pixelfont"
  context.fillStyle = "white"
  context.fillText(text, canvas.width / 2 - 60, canvas.height / 2)
}

export function drawTextOnScreen(text, context, canvas) {
  context.font = "30px pixelfont"
  context.fillStyle = "white"

  // Calcula las coordenadas para centrar el texto en el eje x
  const textWidth = context.measureText(text).width
  const x = (canvas.width - textWidth) / 2

  // Calcula las coordenadas para colocar el texto un poco arriba del centro
  const y = canvas.height / 2 - 30 // 30 es la mitad de la altura de la fuente (30px en este caso)

  context.fillText(text, x, y)
}

export function drawFinalScore(context, canvas, elapsedTime) {
  context.font = "30px pixelfont"
  context.fillStyle = "yellow"
  const finalScore = `${elapsedTime.toFixed(2)}s`
  context.fillText(finalScore, canvas.width / 2 - 30, canvas.height / 2)
}

export function drawTime(context, canvas) {
  context.font = "30px pixelfont";
  context.fillStyle = "white";
  // create inner html element with a div that contains the emoji in a span and other span with the variables.elapsedTime
  const text = `🕑 ${variables.elapsedTime.toFixed(2)}s`;
  const textWidth = context.measureText(text).width;
  const x = (canvas.width - textWidth) / 2;
  const y = 4; // Ajuste para 4 píxeles por debajo del borde superior
  context.fillText(text, x, 30 + y + 20); // Agregar "y" al valor vertical (30) para mover el texto hacia abajo
}

export function drawFuel(context) {
  context.font = "20px pixelfont";
  context.fillStyle = "white";
  context.fillText(`⛽ ${variables.fuel.toFixed(2)}`, 10, 30 + 10); // Agregar 4 al valor vertical (30) para mover el texto hacia abajo
}

export function drawSpeed(context, velocityY) {
  context.font = "20px pixelfont";
  context.fillStyle = "white";

  // Coloca el texto en la esquina superior derecha
  const x = context.canvas.width - 120; // Ajusta el valor para mover el texto hacia la izquierda o derecha
  const y = 30 + 4; // Ajusta el valor para mover el texto hacia abajo en 4 píxeles
  context.fillText(`🚀 ${velocityY < 0 ? Math.abs(velocityY.toFixed(2)) : 0}`, x, y + 8);
}

export function paintHitInBorder() {

  // Remove class glow-green and add glow-red
  displayWrapper.classList.remove("glow-green");
  displayWrapper.classList.add("glow-red");

  // Wait 400ms and restore glow-green
  if (!variables.landed && !variables.crashed) {
    setTimeout(() => {
      displayWrapper.classList.remove("glow-red");
      displayWrapper.classList.add("glow-green");
    }, 200);
  }
}