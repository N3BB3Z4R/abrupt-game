class HUDController {
  constructor() {
    this.hud = document.getElementById('hud');
  }

  updateHUD({
    fuel,
    velocityY,
    spacecraftX,
    spacecraftY,
    flightTime,
    landed,
    crushed,
    crashed
  }) {
    if (landed && !crushed) {
      this.hud.innerHTML = `<span class="land-success">¡Aterrizaje exitoso!</span>`;
    } else if (landed && crushed) {
      this.hud.innerHTML = `<span class="land-success">¡Aterrizaje exitoso pero con daños!</span>`;
    } else if (crashed) {
      this.hud.innerHTML = `<span class="land-fail">¡Demasiado rápido!</span>`;
    } else if (crushed) {
      this.hud.innerHTML = `<span class="land-fail">¡Derribado por un meteorito!</span>`;
    } else if (fuel <= 0) {
      this.hud.innerHTML = `<span class="land-fail">¡Sin combustible!</span>`;
    } else {
      this.hud.innerHTML = `<span>Fuel: ${fuel.toFixed(2)}<br />
                            Falling velocity: ${velocityY - 0 ? velocityY.toFixed(2) : 0}<br />
                            Position: ${spacecraftX.toFixed(2)}, ${spacecraftY.toFixed(2)}<br />
                            Flight time: ${flightTime.toFixed(2)} seconds</span>`;
    }
  }

  drawPausedText(text, context, canvas) {
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText(text, canvas.width / 2 - 60, canvas.height / 2);
  }

  drawFinalScore(context, canvas) {
    context.font = "30px Arial";
    context.fillStyle = "yellow";
    const finalScore = `${elapsedTime.toFixed(2)}s`
    context.fillText(finalScore, canvas.width / 2 - 30, canvas.height / 2);
  }

  drawTime(context, elapsedTime) {
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText(`Time: ${elapsedTime.toFixed(2)}s`, 10, 30);
  }
}


// Exporta la clase HUDController como módulo
export default HUDController;

// Luego, puedes crear una instancia de la clase HUDController
// const hudController = new HUDController();

// En tu función drawHUD, puedes llamar al método updateHUD de la instancia hudController
// function drawHUD() {
// hudController.updateHUD(fuel, velocityY, spacecraftX, spacecraftY, flightTime, landed, crushed, crashed);
// }
