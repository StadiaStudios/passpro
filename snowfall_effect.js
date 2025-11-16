/**
 * Snowfall Effect Script (snowfall_effect.js)
 * Automatically creates a full-screen, straight-down snowfall canvas animation.
 * To use, simply include this file in your HTML: <script src="snowfall_effect.js"></script>
 */

function startSnowfall() {
    // 1. Create and configure the canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'snowCanvas';

    // Apply necessary CSS styles to make it fixed, full-screen, and non-interactive
    canvas.style.cssText = `
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000; /* Ensures snow is above all other content */
        pointer-events: none; /* Allows user clicks to pass through the canvas */
        background-color: transparent; /* Ensure the canvas itself is transparent */
    `;
    
    if (!document.body) {
        console.error("Snowfall script: document.body is not yet available. Retrying on window load.");
        window.addEventListener('load', startSnowfall);
        return;
    }
    
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let snowflakes = [];
    
    // --- Configuration ---
    // Adjust these values to customize the speed and density of the snow.
    const maxSnowflakes = 150; 
    const snowConfig = {
        minRadius: 1,
        maxRadius: 4,
        minSpeed: 2,   // Controls the minimum speed (increased for the 'moving up' effect)
        maxSpeed: 5,   // Controls the maximum speed
        windStrength: 0, // Set to 0 for perfectly straight down movement
        color: '#FFFFFF'
    };

    // --- Snowflake Class ---
    class Snowflake {
        constructor() {
            this.reset();
            // Randomly set x and y to fill the initial screen
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
        }

        reset() {
            // Initialize/reset position (start above the screen)
            this.x = Math.random() * canvas.width;
            this.y = -Math.random() * canvas.height; 
            this.radius = Math.random() * (snowConfig.maxRadius - snowConfig.minRadius) + snowConfig.minRadius;
            this.speed = Math.random() * (snowConfig.maxSpeed - snowConfig.minSpeed) + snowConfig.minSpeed;
        }

        update() {
            // Apply pure vertical movement (straight down)
            this.y += this.speed;

            // If snowflake falls below the bottom edge, reset it to the top
            if (this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = snowConfig.color;
            // Add a slight shadow or blur for a softer look
            ctx.shadowBlur = this.radius * 0.5;
            ctx.shadowColor = snowConfig.color;
            ctx.fill();
        }
    }

    // --- Core Functions ---

    // Adjusts canvas size to fill the window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Initialize the array of snowflakes
    function initSnowflakes() {
        snowflakes = [];
        for (let i = 0; i < maxSnowflakes; i++) {
            snowflakes.push(new Snowflake());
        }
    }

    // The main animation loop
    function animate() {
        // Clear the entire canvas
        // Note: For a true 'motion blur' effect, you could use a semi-transparent clear instead:
        // ctx.fillStyle = 'rgba(11, 28, 46, 0.1)'; 
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height); 

        // Turn off shadows when clearing or drawing non-snow elements
        ctx.shadowBlur = 0;

        // Draw and update each snowflake
        for (let i = 0; i < snowflakes.length; i++) {
            snowflakes[i].update();
            snowflakes[i].draw();
        }

        // Request the next frame for smooth animation
        requestAnimationFrame(animate);
    }

    // --- Initialization and Events ---

    // Initial setup
    resizeCanvas();
    initSnowflakes();
    animate();

    // Redraw and re-initialize on window resize for responsiveness
    window.addEventListener('resize', () => {
        resizeCanvas();
        initSnowflakes();
    });
}

// Automatically start the snowfall once the DOM content is loaded
document.addEventListener('DOMContentLoaded', startSnowfall);
