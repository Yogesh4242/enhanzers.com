'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import * as THREE from 'three';

// Lenis Smooth Scroll types
declare global {
  interface Window {
    Lenis: any;
  }
}

export default function AgencySite() {
  const [isHovered, setIsHovered] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);
  const [text2Visible, setText2Visible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Handle Scroll Animation for Text
  useEffect(() => {
    const handleScroll = () => {
      const text2 = document.getElementById('text-2');
      if (text2) {
        const rect = text2.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setText2Visible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    const arrowTimeout = setTimeout(() => setShowArrow(true), 100);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(arrowTimeout);
    };
  }, []);

  // Handle menu item clicks
  const handleMenuClick = (sectionId: string) => {
    setIsMenuOpen(false);
    setHoveredItem(null);
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      setHoveredItem(null);
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);

  // Function to convert text to double-struck mathematical font
  const toDoubleStruck = (text: string): string => {
    const doubleStruckMap: { [key: string]: string } = {
      'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾',
      'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ',
      'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌',
      'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
      'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘',
      'h': '𝕙', 'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟',
      'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦',
      'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
      ' ': ' '
    };

    return text.split('').map(char => doubleStruckMap[char] || char).join('');
  };

  const menuItems = [
    { id: 'home', defaultText: 'Home', defaultFont: 'font-serif font-normal', hoverFont: 'font-mono font-bold', defaultSize: 'text-4xl md:text-5xl lg:text-6xl', hoverSize: 'text-4xl md:text-5xl lg:text-6xl' },
    { id: 'work', defaultText: 'Work', defaultFont: 'font-serif font-normal', hoverFont: 'font-mono font-bold', defaultSize: 'text-4xl md:text-5xl lg:text-6xl', hoverSize: 'text-4xl md:text-5xl lg:text-6xl' },
    { id: 'about', defaultText: 'About', defaultFont: 'font-serif font-normal', hoverFont: 'font-mono font-bold', defaultSize: 'text-4xl md:text-5xl lg:text-6xl', hoverSize: 'text-4xl md:text-5xl lg:text-6xl' },
    { id: 'contact', defaultText: 'Contact', defaultFont: 'font-serif font-normal', hoverFont: 'font-mono font-bold', defaultSize: 'text-4xl md:text-5xl lg:text-6xl', hoverSize: 'text-4xl md:text-5xl lg:text-6xl' }
  ];

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    // Load Lenis from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js';
    script.async = true;
    
    script.onload = () => {
      const lenis = new window.Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // Store lenis instance for cleanup
      (window as any).lenisInstance = lenis;
    };

    document.head.appendChild(script);

    return () => {
      if ((window as any).lenisInstance) {
        (window as any).lenisInstance.destroy();
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Three.js Logic
  useEffect(() => {
    // Check if we are in the browser and have the ref
    if (typeof window === 'undefined' || !mountRef.current) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    const mount = mountRef.current;
    mount.appendChild(renderer.domElement);

    // --- OBJECTS ---
    const group = new THREE.Group();
    scene.add(group);

    // Create black rings with glowing auras
    const ringGeometry = new THREE.TorusGeometry(8, 0.3, 32, 100);
    const glowGeometry = new THREE.TorusGeometry(8, 0.5, 32, 100);
    
    // Ring 1 - Black with blue glow aura
    const ring1Material = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        emissive: 0x000000,
        metalness: 0.9,
        roughness: 0.2,
    });
    const ring1GlowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x3b82f6,
        transparent: true, 
        opacity: 0.3,
        side: THREE.DoubleSide,
    });
    const ring1 = new THREE.Mesh(ringGeometry, ring1Material);
    const ring1Glow = new THREE.Mesh(glowGeometry, ring1GlowMaterial);
    ring1.position.set(-3, 0, 0);
    ring1Glow.position.set(-3, 0, 0);
    ring1.rotation.x = Math.PI / 4;
    ring1Glow.rotation.x = Math.PI / 4;
    
    // Point light for ring 1 glow
    const light1 = new THREE.PointLight(0x3b82f6, 2, 20);
    light1.position.set(-3, 0, 0);
    
    group.add(ring1);
    group.add(ring1Glow);
    group.add(light1);

    // Ring 2 - Black with purple glow aura
    const ring2Material = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        emissive: 0x000000,
        metalness: 0.9,
        roughness: 0.2,
    });
    const ring2GlowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xa855f7,
        transparent: true, 
        opacity: 0.3,
        side: THREE.DoubleSide,
    });
    const ring2 = new THREE.Mesh(ringGeometry, ring2Material);
    const ring2Glow = new THREE.Mesh(glowGeometry, ring2GlowMaterial);
    ring2.position.set(3, 0, 0);
    ring2Glow.position.set(3, 0, 0);
    ring2.rotation.y = Math.PI / 3;
    ring2Glow.rotation.y = Math.PI / 3;
    
    // Point light for ring 2 glow
    const light2 = new THREE.PointLight(0xa855f7, 2, 20);
    light2.position.set(3, 0, 0);
    
    group.add(ring2);
    group.add(ring2Glow);
    group.add(light2);

    // Ring 3 - Black with cyan glow aura
    const ring3Material = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        emissive: 0x000000,
        metalness: 0.9,
        roughness: 0.2,
    });
    const ring3GlowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x06b6d4,
        transparent: true, 
        opacity: 0.3,
        side: THREE.DoubleSide,
    });
    const ring3 = new THREE.Mesh(ringGeometry, ring3Material);
    const ring3Glow = new THREE.Mesh(glowGeometry, ring3GlowMaterial);
    ring3.position.set(0, 0, 2);
    ring3Glow.position.set(0, 0, 2);
    ring3.rotation.z = Math.PI / 6;
    ring3Glow.rotation.z = Math.PI / 6;
    
    // Point light for ring 3 glow
    const light3 = new THREE.PointLight(0x06b6d4, 2, 20);
    light3.position.set(0, 0, 2);
    
    group.add(ring3);
    group.add(ring3Glow);
    group.add(light3);

    // --- INFINITE STARFIELD BACKGROUND  (PARTICAL COUNT )---
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const velocityArray = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 200;     // X
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 200; // Y
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 200; // Z
      velocityArray[i] = 0.05 + Math.random() * 0.08;     // Speed
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const starField = new THREE.Points(particleGeo, particleMat);
    scene.add(starField);

    const ambientLight = new THREE.AmbientLight(0x111111, 0.3);
    scene.add(ambientLight);

    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
    };
    document.addEventListener('mousemove', onDocumentMouseMove);

    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      const scrollY = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = totalHeight > 0 ? scrollY / totalHeight : 0;

      // Smooth base rotation
      group.rotation.y += 0.003;
      group.rotation.x += 0.002;

      // Smart ring movement with collision avoidance
      // Ring 1 - Orbits in a figure-8 pattern
      const orbit1X = Math.sin(elapsedTime * 0.3) * 4;
      const orbit1Y = Math.cos(elapsedTime * 0.15) * 2;
      ring1.position.x = orbit1X;
      ring1.position.y = orbit1Y;
      ring1Glow.position.x = orbit1X;
      ring1Glow.position.y = orbit1Y;
      light1.position.x = orbit1X;
      light1.position.y = orbit1Y;
      
      // Ring 2 - Orbits in opposite direction
      const orbit2X = Math.cos(elapsedTime * 0.25) * 3.5;
      const orbit2Z = Math.sin(elapsedTime * 0.25) * 3;
      ring2.position.x = orbit2X;
      ring2.position.z = orbit2Z;
      ring2Glow.position.x = orbit2X;
      ring2Glow.position.z = orbit2Z;
      light2.position.x = orbit2X;
      light2.position.z = orbit2Z;
      
      // Ring 3 - Vertical orbit pattern
      const orbit3Y = Math.sin(elapsedTime * 0.2) * 3;
      const orbit3Z = Math.cos(elapsedTime * 0.35) * 2.5;
      ring3.position.y = orbit3Y;
      ring3.position.z = orbit3Z;
      ring3Glow.position.y = orbit3Y;
      ring3Glow.position.z = orbit3Z;
      light3.position.y = orbit3Y;
      light3.position.z = orbit3Z;

      // Individual ring rotations
      ring1.rotation.x += 0.01;
      ring1.rotation.z = Math.sin(elapsedTime * 0.5) * 0.3;
      ring1Glow.rotation.x = ring1.rotation.x;
      ring1Glow.rotation.z = ring1.rotation.z;
      
      ring2.rotation.y += 0.008;
      ring2.rotation.x = Math.cos(elapsedTime * 0.6) * 0.3;
      ring2Glow.rotation.y = ring2.rotation.y;
      ring2Glow.rotation.x = ring2.rotation.x;
      
      ring3.rotation.z += 0.012;
      ring3.rotation.y = Math.sin(elapsedTime * 0.4) * 0.3;
      ring3Glow.rotation.z = ring3.rotation.z;
      ring3Glow.rotation.y = ring3.rotation.y;

      // Pulsing glow effect on auras and lights
      const pulse1 = 0.2 + Math.sin(elapsedTime * 0.8) * 0.15;
      const pulse2 = 0.2 + Math.sin(elapsedTime * 1.0 + Math.PI / 3) * 0.15;
      const pulse3 = 0.2 + Math.sin(elapsedTime * 0.9 + Math.PI / 1.5) * 0.15;
      
      ring1GlowMaterial.opacity = pulse1 + 0.1;
      ring2GlowMaterial.opacity = pulse2 + 0.1;
      ring3GlowMaterial.opacity = pulse3 + 0.1;
      
      light1.intensity = 1.5 + pulse1 * 3;
      light2.intensity = 1.5 + pulse2 * 3;
      light3.intensity = 1.5 + pulse3 * 3;

      // Cursor interaction - smoother response
      const targetX = mouseX * 0.0005;
      const targetY = mouseY * 0.0005;
      group.rotation.y += 0.05 * (targetX - group.rotation.y);
      group.rotation.x += 0.05 * (targetY - group.rotation.x);

      // Scroll-based position with smooth easing
      const startX = -5;
      const endX = 8;
      const currentX = startX + (endX - startX) * (scrollPercent * 1.5);
      const startY = 3;
      const endY = -6;
      const currentY = startY + (endY - startY) * (scrollPercent * 1.5);
      const startZ = 0;
      const endZ = 5;
      const currentZ = startZ + (endZ - startZ) * scrollPercent;

      group.position.x += (currentX - group.position.x) * 0.08;
      group.position.y += (currentY - group.position.y) * 0.08;
      group.position.z += (currentZ - group.position.z) * 0.08;

      // Scale rings based on scroll
      const scaleValue = 1 + scrollPercent * 1;
      group.scale.set(scaleValue, scaleValue, scaleValue);

      // Infinite starfield movement - particles flow through space
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        const zIdx = i * 3 + 2;
        positions[zIdx] += velocityArray[i] + (scrollPercent * 0.8);

        // Infinite wrap-around logic - particles respawn at the back
        if (positions[zIdx] > 50) {
          positions[zIdx] = -50;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Render scene
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      cancelAnimationFrame(animationId);
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      ringGeometry.dispose();
      glowGeometry.dispose();
      ring1Material.dispose();
      ring2Material.dispose();
      ring3Material.dispose();
      ring1GlowMaterial.dispose();
      ring2GlowMaterial.dispose();
      ring3GlowMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden relative selection:bg-white selection:text-black">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;600&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        @keyframes drawArrow { to { stroke-dashoffset: 0; } }
        .animate-draw { animation: drawArrow 2.5s ease-out forwards 0.5s; }
        .no-scroll { overflow: hidden; }
      `}</style>

      <nav className="fixed top-0 w-full p-6 z-50 mix-blend-difference">
        <div className="flex justify-between items-center max-w-screen-2xl mx-auto px-2">
          <div className="border border-white/50 rounded-lg px-4 py-3 backdrop-blur-sm">
            <span className="uppercase tracking-widest font-bold text-white">ENHANZERS</span>
          </div>
          <button
            className={`relative flex items-center justify-center rounded-full transition-all duration-300 ease-in-out bg-white/10 backdrop-blur-sm border border-white/20 ${
              isMenuOpen || isHovered ? 'w-12 h-12' : 'w-12 h-12'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-5 flex flex-col justify-center items-center">
              <span
                className={`absolute w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'rotate-45' : '-translate-y-2'
                }`}
              />
              <span
                className={`absolute w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              />
              <span
                className={`absolute w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                  isMenuOpen ? '-rotate-45' : 'translate-y-2'
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      <div className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black transition-all duration-700 ease-in-out ${isMenuOpen ? 'opacity-95 translate-x-0' : 'opacity-0 -translate-x-full'}`} />
        <div className={`relative z-10 min-h-screen flex items-center md:items-start md:pt-32 lg:pt-40 justify-center md:justify-start px-6 md:px-12 lg:px-20 xl:px-32 transition-all duration-700 ease-in-out ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <div className="w-full max-w-2xl">
            <div className="grid grid-cols-1 gap-4 md:gap-6 w-full text-center md:text-left">
              {menuItems.map((item, index) => (
                <div 
                  key={item.id}
                  className={`relative transition-all duration-700 ease-out transform ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{ transitionDelay: isMenuOpen ? `${index * 100 + 200}ms` : '0ms' }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <button onClick={() => handleMenuClick(item.id)} className="relative group w-full text-center md:text-left">
                    <div className="relative overflow-hidden py-3 md:py-4">
                      <div className={`transition-all duration-400 transform ${hoveredItem === item.id ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                        <span className={`${item.defaultFont} ${item.defaultSize} text-white`}>{item.defaultText}</span>
                      </div>
                      <div className={`transition-all duration-400 transform absolute inset-0 flex items-center justify-center md:justify-start ${hoveredItem === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                        <div className="text-center md:text-left">
                          <div className={`${item.hoverFont} ${item.hoverSize} text-cyan-400`}>{toDoubleStruck(item.defaultText)}</div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
            <div className={`mt-8 md:mt-12 transition-all duration-700 ease-out text-center md:text-left ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`} style={{ transitionDelay: isMenuOpen ? '800ms' : '0ms' }}>
              <p className="text-gray-500 text-sm uppercase tracking-widest">Navigate • Explore • Discover</p>
            </div>
          </div>
        </div>
      </div>

      <div ref={mountRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />

      <main>
        <section id="home" className="min-h-screen relative flex items-center px-8 md:pl-32 z-10">
          <div className="max-w-2xl opacity-100 translate-y-0">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 font-serif tracking-tight">
              Where vision <br />
              <span className="italic font-light text-gray-400">MEETS</span> precision.
            </h1>
            <p className="text-gray-400 text-lg md:w-2/3">
              We craft digital experiences that exist at the intersection of aesthetic beauty and engineering rigor.
            </p>
          </div>
        </section>

        <section id="work" className="min-h-screen relative flex items-center justify-end px-8 md:pr-32 z-10 text-right">
          <div id="text-2" className={`max-w-2xl transition-all duration-1000 ease-out ${text2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 font-serif">
              We build modern web apps<br />
              that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Elevate</span> your brand.
            </h2>
            <div className="flex justify-end gap-4">
              <button className="px-8 py-3 border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase text-sm tracking-wider">View Projects</button>
              <button className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-300 uppercase text-sm tracking-wider font-bold">Contact Us</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}