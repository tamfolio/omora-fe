export default function OurStory() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-teal-600 mb-4">Our story</p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            We&apos;re just getting started
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;ve already helped over 4,000 companies achieve remarkable
            results.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-6">
            <p className="text-gray-600 leading-7">
              Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
              suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
              quis montes, sit sit. Tellus aliquam enim urna, etiam.
            </p>

            <p className="text-gray-600 leading-7">
              Eget sit in vitae, lobortis pharetra, semper. Eget in volutpat
              mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu
              quis fusce augue enim. Quis at habitant diam at. Suscipit
              tristique risus, at donec. In turpis vel at quam imperdiet. Ipsum
              molestie aliquet sodales id est ac volutpat.
            </p>

            <p className="text-gray-600 leading-7">
              Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce
              aliquet. Nam elementum urna nisi aliquet erat dolor enim. Ornare
              id morbi eget ipsum. Sapien, dictum molestie sem tempor. Diam
              elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor
              tellus. Sed vel, congue felis elit erat nam nibh orci.
            </p>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <p className="text-gray-600 leading-7">
              Sagittis et eu at elementum, quis in. Proin praesent volutpat
              egestas sociis sit lorem nunc sit. Eget diam curabitur mi ac.
              Auctor rutrum lacus molestie ornare et. Vulputate consectetur ac
              ultrices at diam dui eget fringilla tincidunt. Arcu sit dignissim
              massa erat cursus volutpat gravida id. Sed quis auctor vulputate
              hac elementum gravida cursus dis.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-teal-600 rounded-full mt-2.5 mr-3"></div>
                <p className="text-gray-600 leading-7">
                  Lectus id duis vitae porttitor enim gravida morbi.
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-teal-600 rounded-full mt-2.5 mr-3"></div>
                <p className="text-gray-600 leading-7">
                  Eu turpis posuere semper feugiat volutpat elit, ultrices
                  suspendisse. Auctor vel in vitae placerat.
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-teal-600 rounded-full mt-2.5 mr-3"></div>
                <p className="text-gray-600 leading-7">
                  Suspendisse maecenas ac donec scelerisque diam sed est duis
                  purus.
                </p>
              </div>
            </div>

            <p className="text-gray-600 leading-7">
              Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim
              mauris id. Non pellentesque congue eget consectetur turpis.
              Sapien, dictum molestie sem tempor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
