'use client';

import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // Smooth scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = [
      titleRef.current,
      subtitleRef.current,
      heroRef.current
    ].filter(Boolean);

    elementsToAnimate.forEach(el => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Minimal particle background (very subtle)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    // Very minimal particles - only 15 for subtle effect
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1 + 0.5, // Very small
        speedX: (Math.random() - 0.5) * 0.3, // Very slow
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.1 + 0.05 // Very low opacity
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'; // Almost solid black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 100, 255, ${particle.opacity})`; // Very subtle blue
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Ultra Minimal Particle Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gray-900 z-50">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold opacity-0 animate-fade-in">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                ENHANZERS
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Services', 'Work', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm tracking-wider"
                >
                  {item}
                </a>
              ))}
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                START PROJECT
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <div className={`h-px bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : 'w-4'}`}></div>
                <div className={`h-px bg-current transition-all ${isMenuOpen ? 'opacity-0' : 'w-3'}`}></div>
                <div className={`h-px bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'w-4'}`}></div>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gray-900">
              <div className="flex flex-col space-y-2 p-6">
                {['Services', 'Work', 'About', 'Contact'].map((item) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-cyan-400 transition-colors py-3 text-sm tracking-wider border-b border-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-lg text-sm font-medium mt-4">
                  START PROJECT
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center opacity-0">
        <div className="container mx-auto px-6 text-center">
          {/* Minimal Badge */}
          <div className="inline-flex items-center space-x-2 border border-gray-800 rounded-full px-4 py-2 mb-12 opacity-0 animate-slide-up">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
            <span className="text-xs text-gray-500 tracking-widest">DIGITAL EXCELLENCE</span>
          </div>

          {/* Main Headline with Scroll Animation */}
          <h1 
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight tracking-tight opacity-0 translate-y-8"
          >
            WE BUILD
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-medium">
              DIGITAL FUTURE
            </span>
          </h1>

          {/* Subheadline */}
          <p 
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide opacity-0 translate-y-8"
          >
            Crafting exceptional digital experiences with precision engineering and innovative design.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 opacity-0 animate-fade-in-delayed">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg text-sm font-medium tracking-wider transition-all hover:shadow-lg hover:shadow-cyan-500/20">
              START PROJECT
            </button>
            <button className="border border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-400 px-8 py-3 rounded-lg text-sm font-medium tracking-wider transition-all">
              VIEW WORK →
            </button>
          </div>

          {/* Minimal Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto opacity-0 animate-slide-up-delayed">
            {[
              { number: '50+', label: 'PROJECTS' },
              { number: '98%', label: 'SATISFACTION' },
              { number: '24/7', label: 'SUPPORT' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-light text-cyan-400 mb-1">
                  {stat.number}
                </div>
                <div className="text-xs text-gray-600 tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 opacity-60">
        <div className="animate-bounce-slow">
          <div className="w-px h-6 bg-gray-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}