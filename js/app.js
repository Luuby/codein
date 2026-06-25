document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    initThreeJS();
    initCodeRain();
    handleNavigation();
    initTiltEffect();
});

const ADMIN_NUMBER = "62895370984939";
const COLORS = {
    violet: 0x8b5cf6,
    pink: 0xec4899,
    emerald: 0x10b981
};

// --- Enhanced Three.js Engine ---
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for complex objects
    const group = new THREE.Group();
    scene.add(group);

    // Geometry: Floating "Crystal" Logic
    const mainGeo = new THREE.IcosahedronGeometry(2, 1);
    const mainMat = new THREE.MeshPhysicalMaterial({
        color: COLORS.violet,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9,
        thickness: 0.5,
        iridescence: 1,
        iridescenceIOR: 1.3,
        transparent: true,
        opacity: 0.6
    });
    const mainMesh = new THREE.Mesh(mainGeo, mainMat);
    group.add(mainMesh);

    // Decorative floating octahedrons
    const points = [];
    for(let i=0; i<8; i++) {
        const geo = new THREE.OctahedronGeometry(0.3, 0);
        const mat = new THREE.MeshPhongMaterial({ color: i % 2 === 0 ? COLORS.pink : COLORS.emerald, flatShining: true });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6
        );
        mesh.userData = { speed: Math.random() * 0.02 };
        group.add(mesh);
        points.push(mesh);
    }

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const blueLight = new THREE.PointLight(COLORS.violet, 5, 10);
    blueLight.position.set(2, 2, 2);
    scene.add(blueLight);

    const pinkLight = new THREE.PointLight(COLORS.pink, 5, 10);
    pinkLight.position.set(-2, -2, 2);
    scene.add(pinkLight);

    // Animation
    let mX = 0, mY = 0;
    document.addEventListener('mousemove', (e) => {
        mX = (e.clientX / window.innerWidth) - 0.5;
        mY = (e.clientY / window.innerHeight) - 0.5;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        group.rotation.y += 0.003;
        mainMesh.rotation.x += 0.005;

        points.forEach(p => {
            p.position.y += Math.sin(Date.now() * 0.001 + p.position.x) * 0.01;
            p.rotation.z += p.userData.speed;
        });

        group.rotation.x += (mY * 0.5 - group.rotation.x) * 0.05;
        group.rotation.y += (mX * 0.5 - group.rotation.y) * 0.05;

        renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
}

// --- 3D Tilt Multi-Axis ---
function initTiltEffect() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (centerY - y) / 10;
            const rotateY = (x - centerX) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

// --- Digital Rain 3D ---
function initCodeRain() {
    const container = document.getElementById('code-rain');
    const snippets = ['{ code: "3D" }', 'crystal.render()', 'aurora.flow()', 'transcend()', 'await vision()', 'glass.blur++'];
    for(let i=0; i<40; i++) {
        const span = document.createElement('span');
        span.className = 'code-bg-item';
        span.innerText = snippets[Math.floor(Math.random() * snippets.length)];
        span.style.left = Math.random() * 100 + 'vw';
        span.style.animationDelay = Math.random() * 10 + 's';
        span.style.animationDuration = (8 + Math.random() * 12) + 's';
        container.appendChild(span);
    }
}

// --- Navigation & Core UI ---
function handleNavigation() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    document.querySelectorAll('.btn-contact-direct').forEach(btn => {
        btn.onclick = () => window.open(`https://wa.me/${ADMIN_NUMBER}?text=Halo admin Codein Studio!`, '_blank');
    });
}

async function fetchData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        renderPortfolio(data.portfolios);
        renderTestimonials(data.testimonials);
        setupFilters(data.portfolios);
        initScrollAnimations();
        setupWhatsAppLinks();
    } catch (err) { console.error(err); }
}

function renderPortfolio(items) {
    const container = document.getElementById('portfolio-container');
    container.innerHTML = '';
    items.forEach(item => {
        const html = `
            <div class="group relative overflow-hidden rounded-[40px] glass-v3 aspect-[12/10] fade-up-3d tilt-card" data-animate>
                <img src="${item.image}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all">
                    <span class="text-violet-400 text-[9px] uppercase font-black tracking-[0.3em] mb-2">${item.category}</span>
                    <h3 class="text-2xl font-bold text-white">${item.title}</h3>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
    initTiltEffect(); // Re-bind for new items
}

function renderTestimonials(items) {
    const container = document.getElementById('testimonials-container');
    container.innerHTML = '';
    items.forEach(item => {
        const html = `
            <div class="glass-v3 p-10 rounded-[40px] fade-up-3d relative overflow-hidden" data-animate>
                <div class="absolute top-0 right-0 p-8 text-white/5 text-6xl"><i class="fas fa-quote-right"></i></div>
                <p class="text-neutral-400 text-lg leading-relaxed relative z-10 italic">"${item.review}"</p>
                <div class="mt-8 flex items-center gap-5">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center font-black text-white shadow-lg">${item.name[0]}</div>
                    <div>
                        <div class="font-bold text-white">${item.name}</div>
                        <div class="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">JURUSAN: ${item.jurusan}</div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function setupFilters(all) {
    document.querySelectorAll('.filter-pill').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filter-pill').forEach(b => {
                b.classList.remove('active', 'bg-violet-500', 'text-white');
                b.classList.add('text-neutral-500');
            });
            btn.classList.add('active', 'bg-violet-500', 'text-white');
            btn.classList.remove('text-neutral-500');
            const f = btn.dataset.filter;
            renderPortfolio(f === 'all' ? all : all.filter(x => x.category === f));
            initScrollAnimations();
        };
    });
}

function setupWhatsAppLinks() {
    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.onclick = () => {
            const msg = `Halo Admin Codein, saya mau order paket ${btn.dataset.package}!`;
            window.open(`https://wa.me/${ADMIN_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        };
    });
}

function initScrollAnimations() {
    const obs = new IntersectionObserver(ents => {
        ents.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));
}

