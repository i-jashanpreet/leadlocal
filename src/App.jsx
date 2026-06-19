import { useState, useEffect } from 'react'
import { 
  Search, 
  Globe, 
  Building, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  ArrowRight, 
  Mail, 
  Phone, 
  Sparkles,
  ExternalLink
} from 'lucide-react'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('Austin, TX')
  const [isLoading, setIsLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking') // 'checking', 'connected', 'offline'
  
  // Check backend health status on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('/api/')
        if (response.ok) {
          const data = await response.json()
          if (data.message === 'Backend running') {
            setBackendStatus('connected')
          } else {
            setBackendStatus('offline')
          }
        } else {
          setBackendStatus('offline')
        }
      } catch (error) {
        setBackendStatus('offline')
      }
    }
    
    checkBackend()
    // Poll every 10 seconds to detect when backend is launched
    const interval = setInterval(checkBackend, 10000)
    return () => clearInterval(interval)
  }, [])

  // Mock search execution
  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchLocation.trim()) return
    
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSearched(true)
    }, 1200)
  }

  // Mock leads data matching the search
  const mockLeads = [
    {
      id: 1,
      name: "Tony's Woodfired Pizza",
      category: "Restaurant / Pizzeria",
      location: searchLocation,
      phone: "(512) 555-0192",
      address: "1024 Congress Ave",
      opportunity: "High - Google Maps listing has 120+ positive reviews but no website linked.",
      potentialRevenue: "$1,500 - $3,000"
    },
    {
      id: 2,
      name: "Stellar Auto Services",
      category: "Automotive Repair",
      location: searchLocation,
      phone: "(512) 555-3841",
      address: "804 W 5th St",
      opportunity: "Medium - Has a standard facebook page but no dedicated web portfolio/booking system.",
      potentialRevenue: "$2,000 - $4,000"
    },
    {
      id: 3,
      name: "Green Valley Landscaping",
      category: "Home Services / Landscaping",
      location: searchLocation,
      phone: "(512) 555-7733",
      address: "Serving local area",
      opportunity: "High - Active local advertisement with no digital footprint besides a phone directory listing.",
      potentialRevenue: "$1,200 - $2,500"
    }
  ]

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 relative font-sans">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full glow-blur -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full glow-blur translate-x-1/3"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0f19]/70 border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                LeadLocal
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-900/50">
                v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Backend Connection Status Badge */}
            <div id="backend-status-container" className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Backend API:</span>
              {backendStatus === 'checking' && (
                <div className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>
                  Checking...
                </div>
              )}
              {backendStatus === 'connected' && (
                <div className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-ping"></span>
                  Connected
                </div>
              )}
              {backendStatus === 'offline' && (
                <div className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-950/80 text-rose-300 border border-rose-800/50" title="Run server/run.py to connect">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-2"></span>
                  Offline
                </div>
              )}
            </div>

            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        
        {/* Banner Announcement */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 mb-8 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold tracking-wide text-indigo-400 hover:border-slate-700 transition-colors">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 Project Foundation Initialized</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Find Local Businesses With{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              No Website
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            LeadLocal helps freelancers scan local areas, identify high-value businesses lacking a web presence, and generate outreach plans to secure web development clients.
          </p>
        </div>

        {/* Search SaaS Box */}
        <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          
          <form id="search-form" onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Enter City, State (e.g. Austin, TX)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm"
                  required
                />
              </div>
              <button
                id="search-button"
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Scanning Area...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search Leads</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Press Search to run a simulated scan of the area</span>
              <span>Filter: No Website</span>
            </div>
          </form>
        </div>

        {/* Results / Landing Content */}
        <div className="w-full max-w-4xl mt-16">
          {searched ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Building className="w-5 h-5 text-indigo-400" />
                  <span>Found Leads in {searchLocation} (Simulated)</span>
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 font-medium">
                  {mockLeads.length} Opportunities
                </span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                {mockLeads.map((lead) => (
                  <div key={lead.id} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          No Website
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{lead.potentialRevenue}</span>
                      </div>
                      
                      <h4 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors text-base mb-1">
                        {lead.name}
                      </h4>
                      <p className="text-xs text-indigo-400 mb-3">{lead.category}</p>
                      
                      <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{lead.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{lead.phone}</span>
                        </div>
                      </div>

                      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-400">
                        <span className="block font-medium text-slate-300 mb-1">Opportunity Details:</span>
                        {lead.opportunity}
                      </div>
                    </div>

                    <button className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1">
                      <span>Unlock Lead</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 hover:border-slate-800 transition-all">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-bold text-slate-200 mb-2">1. Target Location</h3>
                <p className="text-sm text-slate-400">
                  Search by city, town, or business type to discover listings in maps and directories.
                </p>
              </div>

              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 hover:border-slate-800 transition-all">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-bold text-slate-200 mb-2">2. Find Presence Gaps</h3>
                <p className="text-sm text-slate-400">
                  Instantly verify business domains to find established companies operating without a website.
                </p>
              </div>

              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 hover:border-slate-800 transition-all">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-bold text-slate-200 mb-2">3. Reach Out & Pitch</h3>
                <p className="text-sm text-slate-400">
                  Acquire lead contact details and pitch professional web development services to expand their business.
                </p>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-[#080b12] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 LeadLocal. All rights reserved.</p>
          <div className="flex space-x-4">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">React v19</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">FastAPI</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">Tailwind CSS v4</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
