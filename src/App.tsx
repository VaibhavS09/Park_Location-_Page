import React, { useState } from 'react';
import LocationSearchBox from './components/LocationSearchBox';
import type { GeocodingResult } from './utils/geocoding';

function App() {
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult | null>(null);

  const handleLocationSelect = (location: GeocodingResult) => {
    setSelectedLocation(location);
    // You can add additional logic here, like storing the selection in localStorage
    // or making API calls with the selected location
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LocationSearchBox onLocationSelect={handleLocationSelect} />
      
      {selectedLocation && (
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">Selected Location</h2>
            <div className="flex items-start gap-4">
              <img
                src={`${selectedLocation.imageUrl}?w=200&h=150&fit=crop`}
                alt={selectedLocation.placeName}
                className="w-48 h-36 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-medium">{selectedLocation.placeName}</h3>
                <p className="text-gray-600">{selectedLocation.area}</p>
                <p className="mt-2 text-gray-700">{selectedLocation.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Latitude: {selectedLocation.latitude.toFixed(4)}</p>
                  <p>Longitude: {selectedLocation.longitude.toFixed(4)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;