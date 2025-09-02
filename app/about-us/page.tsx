export default function AboutUsPage() {
  return (
    <section className="min-h-screen bg-white pt-0">
      <div className="container mx-auto px-4 pb-8 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Text and Button */}
          <div className="space-y-6">
            <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl leading-tight font-bold text-gray-900">
              Building a company <span className="text-blue-600">beyond the battlefield</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-lg">
              As an active duty airman, I built Patriot Heavy Ops as a way for veterans and military service members to make money and serve their local community.
            </p>
            <button className="text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg" style={{ backgroundColor: '#232C43' }}>
              Get in Touch
            </button>
          </div>

          {/* Right Section - Image */}
          <div className="relative">
            <div className="aspect-square lg:aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
              {/* Placeholder for image - you can replace this with an actual image */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-purple-200 mx-auto flex items-center justify-center">
                    <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Add your company image here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Team
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              We're building the team of the future—lean & AI-powered.
            </p>
          </div>

          {/* Team Member Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">William Henry</h3>
              <p className="text-gray-600 mb-4">Founder / CEO</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ally</h3>
              <p className="text-gray-600 mb-4">AI Chief Operations Officer</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sam Henry</h3>
              <p className="text-gray-600 mb-4">Board Member</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find a Location Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Find a Location
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              We operate across all 50 states to serve your heavy equipment needs.
            </p>
          </div>

          {/* States List - 5 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Column 1 */}
            <div className="space-y-3">
              <div className="text-gray-700">Alabama</div>
              <div className="text-gray-700">Alaska</div>
              <div className="text-gray-700">Arizona</div>
              <div className="text-gray-700">Arkansas</div>
              <div className="text-gray-700">California</div>
              <div className="text-gray-700">Colorado</div>
              <div className="text-gray-700">Connecticut</div>
              <div className="text-gray-700">Delaware</div>
              <div className="text-gray-700">Florida</div>
              <div className="text-gray-700">Georgia</div>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <div className="text-gray-700">Hawaii</div>
              <div className="text-gray-700">Idaho</div>
              <div className="text-gray-700">Illinois</div>
              <div className="text-gray-700">Indiana</div>
              <div className="text-gray-700">Iowa</div>
              <div className="text-gray-700">Kansas</div>
              <div className="text-gray-700">Kentucky</div>
              <div className="text-gray-700">Louisiana</div>
              <div className="text-gray-700">Maine</div>
              <div className="text-gray-700">Maryland</div>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <div className="text-gray-700">Massachusetts</div>
              <div className="text-gray-700">Michigan</div>
              <div className="text-gray-700">Minnesota</div>
              <div className="text-gray-700">Mississippi</div>
              <div className="text-gray-700">Missouri</div>
              <div className="text-gray-700">Montana</div>
              <div className="text-gray-700">Nebraska</div>
              <div className="text-gray-700">Nevada</div>
              <div className="text-gray-700">New Hampshire</div>
              <div className="text-gray-700">New Jersey</div>
            </div>

            {/* Column 4 */}
            <div className="space-y-3">
              <div className="text-gray-700">New Mexico</div>
              <div className="text-gray-700">New York</div>
              <div className="text-gray-700">North Carolina</div>
              <div className="text-gray-700">North Dakota</div>
              <div className="text-gray-700">Ohio</div>
              <div className="text-gray-700">Oklahoma</div>
              <div className="text-gray-700">Oregon</div>
              <div className="text-gray-700">Pennsylvania</div>
              <div className="text-gray-700">Rhode Island</div>
              <div className="text-gray-700">South Carolina</div>
            </div>

            {/* Column 5 */}
            <div className="space-y-3">
              <div className="text-gray-700">South Dakota</div>
              <div className="text-gray-700">Tennessee</div>
              <div className="text-gray-700">Texas</div>
              <div className="text-gray-700">Utah</div>
              <div className="text-gray-700">Vermont</div>
              <div className="text-gray-700">Virginia</div>
              <div className="text-gray-700">Washington</div>
              <div className="text-gray-700">West Virginia</div>
              <div className="text-gray-700">Wisconsin</div>
              <div className="text-gray-700">Wyoming</div>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}
