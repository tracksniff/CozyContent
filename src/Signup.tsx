import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ArrowRight, Upload, X, Check, Loader2, Info, MapPin, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import logo from './assets/PNG/Cosy Content Ltd -05.png';

// Fix Leaflet icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const industries = [
  'Plumbing', 'Roofing', 'Electrical', 'Cleaning', 
  'Removals', 'Locksmiths', 'Construction', 'Landscaping',
  'Interior Design', 'Real Estate', 'Consulting', 'Other'
];

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]); // Default to London
  
  const [formData, setFormData] = useState({
    company_name: '',
    website_url: '',
    industry: '',
    services_list: '',
    city_location: '',
    testimonials: '',
    branding_colors: '',
    email: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages([...images, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    
    images.forEach((image) => {
      data.append('uploaded_images', image);
    });

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/applications/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.id) {
        navigate('/pricing', { 
          state: { 
            applicationId: response.data.id,
            email: formData.email 
          } 
        });
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setError('Failed to submit application. Please check all fields.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Map Components
  const MapEvents = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setMapCenter([lat, lng]);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data.display_name) {
             setFormData({ ...formData, city_location: data.display_name });
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
        }
      },
    });
    return null;
  };

  const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    map.setView(center, 13);
    return null;
  };

  const handleSearchLocation = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setFormData({ ...formData, city_location: display_name });
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface transition-colors duration-300 p-6">
      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-surface w-full max-w-4xl rounded-[2.5rem] border border-outline-variant shadow-2xl overflow-hidden flex flex-col h-[80vh]">
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="text-primary" /> Select Your Location
              </h3>
              <button onClick={() => setShowMap(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 bg-surface-container-low flex gap-3 border-b border-outline-variant">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input
                  type="text"
                  placeholder="Search city, town, or postcode..."
                  className="w-full pl-11 pr-5 py-3 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation()}
                />
              </div>
              <button 
                onClick={handleSearchLocation}
                disabled={isSearching}
                className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:brightness-110 transition-all flex items-center gap-2"
              >
                {isSearching ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
              </button>
            </div>

            <div className="flex-grow relative z-0">
              <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={mapCenter} />
                <MapEvents />
                <ChangeView center={mapCenter} />
              </MapContainer>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-surface/90 backdrop-blur px-6 py-3 rounded-full border border-outline-variant shadow-lg text-sm font-bold text-on-surface-variant">
                Click anywhere on the map to pick your spot
              </div>
            </div>

            <div className="p-6 bg-surface border-t border-outline-variant flex items-center justify-between">
              <div className="flex-grow mr-4 truncate">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Selected Location</p>
                <p className="font-bold text-on-surface truncate">{formData.city_location || 'No location selected'}</p>
              </div>
              <button 
                onClick={() => setShowMap(false)}
                className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-md"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}

      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="w-full max-w-2xl relative">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center border-4 border-surface shadow-md p-2">
            <img src={logo} alt="Cosy Content Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="p-8 md:p-12 pt-12 bg-surface-container-low rounded-[2.5rem] border border-outline-variant shadow-lg relative overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight">Your New Website</h2>
            <p className="mt-2 text-on-surface-variant font-medium text-sm">Tell us about your business</p>
            
            {/* Progress Bar */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'w-8 bg-primary' : 'w-4 bg-outline-variant'}`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="text-red-500 text-xs font-bold text-center bg-red-500/5 p-3 rounded-xl border border-red-500/20">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Company Name</label>
                    <input
                      name="company_name"
                      required
                      placeholder="e.g. Acme Plumbing"
                      className="w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                      value={formData.company_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Current Website (if any)</label>
                    <input
                      name="website_url"
                      placeholder="https://acmeplumbing.com"
                      className="w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                      value={formData.website_url}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Industry</label>
                  <select
                    name="industry"
                    required
                    className="w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium appearance-none"
                    value={formData.industry}
                    onChange={handleInputChange}
                  >
                    <option value="">Select an industry...</option>
                    {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Email Address (for account details)</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <p className="mt-2 text-[10px] text-on-surface-variant flex items-center gap-1 ml-1 font-medium">
                    <Info size={12} className="text-primary" /> This email will be used for your account and Stripe payment.
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-md flex items-center gap-2"
                  >
                    Next <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Services Provided</label>
                  <textarea
                    name="services_list"
                    required
                    rows={3}
                    placeholder="List the core services you provide..."
                    className="w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                    value={formData.services_list}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">City / Location</label>
                    <div className="relative group">
                      <input
                        name="city_location"
                        required
                        placeholder="Search or pick on map..."
                        className="w-full pl-5 pr-12 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium truncate"
                        value={formData.city_location}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowMap(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all group-hover:scale-105"
                        title="Open Map"
                      >
                        <MapPin size={20} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Branding Colors / Style</label>
                    <input
                      name="branding_colors"
                      required
                      placeholder="e.g. Blue and White, Professional"
                      className="w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                      value={formData.branding_colors}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Testimonials (Optional)</label>
                  <textarea
                    name="testimonials"
                    rows={3}
                    placeholder="What do your customers say?"
                    className="w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                    value={formData.testimonials}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-4 border border-outline-variant text-on-surface font-black rounded-2xl hover:bg-surface transition-all flex items-center gap-2"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-md flex items-center gap-2"
                  >
                    Next <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4 ml-1">Upload Images & Media</label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-outline-variant group">
                        <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                      <Upload size={24} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">Add Photo</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                  
                  <div className="bg-surface p-4 rounded-2xl border border-outline-variant flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-on-surface-variant leading-relaxed font-medium">
                      Final step! After you submit, you'll be taken to our secure checkout page to select your plan and launch your project.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-4 border border-outline-variant text-on-surface font-black rounded-2xl hover:bg-surface transition-all flex items-center gap-2"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                    ) : (
                      'Review Pricing'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-10 pt-8 border-t border-outline-variant text-center">
            <p className="text-on-surface-variant font-medium text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-black hover:underline ml-1">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
