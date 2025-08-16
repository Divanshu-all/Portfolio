// --- Thunderstorm Animation (Common to all pages) ---
function initThunderstormAnimation() {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let raindrops = [];
    let lightning = [];

    class Raindrop {
        constructor(x, y, length, speed) {
            this.x = x;
            this.y = y;
            this.length = length;
            this.speed = speed;
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.length);
            ctx.strokeStyle = 'rgba(173, 216, 230, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        update() {
            this.y += this.speed;
            if (this.y > canvas.height) {
                this.y = -this.length;
                this.x = Math.random() * canvas.width;
            }
            this.draw();
        }
    }

    class Lightning {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = 0;
            this.path = [{ x: this.x, y: this.y }];
            this.alpha = 1;
            
            while(this.path[this.path.length - 1].y < canvas.height * 0.7) {
                const lastPoint = this.path[this.path.length - 1];
                const newY = lastPoint.y + (Math.random() * 20 + 10);
                const newX = lastPoint.x + (Math.random() * 20 - 10);
                this.path.push({ x: newX, y: newY });
            }
        }
        draw() {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath();
            ctx.moveTo(this.path[0].x, this.path[0].y);
            for(let i = 1; i < this.path.length; i++) {
                ctx.lineTo(this.path[i].x, this.path[i].y);
            }
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.1})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
            
            this.alpha -= 0.04;
        }
    }

    function init() {
        raindrops = [];
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const length = Math.random() * 15 + 5;
            const speed = Math.random() * 4 + 1;
            raindrops.push(new Raindrop(x, y, length, speed));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        raindrops.forEach(drop => drop.update());
        if (Math.random() < 0.003) {
            lightning.push(new Lightning());
        }
        lightning.forEach((bolt, index) => {
            bolt.draw();
            if (bolt.alpha <= 0) {
                lightning.splice(index, 1);
            }
        });
    }
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    init();
    animate();
}


// --- Page-Specific Logic ---

// Home Page (index.html)
function initHomePage() {
    // Typewriter effect
    const roles = ["Software Developer", "AI Engineer", "Automation Specialist", "Full Stack Developer"];
    let roleIndex = 0, charIndex = 0;
    const roleText = document.getElementById("role-text");

    function typeRole() {
        if (charIndex < roles[roleIndex].length) {
            roleText.textContent = roles[roleIndex].substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeRole, 100);
        } else {
            setTimeout(eraseRole, 2000);
        }
    }
    function eraseRole() {
        if (charIndex > 0) {
            roleText.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(eraseRole, 50);
        } else {
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeRole, 300);
        }
    }
    typeRole();

    // GSAP animations
    gsap.to("#hero-title", { opacity: 1, y: -10, duration: 1 });
    gsap.to("#hero-subtext", { opacity: 1, y: -10, duration: 1, delay: 0.5 });
    gsap.to("#hero-buttons", { opacity: 1, y: -10, duration: 1, delay: 1 });
}

// Projects Page (project.html)
function initProjectsPage() {
    gsap.from("#projects-title", { opacity: 0, y: -20, duration: 1, delay: 0.2 });
    gsap.from("#projects-subtitle", { opacity: 0, y: -20, duration: 1, delay: 0.4 });
    gsap.from(".project-card", { 
        opacity: 0, 
        y: 20, 
        duration: 0.8, 
        stagger: 0.1, 
        delay: 0.6 
    });

    const slider = document.getElementById('projectSlider');
    const nextBtn = document.getElementById('nextProjects');
    const prevBtn = document.getElementById('prevProjects');
    let offset = 0;

    nextBtn.addEventListener('click', () => {
        offset = -100;
        slider.style.transform = `translateX(${offset}%)`;
        nextBtn.classList.add('hidden');
        prevBtn.classList.remove('hidden');
    });

    prevBtn.addEventListener('click', () => {
        offset = 0;
        slider.style.transform = `translateX(${offset}%)`;
        prevBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');
    });
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Skills Page (skills.html)
function initSkillsPage() {
    gsap.from("#skills-title", { opacity: 0, y: -20, duration: 1, delay: 0.2 });
    gsap.from("#skills-subtitle", { opacity: 0, y: -20, duration: 1, delay: 0.4 });

    gsap.utils.toArray('.skill-bar-item').forEach((item, index) => {
        const bar = item.querySelector('.skill-bar-fill');
        const level = bar.getAttribute('data-skill-level');
        const percentText = item.querySelector('.skill-percent-value');
        const delay = 0.6 + index * 0.1;

        gsap.to(item, { opacity: 1, y: 0, duration: 0.8, delay: delay, ease: 'power2.out' });
        gsap.to(bar, { width: `${level}%`, duration: 1.5, delay: delay + 0.2, ease: 'power3.out' });

        let counter = { val: 0 };
        gsap.to(counter, {
            val: level,
            duration: 1.5,
            delay: delay + 0.2,
            ease: 'power3.out',
            onUpdate: () => {
                percentText.textContent = Math.round(counter.val);
            }
        });
    });
}

// Certifications Page (certifications.html)
function initCertsPage() {
    gsap.from("#certs-title", { opacity: 0, y: -20, duration: 1, delay: 0.2 });
    gsap.from("#certs-subtitle", { opacity: 0, y: -20, duration: 1, delay: 0.4 });

    gsap.utils.toArray('.cert-card').forEach((card, index) => {
        gsap.fromTo(card, 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 0.8, delay: 0.6 + index * 0.15, ease: 'power2.out' }
        );
    });
}


// --- Main Execution ---
document.addEventListener('DOMContentLoaded', () => {
    // Determine which page is loaded by checking for a unique element
    if (document.getElementById('hero-title')) {
        initHomePage();
    }
    if (document.getElementById('projectSlider')) {
        initProjectsPage();
    }
    if (document.querySelector('.skill-bar-item')) {
        initSkillsPage();
    }
    if (document.querySelector('.cert-card')) {
        initCertsPage();
    }
    
    // Run background animation on any page that has the canvas element
    if (document.getElementById('background-canvas')) {
        initThunderstormAnimation();
    }
});
