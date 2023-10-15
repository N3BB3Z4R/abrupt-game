//#############################
//#
//#   UTILS
//#
//#
//#############################

// Reiniciar el juego
export function restartGame() {
  // FORCE reload page
  location.reload(true)
}

// DETECT THE HEIGHT AND THE WIDTH OF THE VIEWPORT
export const detectViewportSize = (canvas) => {
  const viewportWidth = window.innertHeight
  const viewportHeight = window.innerWidth
  // add the property width and height to the canvas
  canvas.setAttribute("style", `width: ${viewportWidth}px; height: ${viewportHeight}; aspect-ratio: 16/9;`)
}
