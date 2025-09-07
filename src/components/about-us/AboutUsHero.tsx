export default function AboutUsHero() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-teal-600 mb-4">About us</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Our mission is to increase the{" "}
            <span className="text-teal-600">GDP of your startup</span>
          </h1>
          <p className="text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Untitled is a technology company that builds infrastructure for your
            startup, so you don&apos;t have to. Businesses of every size—from
            new startups to public companies—use our software to manage their
            businesses.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mt-16 relative">
          {/* Background Image */}
          <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-r from-teal-600 to-teal-800">
            {/* You can replace this with your actual background image */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Stats Cards */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
                {/* Projects Completed */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
                  <div className="text-4xl font-bold text-white mb-2">400+</div>
                  <div className="text-white font-semibold mb-2">
                    Projects completed
                  </div>
                  <p className="text-white/80 text-sm">
                    We&apos;ve helped build over 400 projects with great
                    companies.
                  </p>
                </div>

                {/* Return on Investment */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
                  <div className="text-4xl font-bold text-white mb-2">600%</div>
                  <div className="text-white font-semibold mb-2">
                    Return on investment
                  </div>
                  <p className="text-white/80 text-sm">
                    We&apos;ve helped build over 400 projects with great
                    companies.
                  </p>
                </div>

                {/* Global Downloads */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
                  <div className="text-4xl font-bold text-white mb-2">10k</div>
                  <div className="text-white font-semibold mb-2">
                    Global downloads
                  </div>
                  <p className="text-white/80 text-sm">
                    Our free UI kit has been downloaded over 10k times.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
