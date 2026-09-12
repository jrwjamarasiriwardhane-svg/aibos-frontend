import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  MapPin,
  Check,
  X,
  Loader2,
  Crosshair,
  AlertCircle,
} from "lucide-react";

// Custom Leaflet pin icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface SelectedLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
}

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  onSelectLocation: (location: SelectedLocation) => void;
  onClose?: () => void;
  isModal?: boolean;
}

// Controller to smoothly pan map when center changes
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, Math.max(map.getZoom(), 15), {
      duration: 1.2,
    });
  }, [center, map]);
  return null;
}

// Click-to-move marker listener
function MapClickHandler({
  onLocationClick,
}: {
  onLocationClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLat = 6.9271, // Colombo default
  initialLng = 79.8612,
  initialAddress = "",
  onSelectLocation,
  onClose,
  isModal = true,
}) => {
  const [position, setPosition] = useState<[number, number]>([
    initialLat,
    initialLng,
  ]);
  const [address, setAddress] = useState<string>(initialAddress);
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [geocoding, setGeocoding] = useState<boolean>(false);
  const [detectingGps, setDetectingGps] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const searchTimeoutRef = useRef<any>(null);

  // Reverse geocode to get clean address when coordinates change
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      setGeocoding(true);
      setError("");

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      if (!res.ok) throw new Error("Could not resolve address");

      const data = await res.json();
      const addr = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      const detectedCity =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.suburb ||
        "";
      const detectedCountry = data.address?.country || "";

      setAddress(addr);
      setCity(detectedCity);
      setCountry(detectedCountry);
    } catch (err: any) {
      console.warn("Reverse geocoding error:", err);
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setGeocoding(false);
    }
  };

  // Run reverse geocoding on initial mount if no address given
  useEffect(() => {
    if (!initialAddress) {
      fetchAddress(position[0], position[1]);
    }
  }, []);

  // Handle Search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!val.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            val
          )}&limit=5&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        const data = await res.json();
        setSearchResults(data || []);
      } catch (err) {
        console.error("Geocoding search failed:", err);
      } finally {
        setSearching(false);
      }
    }, 450);
  };

  const handleSelectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setPosition([lat, lng]);
    setAddress(result.display_name);
    setCity(
      result.address?.city ||
        result.address?.town ||
        result.address?.village ||
        ""
    );
    setCountry(result.address?.country || "");
    setSearchResults([]);
    setSearchQuery("");
  };

  // GPS Current Location Detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingGps(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        fetchAddress(lat, lng);
        setDetectingGps(false);
      },
      (err) => {
        setError(`Unable to retrieve your location: ${err.message}`);
        setDetectingGps(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  // Drag pin handler
  const markerEventHandlers = useMemo(
    () => ({
      dragend(e: any) {
        const marker = e.target;
        if (marker) {
          const newPos = marker.getLatLng();
          setPosition([newPos.lat, newPos.lng]);
          fetchAddress(newPos.lat, newPos.lng);
        }
      },
    }),
    []
  );

  const handleConfirm = () => {
    onSelectLocation({
      lat: position[0],
      lng: position[1],
      address: address || `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`,
      city,
      country,
    });
    if (onClose) onClose();
  };

  const containerContent = (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MapPin size={18} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              Select Precise Location
            </h2>
            <p className="text-xs text-slate-500">
              Drag pin or search address for AI-powered nearby matching
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search & Action Bar */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search area, landmark, or street..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
            {searching && (
              <Loader2
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-600"
              />
            )}
          </div>

          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={detectingGps}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition disabled:opacity-50"
            title="Use My Current GPS Location"
          >
            {detectingGps ? (
              <Loader2 size={15} className="animate-spin text-blue-600" />
            ) : (
              <Crosshair size={15} className="text-blue-600" />
            )}
            <span className="hidden sm:inline">Detect GPS</span>
          </button>
        </div>

        {/* Search Autocomplete Suggestions */}
        {searchResults.length > 0 && (
          <div className="relative z-50">
            <div className="absolute left-0 right-0 top-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-100">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-start gap-2 transition"
                >
                  <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                  <span className="truncate">{item.display_name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative flex-1 min-h-[300px] w-full bg-slate-100">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRecenter center={position} />
          <MapClickHandler
            onLocationClick={(lat, lng) => {
              setPosition([lat, lng]);
              fetchAddress(lat, lng);
            }}
          />
          <Marker
            position={position}
            icon={customIcon}
            draggable={true}
            eventHandlers={markerEventHandlers}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-bold text-slate-800">Selected Location</p>
                <p className="text-slate-500 mt-0.5">{address || "Loading..."}</p>
                <p className="text-[10px] text-blue-600 mt-1 font-mono">
                  {position[0].toFixed(5)}, {position[1].toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Floating Hint */}
        <div className="absolute top-3 right-3 z-[1000] pointer-events-none bg-slate-900/80 backdrop-blur text-white text-[11px] px-2.5 py-1 rounded-full shadow font-medium">
          💡 Click or drag pin to adjust
        </div>
      </div>

      {/* Selected Location Summary & Confirm footer */}
      <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Selected Address
          </p>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate mt-0.5">
            {geocoding ? (
              <span className="flex items-center gap-1.5 text-blue-600">
                <Loader2 size={13} className="animate-spin" />
                Resolving address...
              </span>
            ) : (
              address || "No address selected"
            )}
          </p>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            Coordinates: {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition cursor-pointer"
          >
            <Check size={16} />
            <span>Confirm Location</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-3xl h-[85vh] max-h-[680px]">
          {containerContent}
        </div>
      </div>
    );
  }

  return <div className="w-full h-[450px]">{containerContent}</div>;
};

export default LocationPicker;
