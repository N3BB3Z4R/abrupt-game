// gameVariables.js

// Terrain Generation
export const terrainUnitWidth = 2;
export const terrainUnitHeight = 2;
export const peakChance = 0.0;
export const holeChance = 0.6;
export const terrainColor = '#332';

// Ship Generation
export const spacecraftWidth = 8;
export const spacecraftHeight = 8;
export const engineParticles = [];
export const engineParticleSize = 4;
export const engineHorizontalPower = 0.1;
export const propulsionColors = ['#FFA', '#3FF', '#FD3', '#FF4400'];
export let engineVerticalPower = 0.11;

// Asteroids Generation
export let asteroidProbability = 0.02;
export const asteroidProbabilityIncrement = 0.0005;
export const asteroidProbabilityIncrementTime = 5;
export const asteroidAverageSize = 10;
export const minAsteroidSize = 12;
export const maxAsteroidSize = 20;
export const asteroidColor = '#346';
export const asteroidVelocityX = 0.6;
export const asteroidVelocityY = 0.6;
export let pixelSizeAsteroid = null;

// Particle Generation
export const initialParticleLifespan = 40;
export const lifespan = 30;
export const explosionNumberPixels = 15;
export const explosionParticleSize = 5;

// Game variables
export const maxLandingSpeed = 1.5;
export let landed = false;
export let crashed = false;
export let crushed = false;
export let flightTime = 0;
export let elapsedTime = 0;
export let startTime;
export let isGameOver = false;

// Pixel Types
export const pixelTypes = {
  space: ' ',
  mountain: '+',
  hole: '-',
  asteroid: 'A',
  ship: 'S',
  fuel: 'F',
};

// import {
//   terrainUnitWidth,
//   terrainUnitHeight,
//   peakChance,
//   holeChance,
//   terrainColor,
//   flightTime,
//   elapsedTime,
//   startTime,
//   isGameOver,
//   pixelTypes,
// } from './gameVariables.js';
