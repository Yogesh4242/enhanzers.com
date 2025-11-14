export default function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-blue-400">Enhanzers</span>.com
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#services" className="hover:text-blue-400 transition">Services</a>
            <a href="#portfolio" className="hover:text-blue-400 transition">Portfolio</a>
            <a href="#about" className="hover:text-blue-400 transition">About</a>
            <a href="#contact" className="hover:text-blue-400 transition">Contact</a>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Hero Content */}
      <div className="container mx-auto px-6 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
            <span className="text-blue-400 text-sm font-semibold">🚀 Trusted by 50+ Clients Worldwide</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            We Build{" "}
            <span className="bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Digital Experiences
            </span>{" "}
            That Convert
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            Full-service digital agency specializing in <span className="text-blue-400">blazing-fast websites</span>, 
            <span className="text-purple-400"> SEO optimization</span>, and <span className="text-green-400">conversion-focused design</span>
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">50+</div>
              <div className="text-gray-400 text-sm">Projects Done</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">98%</div>
              <div className="text-gray-400 text-sm">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25">
              🚀 Start Your Project
            </button>
            <button className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              📞 Book a Call
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm">
            <div>✅ No Upfront Payment</div>
            <div>✅ 30-Day Support</div>
            <div>✅ Money-Back Guarantee</div>
            <div>✅ SEO Optimized</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}