export default function Features() {
  const features = [
    {
      title: 'Ordinals',
      description: 'Browse and collect unique Bitcoin ordinals',
    },
    {
      title: 'Tokens',
      description: 'Trade MNEE and other BSV tokens',
    },
    {
      title: 'Secure',
      description: 'Built on Bitcoin SV blockchain',
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose 1Sat?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 border-2 border-gray-200 dark:border-gray-800 rounded-lg hover:border-black dark:hover:border-white transition-colors"
            >
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
