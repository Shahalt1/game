/**
 * Babylon.js 3D Game
 * A simple 3D game with physics, player controls, and obstacles
 */

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get the canvas element and engine
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    
    // Game variables
    let scene, camera, player;
    let playerSpeed = 2.5;
    let playerJumpForce = 10;
    let keysPressed = {};
    let playerOnGround = false;
    
    // Create the main scene
    createScene();
    
    // Start the render loop
    engine.runRenderLoop(function() {
        scene.render();
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        engine.resize();
    });
    
    /**
     * Creates the main game scene
     */
    function createScene() {
        // Create a new scene
        scene = new BABYLON.Scene(engine);
        
        // Setup physics
        scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
        
        // Create camera
        camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 15, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 5;
        camera.upperRadiusLimit = 20;
        
        // Create lighting
        const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light1.intensity = 0.7;
        
        const light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(0, -1, 1), scene);
        light2.intensity = 0.5;
        
        // Create environment
        createEnvironment();
        
        // Create player
        createPlayer();
        
        // Setup input handling
        setupInputHandling();
        
        // Add game loop
        scene.registerBeforeRender(gameLoop);
        
        // Setup reset button
        document.getElementById('resetButton').addEventListener('click', resetGame);
        
        return scene;
    }
    
    /**
     * Creates the game environment (ground and obstacles)
     */
    function createEnvironment() {
        // Create ground
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 30, height: 30}, scene);
        ground.position.y = 0;
        
        // Ground material
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.2);
        ground.material = groundMaterial;
        
        // Add physics to ground
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(
            ground, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { mass: 0, restitution: 0.1, friction: 0.1 }, 
            scene
        );
        
        // Create walls to keep player from falling off
        createWalls();
        
        // Create obstacles
        createObstacles();
    }
    
    /**
     * Creates walls around the ground
     */
    function createWalls() {
        const wallHeight = 2;
        const wallThickness = 1;
        const groundSize = 30;
        
        // Wall material
        const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
        wallMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        
        // North wall
        const northWall = BABYLON.MeshBuilder.CreateBox("northWall", {
            width: groundSize, 
            height: wallHeight, 
            depth: wallThickness
        }, scene);
        northWall.position = new BABYLON.Vector3(0, wallHeight / 2, -groundSize / 2);
        northWall.material = wallMaterial;
        northWall.physicsImpostor = new BABYLON.PhysicsImpostor(
            northWall, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { mass: 0, restitution: 0.1 }, 
            scene
        );
        
        // South wall
        const southWall = BABYLON.MeshBuilder.CreateBox("southWall", {
            width: groundSize, 
            height: wallHeight, 
            depth: wallThickness
        }, scene);
        southWall.position = new BABYLON.Vector3(0, wallHeight / 2, groundSize / 2);
        southWall.material = wallMaterial;
        southWall.physicsImpostor = new BABYLON.PhysicsImpostor(
            southWall, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { mass: 0, restitution: 0.1 }, 
            scene
        );
        
        // East wall
        const eastWall = BABYLON.MeshBuilder.CreateBox("eastWall", {
            width: wallThickness, 
            height: wallHeight, 
            depth: groundSize
        }, scene);
        eastWall.position = new BABYLON.Vector3(groundSize / 2, wallHeight / 2, 0);
        eastWall.material = wallMaterial;
        eastWall.physicsImpostor = new BABYLON.PhysicsImpostor(
            eastWall, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { mass: 0, restitution: 0.1 }, 
            scene
        );
        
        // West wall
        const westWall = BABYLON.MeshBuilder.CreateBox("westWall", {
            width: wallThickness, 
            height: wallHeight, 
            depth: groundSize
        }, scene);
        westWall.position = new BABYLON.Vector3(-groundSize / 2, wallHeight / 2, 0);
        westWall.material = wallMaterial;
        westWall.physicsImpostor = new BABYLON.PhysicsImpostor(
            westWall, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { mass: 0, restitution: 0.1 }, 
            scene
        );
    }
    
    /**
     * Creates various obstacles in the scene
     */
    function createObstacles() {
        // Obstacle material
        const obstacleMaterial = new BABYLON.StandardMaterial("obstacleMaterial", scene);
        obstacleMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.3, 0.3);
        
        // Create different types of obstacles
        
        // Cube obstacles
        const positions = [
            new BABYLON.Vector3(5, 1, 5),
            new BABYLON.Vector3(-7, 1, 3),
            new BABYLON.Vector3(0, 1, -8),
            new BABYLON.Vector3(-5, 1, -5)
        ];
        
        positions.forEach((position, index) => {
            const cube = BABYLON.MeshBuilder.CreateBox(`cube${index}`, {
                width: 2, 
                height: 2, 
                depth: 2
            }, scene);
            cube.position = position;
            cube.material = obstacleMaterial;
            cube.physicsImpostor = new BABYLON.PhysicsImpostor(
                cube, 
                BABYLON.PhysicsImpostor.BoxImpostor, 
                { mass: 0, restitution: 0.1 }, 
                scene
            );
        });
        
        // Cylinder obstacle
        const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {
            height: 4,
            diameter: 3
        }, scene);
        cylinder.position = new BABYLON.Vector3(8, 2, -3);
        cylinder.material = obstacleMaterial;
        cylinder.physicsImpostor = new BABYLON.PhysicsImpostor(
            cylinder, 
            BABYLON.PhysicsImpostor.CylinderImpostor, 
            { mass: 0, restitution: 0.1 }, 
            scene
        );
        
        // Ramp obstacle
        const ramp = BABYLON.MeshBuilder.CreateBox("ramp", {
            width: 6,
            height: 2,
            depth: 4
        }, scene);
        ramp.position = new BABYLON.Vector3(-3, 1, 8);
        ramp.rotation.x = Math.PI / 12; // slight tilt
        ramp.material = obstacleMaterial;
        ramp.physicsImpostor = new BABYLON.PhysicsImpostor(
            ramp, 
            BABYLON.PhysicsImpostor.BoxImpostor, 
            { mass: 0, restitution: 0.1, friction: 0.3 }, 
            scene
        );
    }
    
    /**
     * Creates the player-controlled object
     */
    function createPlayer() {
        // Create player sphere
        player = BABYLON.MeshBuilder.CreateSphere("player", {diameter: 1.5}, scene);
        player.position = new BABYLON.Vector3(0, 3, 0);
        
        // Player material
        const playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
        playerMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.8);
        playerMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.5);
        player.material = playerMaterial;
        
        // Add physics to player
        player.physicsImpostor = new BABYLON.PhysicsImpostor(
            player, 
            BABYLON.PhysicsImpostor.SphereImpostor, 
            { mass: 1, restitution: 0.2, friction: 0.5 }, 
            scene
        );
        
        // Make camera follow player
        camera.setTarget(player.position);
    }
    
    /**
     * Sets up keyboard input handling
     */
    function setupInputHandling() {
        // Key down event
        scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                keysPressed[kbInfo.event.key.toLowerCase()] = true;
                
                // Jump on space if on ground
                if (kbInfo.event.key === " " && playerOnGround) {
                    player.physicsImpostor.applyImpulse(
                        new BABYLON.Vector3(0, playerJumpForce, 0),
                        player.getAbsolutePosition()
                    );
                    playerOnGround = false;
                }
            }
        });
        
        // Key up event
        scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
                keysPressed[kbInfo.event.key.toLowerCase()] = false;
            }
        });
        
        // Ray to check if player is on ground
        scene.registerBeforeRender(() => {
            const origin = player.position;
            const direction = new BABYLON.Vector3(0, -1, 0);
            const length = 1.0;
            const ray = new BABYLON.Ray(origin, direction, length);
            
            const hit = scene.pickWithRay(ray);
            playerOnGround = hit.hit && hit.distance <= 0.75;
        });
    }
    
    /**
     * Game loop function called before each render
     */
    function gameLoop() {
        // Get camera forward and right vectors for movement relative to camera
        const cameraForward = new BABYLON.Vector3(0, 0, 1);
        cameraForward.applyRotationQuaternion(camera.absoluteRotation);
        cameraForward.y = 0; // We don't want to move up/down when looking up/down
        cameraForward.normalize();
        
        const cameraRight = BABYLON.Vector3.Cross(cameraForward, new BABYLON.Vector3(0, 1, 0));
        cameraRight.normalize();
        
        // Movement forces
        let movementX = 0;
        let movementZ = 0;
        
        if (keysPressed["w"]) {
            movementZ -= playerSpeed;
        }
        if (keysPressed["s"]) {
            movementZ += playerSpeed;
        }
        if (keysPressed["a"]) {
            movementX -= playerSpeed;
        }
        if (keysPressed["d"]) {
            movementX += playerSpeed;
        }
        
        // Apply movement in camera relative directions
        if (movementX !== 0 || movementZ !== 0) {
            const movement = cameraRight.scale(movementX).add(cameraForward.scale(movementZ));
            player.physicsImpostor.applyForce(movement, player.getAbsolutePosition());
        }
        
        // Update camera target
        camera.setTarget(player.position);
        
        // Check if player fell off the map
        if (player.position.y < -10) {
            resetGame();
        }
    }
    
    /**
     * Resets the game and player position
     */
    function resetGame() {
        // Reset player position
        player.position = new BABYLON.Vector3(0, 3, 0);
        player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        player.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
        
        // Reset camera
        camera.setTarget(player.position);
    }
}); 