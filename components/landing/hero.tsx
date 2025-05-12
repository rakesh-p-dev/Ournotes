const Hero = () => (
  <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Secure Collaborative Note-Taking
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Your all-in-one solution for secure file management and team collaboration
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Secure Access</h3>
            <p className="text-gray-300">Google-powered authentication with NextAuth for reliable security</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-purple-400">PDF Management</h3>
            <p className="text-gray-300">Seamless PDF uploads and storage with Amazon S3 integration</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Smart Sharing</h3>
            <p className="text-gray-300">Granular control over document access and permissions</p>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
          Get Started
        </button>
      </div>
    </div>
  </section>
);

export default Hero; 