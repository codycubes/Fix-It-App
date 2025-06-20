import { useState, useEffect, useRef, useMemo } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { useAuth } from '../context/AuthContext';
import mockData from '../data/mockData.json'
import { Search, MapPin, Tag, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function MapViewPage() {
  const mapRef = useRef(null)
  const reportListRef = useRef(null)
  const reportItemRefs = useRef({})
  const navigate = useNavigate()
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [issues] = useState(mockData.issues)
  const [users] = useState(mockData.users)
  const [categories] = useState(mockData.categories)
  const [municipalities] = useState(mockData.municipalities)
  const { currentUser } = useAuth();

  // Filter issues based on selected filters using useMemo
  const filteredIssues = useMemo(() => {
    let reports = issues;
    const isMunicipalityStaff = currentUser.role === 'Municipality Admin' || currentUser.role === 'Manager';

    if (isMunicipalityStaff) {
      reports = issues.filter(issue => issue.municipality_id === currentUser.municipality_id);
    }
    return reports.filter(issue => {
      const statusMatch = selectedStatus === 'all' || 
        issue.status.toLowerCase().replace(/\s+/g, '_') === selectedStatus
      const categoryMatch = selectedCategory === 'all' || 
        issue.category_id.toString() === selectedCategory
      const searchMatch = searchQuery === '' || 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.location.toLowerCase().includes(searchQuery.toLowerCase())
      return statusMatch && categoryMatch && searchMatch
    })
  }, [issues, selectedStatus, selectedCategory, searchQuery, currentUser])

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
        })

        const { Map } = await loader.importLibrary('maps')
        const mapInstance = new Map(mapRef.current, {
          center: { lat: -26.1067, lng: 28.0568 },
          zoom: 10,
          mapId: 'DEMO_MAP_ID',
          disableDefaultUI: true,
          zoomControl: true,
        })
        setMap(mapInstance)
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    initMap()
  }, [])

  // Update markers when map or filters change
  useEffect(() => {
    if (!map) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))

    const updateMarkers = async () => {
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')
      
      const newMarkers = filteredIssues.map((issue) => {
        // Create custom marker element with status color
        const markerElement = document.createElement('div')
        markerElement.className = 'marker'
        markerElement.style.setProperty('--marker-color', issue.status_color || '#FF0000')

        const marker = new AdvancedMarkerElement({
          map: map,
          position: { lat: issue.latitude, lng: issue.longitude },
          content: markerElement,
          title: issue.title,
        })

        // Add click listener to marker
        marker.addListener('click', () => {
          setSelectedIssue(issue)
          map.panTo({ lat: issue.latitude, lng: issue.longitude })
        })

        return marker
      })

      setMarkers(newMarkers)
    }

    updateMarkers().catch(console.error)

    if (selectedIssue && reportItemRefs.current[selectedIssue.issue_id]) {
        reportItemRefs.current[selectedIssue.issue_id].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    }

  }, [map, filteredIssues, selectedIssue])

  const getStatusDisplay = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.category_id === categoryId)
    return category ? category.name : 'Unknown'
  }

  const getMunicipalityName = (municipalityId) => {
    const municipality = municipalities.find(mun => mun.municipality_id === municipalityId)
    return municipality ? municipality.name : 'Unknown'
  }

  const getAssignedUser = (userId) => {
    const user = users.find(u => u.user_id === userId)
    return user ? user.username : 'Unassigned'
  }

  // Get unique statuses from issues
  const getUniqueStatuses = () => {
    const statuses = [...new Set(issues.map(issue => issue.status))]
    return statuses.map(status => ({
      value: status.toLowerCase().replace(/\s+/g, '_'),
      label: getStatusDisplay(status)
    }))
  }

  const handleReportClick = (issue) => {
    setSelectedIssue(issue)
    if (map) {
      map.panTo({ lat: issue.latitude, lng: issue.longitude })
      map.setZoom(14)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50/50 p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Map View</h1>
        <p className="text-gray-600 mt-1">View reported issues on an interactive map.</p>
      </header>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Statuses</option>
          {getUniqueStatuses().map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200/80 p-2">
          <div ref={mapRef} className="h-[600px] w-full rounded-md">
            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
              Map view would be integrated here.
            </div>
          </div>
        </div>

        {/* Filtered Reports */}
        <div 
          ref={reportListRef}
          className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200/80 p-6 h-[650px] overflow-y-auto"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-1">Filtered Reports</h2>
          <p className="text-sm text-gray-500 mb-4">{filteredIssues.length} reports matching your filters</p>
          <div className="space-y-4">
            {filteredIssues.map(issue => (
              <div
                key={issue.issue_id}
                ref={el => reportItemRefs.current[issue.issue_id] = el}
                onClick={() => handleReportClick(issue)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedIssue?.issue_id === issue.issue_id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800 mb-2 flex-1 pr-2">{issue.title}</h3>
                  <span 
                    className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{ backgroundColor: `${issue.status_color}20`, color: issue.status_color }}
                  >
                    {issue.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-gray-400"/>
                    <span>{getCategoryName(issue.category_id)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400"/>
                    <span>{issue.location}</span>
                  </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/report/${issue.issue_id}`);
                    }}
                    className="w-full text-center py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center"
                >
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapViewPage 