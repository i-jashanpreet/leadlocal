import { useState, useEffect } from 'react'
import { 
  Search, 
  Globe, 
  Building, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  ArrowRight, 
  Phone, 
  Sparkles,
  ExternalLink,
  Star,
  AlertTriangle,
  Mail,
  ShieldAlert
} from 'lucide-react'

function App() {
  const [city, setCity] = useState('Austin, TX')
  const [category, setCategory] = useState('Dentist')
  const [isLoading, setIsLoading] = useState(false)
  const [leads, setLeads] = useState([])
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState(null)
  const [backendStatus, setBackendStatus] = useState('checking') // 'checking', 'connected', 'offline'
  
  // Categories for the dropdown list
  const categories = [
    { value: 'Dentist', label: 'Dentists' },
    { value: 'Restaurant', label: 'Restaurants & Cafes' },
    { value: 'Plumber', label: 'Plumbers' },
    { value: 'Gym', label: 'Gyms & Fitness' },
    { value: 'Auto Repair', label: 'Auto Repair Shops' },
    { value: 'Landscaping', label: 'Landscaping Services' },
    { value: 'Electrician', label: 'Electricians' },
    { value: 'Bakery', label: 'Bakeries' },
    { value: 'Salon', label: 'Salons & Spas' }
  ]

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

  // Call search API
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!city.trim() || !category.trim()) return
    
    setIsLoading(true)
    setError(null)
    setSearched(true)
    
    try {
      const response = await fetch(
        `/api/search?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}`
      )
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Search failed with status code ${response.status}`)
      }
      
      const data = await response.json()
      setLeads(data.results || [])
    } catch (err) {
      console.error(err)
      setError(
        err.message || 'Failed to retrieve listings from backend. Ensure server/run.py is running.'
      )
      setLeads([])
    } finally {
      setIsLoading(false)
    }
  }

  // Count leads without website to show quick stats
  const leadsWithoutWebsiteCount = leads.filter(l => l.status === 'No Website').length

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
                Step 2
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Backend Connection Status Badge */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Backend API:</span>
              {backendStatus === 'checking' && (
                <div id="backend-status-container" className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>
                  Checking...
                </div>
              )}
              {backendStatus === 'connected' && (
                <div id="backend-status-container" className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-ping"></span>
                  Connected
                </div>
              )}
              {backendStatus === 'offline' && (
                <div id="backend-status-container" className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-950/80 text-rose-300 border border-rose-800/50" title="Run server/run.py to connect">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-2"></span>
                  Offline
                </div>
              )}
            </div>

            <a 
              href="https://github.com/i-jashanpreet/leadlocal" 
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
        
        {/* Banner Announcement */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 mb-8 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold tracking-wide text-indigo-400 hover:border-slate-700 transition-colors">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 2 Live Google Places API Connected</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Identify Local Service Gaps
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Search any city and service category to pinpoint businesses with missing web presences. Uncover warm lead options to sell your freelance web design services.
          </p>
        </div>

        {/* Search Panel Box */}
        <div className="w-full max-w-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          
          <form id="search-form" onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* City Input */}
              <div className="relative md:col-span-6">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="search-city"
                  type="text"
                  placeholder="Enter City, State (e.g. Austin, TX)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm"
                  required
                />
              </div>
              
              {/* Category Dropdown */}
              <div className="relative md:col-span-4">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  id="search-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-11 pr-10 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-slate-950 text-slate-100">
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="search-button"
                type="submit"
                disabled={isLoading}
                className="w-full md:col-span-2 px-5 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
            
            {backendStatus === 'offline' && (
              <div className="flex items-start space-x-2 text-xs text-amber-500 bg-amber-950/20 border border-amber-900/50 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Backend is currently offline.</strong> Running a search will result in a connection error. Please run <code>python run.py</code> inside the <code>server/</code> folder to start it.
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Results Container */}
        <div className="w-full max-w-5xl">
          
          {/* 1. Loading State (Skeleton Cards) */}
          {isLoading && (
            <div className="space-y-6">
              <div className="h-6 w-48 bg-slate-800 rounded animate-pulse"></div>
              <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-slate-900/25 border border-slate-800/80 rounded-xl p-5 space-y-4 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="h-5 w-24 bg-slate-800 rounded"></div>
                      <div className="h-4 w-12 bg-slate-800 rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-slate-800 rounded"></div>
                    <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
                    <div className="space-y-2 pt-2">
                      <div className="h-3 w-full bg-slate-800 rounded"></div>
                      <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
                    </div>
                    <div className="h-9 w-full bg-slate-800 rounded pt-3"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Error State */}
          {!isLoading && error && (
            <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-6 text-center max-w-xl mx-auto">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-100 mb-2">Search Call Failed</h3>
              <p className="text-sm text-slate-400 mb-4">{error}</p>
              <button 
                onClick={handleSearch}
                className="px-4 py-2 bg-rose-800/35 hover:bg-rose-800/50 border border-rose-700/50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          )}

          {/* 3. Success State with Results */}
          {!isLoading && !error && searched && (
            <div className="space-y-6">
              
              {/* Scan Metrics / Quick Stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Building className="w-5 h-5 text-indigo-400" />
                    <span>Search Results: {category} in {city}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Google Places API returned {leads.length} results.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-950 border border-indigo-900/50 text-indigo-300 font-medium">
                    {leads.length} Scan Matches
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
                    {leadsWithoutWebsiteCount} High Value Leads
                  </span>
                </div>
              </div>
              
              {/* Results Grid */}
              {leads.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {leads.map((lead, idx) => {
                    const noWebsite = lead.status === 'No Website'
                    return (
                      <div 
                        key={idx} 
                        className={`bg-slate-900/40 border rounded-xl p-5 hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                          noWebsite 
                            ? 'border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-amber-500/5' 
                            : 'border-slate-800/80'
                        }`}
                      >
                        {/* Glow for no website leads */}
                        {noWebsite && (
                          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none translate-x-8 -translate-y-8"></div>
                        )}
                        
                        <div>
                          {/* Badges / Rating Header */}
                          <div className="flex justify-between items-start mb-3 gap-2">
                            {noWebsite ? (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Potential Lead
                              </span>
                            ) : (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Has Website
                              </span>
                            )}
                            
                            {/* Stars rating */}
                            {lead.rating > 0 && (
                              <div className="flex items-center space-x-1 text-amber-400">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-bold font-mono">{lead.rating}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Business Name */}
                          <h4 className={`font-bold text-base mb-1 transition-colors ${
                            noWebsite ? 'text-slate-100 group-hover:text-amber-400' : 'text-slate-300'
                          }`}>
                            {lead.name}
                          </h4>
                          
                          {/* Business Location & Contact */}
                          <div className="space-y-2 text-xs text-slate-400 mt-4 mb-4">
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{lead.address}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{lead.phone || 'No phone listing'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Button Link Layout */}
                        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
                          {noWebsite ? (
                            <div className="space-y-2">
                              <div className="bg-slate-950/80 border border-amber-500/10 rounded-lg p-2.5 text-[11px] text-amber-300/85">
                                Opportunity: High. Business is well rated, but lacks web services. Pitch standard package.
                              </div>
                              <a 
                                href={lead.maps_link}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <span>Outreach Map Profile</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ) : (
                            <a 
                              href={lead.website}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <span>Visit Website</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* Empty Results State */
                <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto">
                  <Building className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-200 mb-2">No Matching Businesses</h3>
                  <p className="text-sm text-slate-400">
                    We scanned the location but couldn't find any {category.toLowerCase()} listings in {city}. Try modifying your queries.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 4. Starter Screen / Initial landing state */}
          {!isLoading && !error && !searched && (
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
      <footer className="border-t border-slate-800/60 bg-[#080b12] py-8 text-center text-xs text-slate-500 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 LeadLocal. All rights reserved.</p>
          <div className="flex space-x-4">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">React v19</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">FastAPI</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">Google Places API v1</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
