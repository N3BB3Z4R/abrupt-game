// Uso de la clase TerrainGenerator
// const terrainGenerator = new TerrainGenerator(800, 600);
// terrainGenerator.drawTerrain(context, terrainColor, terrainUnitWidth, terrainUnitHeight);

class TerrainGenerator {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.surface = this.generateTerrain();
  }

  generateTerrain() {
    const surface = [];
    const maxHeight = Math.floor(this.height * 0.7); // Altura máxima de las montañas
    const minHeight = Math.floor(this.height * 0.3); // Altura mínima de los huecos
    const midHeight = Math.floor((maxHeight + minHeight) / 1.2); // Altura media

    for (let x = 0; x < this.width; x++) {
      const column = [];
      for (let y = 0; y < this.height; y++) {
        let terrainType = ' '; // Espacio en blanco en el aire por defecto

        // Genera montañas
        if (Math.random() < peakChance) {
          const heightValue = Math.floor(Math.random() * (maxHeight - midHeight)) + midHeight;
          if (y < heightValue) {
            terrainType = '+'; // Representa una montaña
          }
        }

        // Genera huecos
        if (Math.random() < holeChance) {
          const depthValue = Math.floor(Math.random() * (midHeight - minHeight)) + minHeight;
          if (y >= midHeight && y < midHeight + depthValue) {
            terrainType = '-'; // Representa un hueco
          }
        }

        column.push(terrainType);
      }
      surface.push(column);
    }

    return surface;
  }

  drawTerrain(context, terrainColor, terrainUnitWidth, terrainUnitHeight) {
    for (let x = 0; x < this.surface.length; x++) {
      for (let y = 0; y < this.surface[x].length; y++) {
        if (this.surface[x][y] === '-') {
          context.fillStyle = terrainColor; // Color del suelo
          context.fillRect(x * terrainUnitWidth, y * terrainUnitHeight, terrainUnitWidth, terrainUnitHeight);
        }
      }
    }
  }
}

// exporta la clase TerrainGenerator como modulo
export default TerrainGenerator;