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
      velocityY: velocityY + (Math.random() - 0.5) * 3, // Velocidad vertical aleatoria con base en la proporcionada
      color: getRandomColor(), // Color aleatorio
      size: Math.random() * itemSize, // Tamaño aleatorio
      lifespan: Math.random() * 30 + 10, // Vida aleatoria
    }
    explosionPixels.push(pixel)
  }

  return explosionPixels
}

// Función auxiliar para obtener un color aleatorio
// export function getRandomColor() {
//   const letters = "0123456789ABCDEF"
//   let color = "#"
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)]
//   }
//   return color
// }
// Función auxiliar para obtener un color aleatorio o ajustar el brillo de un color existente
export function getRandomColor(baseColor) {
  const letters = "0123456789ABCDEF";

  if (baseColor) {
    // Si se proporciona un color base, ajusta el brillo aleatoriamente
    let adjustedColor = "#";
    for (let i = 1; i < 7; i++) {
      const baseHex = baseColor[i];
      let randomHex = baseHex;

      // Ajusta el brillo aleatoriamente
      if (Math.random() > 0.5) {
        randomHex = letters[Math.floor(Math.random() * 16)];
      }

      adjustedColor += randomHex;
    }

    return adjustedColor;
  } else {
    // Si no se proporciona un color base, genera un color aleatorio
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

// Función para simular humo de la nave al estrellarse
export function smokeCrashedShip(canvas, context) {
  const {
    smokeParticleSize,
    smokeNumberParticles
  } = constants;

  const {
    spacecraftX,
    spacecraftY,
    crashed,
    spacecraftHeight // Altura de la nave
  } = variables;

  let itemSize = smokeParticleSize; // Tamaño de los píxeles de la explosión
  const numParticles = smokeNumberParticles; // Cantidad de píxeles en la explosión
  let smokeParticles = [];

  if (crashed) {
    for (let i = 0; i < numParticles; i++) {
      const angle = (Math.random() - 0.5) * Math.PI / 9; // Ángulo aleatorio entre -10 y 10 grados
      const speed = Math.random() * 2 + 0.5; // Velocidad aleatoria

      const particle = {
        x: spacecraftX + 2 + Math.random(),
        y: spacecraftY + 2 + Math.random(),
        velocityX: speed * Math.cos(angle) / 3, // Componente X de la velocidad
        velocityY: -speed * Math.sin(angle) / 3, // Componente Y de la velocidad (hacia arriba)
        color: '#777777', // Color aleatorio
        size: Math.random() * itemSize * 2.4, // Tamaño aleatorio
        lifespan: Math.random() * 300 + 10, // Vida aleatoria
      };

      smokeParticles.push(particle);
    }
  }

  for (const particle of smokeParticles) {
    particle.lifespan--; // Reducir la vida de la partícula

    // Actualizar la posición de la partícula
    particle.x += particle.velocityX;
    particle.y += particle.velocityY;

    // Eliminar la partícula si su vida llega a cero
    if (particle.lifespan <= 0 || (spacecraftY + 1 - particle.y) >= spacecraftHeight * 2) {
      const particleIndex = smokeParticles.indexOf(particle);
      if (particleIndex !== -1) {
        smokeParticles.splice(particleIndex, 1);
      }
    }
  }

  // Dibujar las partículas de humo en el lienzo
  for (const particle of smokeParticles) {
    context.fillStyle = particle.color; // Establecer el color de relleno
    context.fillRect(particle.x, particle.y, particle.size, particle.size); // Dibujar la partícula
  }

  return smokeParticles;
}



