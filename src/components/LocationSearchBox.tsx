import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, Car, Building } from 'lucide-react';
import { searchLocation, getCurrentLocation, findNearestLocation, GeocodingResult } from '../utils/geocoding';
import ImageSlider from './ImageSlider';
import image1 from '../assest/download (1).jpeg.jpg'
import image2 from '../assest/download (2).jpeg.jpg'
import image3 from '../assest/download (3).jpeg.jpg'
import image4 from '../assest/download (4).jpeg.jpg'
import image5 from '../assest/download.jpeg.jpg'
import image6 from '../assest/images.jpeg.jpg'
interface LocationSearchBoxProps {
  onLocationSelect: (location: GeocodingResult) => void;
}

interface ParkingArea extends GeocodingResult {
  parking: {
    spots: number;
    hourlyRate: number;
    type: 'covered' | 'open' | 'multi-level';
  };
}

const popularAreas: ParkingArea[] = [
  {
    id: '1',
    placeName: 'Pacific Mall',
    area: 'Rajpur Road',
    latitude: 30.3398,
    longitude: 78.0644,
    imageUrl: `${image1}`,
    description: 'Popular shopping destination with ample parking',
    parking: {
      spots: 200,
      hourlyRate: 30,
      type: 'multi-level'
    }
  },
  {
    id: '2',
    placeName: 'Clock Tower',
    area: 'City Center',
    latitude: 30.3245,
    longitude: 78.0339,
    imageUrl: `${image5}`,
    description: 'Historic landmark with nearby parking facilities',
    parking: {
      spots: 50,
      hourlyRate: 20,
      type: 'open'
    }
  },
  {
    id: '3',
    placeName: 'Astley Hall',
    area: 'Rajpur',
    latitude: 30.3615,
    longitude: 78.0719,
    imageUrl: `${image3}`,
    description: 'Cultural center with dedicated parking',
    parking: {
      spots: 80,
      hourlyRate: 25,
      type: 'covered'
    }
  },
  {
    id: '4',
    placeName: 'Forest Research Institute',
    area: 'New Forest',
    latitude: 30.3426,
    longitude: 77.9969,
    imageUrl: `${image4}`,
    description: 'Historic institution with visitor parking',
    parking: {
      spots: 150,
      hourlyRate: 15,
      type: 'open'
    }
  },
  {
    id: '5',
    placeName: 'Paltan Bazaar',
    area: 'City Center',
    latitude: 30.3252,
    longitude: 78.0440,
    imageUrl: `${image2}`,
    description: 'Shopping district with multiple parking lots',
    parking: {
      spots: 120,
      hourlyRate: 35,
      type: 'multi-level'
    }
  },
  {
    id: '6',
    placeName: 'Robber\'s Cave',
    area: 'New Forest',
    latitude: 30.3752,
    longitude: 78.0643,
    imageUrl: `${image6}`, 
    description: 'Tourist attraction with parking facilities',
    parking: {
      spots: 60,
      hourlyRate: 20,
      type: 'open'
    }
  }
];

const featuredImages = [
  {
    url: 'C:\Users\embed\Downloads\New Location\project\src\assest\download (1).jpeg.jpg?w=800',
    title: 'Discover Dehradun'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqhfqB2361wcajC3-Md3x3OLwbnmhbjgDLSg&s?w=800',
    title: 'Local Markets'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlQHcwaEajw1tR92aoPhfON4JsL2-8VTSNuQ&s?w=800',
    title: 'Scenic Views'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO8p57LAyFGdk137zbq-P4dspy0BpOOyeTnw&s?w=800',
    title: 'Scenic Views'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXCXcAlv3u-aRL-HdOWGOtbLGm3f5P9xyL2A&s?w=800',
    title: 'Scenic Views'
  }
];

