'use client';
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

// Register SplitText plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText);
}

export default function Home() {
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const pageContentRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLDivElement>(null);
  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const lenis = new Lenis();
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Initialize menu animation timeline
    if (menuOverlayRef.current && pageContentRef.current && toggleButtonRef.current) {
      menuTimelineRef.current = gsap.timeline({ paused: true });
      
      const menuOverlay = menuOverlayRef.current;
      const pageContent = pageContentRef.current;
      const toggleButton = toggleButtonRef.current;

      // === OPEN ANIMATION ===
      menuTimelineRef.current
        // Animate menu overlay clip-path open
        .to(menuOverlay, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 120%, 0% 100%)",
          duration: 0.8,
          ease: "power3.inOut",
          onStart: () => {
            menuOverlay.style.pointerEvents = "none";
          },
          onComplete: () => {
            menuOverlay.style.clipPath = "none";
            menuOverlay.style.pointerEvents = "auto";
          }
        }, 0)
        // Animate page content
        .to(pageContent, {
          yPercent: 20,
          rotation: 18,
          scale: 1.3,
          transformOrigin: "left top",
          duration: 0.8,
          ease: "power3.inOut"
        }, 0)
        // Animate background zoom
        .to(".menu-overlay__bg-img img", {
          scale: 1.1,
          duration: 1,
          ease: "power3.inOut"
        }, 0)
        // Animate toggle button
        .to(".toggle-line-top", {
          transformOrigin: "center",
          y: 4,
          scaleX: 0.8,
          rotation: 45,
          duration: 0.4,
          ease: "back.out(1.5)"
        }, 0.2)
        .to(".toggle-line-bottom", {
          transformOrigin: "center",
          y: -4,
          scaleX: 0.8,
          rotation: -45,
          duration: 0.4,
          ease: "back.out(1.5)"
        }, 0.2);

      // Setup menu item hover effects
      const items = menuOverlay.querySelectorAll(".menu-overlay__main ul li");
      const bgImgs = menuOverlay.querySelectorAll(".menu-overlay__bg-img img");

      // Show first image by default
      gsap.set(bgImgs[0], { opacity: 1 });

      items.forEach((item, index) => {
        item.addEventListener("mouseenter", () => {
          // Fade out all images
          gsap.to(bgImgs, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut"
          });

          // Fade in corresponding image
          if (bgImgs[index + 1]) {
            gsap.to(bgImgs[index + 1], {
              opacity: 1,
              scale: 1.18,
              duration: 0.5,
              ease: "power3.inOut"
            });
          }
        });

        item.addEventListener("mouseleave", () => {
          // Reset to default (first image)
          gsap.to(bgImgs, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            scale: 1
          });
          gsap.to(bgImgs[0], {
            opacity: 1,
            duration: 0.5,
            ease: "power3.inOut"
          });
        });
      });

      // Setup text animations when menu opens
      menuTimelineRef.current.add(() => {
        const linkTexts = menuOverlay.querySelectorAll("[data-text-anim]");
        
        linkTexts.forEach((el) => {
          gsap.set(el, { visibility: "visible" });
          
          const split = new SplitText(el as HTMLElement, {
            type: "chars",
            charsClass: "duplicate-char",
          });

          menuTimelineRef.current!.fromTo(
            split.chars,
            { yPercent: -200 },
            { 
              yPercent: 0, 
              ease: "power2.inOut", 
              duration: 0.5, 
              stagger: 0.01 
            },
            0.2
          );
        });
      }, 0);
    }

    return () => {
      // Cleanup
      if (menuTimelineRef.current) {
        menuTimelineRef.current.kill();
      }
    };
  }, []);

  const handleMenuToggle = () => {
    if (!menuTimelineRef.current || !menuOverlayRef.current) return;

    if (menuTimelineRef.current.progress() === 1) {
      // Menu is open, close it
      menuTimelineRef.current.reverse();
      menuTimelineRef.current.eventCallback("onReverseComplete", () => {
        if (menuOverlayRef.current) {
          menuOverlayRef.current.style.pointerEvents = "none";
        }
      });
    } else {
      // Menu is closed, open it
      menuTimelineRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Menu Overlay */}
      <div 
        ref={menuOverlayRef}
        className="menu-overlay fixed inset-0 h-screen w-full z-40 pointer-events-none"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
      >
        <div className="menu-overlay__bg-container absolute top-0 left-0 w-full h-full pointer-events-none z-[-1]">
          <div className="menu-overlay__bg-img">
            <img 
              src="https://ik.imagekit.io/kg2nszxjp/travel-menu/bg-1.webp" 
              data-bg-for="default" 
              alt="Default background" 
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0"
            />
          </div>
          <div className="menu-overlay__bg-img">
            <img 
              src="https://ik.imagekit.io/kg2nszxjp/travel-menu/bg-2.webp" 
              data-bg-for="home" 
              alt="Home background" 
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0"
            />
          </div>
          <div className="menu-overlay__bg-img">
            <img 
              src="https://ik.imagekit.io/kg2nszxjp/travel-menu/bg-3.webp" 
              data-bg-for="about" 
              alt="About background" 
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0"
            />
          </div>
          <div className="menu-overlay__bg-img">
            <img 
              src="https://ik.imagekit.io/kg2nszxjp/travel-menu/bg-4.webp" 
              data-bg-for="explore" 
              alt="Explore background" 
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0"
            />
          </div>
          <div className="menu-overlay__bg-img">
            <img 
              src="https://ik.imagekit.io/kg2nszxjp/travel-menu/bg-5.webp" 
              data-bg-for="services" 
              alt="Services background" 
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0"
            />
          </div>
          <div className="menu-overlay__bg-img">
            <img 
              src="https://ik.imagekit.io/kg2nszxjp/travel-menu/bg-6.webp" 
              data-bg-for="contact" 
              alt="Contact background" 
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0"
            />
          </div>
        </div>

        <div className="menu-overlay__content w-full h-full">
          <div className="menu-overlay__links bg-black/20 backdrop-blur-2xl w-1/2 h-full p-11 flex flex-col gap-2.5 items-center justify-center text-center">
            <div className="menu-overlay__main text-amber-50 font-anton text-6xl leading-[90%] tracking-tight">
              <ul className="space-y-2.5">
                <li className="mb-2.5 transition-opacity duration-300 w-fit mx-auto">
                  <a href="/" data-text-anim className="leading-[93%]">HOME</a>
                </li>
                <li className="mb-2.5 transition-opacity duration-300 w-fit mx-auto">
                  <a href="/" data-text-anim className="leading-[93%]">ABOUT US</a>
                </li>
                <li className="mb-2.5 transition-opacity duration-300 w-fit mx-auto">
                  <a href="/" data-text-anim className="leading-[93%]">EXPLORE TRIPS</a>
                </li>
                <li className="mb-2.5 transition-opacity duration-300 w-fit mx-auto">
                  <a href="/" data-text-anim className="leading-[93%]">SERVICES</a>
                </li>
                <li className="mb-2.5 transition-opacity duration-300 w-fit mx-auto">
                  <a href="/" data-text-anim className="leading-[93%]">CONTACT US</a>
                </li>
              </ul>
            </div>
            <div className="menu-overlay__socials">
              <ul className="flex gap-3.5 text-amber-50 text-xl font-semibold tracking-tight">
                <li><a href="/">Instagram</a></li>
                <li><a href="/">TikTok</a></li>
                <li><a href="/">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="navbar fixed top-4 w-full z-50">
        <nav className="max-w-7xl mx-auto px-8">
          <div className="menu-bar flex justify-between items-center">
            <div className="logo-wrapper">
              <img 
                src="https://ik.imagekit.io/kg2nszxjp/travel-menu/logo.svg" 
                alt="Logo" 
                className="h-8 w-auto"
              />
            </div>
            <div 
              ref={toggleButtonRef}
              className="navbar__menu flex flex-col gap-1.5 items-center justify-center w-11 h-11 bg-amber-50 rounded-lg cursor-pointer"
              onClick={handleMenuToggle}
            >
              <span className="toggle-line-top w-7 h-0.5 bg-gray-800 transition-all duration-300"></span>
              <span className="toggle-line-bottom w-7 h-0.5 bg-gray-800 transition-all duration-300"></span>
            </div>
            <a href="#" className="navbar__btn btn flex gap-2.5 px-4 py-3.5 bg-amber-50 rounded-lg font-anton items-center justify-center">
              <span className="btn-txt text-gray-800">EXPLORE TRIPS</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" fill="none">
                <path fill="#2F2411" d="m17.76 6.857-5.727-5.688a.821.821 0 0 0-1.147.01.81.81 0 0 0-.01 1.139l4.33 4.3H.819a.821.821 0 0 0-.578.238.81.81 0 0 0 .578 1.388h14.389l-4.33 4.3a.813.813 0 0 0-.19.892.813.813 0 0 0 .765.505.824.824 0 0 0 .581-.248l5.727-5.688a.81.81 0 0 0 0-1.148Z" />
              </svg>
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div ref={pageContentRef} className="page-content pt-20">
        {/* Your existing sections */}
        <section id="home" className="min-h-screen flex items-center justify-center px-8">
          <div className="text-center max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-800">Home Section</h1>
            <p className="text-gray-600 mt-4">This is the home section</p>
          </div>
        </section>

        <section id="about" className="min-h-screen flex items-center justify-center px-8 bg-white">
          <div className="text-center max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-800">About Us Section</h1>
            <p className="text-gray-600 mt-4">This is the about us section</p>
          </div>
        </section>

        <section id="services" className="min-h-screen flex items-center justify-center px-8">
          <div className="text-center max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-800">Services Section</h1>
            <p className="text-gray-600 mt-4">This is the services section</p>
          </div>
        </section>
      </div>
    </div>
  );
}