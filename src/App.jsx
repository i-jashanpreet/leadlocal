import { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  Globe, 
  Building, 
  CheckCircle2, 
  MapPin, 
  ExternalLink,
  Star,
  AlertTriangle,
  Bookmark,
  LayoutGrid,
  Table,
  Trash2,
  Phone,
  Sparkles,
  Check,
  ArrowRight,
  Copy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const getPresenceBadges = (lead) => {
  const badges = []
  if (lead.status === 'No Website') {
    badges.push({ text: 'No Website', color: 'bg-[#ff3b30]/10 text-[#ff3b30] border-transparent shadow-none' })
    badges.push({ text: 'Weak Presence', color: 'bg-[#ff3b30]/10 text-[#ff3b30] border-transparent shadow-none' })
  } else if (lead.status === 'Broken') {
    badges.push({ text: 'Broken Website', color: 'bg-[#ff3b30]/10 text-[#ff3b30] border-transparent shadow-none' })
    badges.push({ text: 'Weak Presence', color: 'bg-[#ff3b30]/10 text-[#ff3b30] border-transparent shadow-none' })
  } else if (lead.status === 'Outdated' || lead.status === 'Outdated/Parked') {
    badges.push({ text: 'Outdated Site', color: 'bg-[#ff9500]/10 text-[#ff9500] border-transparent' })
    badges.push({ text: 'Muted Online Presence', color: 'bg-[#f5f5f7] text-[#86868b] border-[#e8e8ed]' })
  } else if (lead.status === 'Active') {
    badges.push({ text: 'Verified Lead', color: 'bg-[#34c759]/10 text-[#30d158] border-transparent' })
  } else {
    // fallback
    badges.push({ text: 'Verified Lead', color: 'bg-[#0071e3]/10 text-[#0071e3] border-transparent' })
  }
  return badges
}

const renderSocialIcons = (socials) => {
  if (!socials || socials.length === 0) return null
  return (
    <div className="flex items-center space-x-2 mt-2">
      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Socials:</span>
      <div className="flex items-center space-x-1.5">
        {socials.map((platform) => {
          let icon = null
          let tooltip = platform
          
          if (platform === 'Facebook') {
            icon = (
              <svg className="w-4 h-4 text-blue-500 hover:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            )
          } else if (platform === 'Instagram') {
            icon = (
              <svg className="w-4 h-4 text-pink-500 hover:text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            )
          } else if (platform === 'LinkedIn') {
            icon = (
              <svg className="w-4 h-4 text-blue-400 hover:text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            )
          } else if (platform === 'X/Twitter' || platform === 'X' || platform === 'Twitter') {
            icon = (
              <svg className="w-4 h-4 text-slate-350 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            )
          }
          
          return (
            <span key={platform} title={tooltip} className="p-1 rounded bg-slate-900 border border-slate-200 flex items-center justify-center">
              {icon}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function App() {
  // Navigation & View Tabs
  const [currentView, setCurrentView] = useState('find_leads') // 'landing', 'find_leads', or 'saved_leads'
  const [layoutView, setLayoutView] = useState('grid') // 'grid' or 'table'
  
  // Dashboard/Search Parameters States
  const [city, setCity] = useState('Austin, TX')
  const [category, setCategory] = useState('Dentist')
  const [minRating, setMinRating] = useState(0.0)
  const [noWebsiteOnly, setNoWebsiteOnly] = useState(false)
  const [sortBy, setSortBy] = useState('score_desc') // Default sort by Lead Score!
  
  // Pagination States for Search
  const [searchPage, setSearchPage] = useState(1)
  const [totalSearchLeads, setTotalSearchLeads] = useState(0)
  const limit = 6 

  // Search Output States
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [searchError, setSearchError] = useState(null)
  
  // Saved Leads Filters & Pagination States
  const [savedMinRating, setSavedMinRating] = useState(0.0)
  const [savedNoWebsiteOnly, setSavedNoWebsiteOnly] = useState(false)
  const [savedSortBy, setSavedSortBy] = useState('score_desc') // Default sort by Lead Score!
  const [savedPage, setSavedPage] = useState(1)
  const [totalSavedLeads, setTotalSavedLeads] = useState(0)

  // Saved Leads Output States
  const [savedLeads, setSavedLeads] = useState([])
  const [isSavedLoading, setIsSavedLoading] = useState(false)
  const [savedError, setSavedError] = useState(null)
  
  // Modal / Detailed Audit States
  const [activeAuditLead, setActiveAuditLead] = useState(null)
  const [showAuditModal, setShowAuditModal] = useState(false)
  
  
  // Copying Phone States
  const [copiedId, setCopiedId] = useState(null)

  // Toasts System State
  const [toasts, setToasts] = useState([])
  
  // System Health State
  const [backendStatus, setBackendStatus] = useState('checking') // 'checking', 'connected', 'offline'
  
  const prevParamsRef = useRef(null)

  const categories = [
    { value: 'Dentist', label: 'Dentists' },
    { value: 'Restaurant', label: 'Restaurants & Cafes' },
    { value: 'Plumber', label: 'Plumbers' },
    { value: 'Gym', label: 'Gyms & Fitness' },
    { value: 'Auto Repair', label: 'Auto Repair Shops' },
    { value: 'Landscaping', label: 'Landscaping' },
    { value: 'Electrician', label: 'Electricians' },
    { value: 'Bakery', label: 'Bakeries' },
    { value: 'Salon', label: 'Salons & Spas' }
  ]

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  const copyToClipboard = (text, leadId) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedId(leadId)
    addToast('Phone number copied to clipboard!', 'info')
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function verifyBackend() {
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
    } catch {
      setBackendStatus('offline')
    }
  }

  useEffect(() => {
    setTimeout(() => {
      verifyBackend()
      fetchSavedLeads()
    }, 0)
    const interval = setInterval(() => {
      verifyBackend()
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  // Auto-fetch database saved leads on filter/page changes
  useEffect(() => {
    fetchSavedLeads()
  }, [savedMinRating, savedNoWebsiteOnly, savedSortBy, savedPage, currentView])

  // Auto-refetch Search results when page or sorting parameters change
  useEffect(() => {
    if (searched) {
      executeSearch(false)
    }
  }, [searchPage, sortBy])

  // Fetch saved leads list from DB
  async function fetchSavedLeads() {
    if (backendStatus === 'offline') return
    
    setIsSavedLoading(true)
    setSavedError(null)
    
    const offset = (savedPage - 1) * limit
    const url = `/api/saved-leads?min_rating=${savedMinRating}&no_website_only=${savedNoWebsiteOnly}&sort_by=${savedSortBy}&limit=${limit}&offset=${offset}`
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Load failed: status ${response.status}`)
      }
      const data = await response.json()
      setSavedLeads(data.results || [])
      setTotalSavedLeads(data.total_count || 0)
    } catch (err) {
      console.error(err)
      setSavedError('Could not fetch saved leads from database.')
    } finally {
      setIsSavedLoading(false)
    }
  }

  // Search businesses execution logic
  async function executeSearch(resetPage = true) {
    if (!city.trim() || !category.trim()) return
    
    const targetPage = resetPage ? 1 : searchPage
    if (resetPage) setSearchPage(1)
    
    setIsLoading(true)
    setSearchError(null)
    setSearched(true)
    
    const offset = (targetPage - 1) * limit
    
    // Performance optimization: duplicate params query check
    const paramKey = `${city}_${category}_${minRating}_${noWebsiteOnly}_${sortBy}_${offset}`
    if (prevParamsRef.current === paramKey) {
      setIsLoading(false)
      return 
    }
    prevParamsRef.current = paramKey
    
    const url = `/api/search?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}&min_rating=${minRating}&no_website_only=${noWebsiteOnly}&sort_by=${sortBy}&limit=${limit}&offset=${offset}`
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Search failed with status ${response.status}`)
      }
      const data = await response.json()
      setSearchResults(data.results || [])
      setTotalSearchLeads(data.total_count || 0)
    } catch (err) {
      console.error(err)
      setSearchError(err.message || 'Failed to search local businesses.')
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    executeSearch(true)
  }

  // Save a business to the pipeline
  const handleSaveLead = async (lead) => {
    try {
      const response = await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          address: lead.address,
          rating: lead.rating || 0,
          phone: lead.phone,
          website: lead.website,
          maps_link: lead.maps_link,
          category: category,
          reviews_count: lead.reviews_count || 0,
          status: lead.status,
          lead_score: lead.lead_score,
          opportunity_level: lead.opportunity_level,
          ai_insights: lead.ai_insights,
          photo_url: lead.photo_url,
          socials: lead.socials,
          presence_details: lead.presence_details
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to save lead.')
      }
      
      addToast(`Saved lead: "${lead.name}"`, 'success')
      fetchSavedLeads() // Update saved counter
    } catch (err) {
      console.error(err)
      addToast(err.message || 'Error occurred saving lead.', 'error')
    }
  }

  // Remove a saved lead
  const handleRemoveLead = async (id, name) => {
    try {
      const response = await fetch(`/api/saved-lead/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to remove lead.')
      }
      
      addToast(`Removed lead: "${name}"`, 'info')
      fetchSavedLeads() 
    } catch (err) {
      console.error(err)
      addToast(err.message || 'Error occurred removing lead.', 'error')
    }
  }

  const isLeadAlreadySaved = (lead) => {
    return savedLeads.some(
      (saved) => saved.name === lead.name && saved.address === lead.address
    )
  }


  // Open the score audit details overlay modal
  const openAuditModal = (lead) => {
    setActiveAuditLead(lead)
    setShowAuditModal(true)
  }

  // Find the top 3 opportunities in the current saved list (Top scoring)
  const topOpportunities = [...savedLeads]
    .filter(lead => lead.opportunity_level === 'High')
    .sort((a, b) => b.lead_score - a.lead_score)
    .slice(0, 3)

  // Pagination totals
  const totalSearchPages = Math.ceil(totalSearchLeads / limit) || 1
  const totalSavedPages = Math.ceil(totalSavedLeads / limit) || 1

  

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] relative font-sans flex overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#e8e8ed] bg-[#fbfbfd] flex flex-col justify-between z-20 shrink-0 select-none">
        <div>
          {/* Brand Logo Header */}
          <div 
            onClick={() => setCurrentView('find_leads')}
            className="h-16 flex items-center px-6 border-b border-[#e8e8ed] space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-[#e8e8ed] flex items-center justify-center shadow-sm shrink-0">
              <svg viewBox="0 0 100 100" className="w-5.5 h-5.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sidebarLogoLeftGrad" x1="23" y1="17" x2="43" y2="82" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0071e3" />
                    <stop offset="100%" stopColor="#5e5ce6" />
                  </linearGradient>
                  
                  <linearGradient id="sidebarLogoRightGrad" x1="47" y1="40" x2="67" y2="82" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3da4ff" />
                    <stop offset="100%" stopColor="#0071e3" />
                  </linearGradient>

                  <filter id="sidebarLogoOverlapShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="-1.5" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.22"/>
                  </filter>
                </defs>

                <path d="M 23 17 L 23 72 A 10 10 0 0 0 33 82 L 63 82" 
                      stroke="url(#sidebarLogoLeftGrad)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />

                <path d="M 47 40 L 47 72 A 10 10 0 0 0 57 82 L 78 82" 
                      stroke="url(#sidebarLogoRightGrad)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"
                      filter="url(#sidebarLogoOverlapShadow)" />
              </svg>
            </div>
            <div>
              <span className="font-semibold tracking-tight text-[#1d1d1f] text-sm">
                LeadLocal
              </span>
              <span className="ml-2 text-[8px] font-semibold px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b] border border-[#e8e8ed] tracking-wider uppercase">
                AI Engine
              </span>
            </div>
          </div>
 
          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setCurrentView('find_leads')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                currentView === 'find_leads'
                  ? 'bg-[#e8e8ed] text-[#1d1d1f] font-semibold'
                  : 'text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Search className="w-4 h-4" />
                <span>Scan Leads</span>
              </div>
              <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${
                currentView === 'find_leads' ? 'translate-x-0.5 opacity-100' : 'opacity-0'
              }`} />
            </button>
 
            <button
              onClick={() => {
                setCurrentView('saved_leads')
                setSavedPage(1)
                fetchSavedLeads()
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                currentView === 'saved_leads'
                  ? 'bg-[#e8e8ed] text-[#1d1d1f] font-semibold'
                  : 'text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Bookmark className="w-4 h-4" />
                <span>Saved Pipeline</span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                currentView === 'saved_leads'
                  ? 'bg-[#ffffff] text-[#1d1d1f] border-[#d2d2d7]'
                  : 'bg-[#f5f5f7] text-[#86868b] border-[#e8e8ed]'
              }`}>
                {totalSavedLeads}
              </span>
            </button>
          </nav>
        </div>
 
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#e8e8ed] bg-transparent">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-[#86868b] font-medium">Database Status:</span>
            {backendStatus === 'connected' ? (
              <span className="w-2 h-2 rounded-full bg-[#30d158] shadow-sm shadow-[#30d158]/55 animate-pulse"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-[#ff3b30]"></span>
            )}
          </div>
          <p className="text-[10px] text-[#86868b] leading-normal font-normal">
            Lead score and local opportunity audit engine is online.
          </p>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="flex-grow flex flex-col h-screen overflow-y-auto">
        
        {/* Sticky Translucent Header */}
        <header className="sticky top-0 h-14 border-b border-[#e8e8ed] px-8 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-30">
          <h2 className="text-[11px] font-semibold text-[#86868b] tracking-widest">
            {currentView === 'find_leads' ? 'DISCOVERY HUB' : 'PIPELINE ANALYTICS'}
          </h2>
 
          <div className="flex items-center space-x-4">
            <div className="text-[11px] font-normal text-[#1d1d1f] flex items-center space-x-2 bg-[#f5f5f7] border border-[#e8e8ed] px-3.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse"></span>
              <span>AI Lead Scoring Active</span>
            </div>
          </div>
        </header>
 
        {/* View tab contents */}
        <div className="flex-grow p-8 max-w-6xl w-full mx-auto pb-24">
          
          {/* TAB 1: DISCOVER LEADS & SCORING */}
          {currentView === 'find_leads' && (
            <div className="space-y-6">
              
              {/* Sticky Search bar panel */}
              <div className="bg-white border border-[#e8e8ed] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] relative overflow-hidden">
                
                <form id="search-form" onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="relative md:col-span-6">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                      <input
                        id="search-city"
                        type="text"
                        placeholder="Enter City, State (e.g. Austin, TX)"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#f5f5f7] focus:bg-white rounded-full py-2.5 pl-11 pr-4 text-[13px] text-[#1d1d1f] placeholder-[#a1a1a6] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all font-normal"
                        required
                      />
                    </div>
                    
                    <div className="relative md:col-span-4">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
                      <select
                        id="search-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#f5f5f7] focus:bg-white rounded-full py-2.5 pl-11 pr-10 text-[13px] text-[#1d1d1f] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all font-normal"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value} className="bg-white text-[#1d1d1f]">
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#86868b]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
 
                    <button
                      id="search-button"
                      type="submit"
                      disabled={isLoading}
                      className="w-full md:col-span-2 px-5 py-2.5 bg-[#1d1d1f] hover:bg-[#2d2d2f] text-white font-medium rounded-full text-[13px] transition-all duration-205 flex items-center justify-center space-x-2 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isLoading ? (
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5" />
                          <span>Discover</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Advanced Filters Drawer */}
                  <div className="pt-4 border-t border-[#e8e8ed] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                      
                      {/* Min Rating Slider */}
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-[#86868b] font-medium">Min Rating:</span>
                        <input
                          type="range"
                          min="0.0"
                          max="5.0"
                          step="0.5"
                          value={minRating}
                          onChange={(e) => setMinRating(parseFloat(e.target.value))}
                          className="w-24 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-[#1d1d1f] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full border border-[#e8e8ed]">
                          {minRating > 0 ? `${minRating}+` : 'All'}
                        </span>
                      </div>
 
                      {/* No Website Only Toggle */}
                      <label className="inline-flex items-center space-x-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={noWebsiteOnly}
                          onChange={(e) => setNoWebsiteOnly(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-[#e8e8ed] rounded-full peer peer-checked:bg-[#34c759] relative transition-all duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-transparent after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 shadow-sm"></div>
                        <span className="text-xs font-medium text-[#86868b] peer-checked:text-[#1d1d1f]">No Website Only</span>
                      </label>
                    </div>
 
                    {/* Sorting Parameters */}
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="text-xs text-[#86868b] font-medium">Sort By:</span>
                      <div className="relative">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="pl-3 pr-8 py-1.5 bg-[#f5f5f7] border border-[#e8e8ed] text-xs font-medium text-[#1d1d1f] rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
                        >
                          <option value="score_desc">AI Opportunity Score</option>
                          <option value="rating_desc">Highest Rating</option>
                          <option value="rating_asc">Lowest Rating</option>
                          <option value="reviews_desc">Most Reviews</option>
                          <option value="name_asc">Alphabetical</option>
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#86868b]">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Discovery Output View */}
              <div className="space-y-6">
                
                {/* 1. Loading Skeletons */}
                {isLoading && (
                  <div className="space-y-6">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 text-center max-w-2xl mx-auto flex flex-col items-center space-y-3 shadow-sm animate-pulse">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Compiling Real-Time Market Intelligence</h3>
                      <p className="text-xs text-slate-400 max-w-md">
                        Querying live Google Places directories, verifying domain health, checking mobile layout responsiveness, and compiling Business Intelligence opportunity scores. This takes about 2-3 seconds.
                      </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-slate-900/25 border border-slate-200/80 rounded-2xl p-5 space-y-4 animate-pulse">
                          <div className="h-32 w-full bg-slate-100 rounded-xl"></div>
                          <div className="flex justify-between items-center">
                            <div className="h-5 w-20 bg-slate-100 rounded"></div>
                            <div className="h-4 w-10 bg-slate-100 rounded"></div>
                          </div>
                          <div className="h-6 w-3/4 bg-slate-100 rounded"></div>
                          <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                          <div className="space-y-2 pt-2">
                            <div className="h-3 w-full bg-slate-105 rounded"></div>
                            <div className="h-3 w-5/6 bg-slate-105 rounded"></div>
                          </div>
                          <div className="h-9 w-full bg-slate-100 rounded pt-3"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Error Display */}
                {!isLoading && searchError && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-xl mx-auto text-slate-700">
                    <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-100 mb-2">Search Pipeline Failed</h3>
                    <p className="text-sm text-slate-450 mb-4">{searchError}</p>
                    <button 
                      onClick={() => executeSearch(false)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Retry Search
                    </button>
                  </div>
                )}

                {/* 3. Query Results */}
                {!isLoading && !searchError && searched && (
                  <div key={searchPage} className="space-y-6 animate-slideIn">
                    
                    {/* Header metrics count */}
                    <div className="flex items-center justify-between border-b border-[#e8e8ed] pb-3">
                      <span className="text-xs text-[#86868b] font-medium tracking-wide uppercase">
                        RESULTS PAGE {searchPage} OF {totalSearchPages} ({totalSearchLeads} PROSPECTS)
                      </span>
                      <span className="text-xs text-[#0071e3] font-medium">
                        Sort order: AI Lead Opportunity Priority
                      </span>
                    </div>

                    {searchResults.length > 0 ? (
                      <>
                        <div className="grid gap-6 md:grid-cols-3">
                          {searchResults.map((lead, idx) => {
                            const noWebsite = lead.status === 'No Website' || lead.status === 'Broken'
                            const outdated = lead.status === 'Outdated' || lead.status === 'Outdated/Parked'
                            const leadFound = lead.status === 'Active' || (!noWebsite && !outdated)
                            const alreadySaved = isLeadAlreadySaved(lead)
                            
                            // progress bar color helper
                            const score = lead.lead_score || 0
                            const barColorClass = score >= 75 ? 'bg-[#34c759]' : score >= 40 ? 'bg-[#ff9500]' : 'bg-[#ff3b30]'
                            
                            return (
                              <div 
                                key={idx} 
                                onClick={() => openAuditModal(lead)}
                                className="bg-white border border-[#e8e8ed] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:border-[#d2d2d7] transition-all duration-300 flex flex-col justify-between h-[235px] relative group cursor-pointer"
                              >
                                <div>
                                  {/* Top Row: Name and Badge/Save */}
                                  <div className="flex items-start justify-between gap-4">
                                    <h4 className="font-semibold text-[#1d1d1f] text-[15px] leading-snug group-hover:text-[#0071e3] transition-colors line-clamp-1">
                                      {lead.name}
                                    </h4>
                                    
                                    <div className="flex items-center space-x-1.5 shrink-0">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (!alreadySaved) handleSaveLead(lead);
                                        }}
                                        className={`p-1.5 rounded-full border-0 transition-all ${
                                          alreadySaved 
                                            ? 'bg-[#34c759]/10 text-[#30d158]' 
                                            : 'bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]'
                                        }`}
                                        title={alreadySaved ? "Saved" : "Save Lead"}
                                      >
                                        {alreadySaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                                      </button>
                                      
                                      {noWebsite && (
                                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-[#ff3b30]/10 text-[#ff3b30] uppercase tracking-wider">
                                          No Website
                                        </span>
                                      )}
                                      {outdated && (
                                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-[#ff9500]/10 text-[#ff9500] uppercase tracking-wider">
                                          Outdated Tech
                                        </span>
                                      )}
                                      {leadFound && (
                                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b] border border-[#e8e8ed] uppercase tracking-wider">
                                          Lead Found
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Rating Row */}
                                  <div className="flex items-center space-x-1.5 text-xs text-[#ff9500] mt-1">
                                    <Star className="w-3.5 h-3.5 fill-current text-[#ff9500]" />
                                    <span className="font-semibold text-[#1d1d1f]">{lead.rating ? lead.rating.toFixed(1) : '0.0'}</span>
                                    <span className="text-[#86868b]">({lead.reviews_count || 0} reviews)</span>
                                  </div>

                                  {/* Location / Details */}
                                  <div className="text-[12px] text-[#86868b] mt-3 space-y-1">
                                    <div className="flex items-center space-x-1.5">
                                      <MapPin className="w-3.5 h-3.5 text-[#a1a1a6] shrink-0" />
                                      <span className="truncate">{lead.address}</span>
                                    </div>
                                    {lead.phone && (
                                      <div className="flex items-center space-x-1.5">
                                        <Phone className="w-3.5 h-3.5 text-[#a1a1a6] shrink-0" />
                                        <span>{lead.phone}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Bottom Metric / Actions Row */}
                                <div className="mt-3 pt-3 border-t border-[#e8e8ed]">
                                  {noWebsite && (
                                    <div>
                                      <div className="flex justify-between text-xs text-[#86868b] mb-1 font-medium">
                                        <span>SEO Score</span>
                                        <span className="font-semibold text-[#1d1d1f]">{lead.lead_score || 12}/100</span>
                                      </div>
                                      <div className="w-full bg-[#e8e8ed] h-1.5 rounded-full overflow-hidden">
                                        <div 
                                          className={`${barColorClass} h-full rounded-full transition-all duration-500`} 
                                          style={{ width: `${lead.lead_score || 12}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}

                                  {outdated && (
                                    <div>
                                      <div className="flex justify-between text-xs text-[#86868b] mb-1 font-medium">
                                        <span>Mobile Friendliness</span>
                                        <span className="font-semibold text-[#ff9500]">
                                          {lead.lead_score < 40 ? 'Poor' : lead.lead_score < 75 ? 'Fair' : 'Good'}
                                        </span>
                                      </div>
                                      <div className="w-full bg-[#e8e8ed] h-1.5 rounded-full overflow-hidden">
                                        <div 
                                          className={`${barColorClass} h-full rounded-full transition-all duration-500`} 
                                          style={{ width: `${lead.lead_score || 35}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}

                                  {leadFound && (
                                    <div className="flex items-center justify-between gap-3">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openAuditModal(lead);
                                        }}
                                        className="flex-grow py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-xs font-medium transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm shadow-[#0071e3]/10"
                                      >
                                        <span>View Decision Maker</span>
                                      </button>
                                      
                                      <a
                                        href={lead.maps_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] rounded-full transition-all border-0"
                                        title="Google Maps"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
 
                        {/* Search Pagination Controller */}
                        {totalSearchPages > 1 && (
                          <div className="flex items-center justify-between border-t border-[#e8e8ed] pt-6 mt-8">
                            <button
                              onClick={() => setSearchPage(p => Math.max(1, p - 1))}
                              disabled={searchPage === 1}
                              className="px-4 py-2 bg-white hover:bg-[#f5f5f7] disabled:opacity-50 disabled:cursor-not-allowed border border-[#e8e8ed] text-[#1d1d1f] text-xs font-medium rounded-full transition-all flex items-center space-x-1.5 cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Previous</span>
                            </button>
                            
                            <span className="text-xs font-medium text-[#86868b]">
                              Page {searchPage} of {totalSearchPages}
                            </span>
 
                            <button
                              onClick={() => setSearchPage(p => Math.min(totalSearchPages, p + 1))}
                              disabled={searchPage === totalSearchPages}
                              className="px-4 py-2 bg-white hover:bg-[#f5f5f7] disabled:opacity-50 disabled:cursor-not-allowed border border-[#e8e8ed] text-[#1d1d1f] text-xs font-medium rounded-full transition-all flex items-center space-x-1.5 cursor-pointer"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-white border border-[#e8e8ed] rounded-2xl p-16 text-center max-w-xl mx-auto shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <Building className="w-12 h-12 text-[#a1a1a6] mx-auto mb-4" />
                        <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">No matching prospects found</h3>
                        <p className="text-[13px] text-[#86868b] max-w-sm mx-auto">
                          Try modifying your location or adjust filter criteria.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Initial landing state */}
                {!searched && (
                  <div className="grid gap-6 md:grid-cols-3 pt-6 animate-fadeIn">
                    <div className="bg-white border border-[#e8e8ed] rounded-2xl p-6 hover:border-[#d2d2d7] hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all">
                      <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-4">
                        <MapPin className="w-4 h-4 text-[#1d1d1f]" />
                      </div>
                      <h3 className="font-semibold text-[#1d1d1f] text-[15px] mb-2">1. Choose Location</h3>
                      <p className="text-[13px] text-[#86868b] leading-relaxed">
                        Type in any city or state to scan active business directories in real-time.
                      </p>
                    </div>

                    <div className="bg-white border border-[#e8e8ed] rounded-2xl p-6 hover:border-[#d2d2d7] hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all">
                      <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-4">
                        <Globe className="w-4 h-4 text-[#1d1d1f]" />
                      </div>
                      <h3 className="font-semibold text-[#1d1d1f] text-[15px] mb-2">2. Audit Digital Assets</h3>
                      <p className="text-[13px] text-[#86868b] leading-relaxed">
                        Verify domains, contact fields, and identify companies operating without modern websites.
                      </p>
                    </div>

                    <div className="bg-white border border-[#e8e8ed] rounded-2xl p-6 hover:border-[#d2d2d7] hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all">
                      <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-4">
                        <Sparkles className="w-4 h-4 text-[#1d1d1f]" />
                      </div>
                      <h3 className="font-semibold text-[#1d1d1f] text-[15px] mb-2">3. Prioritize Opportunities</h3>
                      <p className="text-[13px] text-[#86868b] leading-relaxed">
                        Instantly score review counts, rating values, and presence health to pitch high-converting services.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: SAVED LEADS & PIPELINE */}
          {currentView === 'saved_leads' && (
            <div className="space-y-8 animate-fadeIn">
               
              {/* TOP OPPORTUNITIES SHELF */}
              {topOpportunities.length > 0 && !isSavedLoading && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#0071e3]" />
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">AI Priority: Top 3 Pipeline Opportunities</h2>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    {topOpportunities.map((lead) => (
                      <div 
                        key={lead.id} 
                        className="bg-white border border-[#e8e8ed] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:border-[#d2d2d7] transition-all duration-300 relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[9px] font-medium px-2.5 py-0.5 rounded-full bg-[#34c759]/10 text-[#30d158] uppercase tracking-wider">
                            High Priority
                          </span>
                          
                          <div className="flex items-center space-x-1 bg-[#f5f5f7] border border-[#e8e8ed] px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#1d1d1f]">
                            <span>Score:</span>
                            <span className="text-[#1d1d1f] font-semibold">{lead.lead_score}</span>
                          </div>
                        </div>
 
                        <h4 className="font-semibold text-[#1d1d1f] text-[15px] tracking-tight truncate">{lead.name}</h4>
                        <p className="text-[11px] text-[#86868b] mt-0.5">{lead.category || 'General'}</p>
                        
                        <p className="text-[12px] text-[#86868b] leading-relaxed mt-4 line-clamp-2">
                          {lead.ai_insights && lead.ai_insights[0] ? lead.ai_insights[0] : 'Needs custom web presence auditing.'}
                        </p>
 
                        <button 
                          onClick={() => openAuditModal(lead)}
                          className="mt-4 w-full py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[11px] font-medium rounded-full tracking-normal transition-colors cursor-pointer"
                        >
                          Open Audit Sheet
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
 
              {/* Saved leads filter drawer/bar */}
              <div className="bg-white border border-[#e8e8ed] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  
                  {/* Min Rating */}
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-[#86868b] font-medium">Min Rating:</span>
                    <input
                      type="range"
                      min="0.0"
                      max="5.0"
                      step="0.5"
                      value={savedMinRating}
                      onChange={(e) => {
                        setSavedMinRating(parseFloat(e.target.value))
                        setSavedPage(1)
                      }}
                      className="w-20 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#1d1d1f] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full border border-[#e8e8ed]">
                      {savedMinRating > 0 ? `${savedMinRating}+` : 'All'}
                    </span>
                  </div>
 
                  {/* No Website Only Toggle */}
                  <label className="inline-flex items-center space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={savedNoWebsiteOnly}
                      onChange={(e) => {
                        setSavedNoWebsiteOnly(e.target.checked)
                        setSavedPage(1)
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#e8e8ed] rounded-full peer peer-checked:bg-[#34c759] relative transition-all duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-transparent after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 shadow-sm"></div>
                    <span className="text-xs font-medium text-[#86868b] peer-checked:text-[#1d1d1f]">No Website Only</span>
                  </label>
                </div>
 
                {/* Sort dropdown and layout segmented selector */}
                <div className="flex items-center space-x-4 shrink-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-[#86868b] font-medium">Sort By:</span>
                    <div className="relative">
                      <select
                        value={savedSortBy}
                        onChange={(e) => {
                          setSavedSortBy(e.target.value)
                          setSavedPage(1)
                        }}
                        className="pl-3 pr-8 py-1.5 bg-[#f5f5f7] border border-[#e8e8ed] text-xs font-medium text-[#1d1d1f] rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
                      >
                        <option value="score_desc">AI Opportunity Score</option>
                        <option value="newest">Newest Saved</option>
                        <option value="rating_desc">Highest Rating</option>
                        <option value="rating_asc">Lowest Rating</option>
                      </select>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#86868b]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Segmented Control Picker */}
                  <div className="flex items-center space-x-0.5 bg-[#f5f5f7] p-0.5 rounded-full border border-[#e8e8ed]">
                    <button
                      type="button"
                      onClick={() => setLayoutView('grid')}
                      className={`p-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                        layoutView === 'grid'
                          ? 'bg-white text-[#1d1d1f] shadow-sm'
                          : 'text-[#86868b] hover:text-[#1d1d1f]'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutView('table')}
                      className={`p-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                        layoutView === 'table'
                          ? 'bg-white text-[#1d1d1f] shadow-sm'
                          : 'text-[#86868b] hover:text-[#1d1d1f]'
                      }`}
                      title="Table View"
                    >
                      <Table className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
 
              {/* Loader */}
              {isSavedLoading && (
                <div className="grid gap-6 md:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white border border-[#e8e8ed] rounded-2xl p-5 space-y-4 animate-pulse">
                      <div className="h-5 w-24 bg-[#f5f5f7] rounded-full"></div>
                      <div className="h-6 w-3/4 bg-[#f5f5f7] rounded-full"></div>
                      <div className="h-4 w-1/2 bg-[#f5f5f7] rounded-full"></div>
                      <div className="h-9 w-full bg-[#f5f5f7] rounded-full pt-3"></div>
                    </div>
                  ))}
                </div>
              )}
 
              {/* Saved Error Box */}
              {!isSavedLoading && savedError && (
                <div className="bg-[#ff3b30]/5 border border-[#ff3b30]/15 rounded-2xl p-8 text-center max-w-xl mx-auto text-[#ff3b30]">
                  <AlertTriangle className="w-10 h-10 text-[#ff3b30] mx-auto mb-4" />
                  <h3 className="text-base font-semibold mb-2">Failed to Load Database</h3>
                  <p className="text-xs text-[#86868b] mb-4">{savedError}</p>
                  <button 
                    onClick={fetchSavedLeads}
                    className="px-4 py-2 bg-[#ff3b30] hover:bg-[#ff3b30]/90 text-white text-xs font-medium rounded-full transition-colors cursor-pointer"
                  >
                    Retry Connection
                  </button>
                </div>
              )}

              {/* Saved Leads list render */}
              {!isSavedLoading && !savedError && (
                <div key={`${savedPage}-${layoutView}`} className="space-y-6 animate-slideIn">
                  {savedLeads.length > 0 ? (
                    <>
                      {/* View Grid Layout */}
                      {layoutView === 'grid' && (
                        <div className="grid gap-6 md:grid-cols-3 animate-fadeIn">
                          {savedLeads.map((lead) => {
                            const noWebsite = lead.status === 'No Website' || lead.status === 'Broken'
                            const outdated = lead.status === 'Outdated' || lead.status === 'Outdated/Parked'
                            const leadFound = lead.status === 'Active' || (!noWebsite && !outdated)
                            
                            // progress bar color helper
                            const score = lead.lead_score || 0
                            const barColorClass = score >= 75 ? 'bg-[#34c759]' : score >= 40 ? 'bg-[#ff9500]' : 'bg-[#ff3b30]'
                            
                            return (
                              <div 
                                key={lead.id} 
                                onClick={() => openAuditModal(lead)}
                                className="bg-white border border-[#e8e8ed] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:border-[#d2d2d7] transition-all duration-300 flex flex-col justify-between h-[235px] relative group cursor-pointer"
                              >
                                <div>
                                  {/* Top Row: Name and Badge/Delete */}
                                  <div className="flex items-start justify-between gap-4">
                                    <h4 className="font-semibold text-[#1d1d1f] text-[15px] leading-snug group-hover:text-[#0071e3] transition-colors line-clamp-1">
                                      {lead.name}
                                    </h4>
                                    
                                    <div className="flex items-center space-x-1.5 shrink-0">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveLead(lead.id, lead.name);
                                        }}
                                        className="p-1.5 rounded-full bg-[#ff3b30]/10 hover:bg-[#ff3b30]/20 text-[#ff3b30] border-0 transition-all"
                                        title="Remove Lead"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                      
                                      {noWebsite && (
                                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-[#ff3b30]/10 text-[#ff3b30] uppercase tracking-wider">
                                          No Website
                                        </span>
                                      )}
                                      {outdated && (
                                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-[#ff9500]/10 text-[#ff9500] uppercase tracking-wider">
                                          Outdated Tech
                                        </span>
                                      )}
                                      {leadFound && (
                                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b] border border-[#e8e8ed] uppercase tracking-wider">
                                          Lead Found
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Rating Row */}
                                  <div className="flex items-center space-x-1.5 text-xs text-[#ff9500] mt-1">
                                    <Star className="w-3.5 h-3.5 fill-current text-[#ff9500]" />
                                    <span className="font-semibold text-[#1d1d1f]">{lead.rating ? lead.rating.toFixed(1) : '0.0'}</span>
                                    <span className="text-[#86868b]">({lead.reviews_count || 0} reviews)</span>
                                  </div>
 
                                  {/* Location / Details */}
                                  <div className="text-[12px] text-[#86868b] mt-3 space-y-1">
                                    <div className="flex items-center space-x-1.5">
                                      <MapPin className="w-3.5 h-3.5 text-[#a1a1a6] shrink-0" />
                                      <span className="truncate">{lead.address}</span>
                                    </div>
                                    {lead.phone && (
                                      <div className="flex items-center space-x-1.5">
                                        <Phone className="w-3.5 h-3.5 text-[#a1a1a6] shrink-0" />
                                        <span>{lead.phone}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
 
                                {/* Bottom Metric / Actions Row */}
                                <div className="mt-3 pt-3 border-t border-[#e8e8ed]">
                                  {noWebsite && (
                                    <div>
                                      <div className="flex justify-between text-xs text-[#86868b] mb-1 font-medium">
                                        <span>SEO Score</span>
                                        <span className="font-semibold text-[#1d1d1f]">{lead.lead_score || 12}/100</span>
                                      </div>
                                      <div className="w-full bg-[#e8e8ed] h-1.5 rounded-full overflow-hidden">
                                        <div 
                                          className={`${barColorClass} h-full rounded-full transition-all duration-500`} 
                                          style={{ width: `${lead.lead_score || 12}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}
 
                                  {outdated && (
                                    <div>
                                      <div className="flex justify-between text-xs text-[#86868b] mb-1 font-medium">
                                        <span>Mobile Friendliness</span>
                                        <span className="font-semibold text-[#ff9500]">
                                          {lead.lead_score < 40 ? 'Poor' : lead.lead_score < 75 ? 'Fair' : 'Good'}
                                        </span>
                                      </div>
                                      <div className="w-full bg-[#e8e8ed] h-1.5 rounded-full overflow-hidden">
                                        <div 
                                          className={`${barColorClass} h-full rounded-full transition-all duration-500`} 
                                          style={{ width: `${lead.lead_score || 35}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}
 
                                  {leadFound && (
                                    <div className="flex items-center justify-between gap-3">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openAuditModal(lead);
                                        }}
                                        className="flex-grow py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-xs font-medium transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm shadow-[#0071e3]/10"
                                      >
                                        <span>View Decision Maker</span>
                                      </button>
                                      
                                      <a
                                        href={lead.maps_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] rounded-full transition-all border-0"
                                        title="Google Maps"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
 
                      {/* View Table Layout */}
                      {layoutView === 'table' && (
                        <div className="bg-white border border-[#e8e8ed] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-fadeIn">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm text-[#1d1d1f]">
                              <thead className="bg-[#f5f5f7] text-[11px] font-semibold uppercase tracking-wider text-[#86868b] border-b border-[#e8e8ed]">
                                <tr>
                                  <th className="px-6 py-3.5">Business Name</th>
                                  <th className="px-6 py-3.5">Category</th>
                                  <th className="px-6 py-3.5 text-center">Score</th>
                                  <th className="px-6 py-3.5">Opportunity</th>
                                  <th className="px-6 py-3.5">Phone</th>
                                  <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#e8e8ed] bg-white">
                                {savedLeads.map((lead, idx) => {
                                  const isHigh = lead.lead_score >= 75
                                  const isMedium = lead.lead_score >= 40 && lead.lead_score < 75
                                  const scoreColor = isHigh ? 'text-[#30d158]' : isMedium ? 'text-[#ff9500]' : 'text-[#86868b]'
                                  
                                  return (
                                    <tr 
                                      key={lead.id} 
                                      className="hover:bg-[#fbfbfd] transition-all text-[#1d1d1f] font-normal"
                                    >
                                      <td className="px-6 py-4">
                                        <div className="font-semibold text-[#1d1d1f] text-[14px]">{lead.name}</div>
                                        <div className="flex flex-wrap gap-1 mt-1 mb-1">
                                          {getPresenceBadges(lead).map((badge, bIdx) => (
                                            <span key={bIdx} className={`text-[7px] font-medium px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${badge.color}`}>
                                              {badge.text}
                                            </span>
                                          ))}
                                        </div>
                                        <div className="text-[11px] text-[#86868b] mt-1 flex items-center">
                                          <MapPin className="w-3 h-3 text-[#a1a1a6] mr-1 shrink-0" />
                                          <span className="truncate max-w-[200px]">{lead.address}</span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-xs font-medium text-[#86868b]">
                                        {lead.category || 'General'}
                                      </td>
                                      <td className={`px-6 py-4 text-center font-semibold font-mono text-sm ${scoreColor}`}>
                                        {lead.lead_score}
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className={`text-[9px] font-medium px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                                          lead.opportunity_level === 'High' 
                                            ? 'bg-[#34c759]/10 text-[#30d158] border-transparent' 
                                            : lead.opportunity_level === 'Medium' 
                                            ? 'bg-[#ff9500]/10 text-[#ff9500] border-transparent' 
                                            : 'bg-[#f5f5f7] text-[#86868b] border-[#e8e8ed]'
                                        }`}>
                                          {lead.opportunity_level}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-xs font-mono text-[#86868b]">
                                        {lead.phone || '—'}
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-1.5">
                                          <button
                                            onClick={() => openAuditModal(lead)}
                                            className="p-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] rounded-full border-0 transition-colors cursor-pointer"
                                            title="AI Audit Details"
                                          >
                                            <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                                          </button>
                                          {lead.phone && (
                                            <button 
                                              onClick={() => copyToClipboard(lead.phone, `table_${idx}`)}
                                              className="p-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] rounded-full border-0 transition-colors cursor-pointer"
                                              title="Copy Phone"
                                            >
                                              {copiedId === `table_${idx}` ? <Check className="w-3.5 h-3.5 text-[#30d158]" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                          )}
                                          {lead.maps_link && (
                                            <a 
                                              href={lead.maps_link}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="p-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] rounded-full transition-colors border-0 flex items-center justify-center"
                                              title="View Map"
                                            >
                                              <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                          )}
                                          <button
                                            onClick={() => handleRemoveLead(lead.id, lead.name)}
                                            className="p-2 bg-[#ff3b30]/10 hover:bg-[#ff3b30]/20 text-[#ff3b30] rounded-full border-0 transition-colors cursor-pointer"
                                            title="Delete Lead"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
  
                      {/* Saved Pagination Controller */}
                      {totalSavedPages > 1 && (
                        <div className="flex items-center justify-between border-t border-[#e8e8ed] pt-6 mt-8">
                          <button
                            onClick={() => setSavedPage(p => Math.max(1, p - 1))}
                            disabled={savedPage === 1}
                            className="px-4 py-2 bg-white hover:bg-[#f5f5f7] disabled:opacity-50 disabled:cursor-not-allowed border border-[#e8e8ed] text-[#1d1d1f] text-xs font-medium rounded-full transition-all flex items-center space-x-1.5 cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                          </button>
                          
                          <span className="text-xs font-medium text-[#86868b]">
                            Page {savedPage} of {totalSavedPages}
                          </span>
  
                          <button
                            onClick={() => setSavedPage(p => Math.min(totalSavedPages, p + 1))}
                            disabled={savedPage === totalSavedPages}
                            className="px-4 py-2 bg-white hover:bg-[#f5f5f7] disabled:opacity-50 disabled:cursor-not-allowed border border-[#e8e8ed] text-[#1d1d1f] text-xs font-medium rounded-full transition-all flex items-center space-x-1.5 cursor-pointer"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-white border border-[#e8e8ed] rounded-2xl p-16 text-center max-w-xl mx-auto shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      <Bookmark className="w-12 h-12 text-[#a1a1a6] mx-auto mb-4" />
                      <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">No leads in pipeline</h3>
                      <p className="text-[13px] text-[#86868b] mb-6 max-w-sm mx-auto">
                        Go scan local businesses and save opportunities with high AI opportunity scores.
                      </p>
                      <button
                        onClick={() => setCurrentView('find_leads')}
                        className="px-5 py-2.5 bg-[#1d1d1f] hover:bg-[#2d2d2f] text-white font-medium rounded-full text-xs transition-all shadow-sm cursor-pointer"
                      >
                        Discover Leads
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Floating Notifications (Toasts Component) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full select-none pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-5 py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.06)] border transition-all duration-300 animate-slideIn flex items-center space-x-2.5 backdrop-blur-md ${
              t.type === 'success'
                ? 'bg-white/95 border-[#e8e8ed] text-[#1d1d1f]'
                : t.type === 'error'
                ? 'bg-[#ff3b30]/10 border-[#ff3b30]/20 text-[#ff3b30]'
                : 'bg-white/95 border-[#e8e8ed] text-[#1d1d1f]'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#30d158] shrink-0" />}
            {t.type === 'error' && <AlertTriangle className="w-4 h-4 text-[#ff3b30] shrink-0" />}
            {t.type === 'info' && <Globe className="w-4 h-4 text-[#0071e3] shrink-0" />}
            <span className="text-xs font-medium leading-none">{t.message}</span>
          </div>
        ))}
      </div>

      {/* SCORE AUDIT DETAILS OVERLAY MODAL */}
      {showAuditModal && activeAuditLead && (
        <div className="fixed inset-0 bg-[#1d1d1f]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8e8ed] max-w-lg w-full rounded-3xl p-8 shadow-2xl relative animate-slideIn text-[#1d1d1f]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6 border-b border-[#e8e8ed] pb-4">
              <div>
                <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">AI Audit Sheet</span>
                <h3 className="text-lg font-semibold text-[#1d1d1f] mt-1">{activeAuditLead.name}</h3>
              </div>
              <button 
                onClick={() => setShowAuditModal(false)}
                className="text-xs font-medium bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] hover:text-[#1d1d1f] px-3.5 py-1.5 rounded-full transition-all border-0 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
 
            {/* Score Analytics Header */}
            <div className="flex items-center justify-between bg-[#f5f5f7] border-0 p-5 rounded-2xl mb-6">
              <div>
                <span className="text-xs text-[#86868b] font-medium">Digital Presence Score</span>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className={`text-3xl font-bold font-mono ${
                    activeAuditLead.lead_score >= 75 ? 'text-[#30d158]' : activeAuditLead.lead_score >= 40 ? 'text-[#ff9500]' : 'text-[#ff3b30]'
                  }`}>{activeAuditLead.lead_score}</span>
                  <span className="text-xs text-[#a1a1a6] font-mono">/ 100</span>
                </div>
              </div>
 
              <div className="text-right">
                <span className="text-xs text-[#86868b] font-medium">Opportunity Priority</span>
                <div className="mt-1">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border-0 uppercase tracking-wider ${
                    activeAuditLead.opportunity_level === 'High' 
                      ? 'bg-[#34c759]/10 text-[#30d158]' 
                      : activeAuditLead.opportunity_level === 'Medium' 
                      ? 'bg-[#ff9500]/10 text-[#ff9500]' 
                      : 'bg-[#f5f5f7] text-[#86868b]'
                  }`}>{activeAuditLead.opportunity_level}</span>
                </div>
              </div>
            </div>
 
            {/* Scraper / Connection Details */}
            <div className="bg-[#f5f5f7] border-0 p-5 rounded-2xl mb-6 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#86868b] font-medium">Crawl Status:</span>
                <span className="font-semibold flex items-center space-x-1">
                  {getPresenceBadges(activeAuditLead).map((badge, bIdx) => (
                    <span key={bIdx} className={`text-[9px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-wider ${badge.color}`}>
                      {badge.text}
                    </span>
                  ))}
                </span>
              </div>
              {activeAuditLead.presence_details && (
                <div className="text-xs text-[#86868b] mt-2 leading-relaxed flex items-start space-x-2 bg-white/80 p-3 rounded-xl border border-[#e8e8ed]">
                  <span className="text-[#0071e3] font-semibold">ℹ</span>
                  <span>{activeAuditLead.presence_details}</span>
                </div>
              )}
              {activeAuditLead.socials && activeAuditLead.socials.length > 0 && (
                <div className="pt-3 border-t border-[#e8e8ed] flex items-center justify-between text-xs">
                  <span className="text-[#86868b] font-medium">Found Networks:</span>
                  <div>
                    {renderSocialIcons(activeAuditLead.socials)}
                  </div>
                </div>
              )}
            </div>
 
            {/* Detailed Insights list */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] block mb-2">Audit Findings</span>
              {activeAuditLead.ai_insights && activeAuditLead.ai_insights.length > 0 ? (
                <div className="space-y-2">
                  {activeAuditLead.ai_insights.map((insight, index) => {
                    const isNeg = insight.toLowerCase().includes('no ') || insight.toLowerCase().includes('low') || insight.toLowerCase().includes('missing') || insight.toLowerCase().includes('poor')
                    return (
                      <div key={index} className="flex items-start space-x-3 text-xs bg-[#f5f5f7] border-0 p-3 rounded-xl text-[#1d1d1f]">
                        {isNeg ? (
                          <span className="text-[#ff9500] shrink-0 text-xs mt-0.5">⚠️</span>
                        ) : (
                          <span className="text-[#30d158] shrink-0 text-xs mt-0.5">✓</span>
                        )}
                        <span className="leading-relaxed font-normal">{insight}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#86868b] italic">No detailed insights compiled.</p>
              )}
            </div>
 
            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-[#e8e8ed] grid grid-cols-2 gap-3">
              <a 
                href={activeAuditLead.maps_link}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] border-0 text-[#1d1d1f] text-xs font-medium rounded-full text-center flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Google Maps Listing</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
 
              {activeAuditLead.phone && (
                <button 
                  onClick={() => {
                    copyToClipboard(activeAuditLead.phone, 'modal')
                  }}
                  className="py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium rounded-full flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm shadow-[#0071e3]/10 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Phone</span>
                </button>
              )}
            </div>
 
          </div>
        </div>
      )}

    </div>
  )
}

export default App
