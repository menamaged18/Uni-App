import Head from 'next/head'
import Link from 'next/link'

function Student() {
  return (
    <>
      <Head>
        <title>UniSystem - Welcome to Our Learning Platform</title>
        <meta name="description" content="Discover and enroll in courses from our university" />
      </Head>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Welcome to <span className="text-blue-600">UniSystem</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
              Discover a world of knowledge with our comprehensive course catalog. 
              Learn from expert lecturers and advance your academic journey.
            </p>
            <div className="mt-10">
              <Link href="/courses" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors">
                Browse Courses
              </Link>
              <Link href="/register" className="ml-4 inline-block bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose UniSystem?</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Wide Course Selection</h3>
              <p className="mt-2 text-gray-600">
                Choose from hundreds of courses across various disciplines and academic levels.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">👨‍🏫</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Expert Lecturers</h3>
              <p className="mt-2 text-gray-600">
                Learn from experienced professors and industry professionals dedicated to your success.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">📱</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Flexible Learning</h3>
              <p className="mt-2 text-gray-600">
                Access course materials and manage your enrollment anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Student