//#############################
//#
//#   EXPLOSIONS & PARTICLES
//#
//#
//#############################
// import { gameProps } from "./main"
import { constants, variables } from './Config'

// Funcion de redibujado segun los propulsionColors
export function updateEngineParticles() {
  const {
    initialParticleLifespan,
    propulsionColors,
  } = constants

  for (const particle of variables.engineParticles) {
    particle.lifespan-- // Reducir la vida de la partícula

    // Calcular el índice de color basado en el tiempo de vida restante
    const colorIndex = Math.floor((particle.lifespan / initialParticleLifespan) * propulsionColors.length)
    // generame una opcion alternativa para que la duracion del ciclo de cambio de color se ajuste a la vida de la particula
    const altColorIndex = Math.floor(((initialParticleLifespan - particle.lifespan) / initialParticleLifespan) * propulsionColors.length)

    // Establecer el color de la partícula basado en el índice de color
    particle.color = propulsionColors[altColorIndex]

    // Actualizar la posición de la partícula
    particle.x += particle.velocityX
    particle.y += particle.velocityY

    // Eliminar la partícula si su vida llega a cero
    if (particle.lifespan <= 0) {
      const particleIndex = variables.engineParticles.indexOf(particle)
      if (particleIndex !== -1) {
        variables.engineParticles.splice(particleIndex, 1)
      }
    }
  }
}

// Función jumpingPixels para simular una explosión de 5 píxeles
export function jumpingPixels(x, y, size) {
  const {
    explosionParticleSize,
    explosionNumberPixels
  } = constants

  const {
    velocityY
  } = variables

  let itemSize = typeof size === "number" ? size * explosionParticleSize / 3 : explosionParticleSize // Tamaño de los píxeles de la explosión
  const numPixels = explosionNumberPixels // Cantidad de píxeles en la explosión
  let explosionPixels = [] // Píxeles de la explosión

  for (let i = 0; i < numPixels; i++) {
    const pixel = {
      x: x,
      y: y,
      velocityX: (Math.random() - 0.5) * 2, // Velocidad horizontal aleatoria
      velocityY: velocityY + (Math.random() - 0.5) * 2, // Velocidad vertical aleatoria con base en la proporcionada
      color: getRandomColor(), // Color aleatorio
      size: Math.random() * itemSize, // Tamaño aleatorio
      lifespan: Math.random() * 30 + 10, // Vida aleatoria
    }
    explosionPixels.push(pixel)
  }

  return explosionPixels
}

// Función auxiliar para obtener un color aleatorio
export function getRandomColor() {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}