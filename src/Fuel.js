//#############################
//#
//#   FUEL
//#
//#
//#############################

import { variables, constants } from './Config'

export const fuelShape = [
  [" ", " ", "F", "F", "F"],
  ["F", " ", "F", " ", "F"],
  [" ", "F", "F", "F", "F"],
  [" ", "F", "F", "F", "F"],
  [" ", "F", "F", "F", "F"],
  [" ", "F", "F", "F", "F"],
]

export function createFuelItem(canvas) {
  const {
    fuelSize,
  } = constants

  const fuelItem = {
    x: Math.random() * canvas.width,
    y: 0, // Inicialmente, los objetos de fuel aparecen en la parte superior del lienzo
    size: constants.fuelSize, // Tamaño fijo para los objetos de fuel
    shape: fuelShape, // Matriz que representa la forma del objeto de fuel
    collected: false, // Indica si el objeto de fuel ha sido recogido
  }

  variables.fuelItems.push(fuelItem)
}

export function drawFuelItem(context, fuelItem) {
  const {
    pixelTypes,
    fuelColor,
  } = constants

  const {
    fuelItems
  } = variables

  context.fillStyle = fuelColor // Color rojo para los objetos de fuel
  for (const fuelItem of fuelItems) {
    if (!fuelItem.collected) {
      for (let row = 0; row < fuelItem.shape.length; row++) {
        for (let col = 0; col < fuelItem.shape[0].length; col++) {
          const pixel = fuelItem.shape[row][col]
          if (pixel === pixelTypes.fuel) {
            context.fillRect(
              fuelItem.x + col * fuelItem.size,
              fuelItem.y + row * fuelItem.size,
              fuelItem.size,
              fuelItem.size
            )
          }
        }
      }
    }
  }
}