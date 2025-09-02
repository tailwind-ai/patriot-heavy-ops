export default function AboutUsPage() {
  return (
    <section className="min-h-screen bg-white pt-0">
      <div className="container mx-auto px-4 pb-8 lg:pb-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Section - Text and Button */}
          <div className="space-y-6">
            <h1 className="font-heading text-4xl font-bold leading-tight text-gray-900 lg:text-5xl xl:text-6xl">
              Building a company <span className="text-blue-600">beyond the battlefield</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-gray-700 lg:text-xl">
              As an active duty airman, I built Patriot Heavy Ops as a way for veterans and military service members to make money and serve their local community.
            </p>
            <button className="rounded-lg px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors duration-200" style={{ backgroundColor: '#232C43' }}>
              Get in Touch
            </button>
          </div>

          {/* Right Section - Image */}
          <div className="relative">
            <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 lg:aspect-[4/3]">
              {/* Placeholder for image - you can replace this with an actual image */}
              <div className="flex h-full w-full items-center justify-center">
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex size-32 items-center justify-center bg-purple-200">
                    <svg className="size-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Add your company image here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">
              Our Team
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-700">
              We&apos;re building the team of the future—lean & AI-powered.
            </p>
          </div>

          {/* Team Member Cards */}
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            {/* Team Member 1 */}
            <div className="rounded-lg bg-white p-8 text-center shadow-lg">
              <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-gray-200">
                <svg className="size-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">William Henry</h3>
              <p className="mb-4 text-gray-600">Founder / CEO</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-400 transition-colors hover:text-gray-600">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="rounded-lg bg-white p-8 text-center shadow-lg">
              <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-gray-200">
                <svg className="size-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Ally</h3>
              <p className="mb-4 text-gray-600">AI Chief Operations Officer</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-400 transition-colors hover:text-gray-600">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="rounded-lg bg-white p-8 text-center shadow-lg">
              <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-gray-200">
                <svg className="size-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Sam Henry</h3>
              <p className="mb-4 text-gray-600">Board Member</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-400 transition-colors hover:text-gray-600">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
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
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Find a Location
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              We operate in all 50 US states and territories.
            </p>
          </div>
          
          <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
            {/* States will be populated here */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">Alabama</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">Alaska</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">Arizona</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">Arkansas</h3>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">California</h3>
            </div>
            {/* Continue with remaining states... */}
          </div>
        </div>
      </section>
    </section>
  )
}