const LocationSearchBox: React.FC<LocationSearchBoxProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedParking, setSelectedParking] = useState<ParkingArea | null>(null);

  useEffect(() => {
    const loadInitialAreas = async () => {
      const locations = await searchLocation('');
      setResults(locations.slice(0, 3));
    };
    loadInitialAreas();
  }, []);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        const locations = await searchLocation(query);
        setResults(locations);
        setIsLoading(false);
      } else if (query.length === 0) {
        const locations = await searchLocation('');
        setResults(locations.slice(0, 3));
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  const handleLocationSelect = (location: GeocodingResult) => {
    onLocationSelect(location);
    setQuery(location.placeName);
    setResults([]);
  };

  const handleParkingSelect = (area: ParkingArea) => {
    setSelectedParking(area);
  };

  const handleCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const position = await getCurrentLocation();
      const nearest = findNearestLocation(position.coords.latitude, position.coords.longitude);
      handleLocationSelect(nearest);
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Could not detect your location. Please try again or select manually.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-red-600" />
        <h1 className="text-lg font-medium text-gray-800">Select Your Location</h1>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for your area in Dehradun"
              className="w-full h-10 pl-9 pr-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleCurrentLocation}
            className="h-10 flex items-center justify-center gap-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap text-sm font-medium"
          >
            <MapPin className="w-4 h-4" />
            <span>Detect location</span>
          </button>
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && query.length > 2 && (
        <div className="absolute z-50 left-4 right-4 sm:left-auto sm:right-auto sm:w-full max-w-2xl bg-white rounded-lg shadow-lg max-h-[calc(100vh-200px)] overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleLocationSelect(result)}
              className="w-full px-3 py-2 text-left hover:bg-red-50 flex items-center gap-2 border-b last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm text-gray-900">{result.placeName}</div>
                <div className="text-xs text-gray-500">{result.area}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Popular Areas */}
      {!query && (
        <div className="mb-6">
          <h2 className="text-base font-medium text-gray-800 mb-3">Popular Areas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => handleParkingSelect(area)}
                className="group relative overflow-hidden rounded-lg w-full aspect-[4/3]"
              >
                {/* Background P letter */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[120px] font-bold text-gray-100 opacity-50 group-hover:scale-150 transition-transform duration-500">
                    P
                  </span>
                </div>
                
                <img
                  src={area.imageUrl}
                  alt={area.placeName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-red-900/70 transition-colors" />
                
                {/* Quick parking info on hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                  <Car className="w-8 h-8 text-white mb-2" />
                  <p className="text-white text-lg font-bold">{area.parking.spots} spots</p>
                  <p className="text-white text-sm">₹{area.parking.hourlyRate}/hr</p>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-2 group-hover:opacity-0 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium text-center line-clamp-1">
                    {area.placeName}
                  </p>
                  <p className="text-gray-200 text-xs text-center line-clamp-1">
                    {area.area}
                  </p>
                </div>
                
                {/* Parking indicator */}
                <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1">
                  <Car className="w-4 h-4 text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Parking Information Modal */}
      {selectedParking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedParking.placeName}</h3>
                <p className="text-sm text-gray-600">{selectedParking.area}</p>
              </div>
              <button
                onClick={() => setSelectedParking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <span className="text-6xl font-bold text-red-600">P</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-red-600" />
                  <span className="text-sm">
                    {selectedParking.parking.spots} parking spots available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-red-600" />
                  <span className="text-sm capitalize">
                    {selectedParking.parking.type} parking
                  </span>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-red-900">
                    ₹{selectedParking.parking.hourlyRate}/hour
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  handleLocationSelect(selectedParking);
                  setSelectedParking(null);
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Select Location
              </button>
              <button
                onClick={() => setSelectedParking(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Image Slider */}
      {!query && (
        <div>
          <ImageSlider images={featuredImages} />
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center py-3">
          <p className="text-gray-600 text-sm">Searching areas...</p>
        </div>
      )}
    </div>
  );
};

export default LocationSearchBox;