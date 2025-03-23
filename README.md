# 3D Game with Babylon.js

A simple 3D game created with Babylon.js featuring physics, player controls, and obstacles.
### Play game :  https://shahalt1.github.io/game/
## Features

- 3D scene with ground, walls, and various obstacles
- Player-controlled sphere with keyboard input
- Physics and collision detection
- Camera following the player
- Simple UI with controls instructions and reset button

## How to Run

1. Open `index.html` in a web browser.
   - For best results, use Chrome, Firefox, or Edge.
   - You may need to run a local server for better performance.

2. Simple local server options:
   - Using Python:
     ```
     python -m http.server
     ```
   - Using Node.js:
     ```
     npx serve
     ```

## Controls

- **W, A, S, D**: Move the player in the respective directions
- **Space**: Jump (only works when touching the ground)
- **Mouse**: Rotate and zoom the camera
- **Reset Button**: Click to reset the player position if you fall off the map

## Game Structure

- `index.html`: The main HTML file that loads the game
- `js/game.js`: The JavaScript file containing all game logic
  - Scene initialization
  - Object creation
  - Input handling
  - Physics setup
  - Game loop

## Dependencies

All dependencies are included via CDN links in the HTML file:
- Babylon.js: Main 3D engine
- Cannon.js: Physics engine
- Babylon.js Loaders: For loading assets

## Future Enhancements

Possible improvements for future versions:
- Add collectible items
- Implement score tracking
- Create multiple levels
- Add sound effects and music
- Improve graphics with textures and lighting effects

## Credits

Created using the Babylon.js framework (https://www.babylonjs.com/) 
