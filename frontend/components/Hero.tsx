export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
          The Premier Bitcoin Ordinals Marketplace
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-400 text-balance">
          Discover, collect, and trade unique digital assets on Bitcoin SV
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:opacity-80 transition-opacity"
          >
            Explore Ordinals
          </a>
          <a
            href="#"
            className="px-8 py-4 border-2 border-black dark:border-white rounded-lg font-semibold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  )
}
