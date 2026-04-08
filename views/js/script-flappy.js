'use strict';

class FlappyGame {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.bird = null;
    this.pipes = [];
    this.score = 0;
    this.isPlaying = false;
    // DIFICULTAD BALANCEADA
    this.gravity = -0.010;       // Caída moderada
    this.birdVelocity = 0;
    this.flapStrength = 0.30;    // Salto controlado
    this.pipeSpeed = 0.08;        // Velocidad media
    this.pipeSpawnTime = 0;
    this.pipeInterval = 100;      // Espaciado razonable
    this.gameOver = false;
    this.finalScore = 0;
    this.gapSize = 5.0;           // Espacio más grande para pasar

    this.init();
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 15);
    this.camera.lookAt(0, 5, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-flappy').appendChild(this.renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    this.scene.add(directionalLight);

    // Create bird
    this.createBird();

    // Create ground
    this.createGround();

    // Create background
    this.createBackground();

    // Event listeners
    document.addEventListener('keydown', (e) => this.handleInput(e));
    document.addEventListener('click', (e) => this.handleClick(e));
    document.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleInput();
    }, { passive: false });

    window.addEventListener('resize', () => this.onWindowResize());

    // Start button logic
    this.showStartScreen();
    
    // Animation loop
    this.animate();
  }

  handleClick(e) {
    // Don't trigger if clicking on buttons or links
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    this.handleInput();
  }

  createBird() {
    // Bird body
    const bodyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const bodyMaterial = new THREE.MeshToonMaterial({ color: 0xffd700 });
    this.bird = new THREE.Group();
    
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.bird.add(body);

    // Bird beak
    const beakGeometry = new THREE.ConeGeometry(0.15, 0.4, 8);
    const beakMaterial = new THREE.MeshToonMaterial({ color: 0xff6600 });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.5, 0, 0);
    this.bird.add(beak);

    // Bird eye
    const eyeGeometry = new THREE.SphereGeometry(0.12, 8, 8);
    const eyeMaterial = new THREE.MeshToonMaterial({ color: 0x000000 });
    const eyeWhiteGeometry = new THREE.SphereGeometry(0.18, 8, 8);
    const eyeWhiteMaterial = new THREE.MeshToonMaterial({ color: 0xffffff });

    const eyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
    eyeWhite.position.set(0.3, 0.2, 0.3);
    this.bird.add(eyeWhite);

    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(0.35, 0.22, 0.35);
    this.bird.add(eye);

    // Bird wing
    const wingGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.5);
    const wingMaterial = new THREE.MeshToonMaterial({ color: 0xffaa00 });
    this.wing = new THREE.Mesh(wingGeometry, wingMaterial);
    this.wing.position.set(-0.1, 0, 0.3);
    this.bird.add(this.wing);

    // Bird tail
    const tailGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.3);
    const tailMaterial = new THREE.MeshToonMaterial({ color: 0xff8800 });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(-0.6, 0, 0);
    this.bird.add(tail);

    this.bird.position.set(-3, 5, 0);
    this.scene.add(this.bird);
  }

  createGround() {
    const groundGeometry = new THREE.BoxGeometry(100, 2, 10);
    const groundMaterial = new THREE.MeshToonMaterial({ color: 0x228b22 });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.position.set(0, -1, 0);
    this.scene.add(this.ground);

    // Ground stripes for movement effect
    const stripeGeometry = new THREE.BoxGeometry(2, 2.1, 10);
    const stripeMaterial = new THREE.MeshToonMaterial({ color: 0x1a6b1a });
    this.stripes = [];
    for (let i = -25; i <= 25; i += 4) {
      const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
      stripe.position.set(i, -1, 0);
      this.scene.add(stripe);
      this.stripes.push(stripe);
    }
  }

  createBackground() {
    // Clouds
    const cloudGeometry = new THREE.SphereGeometry(2, 8, 8);
    const cloudMaterial = new THREE.MeshToonMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    
    this.clouds = [];
    for (let i = 0; i < 10; i++) {
      const cloud = new THREE.Group();
      for (let j = 0; j < 3; j++) {
        const sphere = new THREE.Mesh(cloudGeometry, cloudMaterial);
        sphere.position.set(j * 1.5 - 1.5, Math.random() * 0.5, Math.random() * 2 - 1);
        sphere.scale.set(1, 0.6, 1);
        cloud.add(sphere);
      }
      cloud.position.set(
        Math.random() * 60 - 30,
        Math.random() * 5 + 7,
        Math.random() * 10 - 15
      );
      this.scene.add(cloud);
      this.clouds.push(cloud);
    }
  }

  createPipe() {
    const pipeGroup = new THREE.Group();
    
    // Gap between pipes - ahora más grande
    const gapSize = this.gapSize;
    const gapY = Math.random() * 3 + 3.5; // Random height between 3.5 and 6.5
    
    // Top pipe
    const topPipeHeight = 15 - gapY - gapSize / 2;
    const topPipeGeometry = new THREE.BoxGeometry(2, topPipeHeight, 2);
    const pipeMaterial = new THREE.MeshToonMaterial({ color: 0x00cc00 });
    const topPipe = new THREE.Mesh(topPipeGeometry, pipeMaterial);
    topPipe.position.y = gapY + gapSize / 2 + topPipeHeight / 2;
    
    // Top pipe cap
    const capGeometry = new THREE.BoxGeometry(2.5, 0.8, 2.5);
    const capMaterial = new THREE.MeshToonMaterial({ color: 0x008800 });
    const topCap = new THREE.Mesh(capGeometry, capMaterial);
    topCap.position.y = gapY + gapSize / 2;

    // Bottom pipe
    const bottomPipeHeight = gapY - gapSize / 2 + 2;
    const bottomPipe = new THREE.Mesh(topPipeGeometry.clone(), pipeMaterial);
    bottomPipe.position.y = gapY - gapSize / 2 - bottomPipeHeight / 2 + 1;
    
    // Bottom pipe cap
    const bottomCap = new THREE.Mesh(capGeometry.clone(), capMaterial);
    bottomCap.position.y = gapY - gapSize / 2;

    pipeGroup.add(topPipe);
    pipeGroup.add(topCap);
    pipeGroup.add(bottomPipe);
    pipeGroup.add(bottomCap);
    
    pipeGroup.position.x = 25;
    pipeGroup.userData = {
      passed: false,
      gapY: gapY,
      gapSize: gapSize
    };

    this.scene.add(pipeGroup);
    this.pipes.push(pipeGroup);
  }

  handleInput(e) {
    if (e && e.keyCode && e.keyCode !== 32) return;
    
    if (!this.isPlaying && !this.gameOver) {
      this.startGame();
    } else if (!this.gameOver) {
      this.flap();
    }
  }

  flap() {
    this.birdVelocity = this.flapStrength;
  }

  startGame() {
    this.isPlaying = true;
    this.score = 0;
    this.updateScoreDisplay();
    const instructions = document.getElementById('instructions-flappy');
    const startBtn = document.getElementById('start-button-flappy');
    if (instructions) instructions.style.opacity = '0';
    if (startBtn) startBtn.style.opacity = '0';
  }

  showStartScreen() {
    const instructions = document.getElementById('instructions-flappy');
    const startBtn = document.getElementById('start-button-flappy');
    const gameOver = document.getElementById('game-over-flappy');
    
    if (instructions) instructions.style.opacity = '1';
    if (startBtn) startBtn.style.opacity = '1';
    if (gameOver) {
      gameOver.style.opacity = '0';
      gameOver.style.transform = 'translateY(-50px)';
    }
  }

  showGameOver() {
    this.gameOver = true;
    this.finalScore = this.score;
    
    const finalScoreEl = document.getElementById('final-score');
    const container = document.getElementById('container-flappy');
    const gameOverDiv = document.getElementById('game-over-flappy');
    
    if (finalScoreEl) finalScoreEl.textContent = this.finalScore;
    if (container) container.classList.add('ended');
    if (gameOverDiv) {
      gameOverDiv.style.opacity = '1';
      gameOverDiv.style.transform = 'translateY(0)';
    }
  }

  restartGame() {
    // Reset game state
    this.isPlaying = false;
    this.gameOver = false;
    this.score = 0;
    this.birdVelocity = 0;
    this.pipeSpawnTime = 0;
    this.finalScore = 0;

    // Remove all pipes
    for (const pipe of this.pipes) {
      this.scene.remove(pipe);
    }
    this.pipes = [];

    // Reset bird position
    this.bird.position.set(-3, 5, 0);
    this.bird.rotation.z = 0;

    // Remove 'ended' class from container
    const container = document.getElementById('container-flappy');
    if (container) container.classList.remove('ended');

    // Update displays
    this.updateScoreDisplay();
    this.showStartScreen();
  }

  updateScoreDisplay() {
    const scoreEl = document.getElementById('score-flappy');
    if (scoreEl) scoreEl.textContent = this.score;
  }

  checkCollision() {
    const birdX = this.bird.position.x;
    const birdY = this.bird.position.y;
    const birdRadius = 0.5;

    // Ground collision
    if (birdY - birdRadius < 0) {
      return true;
    }

    // Ceiling collision
    if (birdY + birdRadius > 12) {
      return true;
    }

    // Pipe collision
    for (const pipe of this.pipes) {
      const pipeX = pipe.position.x;
      const gapY = pipe.userData.gapY;
      const gapSize = pipe.userData.gapSize;

      // Check if bird is within pipe x range
      if (birdX > pipeX - 1.25 && birdX < pipeX + 1.25) {
        // Check if bird is outside the gap
        if (birdY - birdRadius < gapY - gapSize / 2 || birdY + birdRadius > gapY + gapSize / 2) {
          return true;
        }
      }
    }

    return false;
  }

  checkScore() {
    for (const pipe of this.pipes) {
      if (!pipe.userData.passed && pipe.position.x < this.bird.position.x) {
        pipe.userData.passed = true;
        this.score++;
        this.updateScoreDisplay();
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.isPlaying && !this.gameOver) {
      // Bird physics
      this.birdVelocity += this.gravity;
      this.bird.position.y += this.birdVelocity;
      
      // Bird rotation based on velocity
      this.bird.rotation.z = Math.max(-0.5, Math.min(this.birdVelocity * 2, 1));
      
      // Wing animation
      if (this.birdVelocity > 0) {
        this.wing.rotation.z = Math.sin(Date.now() * 0.02) * 0.3;
      }

      // Spawn pipes
      this.pipeSpawnTime++;
      if (this.pipeSpawnTime >= this.pipeInterval) {
        this.createPipe();
        this.pipeSpawnTime = 0;
      }

      // Move pipes
      for (let i = this.pipes.length - 1; i >= 0; i--) {
        const pipe = this.pipes[i];
        pipe.position.x -= this.pipeSpeed;

        // Remove pipes that are off screen
        if (pipe.position.x < -15) {
          this.scene.remove(pipe);
          this.pipes.splice(i, 1);
        }
      }

      // Move clouds
      this.clouds.forEach(cloud => {
        cloud.position.x -= 0.01;
        if (cloud.position.x < -35) {
          cloud.position.x = 35;
        }
      });

      // Move ground stripes
      this.stripes.forEach(stripe => {
        stripe.position.x -= this.pipeSpeed;
        if (stripe.position.x < -27) {
          stripe.position.x = 27;
        }
      });

      // Check score
      this.checkScore();

      // Check collision
      if (this.checkCollision()) {
        this.showGameOver();
      }
    }

    // Idle animation when not playing
    if (!this.isPlaying && !this.gameOver) {
      this.bird.position.y = 5 + Math.sin(Date.now() * 0.003) * 0.5;
      this.bird.rotation.z = Math.sin(Date.now() * 0.003) * 0.1;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Start the game
window.addEventListener('DOMContentLoaded', () => {
  new FlappyGame();
});
