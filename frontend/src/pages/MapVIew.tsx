import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons with proper setup
const createIcon = (color = '#3388ff') => L.divIcon({
  html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  className: 'custom-div-icon'
});

const userIcon = L.divIcon({
  html: '<div style="background-color: #ff4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>',
  iconSize: [20, 20],
  className: 'user-location-icon'
});

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchRadius, setSearchRadius] = useState(5000);
  const [manualLocation, setManualLocation] = useState('');

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Geocoding function for manual location input
  const geocodeLocation = async (locationString) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}&limit=1`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setUserLocation([lat, lon]);
        console.log(`Manual location found: ${lat}, ${lon}`);
      } else {
        throw new Error('Location not found');
      }
    } catch (err) {
      setError(`Could not find location "${locationString}". Please try a different search term.`);
    } finally {
      setLoading(false);
    }
  };

  // Get user location with better error handling
  useEffect(() => {
    const getLocation = () => {
      console.log("Attempting to get location...");

      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser. Please enter a location manually.");
        setLoading(false);
        return;
      }

      const tryLocation = (enableHighAccuracy = true, timeout = 15000) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            console.log(`Location found: ${latitude}, ${longitude} (±${accuracy}m)`);
            setUserLocation([latitude, longitude]);
            setError(null);
            setLoading(false);
          },
          (err) => {
            console.error("Location error:", err);
            
            if (enableHighAccuracy && err.code === err.TIMEOUT) {
              console.log("High accuracy timed out, trying with lower accuracy...");
              tryLocation(false, 30000);
              return;
            }

            let errorMessage = "";
            
            switch(err.code) {
              case err.PERMISSION_DENIED:
                errorMessage = "Location access denied. Please enter a location manually.";
                break;
              case err.POSITION_UNAVAILABLE:
                errorMessage = "Location information unavailable. Please enter a location manually.";
                break;
              case err.TIMEOUT:
                errorMessage = "Location request timed out. Please enter a location manually.";
                break;
              default:
                errorMessage = "Unknown location error. Please enter a location manually.";
            }

            setError(errorMessage);
            setLoading(false);
          },
          { 
            enableHighAccuracy,
            timeout,
            maximumAge: enableHighAccuracy ? 60000 : 300000
          }
        );
      };

      tryLocation();
    };

    getLocation();
  }, []);

  // Fetch nearby specialists with comprehensive search
  useEffect(() => {
    if (!userLocation) return;

    const fetchSpecialists = async () => {
      setLoading(true);
      try {
        const [lat, lon] = userLocation;

        // Much more comprehensive Overpass query
        const query = `
          [out:json][timeout:30];
          (
            node["healthcare"="psychotherapist"](around:${searchRadius},${lat},${lon});
            node["healthcare"="psychologist"](around:${searchRadius},${lat},${lon});
            node["healthcare"="psychiatrist"](around:${searchRadius},${lat},${lon});
            node["healthcare"="counsellor"](around:${searchRadius},${lat},${lon});
            node["healthcare"="mental_health"](around:${searchRadius},${lat},${lon});
            node["healthcare:speciality"~"psychology|psychiatry|psychotherapy|mental_health|counselling"](around:${searchRadius},${lat},${lon});
            node["amenity"="clinic"]["healthcare:speciality"~"psychology|psychiatry|mental_health"](around:${searchRadius},${lat},${lon});
            node["amenity"="doctors"]["healthcare:speciality"~"psychology|psychiatry|mental_health"](around:${searchRadius},${lat},${lon});
            node["office"="therapist"](around:${searchRadius},${lat},${lon});
            node["office"="psychologist"](around:${searchRadius},${lat},${lon});
            node["office"="counsellor"](around:${searchRadius},${lat},${lon});
            node["name"~"therapy|therapist|psychology|psychologist|psychiatry|psychiatrist|counseling|counselling|mental health"](around:${searchRadius},${lat},${lon});
            way["healthcare"="psychotherapist"](around:${searchRadius},${lat},${lon});
            way["healthcare"="psychologist"](around:${searchRadius},${lat},${lon});
            way["healthcare"="psychiatrist"](around:${searchRadius},${lat},${lon});
            way["healthcare"="counsellor"](around:${searchRadius},${lat},${lon});
            way["healthcare"="mental_health"](around:${searchRadius},${lat},${lon});
            way["healthcare:speciality"~"psychology|psychiatry|psychotherapy|mental_health"](around:${searchRadius},${lat},${lon});
            way["office"~"therapist|psychologist|counsellor"](around:${searchRadius},${lat},${lon});
          );
          out center;
        `;

        console.log("Searching for mental health specialists...");
        const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Raw OSM results: ${data.elements.length} elements found`);

        const specialists = data.elements.map((element) => {
          const elementLat = element.lat || element.center?.lat;
          const elementLon = element.lon || element.center?.lon;
          
          if (!elementLat || !elementLon) return null;

          const distance = calculateDistance(lat, lon, elementLat, elementLon);
          
          // Determine specialist type
          let type = element.tags?.healthcare || 
                    element.tags?.office || 
                    element.tags?.["healthcare:speciality"] || 
                    "mental_health";
                    
          // Clean up the type
          if (type.includes("psychology") || type.includes("psychologist")) {
            type = "psychologist";
          } else if (type.includes("psychiatry") || type.includes("psychiatrist")) {
            type = "psychiatrist";
          } else if (type.includes("psychotherapy") || type.includes("therapist")) {
            type = "psychotherapist";
          } else if (type.includes("counselling") || type.includes("counseling") || type.includes("counsellor")) {
            type = "counsellor";
          }
          
          return {
            id: element.id,
            lat: elementLat,
            lon: elementLon,
            name: element.tags?.name || 
                  element.tags?.operator || 
                  "Mental Health Specialist",
            type: type,
            phone: element.tags?.phone || element.tags?.["contact:phone"],
            website: element.tags?.website || element.tags?.["contact:website"],
            email: element.tags?.email || element.tags?.["contact:email"],
            address: [
              element.tags?.["addr:housenumber"],
              element.tags?.["addr:street"],
              element.tags?.["addr:city"],
              element.tags?.["addr:postcode"]
            ].filter(Boolean).join(", ") || "Address not available",
            distance: Math.round(distance * 100) / 100,
            opening_hours: element.tags?.opening_hours,
            description: element.tags?.description
          };
        }).filter(Boolean);

        // Remove duplicates based on location (within 50m)
        const uniqueSpecialists = specialists.reduce((acc, current) => {
          const duplicate = acc.find(item => {
            const distanceBetween = calculateDistance(item.lat, item.lon, current.lat, current.lon) * 1000;
            return distanceBetween < 50;
          });
          
          if (!duplicate) {
            acc.push(current);
          }
          return acc;
        }, []);

        // Sort by distance
        uniqueSpecialists.sort((a, b) => a.distance - b.distance);
        
        console.log(`Final unique specialists: ${uniqueSpecialists.length}`);
        setPlaces(uniqueSpecialists);
        
      } catch (err) {
        console.error("Error fetching specialists:", err);
        setError("Unable to load nearby specialists. This might be due to limited data in your area. Try expanding your search radius or searching a nearby city.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, [userLocation, searchRadius]);

  // Filter places based on selected type
  const filteredPlaces = places.filter(place => 
    selectedFilter === 'all' || place.type.toLowerCase().includes(selectedFilter.toLowerCase())
  );

  // Get marker color based on specialist type
  const getMarkerColor = (type) => {
    const colors = {
      psychotherapist: '#2196F3',
      psychologist: '#4CAF50',
      psychiatrist: '#FF9800',
      counsellor: '#9C27B0'
    };
    
    const normalizedType = type.toLowerCase();
    for (const [key, color] of Object.entries(colors)) {
      if (normalizedType.includes(key)) return color;
    }
    return '#607D8B';
  };

  if (loading && !userLocation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Getting your location...</h2>
          <p className="text-gray-600 mb-4">Please allow location access to find nearby mental health specialists</p>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Or search manually:</p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter your city or address..."
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && manualLocation.trim()) {
                    geocodeLocation(manualLocation.trim());
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => manualLocation.trim() && geocodeLocation(manualLocation.trim())}
                disabled={!manualLocation.trim()}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Search This Location
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Location Issue</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            
            <div className="text-sm text-gray-500 my-2">or</div>
            
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter city, address, or postal code..."
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && manualLocation.trim()) {
                    geocodeLocation(manualLocation.trim());
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => manualLocation.trim() && geocodeLocation(manualLocation.trim())}
                disabled={!manualLocation.trim() || loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search Location'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header with controls */}
      <div className="bg-white shadow-sm p-4 z-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Mental Health Specialists Near You</h1>
          
          {/* Location Section */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">📍 Location:</span>
                {userLocation ? (
                  <span className="text-sm text-green-700 font-medium">
                    Using your current location
                  </span>
                ) : (
                  <span className="text-sm text-orange-600">
                    Location not set
                  </span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Enter city, address, or postal code..."
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && manualLocation.trim()) {
                      geocodeLocation(manualLocation.trim());
                    }
                  }}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => manualLocation.trim() && geocodeLocation(manualLocation.trim())}
                    disabled={!manualLocation.trim() || loading}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                  <button
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      setUserLocation(null);
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setUserLocation([position.coords.latitude, position.coords.longitude]);
                            setLoading(false);
                          },
                          (err) => {
                            setError("Unable to get current location. Please use manual search.");
                            setLoading(false);
                          },
                          { enableHighAccuracy: true, timeout: 10000 }
                        );
                      }
                    }}
                    disabled={loading}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    📍 Use GPS
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            {/* Filter dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="filter" className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                id="filter"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Specialists ({places.length})</option>
                <option value="psychotherapist">Psychotherapists</option>
                <option value="psychologist">Psychologists</option>
                <option value="psychiatrist">Psychiatrists</option>
                <option value="counsellor">Counsellors</option>
              </select>
            </div>

            {/* Search radius */}
            <div className="flex items-center gap-2">
              <label htmlFor="radius" className="text-sm font-medium text-gray-700">Radius:</label>
              <select
                id="radius"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2000}>2 km</option>
                <option value={5000}>5 km</option>
                <option value={10000}>10 km</option>
                <option value={20000}>20 km</option>
              </select>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-600">
              Showing {filteredPlaces.length} specialist{filteredPlaces.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative">
        {/* Results info banner */}
        {userLocation && !loading && (
          <div className="absolute top-4 right-4 z-20 bg-white rounded-lg shadow-lg p-3 max-w-xs">
            <div className="text-sm">
              <div className="font-semibold text-gray-800 mb-1">
                {filteredPlaces.length} specialists found
              </div>
              {filteredPlaces.length < 3 && (
                <div className="text-orange-600 text-xs">
                  <p className="mb-1">⚠️ Limited results in this area</p>
                  <p className="mb-2">Try:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Increase search radius</li>
                    <li>• Search nearby cities</li>
                    <li>• Check major medical centers</li>
                  </ul>
                </div>
              )}
              {filteredPlaces.length === 0 && (
                <div className="text-red-600 text-xs">
                  <p className="mb-1">❌ No specialists found</p>
                  <p>Consider searching:</p>
                  <ul className="text-xs space-y-1 mt-1">
                    <li>• Major cities nearby</li>
                    <li>• University towns</li>
                    <li>• Medical districts</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Searching for specialists...</p>
              <p className="text-xs text-gray-500 mt-1">This may take a moment</p>
            </div>
          </div>
        )}

        {userLocation && (
          <MapContainer
            center={userLocation}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Search radius circle */}
            <Circle
              center={userLocation}
              radius={searchRadius}
              pathOptions={{ 
                color: '#3388ff', 
                weight: 1, 
                opacity: 0.3, 
                fillOpacity: 0.1 
              }}
            />

            {/* User location marker */}
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1">📍 Your Location</div>
                  <p className="text-sm text-gray-600">
                    Found {places.length} specialist{places.length !== 1 ? 's' : ''} within {searchRadius/1000}km
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Specialist markers */}
            {filteredPlaces.map((place) => (
              <Marker 
                key={place.id} 
                position={[place.lat, place.lon]}
                icon={createIcon(getMarkerColor(place.type))}
              >
                <Popup maxWidth={300}>
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">{place.name}</h3>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-blue-600">Type:</span>
                        <span className="capitalize">{place.type}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-green-600">Distance:</span>
                        <span>{place.distance} km away</span>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-gray-600">Address:</span>
                        <span className="text-gray-700">{place.address}</span>
                      </div>
                      
                      {place.phone && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-purple-600">Phone:</span>
                          <a href={`tel:${place.phone}`} className="text-blue-600 hover:underline">
                            {place.phone}
                          </a>
                        </div>
                      )}
                      
                      {place.website && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-orange-600">Website:</span>
                          <a 
                            href={place.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}

                      {place.email && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-teal-600">Email:</span>
                          <a href={`mailto:${place.email}`} className="text-blue-600 hover:underline text-xs">
                            {place.email}
                          </a>
                        </div>
                      )}
                      
                      {place.opening_hours && (
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-indigo-600">Hours:</span>
                          <span className="text-xs">{place.opening_hours}</span>
                        </div>
                      )}

                      {place.description && (
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-gray-600">Info:</span>
                          <span className="text-xs text-gray-700">{place.description}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default MapView;