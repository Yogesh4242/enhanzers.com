export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-6xl font-bold mb-6">
          Enhanzers
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl">
          We build blazing-fast websites that convert visitors into customers
        </p>
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
            Get Started
          </button>
          <button className="border border-gray-600 hover:border-gray-400 text-gray-300 px-8 py-3 rounded-lg font-semibold">
            View Portfolio
          </button>
        </div>
      </div>
    </div>
  )
}