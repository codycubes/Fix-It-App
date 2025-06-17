import { useState, useEffect, useRef, useMemo } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import mockData from '../data/mockData.json'

function MapViewPage() {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [issues] = useState(mockData.issues)
  const [users] = useState(mockData.users)
  const [categories] = useState(mockData.categories)
  const [municipalities] = useState(mockData.municipalities)

  // Filter issues based on selected filters using useMemo
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const statusMatch = selectedStatus === 'all' || 
        issue.status.toLowerCase().replace(/\s+/g, '_') === selectedStatus
      const categoryMatch = selectedCategory === 'all' || 
        issue.category_id.toString() === selectedCategory
      return statusMatch && categoryMatch
    })
  }, [issues, selectedStatus, selectedCategory])

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
      })

      const { Map } = await loader.importLibrary('maps')
      setMap(new Map(mapRef.current, {
        center: { lat: -26.1067, lng: 28.0568 },
        zoom: 10,
        mapId: 'DEMO_MAP_ID',
      }))
    }

    initMap().catch(console.error)
  }, [])

  // Update markers when map or filters change
  useEffect(() => {
    if (!map) return

    // Clear existing markers
    markers.forEach(marker => marker.map = null)

    const updateMarkers = async () => {
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')
      
      const newMarkers = filteredIssues.map((issue) => {
        // Create custom marker element with status color
        const markerElement = document.createElement('div')
        markerElement.innerHTML = `
          <div style="
            width: 20px;
            height: 20px;
            background-color: ${issue.status_color};
            border: 2px solid white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `

        const marker = new AdvancedMarkerElement({
          map: map,
          position: { lat: issue.latitude, lng: issue.longitude },
          content: markerElement,
          title: issue.title,
        })

        // Add click listener to marker
        marker.addListener('click', () => {
          setSelectedIssue(issue)
        })

        return marker
      })

      setMarkers(newMarkers)
    }

    updateMarkers().catch(console.error)
  }, [map, filteredIssues])

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

  return (
    <div className="flex flex-row h-full w-full">
      <div className="flex-1 relative h-full">
        <div ref={mapRef} className="h-full w-full"></div>
      </div>
      
      <div className="w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto p-5 h-full">
        <h2 className="text-gray-800 mb-5 text-2xl font-semibold">Issues</h2>
        
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="all">All Statuses</option>
              {getUniqueStatuses().map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Results count and clear filters */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredIssues.length} of {issues.length} issues
            </div>
            {(selectedStatus !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSelectedStatus('all')
                  setSelectedCategory('all')
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        
        {selectedIssue && (
          <div className="mb-8 pb-5 border-b-2 border-gray-200">
            <h3 className="text-gray-700 mb-4 text-lg font-medium">Selected Issue</h3>
            <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-blue-500 shadow-blue-100">
              <h4 className="text-gray-800 text-base font-semibold mb-2">{selectedIssue.title}</h4>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Description:</strong> {selectedIssue.description}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Location:</strong> {selectedIssue.location}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Category:</strong> {getCategoryName(selectedIssue.category_id)}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Municipality:</strong> {getMunicipalityName(selectedIssue.municipality_id)}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Priority:</strong> {selectedIssue.priority}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Assigned to:</strong> {getAssignedUser(selectedIssue.assigned_to)}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Status:</strong>{' '}
                <span 
                  className="text-white px-2 py-1 rounded-xl text-xs font-medium capitalize inline-block ml-1"
                  style={{ backgroundColor: selectedIssue.status_color }}
                >
                  {getStatusDisplay(selectedIssue.status)}
                </span>
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Created:</strong> {new Date(selectedIssue.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto">
          <h3 className="text-gray-700 mb-4 text-lg font-medium">
            {selectedStatus !== 'all' || selectedCategory !== 'all' ? 'Filtered Issues' : 'All Issues'}
          </h3>
          {filteredIssues.map((issue) => (
            <div 
              key={issue.issue_id} 
              className={`bg-white rounded-lg p-4 mb-3 shadow-sm cursor-pointer transition-all duration-200 border-2 border-transparent hover:-translate-y-0.5 hover:shadow-md ${
                selectedIssue?.issue_id === issue.issue_id 
                  ? 'border-green-500 bg-green-50' 
                  : ''
              }`}
              onClick={() => setSelectedIssue(issue)}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-gray-800 text-base font-semibold m-0">{issue.title}</h4>
                <div 
                  className="w-3 h-3 rounded-full border border-white border-opacity-80"
                  style={{ backgroundColor: issue.status_color }}
                ></div>
              </div>
              <p className="text-gray-500 text-sm mb-2 leading-relaxed">{issue.location}</p>
              <p className="text-gray-500 text-xs mb-2">{getCategoryName(issue.category_id)} • {issue.priority} Priority</p>
              <div className="flex justify-between items-center">
                <span 
                  className="text-white px-2 py-1 rounded-xl text-xs font-medium capitalize inline-block"
                  style={{ backgroundColor: issue.status_color }}
                >
                  {getStatusDisplay(issue.status)}
                </span>
                <span className="text-gray-400 text-xs">
                  {new Date(issue.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MapViewPage 