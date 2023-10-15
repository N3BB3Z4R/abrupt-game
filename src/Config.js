const gameSpeed = 2 // Speed of the game

// ### CONSTANT VARIABLES ###
export const constants = {
  terrainUnitWidth: 2, // Width of terrain unit
  terrainUnitHeight: 2, // Height of terrain unit
  maxHoleWidth: 9, // Maximum hole width
  minHoleWidth: 2, // Minimum hole width
  peakChance: 0.0, // Chance of having a mountain
  holeChance: 0.6, // Chance of having a hole
  terrainColor: "#332", // Ground color
  spacecraftWidth: 8, // Spacecraft width
  spacecraftHeight: 8, // Spacecraft height
  pixelSizeShip: 3, // Size of spacecraft pixel
  engineParticleSize: 4, // Size of engine particles
  asteroidProbabilityIncrementTime: 5, // Seconds to increment the probability
  asteroidAverageSize: 10, // Average size of asteroids
  asteroidProbability: 0.02, // Mutable probability of asteroid appearance
  minAsteroidSize: 12, // Minimum size of asteroids
  maxAsteroidSize: 20, // Maximum size of asteroids
  asteroidColor: "#346", // Color of asteroids
  asteroidVelocityX: 0.5 * gameSpeed, // Horizontal velocity of asteroids
  asteroidVelocityY: 0.5 * gameSpeed, // Vertical velocity of asteroids
  initialParticleLifespan: 40, // Initial lifespan of engine particles
  lifespan: 30, // Lifespan of engine particles
  explosionNumberPixels: 15, // Number of pixels in the explosion
  explosionParticleSize: 5, // Size of pixels in the explosion
  maxLandingSpeed: 1.5 * gameSpeed, // Maximum landing speed
  incrementVelocityY: 0.1 * gameSpeed, // Increment in vertical velocity
  incrementFuelItem: 20, // Fuel amount added when collecting a fuel item
  propulsionColors: ["#FFA", "#3FF", "#FD3", "#FF4400"], // Colors for propulsion
  smokeParticleSize: 4, // Size of smoke particles
  smokeNumberParticles: 20, // Number of particles in the smoke
  pixelTypes: {
    space: " ",
    mountain: "+",
    hole: "-",
    asteroid: "A",
    ship: "S",
    fuel: "F",
  },
  fuelColor: "#FF0000",
  fuelQuantityToAdd: 20,
  fuelSize: 4,
};

// ### MUTABLE VARIABLES ###
export let variables = {
  fuelItems: [],
  fuelItemsToKeep: [],
  fuelVelocityY: 0.6,
  shipRotationAngle: 0, // Initial rotation angle of the spacecraft
  fuel: 100, // Initial fuel amount
  engineParticles: [], // Array to store engine particles
  elapsedFlightTime: 0, // Elapsed flight time in seconds
  elapsedTime: 0, // Counter of total time on air
  flightTime: 0, // Total flight time in seconds
  startTime: undefined, // Start time of the game
  isGameOver: false, // Game over state
  asteroids: [], // Array to store asteroids
  pixelSizeAsteroid: 0, // Initial value for asteroid pixel size
  landed: false, // Landing state
  crashed: false, // Collision state
  crushed: false, // Crushed state
  leftKeyPressed: false, // Left arrow key state (A key)
  rightKeyPressed: false, // Right arrow key state (D key)
  upKeyPressed: false, // Up arrow key state (W key)
  gamePaused: true, // Initial game paused state
  spacecraftX: 100, // Initial horizontal position of the spacecraft
  spacecraftY: 50, // Initial vertical position of the spacecraft
  velocityX: 0, // Horizontal velocity of the spacecraft
  velocityY: 0, // Vertical velocity of the spacecraft
  engineHorizontalPower: 0.1 * gameSpeed, // Horizontal propulsion power
  engineVerticalPower: 0.11 * gameSpeed, // Vertical propulsion power
  shipRotationSpeed: 0.02, // Rotation speed of the spacecraft
  asteroidProbabilityIncrement: 0.0005, // Probability increment for asteroids
  controlOption: "keyboard", // Define the input type of the user
};


// HOW TO:

// Importa las constantes y variables mutables
// import { constants, variables } from './tu_archivo.js';

// Acceso a las constantes
// const {
//   gameSpeed,
//   terrainUnitWidth,
//   terrainUnitHeight,
//   maxHoleWidth,
//   minHoleWidth,
//   peakChance,
//   holeChance,
//   terrainColor,
//   spacecraftWidth,
//   spacecraftHeight,
//   pixelSizeShip,
//   engineParticleSize,
//   engineHorizontalPower,
//   asteroidProbabilityIncrementTime,
//   asteroidAverageSize,
//   minAsteroidSize,
//   maxAsteroidSize,
//   asteroidColor,
//   asteroidVelocityX,
//   asteroidVelocityY,
//   initialParticleLifespan,
//   lifespan,
//   explosionNumberPixels,
//   explosionParticleSize,
//   maxLandingSpeed,
//   incrementVelocityY,
//   fuel,
//   incrementFuelItem,
//   propulsionColors,
//   shipRotationAngle,
//   elapsedFlightTime,
//   flightTime,
//   startTime,
//   isGameOver,
// } = constants;

// Acceso a las variables mutables
// let {
//   asteroids,
//   asteroidProbability,
//   pixelSizeAsteroid,
//   landed,
//   crashed,
//   crushed,
//   leftKeyPressed,
//   rightKeyPressed,
//   upKeyPressed,
//   gamePaused,
//   spacecraftX,
//   spacecraftY,
//   velocityX,
//   velocityY,
//   engineVerticalPower,
//   shipRotationSpeed,
//   asteroidProbabilityIncrement,
// } = variables;