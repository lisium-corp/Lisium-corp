// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    createParticleSystem();
    initializeHolographicCards();
    setupNavigation();
    createFloatingElements();
    initializeGlitchEffects();
    setupScrollAnimations();
    createNeuralNetwork();
}

// Sistema de partículas 3D
function createParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 1000;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.vz = (Math.random() - 0.5) * 5;
            this.size = Math.random() * 3 + 1;
            this.opacity = Math.random();
            this.color = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            if (this.z < 0 || this.z > 1000) this.vz *= -1;
            
            this.opacity = Math.sin(Date.now() * 0.01 + this.z * 0.01) * 0.5 + 0.5;
        }
        
        draw() {
            const scale = 1000 / (1000 + this.z);
            const x2d = this.x * scale;
            const y2d = this.y * scale;
            const size2d = this.size * scale;
            
            ctx.save();
            ctx.globalAlpha = this.opacity * 0.8;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(5, 5, 15, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Conectar partículas cercanas
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.save();
                    ctx.strokeStyle = `rgba(100, 200, 255, ${0.3 - distance / 300})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Redimensionar canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Tarjetas holográficas interactivas
function initializeHolographicCards() {
    const cards = document.querySelectorAll('.holo-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(20px)
            `;
            
            // Efecto de brillo seguidor
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.style.background = `
                    radial-gradient(circle at ${x}px ${y}px, 
                    rgba(255,255,255,0.3) 0%, 
                    transparent 50%)
                `;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Navegación futurista
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const indicator = document.querySelector('.nav-indicator');
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover clase activa de todos los items
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Mover indicador
            const itemRect = item.getBoundingClientRect();
            const navRect = item.parentElement.getBoundingClientRect();
            const position = itemRect.left - navRect.left;
            
            if (indicator) {
                indicator.style.transform = `translateX(${position}px)`;
                indicator.style.width = `${itemRect.width}px`;
            }
            
            // Efecto de onda
            createRippleEffect(e.target, e);
        });
    });
}

// Crear efecto de onda
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Elementos flotantes
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;
    
    const shapes = ['◆', '▲', '●', '■', '◇', '△'];
    
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.className = 'floating-shape';
        element.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        
        element.style.cssText = `
            position: absolute;
            color: hsl(${Math.random() * 60 + 180}, 70%, 60%);
            font-size: ${Math.random() * 20 + 10}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s infinite linear;
            opacity: 0.3;
            pointer-events: none;
        `;
        
        container.appendChild(element);
    }
}

// Efectos de glitch
function initializeGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        const originalText = element.textContent;
        
        setInterval(() => {
            if (Math.random() < 0.1) {
                const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
                let glitchedText = '';
                
                for (let i = 0; i < originalText.length; i++) {
                    if (Math.random() < 0.1) {
                        glitchedText += chars[Math.floor(Math.random() * chars.length)];
                    } else {
                        glitchedText += originalText[i];
                    }
                }
                
                element.textContent = glitchedText;
                
                setTimeout(() => {
                    element.textContent = originalText;
                }, 100);
            }
        }, 2000);
    });
}

// Animaciones de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Red neuronal visual
function createNeuralNetwork() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;
    
    const nodes = [];
    const connections = [];
    
    // Crear nodos
    for (let i = 0; i < 20; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: Math.random() * 3 + 2,
            activity: Math.random()
        });
    }
    
    // Crear conexiones
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() < 0.1) {
                connections.push({
                    from: i,
                    to: j,
                    strength: Math.random()
                });
            }
        }
    }
    
    function animateNeuralNetwork() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Actualizar y dibujar conexiones
        connections.forEach(conn => {
            const from = nodes[conn.from];
            const to = nodes[conn.to];
            
            ctx.strokeStyle = `rgba(0, 255, 255, ${conn.strength * 0.5})`;
            ctx.lineWidth = conn.strength * 2;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
            
            conn.strength = Math.sin(Date.now() * 0.01 + conn.from + conn.to) * 0.5 + 0.5;
        });
        
        // Actualizar y dibujar nodos
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            
            node.activity = Math.sin(Date.now() * 0.005 + node.x * 0.01) * 0.5 + 0.5;
            
            ctx.fillStyle = `rgba(0, 255, 255, ${node.activity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'cyan';
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animateNeuralNetwork);
    }
    
    animateNeuralNetwork();
}

// Cursor personalizado
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Efectos de audio visuales (simulados)
function createAudioVisualizer() {
    const bars = document.querySelectorAll('.audio-bar');
    
    setInterval(() => {
        bars.forEach(bar => {
            const height = Math.random() * 100;
            bar.style.height = height + '%';
            bar.style.backgroundColor = `hsl(${height * 3}, 70%, 60%)`;
        });
    }, 100);
}

// Inicializar visualizador de audio
setTimeout(createAudioVisualizer, 1000);