class SpacecraftPhysics {
  constructor(spacecraft, terrainUnitWidth, terrainUnitHeight, surface, engineHorizontalPower, engineVerticalPower, fuel, crushed, crashed, landed, maxLandingSpeed, jumpingPixels) {
    this.spacecraft = spacecraft;
    this.terrainUnitWidth = terrainUnitWidth;
    this.terrainUnitHeight = terrainUnitHeight;
    this.surface = surface;
    this.engineHorizontalPower = engineHorizontalPower;
    this.engineVerticalPower = engineVerticalPower;
    this.fuel = fuel;
    this.crushed = crushed;
    this.crashed = crashed;
    this.landed = landed;
    this.maxLandingSpeed = maxLandingSpeed;
    this.jumpingPixels = jumpingPixels;
  }

  calculateThrust() {
    const thrustX = Math.sin(this.spacecraft.rotationAngle) * this.engineHorizontalPower;
    const thrustY = -Math.cos(this.spacecraft.rotationAngle) * this.engineVerticalPower;

    return { thrustX, thrustY };
  }

  applyThrust(upKeyPressed) {
    if (upKeyPressed && this.fuel > 0 && !this.crushed && !this.crashed && !this.landed) {
      const { thrustX, thrustY } = this.calculateThrust();
      this.spacecraft.velocityX += thrustX;
      this.spacecraft.velocityY += thrustY;
      this.fuel -= this.crushed ? 0.3 : 0.1;
    }
  }

  checkCollisionWithTerrain() {
    const columnX = Math.floor(this.spacecraft.spacecraftX / this.terrainUnitWidth);
    const columnY = Math.floor(this.spacecraft.spacecraftY / this.terrainUnitHeight);

    if (
      columnX >= 0 &&
      columnX < this.surface.length &&
      columnY >= 0 &&
      columnY < this.surface[columnX].length &&
      this.surface[columnX][columnY] === '-'
    ) {
      if (Math.abs(this.spacecraft.velocityX) > this.maxLandingSpeed || Math.abs(this.spacecraft.velocityY) > this.maxLandingSpeed) {
        this.crashed = true;
        this.engineVerticalPower = 0;
        this.spacecraft.velocityY = 0;
        console.log("¡Nave accidentada!");

        const explosion = this.jumpingPixels(this.spacecraft.spacecraftX, this.spacecraft.spacecraftY, -1.5);
        this.engineParticles.push(...explosion);
      } else {
        this.landed = this.crashed ? false : true;
        this.spacecraft.velocityY = 0;
        console.log("¡Aterrizaje exitoso!");
      }
      this.spacecraft.velocityY = 0;
      // drawFinalScore();
    }
  }

  checkCollisionWithAsteroids(asteroids) {
    for (let i = 0; i < asteroids.length; i++) {
      const asteroid = asteroids[i];

      for (let row = 0; row < this.spacecraft.spacecraftShape.length; row++) {
        for (let col = 0; col < this.spacecraft.spacecraftShape[0].length; col++) {
          if (
            this.spacecraft.spacecraftShape[row][col] === '#' &&
            isPixelInsideAsteroid(
              this.spacecraft.spacecraftX + col * this.spacecraft.pixelSizeShip,
              this.spacecraft.spacecraftY + row * this.spacecraft.pixelSizeShip,
              asteroid
            )
          ) {
            this.crushed = true;

            const explosion = this.jumpingPixels(this.spacecraft.spacecraftX, this.spacecraft.spacecraftY, -1.5);
            this.engineParticles.push(...explosion);

            asteroids.splice(i, 1);
            i--;
            return;
          }
        }
      }
    }
  }
}

class AsteroidPhysics {
  constructor(asteroids, terrainUnitWidth, terrainUnitHeight, surface, engineParticles, jumpingPixels) {
    this.asteroids = asteroids;
    this.terrainUnitWidth = terrainUnitWidth;
    this.terrainUnitHeight = terrainUnitHeight;
    this.surface = surface;
    this.engineParticles = engineParticles;
    this.jumpingPixels = jumpingPixels;
  }

  updateAsteroids() {
    for (let i = 0; i < this.asteroids.length; i++) {
      const asteroidA = this.asteroids[i];

      for (let j = i + 1; j < this.asteroids.length; j++) {
        const asteroidB = this.asteroids[j];

        if (
          asteroidA.x < asteroidB.x + asteroidB.size &&
          asteroidA.x + asteroidA.size > asteroidB.x &&
          asteroidA.y < asteroidB.y + asteroidB.size &&
          asteroidA.y + asteroidA.size > asteroidB.y
        ) {
          const angle = Math.atan2(asteroidB.y - asteroidA.y, asteroidB.x - asteroidA.x);
          const speedA = Math.sqrt(asteroidA.vx * asteroidA.vx + asteroidA.vy * asteroidA.vy);
          const speedB = Math.sqrt(asteroidB.vx * asteroidB.vx + asteroidB.vy * asteroidB.vy);

          const newVXA = (speedA * Math.cos(angle)) / 2;
          const newVYA = (speedA * Math.sin(angle)) / 2;
          const newVXB = (speedB * Math.cos(angle)) / 2;
          const newVYB = (speedB * Math.sin(angle)) / 2;

          asteroidA.vx = newVXA;
          asteroidA.vy = newVYA;
          asteroidB.vx = newVXB;
          asteroidB.vy = newVYB;

          const explosionA = this.jumpingPixels(asteroidA.x, asteroidA.y, -1.5);
          const explosionB = this.jumpingPixels(asteroidB.x, asteroidB.y, -1.5);

          this.engineParticles.push(...explosionA, ...explosionB);

          this.asteroids.splice(i, 1);
          this.asteroids.splice(j - 1, 1);
          i--;
          break;
        }
      }

      const columnX = Math.floor(asteroidA.x / this.terrainUnitWidth);
      const columnY = Math.floor(asteroidA.y / this.terrainUnitHeight);

      if (
        columnX >= 0 &&
        columnX < this.surface.length &&
        columnY >= 0 &&
        columnY < this.surface[columnX].length &&
        this.surface[columnX][columnY] === '-'
      ) {
        this.asteroids.splice(i, 1);
        i--;

        this.jumpingPixels(asteroidA.x, asteroidA.y, -1.5);
      } else {
        asteroidA.x += asteroidA.vx;
        asteroidA.y += asteroidA.vy;
      }
    }
  }
}

// Función para verificar si un píxel está dentro de un asteroide
function isPixelInsideAsteroid(pixelX, pixelY, asteroid) {
  return (
    pixelX >= asteroid.x &&
    pixelX <= asteroid.x + asteroid.size &&
    pixelY >= asteroid.y &&
    pixelY <= asteroid.y + asteroid.size
  );
}

const Physics = {
  SpacecraftPhysics,
  AsteroidPhysics,
  isPixelInsideAsteroid
};

export default Physics;
