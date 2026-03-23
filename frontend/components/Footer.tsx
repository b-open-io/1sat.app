export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">1Sat</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The premier marketplace for Bitcoin SV ordinals and tokens
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Download the App</h4>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:opacity-80 transition-opacity text-center"
              >
                Download on the App Store
              </a>
              <a
                href="#"
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:opacity-80 transition-opacity text-center"
              >
                Get it on Google Play
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} 1Sat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
