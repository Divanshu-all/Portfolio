// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    feather.replace();

    // Mobile Menu Logic
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
    });

    closeBtn.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
        });
    });
    
    // Project Modal Logic
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('project-modal');
    const modalContent = projectModal.querySelector('.modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalDetails = document.getElementById('modal-details');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            modalTitle.textContent = card.dataset.title;
            modalDetails.textContent = card.dataset.details;
            projectModal.classList.remove('hidden');
            setTimeout(() => {
                projectModal.classList.remove('opacity-0');
                modalContent.classList.remove('scale-95', 'opacity-0');
            }, 10);
        });
    });

    function closeModal() {
        modalContent.classList.add('scale-95', 'opacity-0');
        projectModal.classList.add('opacity-0');
        setTimeout(() => {
            projectModal.classList.add('hidden');
        }, 300);
    }

    modalCloseBtn.addEventListener('click', closeModal);
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });

    // Typewriter Effect Logic
    function setupTypewriter(element, text, callback) {
        let i = 0;
        element.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor"></span>';
        const textElement = element.querySelector('.typewriter-text');
        const cursorElement = element.querySelector('.typewriter-cursor');
        
        function type() {
            if (i < text.length) {
                textElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50); // Typing speed
            } else {
                if (callback) {
                    setTimeout(callback, 700); 
                } else {
                    // Keep cursor blinking at the end
                }
            }
        }
        type();
    }

    const text1 = "Hello! I'm Divanshu, a final-year Computer Science student from the beautiful town of Sundernagar, Himachal Pradesh. My passion lies at the intersection of artificial intelligence and automation—I love building smart systems that solve complex problems and streamline processes.";
    const text2 = "From crafting intelligent AI Agents with Generative AI to designing end-to-end automation workflows, my goal is to engineer solutions that are both powerful and precise. I'm constantly exploring new technologies and pushing the boundaries of what's possible with code.";

    // Function to draw SVG paths for the skills tree
    function updateSvgPaths() {
        // The md breakpoint in Tailwind is 768px
        if (window.innerWidth < 768) {
            return; // Don't draw paths on mobile
        }

        const container = document.getElementById('skills-tree');
        const rootEl = container.querySelector('.skills-root');
        const leftBranch = container.querySelector('.md\\:right-1\\/2');
        const rightBranch = container.querySelector('.md\\:left-1\\/2');

        if (!container || !rootEl || !leftBranch || !rightBranch) return;

        const containerRect = container.getBoundingClientRect();
        const rootRect = rootEl.getBoundingClientRect();
        const leftRect = leftBranch.getBoundingClientRect();
        const rightRect = rightBranch.getBoundingClientRect();

        // Calculate coordinates relative to the container
        const startX = rootRect.left + rootRect.width / 2 - containerRect.left;
        const startY = rootRect.top + rootRect.height / 2 - containerRect.top;

        const leftEndX = leftRect.right - containerRect.left;
        const leftEndY = leftRect.top + leftRect.height / 2 - containerRect.top;
        
        const rightEndX = rightRect.left - containerRect.left;
        const rightEndY = rightRect.top + rightRect.height / 2 - containerRect.top;

        // Define bezier curve control points for a smooth arc
        const controlX1_left = startX - 100;
        const controlX2_left = leftEndX + 100;
        
        const controlX1_right = startX + 100;
        const controlX2_right = rightEndX - 100;

        const pathLeft = `M ${startX} ${startY} C ${controlX1_left} ${startY}, ${controlX2_left} ${leftEndY}, ${leftEndX} ${leftEndY}`;
        const pathRight = `M ${startX} ${startY} C ${controlX1_right} ${startY}, ${controlX2_right} ${rightEndY}, ${rightEndX} ${rightEndY}`;

        document.getElementById('pipe-left').setAttribute('d', pathLeft);
        document.getElementById('liquid-left').setAttribute('d', pathLeft);
        document.getElementById('pipe-right').setAttribute('d', pathRight);
        document.getElementById('liquid-right').setAttribute('d', pathRight);
    }

    // Three.js Background Animation
    let scene, camera, renderer, particles, shapesGroup, mouse, originalPositions;
    const canvas = document.getElementById('bg-canvas');

    function initThreeJS() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;
        
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        mouse = new THREE.Vector2(-100, -100);

        // Particles
        const particleCount = 5000;
        const p_geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 200;
        }
        originalPositions = Float32Array.from(positions);
        p_geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const p_material = new THREE.PointsMaterial({ size: 0.07, color: 0x818cf8 });
        particles = new THREE.Points(p_geometry, p_material);
        scene.add(particles);

        // Larger Shapes
        shapesGroup = new THREE.Group();
        const shapeCount = 25;
        const shapeGeometries = [
            new THREE.BoxGeometry(2, 2, 2), new THREE.SphereGeometry(1.5, 16, 16),
            new THREE.TorusGeometry(1.5, 0.5, 16, 100), new THREE.IcosahedronGeometry(2, 0)
        ];
        const shapeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true, transparent: true, opacity: 0.2 });
        for (let i = 0; i < shapeCount; i++) {
            const geometry = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
            const shape = new THREE.Mesh(geometry, shapeMaterial);
            shape.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
            shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            shapesGroup.add(shape);
        }
        scene.add(shapesGroup);

        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('mousemove', onMouseMove, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        updateSvgPaths();
    }
    
    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    function animate() {
        requestAnimationFrame(animate);

        shapesGroup.rotation.y -= 0.0005;
        shapesGroup.rotation.x -= 0.0003;

        // Interactive particle animation
        const positions = particles.geometry.attributes.position.array;
        const particleCount = positions.length / 3;
        
        let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        let dir = vector.sub(camera.position).normalize();
        let distance = -camera.position.z / dir.z;
        let mousePoint = camera.position.clone().add(dir.multiplyScalar(distance));

        for (let i = 0; i < particleCount; i++) {
            const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
            
            const dx = mousePoint.x - originalPositions[ix];
            const dy = mousePoint.y - originalPositions[iy];
            const dist = Math.sqrt(dx * dx + dy * dy);

            const waveStrength = 15.0;
            const waveRadius = 25.0;

            let targetZ = originalPositions[iz];

            if (dist < waveRadius) {
                const factor = (1 - (dist / waveRadius));
                targetZ += Math.pow(factor, 2) * waveStrength;
            }
            
            positions[iz] += (targetZ - positions[iz]) * 0.1;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    // --- Initialization ---
    initThreeJS();
    animate();

    // Start typewriter after a brief delay
    setTimeout(() => {
        const typewriterEl1 = document.getElementById('typewriter-1');
        const typewriterEl2 = document.getElementById('typewriter-2');
        setupTypewriter(typewriterEl1, text1, () => {
            typewriterEl1.querySelector('.typewriter-cursor').style.display = 'none';
            setupTypewriter(typewriterEl2, text2);
        });
    }, 500);

    // Calculate SVG paths after layout is stable
    setTimeout(updateSvgPaths, 100);
});
