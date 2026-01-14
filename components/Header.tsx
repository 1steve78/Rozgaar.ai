export default function Header() {
  return (
    <header className="bg-white rounded-2xl shadow-sm mb-12 px-8 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            R
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Rozgaar AI
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a className="text-gray-700 hover:text-indigo-600 font-medium">Find Jobs</a>
          <a className="text-gray-700 hover:text-indigo-600 font-medium">Companies</a>
          <a className="text-gray-700 hover:text-indigo-600 font-medium">Resources</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-gray-700 hover:text-indigo-600 font-medium">
            Login
          </button>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium">
            Sign Up Free
          </button>
        </div>
      </div>
    </header>
  );
}
