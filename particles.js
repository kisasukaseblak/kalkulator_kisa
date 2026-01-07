// Particle System for Enhanced Visual Effects
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 50;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Add particles on button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('neon-btn')) {
                this.createClickEffect(e.clientX, e.clientY);
            }
        });
    }

    createClickEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            const particle = new ClickParticle(x, y);
            this.particles.push(particle);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();
            particle.draw(this.ctx);
            
            // Remove dead particles
            if (particle.isDead()) {
                this.particles.splice(i, 1);
            }
        }
        
        // Maintain particle count
        while (this.particles.length < this.maxParticles) {
            this.particles.push(new Particle(this.canvas));
        }
        
        // Draw connections between nearby particles
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                if (p1.type === 'floating' && p2.type === 'floating') {
                    const distance = Math.sqrt(
                        Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
                    );
                    
                    if (distance < 150) {
                        const opacity = (150 - distance) / 150 * 0.1;
                        this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.stroke();
                    }
                }
            }
        }
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.type = 'floating';
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.hue = Math.random() * 60 + 180; // Cyan to blue range
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around edges
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
        
        // Subtle size pulsing
        this.size += Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.01;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Create gradient
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, `hsl(${this.hue}, 100%, 70%)`);
        gradient.addColorStop(1, `hsl(${this.hue}, 100%, 30%)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    isDead() {
        return false; // Floating particles don't die
    }
}

class ClickParticle {
    constructor(x, y) {
        this.type = 'click';
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.size = Math.random() * 4 + 2;
        this.opacity = 1;
        this.decay = 0.02;
        this.hue = Math.random() * 60 + 180;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.opacity -= this.decay;
        this.size *= 0.99;
    }

    draw(ctx) {
        if (this.opacity <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Create glowing effect
        ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
        ctx.shadowBlur = 10;
        
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    isDead() {
        return this.opacity <= 0;
    }
}

// Enhanced Button Effects
class ButtonEffects {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.neon-btn').forEach(btn => {
            this.addButtonEffects(btn);
        });
    }

    addButtonEffects(button) {
        // Add particle effect on hover
        button.addEventListener('mouseenter', () => {
            this.createHoverParticles(button);
        });

        // Add ripple effect on click
        button.addEventListener('click', (e) => {
            this.createRippleEffect(button, e);
        });
    }

    createHoverParticles(button) {
        const rect = button.getBoundingClientRect();
        const particleContainer = button.querySelector('.btn-particles');
        
        if (!particleContainer) return;

        // Clear existing particles
        particleContainer.innerHTML = '';

        // Create floating particles
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: currentColor;
                border-radius: 50%;
                pointer-events: none;
                opacity: 0.6;
                animation: floatUp 2s ease-out forwards;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${i * 0.2}s;
            `;
            particleContainer.appendChild(particle);
        }

        // Add CSS animation if not exists
        if (!document.getElementById('floatUpAnimation')) {
            const style = document.createElement('style');
            style.id = 'floatUpAnimation';
            style.textContent = `
                @keyframes floatUp {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 0.6;
                    }
                    100% {
                        transform: translateY(-20px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createRippleEffect(button, event) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
            z-index: 1;
        `;

        button.style.position = 'relative';
        button.appendChild(ripple);

        // Add ripple animation if not exists
        if (!document.getElementById('rippleAnimation')) {
            const style = document.createElement('style');
            style.id = 'rippleAnimation';
            style.textContent = `
                @keyframes ripple {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Initialize particle system and effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure canvas is ready
    setTimeout(() => {
        new ParticleSystem();
        new ButtonEffects();
    }, 100);
});