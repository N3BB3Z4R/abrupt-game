//#############################
//#
//#   AUDIO SFX
//#
//#
//#############################
import { variables } from "./Config"

const sfxTypes = {
  start: {
    url: './sfx/start.wav',
    volume: 0.20
  },
  pause: {
    url: './sfx/pause.wav',
    volume: 0.10
  },
  thrust: {
    url: './sfx/thrust.ogg',
    volume: 0.2
  },
  collision: {
    url: './sfx/collision.wav',
    volume: 0.2
  },
  pickFuel: {
    url: './sfx/pickFuel.wav',
    volume: 0.15
  },
  crashed: {
    url: './sfx/crashed.wav',
    volume: 0.2
  },
  hit1: {
    url: './sfx/hit1.wav',
    volume: 0.1
  },
  hit2: {
    url: './sfx/hit2.wav',
    volume: 0.3
  },
  hit3: {
    url: './sfx/hit3.wav',
    volume: 0.3
  },
}

export const playSfx = (sfx) => {
  if (sfx !== 'thrust') {
    const pickedSfx = sfxTypes[sfx]
    const audio = new Audio(pickedSfx.url)
    audio.volume = pickedSfx.volume
    audio.play()
  }
}

let thrustSound; // Define la variable fuera de la función para mantener el estado del sonido.

export const playThrust = () => {
  if (variables.isGameOver) return
  if (variables.upKeyPressed) {
    if (!thrustSound) {
      // Si el sonido no está definido, créalo y comience a reproducirlo.
      thrustSound = new Audio(sfxTypes['thrust'].url);
      thrustSound.volume = sfxTypes['thrust'].volume;
      thrustSound.loop = true; // Repetir el sonido mientras se mantiene presionada la tecla.
      thrustSound.play();
    }
  } else {
    // Si upKeyPressed es falso, detén y borra el sonido si existe.
    if (thrustSound) {
      thrustSound.pause();
      thrustSound = null;
    }
  }
}
