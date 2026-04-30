import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Check,
  Loader2,
  Info,
  MapPin,
  Search,
  Palette,
  Plus,
  FileText,
  Link2,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import logo from "./assets/PNG/Cosy Content Ltd -05.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const industries = [
  "Plumbing",
  "Roofing",
  "Electrical",
  "Cleaning",
  "Removals",
  "Locksmiths",
  "Construction",
  "Landscaping",
  "Interior Design",
  "Real Estate",
  "Consulting",
  "Other",
];

const colorRoles = [
  { key: "primary" as const, label: "Primary", hint: "Headings & main CTAs" },
  { key: "secondary" as const, label: "Secondary", hint: "Navbar & dark sections" },
  { key: "accent" as const, label: "Accent", hint: "Buttons & highlights" },
];

const isLight = (hex: string): boolean => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
};

const isValidHex = (h: string) => /^[0-9A-Fa-f]{6}$/.test(h);

const inputCls =
  "w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium";

const smInputCls =
  "flex-1 px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface text-sm font-medium";

interface FilePreview {
  name: string;
  url: string;
  isImage: boolean;
}

const TOTAL_STEPS = 4;

const Signup: React.FC = () => {
  const location = useLocation();
  const { planId, billing } = location.state || {};
  const hasPreSelectedPlan = !!planId;

  const [step, setStep] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [mapTarget, setMapTarget] = useState<"city_location" | "service_areas">("city_location");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]);

  // ── core form fields ────────────────────────────────────
  const [formData, setFormData] = useState({
    first_name: (localStorage.getItem("audit_name") || "").split(" ")[0],
    last_name: (localStorage.getItem("audit_name") || "").split(" ").slice(1).join(" "),
    company_name: localStorage.getItem("audit_business_name") || "",
    phone_number: "",
    email: localStorage.getItem("audit_email") || "",
    website_url: localStorage.getItem("audit_website_url") || "",
    industry: localStorage.getItem("audit_industry") || "",
    tagline: "",
    services_list: "",
    city_location: localStorage.getItem("audit_location") || "",
    years_experience: "",
    trust_badges: "",
    service_areas: "",
    testimonials: "",
  });

  // ── brand colours ────────────────────────────────────────
  const [brandColors, setBrandColors] = useState({
    primary: "#2563EB",
    secondary: "#1E3A5F",
    accent: "#10B981",
  });
  // raw hex text for the input boxes (without #)
  const [hexDraft, setHexDraft] = useState({
    primary: "2563EB",
    secondary: "1E3A5F",
    accent: "10B981",
  });

  // ── trust badge files & links ────────────────────────────
  const [certFiles, setCertFiles] = useState<File[]>([]);
  const [certPreviews, setCertPreviews] = useState<FilePreview[]>([]);
  const [certLinks, setCertLinks] = useState<string[]>([""]);

  // ── testimonial files & links ────────────────────────────
  const [testiFiles, setTestiFiles] = useState<File[]>([]);
  const [testiPreviews, setTestiPreviews] = useState<FilePreview[]>([]);
  const [testiLinks, setTestiLinks] = useState<string[]>([""]);

  // ── logo & general images ────────────────────────────────
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ── helpers ──────────────────────────────────────────────
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const makeFilePreviews = (files: File[]): FilePreview[] =>
    files.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      isImage: f.type.startsWith("image/"),
    }));

  // cert files
  const handleCertFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setCertFiles((prev) => [...prev, ...newFiles]);
    setCertPreviews((prev) => [...prev, ...makeFilePreviews(newFiles)]);
    e.target.value = "";
  };
  const removeCertFile = (i: number) => {
    setCertFiles((prev) => prev.filter((_, idx) => idx !== i));
    setCertPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };
  const updateCertLink = (i: number, v: string) =>
    setCertLinks((l) => l.map((x, idx) => (idx === i ? v : x)));
  const addCertLink = () => setCertLinks((l) => [...l, ""]);
  const removeCertLink = (i: number) =>
    setCertLinks((l) => (l.length === 1 ? [""] : l.filter((_, idx) => idx !== i)));

  // testimonial files
  const handleTestiFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setTestiFiles((prev) => [...prev, ...newFiles]);
    setTestiPreviews((prev) => [...prev, ...makeFilePreviews(newFiles)]);
    e.target.value = "";
  };
  const removeTestiFile = (i: number) => {
    setTestiFiles((prev) => prev.filter((_, idx) => idx !== i));
    setTestiPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };
  const updateTestiLink = (i: number, v: string) =>
    setTestiLinks((l) => l.map((x, idx) => (idx === i ? v : x)));
  const addTestiLink = () => setTestiLinks((l) => [...l, ""]);
  const removeTestiLink = (i: number) =>
    setTestiLinks((l) => (l.length === 1 ? [""] : l.filter((_, idx) => idx !== i)));

  // colour picker + hex input (synced bidirectionally)
  const handleColorSwatch = (key: keyof typeof brandColors, hex: string) => {
    setBrandColors((c) => ({ ...c, [key]: hex }));
    setHexDraft((d) => ({ ...d, [key]: hex.slice(1).toUpperCase() }));
  };
  const handleHexDraft = (key: keyof typeof brandColors, raw: string) => {
    const clean = raw
      .replace(/[^0-9A-Fa-f]/g, "")
      .toUpperCase()
      .slice(0, 6);
    setHexDraft((d) => ({ ...d, [key]: clean }));
    if (isValidHex(clean)) setBrandColors((c) => ({ ...c, [key]: `#${clean}` }));
  };

  // logo + general images
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setCompanyLogo(f);
      setLogoPreview(URL.createObjectURL(f));
    }
  };
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
  };
  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  // submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website_url && !formData.website_url.startsWith("https://")) {
      setError("Website URL must start with https://");
      return;
    }
    setIsLoading(true);
    setError("");
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    data.append("branding_colors", JSON.stringify(brandColors));

    // plan selection if pre-selected
    if (hasPreSelectedPlan) {
      data.append("plan_type", billing);
    }

    // certification evidence
    certFiles.forEach((f) => data.append("trust_badge_files", f));
    data.append("trust_badge_links", JSON.stringify(certLinks.filter((l) => l.trim())));
    // testimonial evidence
    testiFiles.forEach((f) => data.append("testimonial_files", f));
    data.append("testimonial_links", JSON.stringify(testiLinks.filter((l) => l.trim())));
    // media
    if (companyLogo) data.append("company_logo", companyLogo);
    images.forEach((img) => data.append("uploaded_images", img));

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/applications/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.id) {
        if (hasPreSelectedPlan) {
          // Direct to Stripe
          try {
            const stripeRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/create-checkout-session/`,
              {
                plan_type: billing,
                application_id: res.data.id,
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
              },
            );
            if (stripeRes.data.url) {
              window.location.href = stripeRes.data.url;
              return;
            }
          } catch (stripeErr) {
            console.error("Error creating direct checkout session:", stripeErr);
            // Fallback to pricing page if stripe fails
            navigate("/checkout", {
              state: {
                applicationId: res.data.id,
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
              },
            });
          }
        } else {
          navigate("/checkout", {
            state: {
              applicationId: res.data.id,
              email: formData.email,
              first_name: formData.first_name,
              last_name: formData.last_name,
            },
          });
        }
      }
    } catch {
      setError("Failed to submit. Please check all required fields and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── map helpers ──────────────────────────────────────────
  const MapEvents = () => {
    useMapEvents({
      click: async (ev: L.LeafletMouseEvent) => {
        const { lat, lng } = ev.latlng;
        setMapCenter([lat, lng]);
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          );
          const j = await r.json();
          if (j.display_name) {
            if (mapTarget === "city_location") {
              setFormData((p) => ({ ...p, city_location: j.display_name }));
            } else {
              const name =
                j.address?.city ||
                j.address?.town ||
                j.address?.village ||
                j.display_name.split(",")[0];
              setFormData((p) => ({
                ...p,
                service_areas: p.service_areas ? `${p.service_areas}, ${name}` : name,
              }));
            }
          }
        } catch {}
      },
    });
    return null;
  };
  const ChangeView = ({ center }: { center: L.LatLngExpression }) => {
    const map = useMap();
    map.setView(center, 13);
    return null;
  };
  const searchLocation = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      );
      const j = await r.json();
      if (j?.[0]) {
        const { lat, lon, display_name } = j[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        if (mapTarget === "city_location") {
          setFormData((p) => ({ ...p, city_location: display_name }));
        } else {
          const name = display_name.split(",")[0];
          setFormData((p) => ({
            ...p,
            service_areas: p.service_areas ? `${p.service_areas}, ${name}` : name,
          }));
        }
      }
    } catch {
    } finally {
      setIsSearching(false);
    }
  };

  // ── reusable nav buttons ─────────────────────────────────
  const NavButtons = ({
    canNext,
    onNext,
    isSubmit,
  }: {
    canNext?: boolean;
    onNext?: () => void;
    isSubmit?: boolean;
  }) => (
    <div className="flex justify-between pt-4">
      {step > 1 ? (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="px-6 py-4 border border-outline-variant text-on-surface font-black rounded-2xl hover:bg-surface transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back
        </button>
      ) : (
        <span />
      )}
      {isSubmit ? (
        <button
          type="submit"
          disabled={isLoading}
          className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Submitting…
            </>
          ) : (
            "Review Pricing"
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={canNext === false}
          className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <ArrowRight size={18} />
        </button>
      )}
    </div>
  );

  // ── file chip row (shared by certs + testimonials) ───────
  const FileChips = ({
    previews,
    onRemove,
  }: {
    previews: FilePreview[];
    onRemove: (i: number) => void;
  }) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {previews.map((p, i) => (
        <div
          key={i}
          className="group relative flex items-center gap-1.5 px-3 py-2 bg-surface border border-outline-variant rounded-xl shadow-sm"
        >
          {p.isImage ? (
            <img src={p.url} className="w-5 h-5 rounded object-cover" />
          ) : (
            <FileText size={14} className="text-primary shrink-0" />
          )}
          <span className="text-xs font-medium text-on-surface max-w-[120px] truncate">
            {p.name}
          </span>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="ml-1 text-on-surface-variant hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );

  // ── link list rows (shared by certs + testimonials) ──────
  const LinkRows = ({
    links,
    onUpdate,
    onAdd,
    onRemove,
    placeholder,
  }: {
    links: string[];
    onUpdate: (i: number, v: string) => void;
    onAdd: () => void;
    onRemove: (i: number) => void;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-2">
          <Link2 size={15} className="text-on-surface-variant shrink-0" />
          <input
            type="url"
            value={link}
            onChange={(e) => onUpdate(i, e.target.value)}
            placeholder={placeholder}
            className={smInputCls}
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="p-2 rounded-xl text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <X size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline mt-1"
      >
        <Plus size={13} /> Add another link
      </button>
    </div>
  );

  // ── evidence block (file upload + links) ─────────────────
  const EvidenceBlock = ({
    label,
    previews,
    links,
    onFiles,
    onRemoveFile,
    onUpdateLink,
    onAddLink,
    onRemoveLink,
    linkPlaceholder,
  }: {
    label: string;
    previews: FilePreview[];
    links: string[];
    onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (i: number) => void;
    onUpdateLink: (i: number, v: string) => void;
    onAddLink: () => void;
    onRemoveLink: (i: number) => void;
    linkPlaceholder: string;
  }) => (
    <div className="mt-3 rounded-2xl border border-outline-variant overflow-hidden">
      {/* upload row */}
      <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant flex items-center gap-3">
        <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant bg-surface hover:border-primary hover:bg-primary/5 transition-all cursor-pointer text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary">
          <Upload size={14} /> Upload files
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={onFiles}
          />
        </label>
        <span className="text-[10px] text-on-surface-variant font-medium">
          Images, PDFs or documents
        </span>
      </div>
      {previews.length > 0 && (
        <div className="px-4 py-3 border-b border-outline-variant bg-surface">
          <FileChips previews={previews} onRemove={onRemoveFile} />
        </div>
      )}
      {/* links row */}
      <div className="px-4 py-3 bg-surface">
        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
          {label}
        </p>
        <LinkRows
          links={links}
          onUpdate={onUpdateLink}
          onAdd={onAddLink}
          onRemove={onRemoveLink}
          placeholder={linkPlaceholder}
        />
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface transition-colors duration-300 p-6">
      {/* ── Map modal ──────────────────────────────────────── */}
      {showMap && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-surface w-full max-w-4xl rounded-[2.5rem] border border-outline-variant shadow-2xl overflow-hidden flex flex-col h-[80vh]">
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="text-primary" />
                {mapTarget === "city_location" ? "Select Your Main Location" : "Pick Service Areas"}
              </h3>
              <button
                onClick={() => setShowMap(false)}
                className="p-2 hover:bg-surface-container rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 bg-surface-container-low flex gap-3 border-b border-outline-variant">
              <div className="relative flex-grow">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={
                    mapTarget === "city_location"
                      ? "Search city, town, or postcode…"
                      : "Search areas to serve…"
                  }
                  className="w-full pl-11 pr-5 py-3 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchLocation()}
                />
              </div>
              <button
                onClick={searchLocation}
                disabled={isSearching}
                className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:brightness-110 transition-all flex items-center gap-2"
              >
                {isSearching ? <Loader2 size={18} className="animate-spin" /> : "Search"}
              </button>
            </div>
            <div className="flex-grow relative z-0">
              {/* @ts-ignore */}
              <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={mapCenter} />
                <MapEvents />
                <ChangeView center={mapCenter} />
              </MapContainer>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-surface/90 backdrop-blur px-6 py-3 rounded-full border border-outline-variant shadow-lg text-sm font-bold text-on-surface-variant text-center min-w-[300px]">
                {mapTarget === "city_location"
                  ? "Click to pick your spot"
                  : "Click to add an area to your list"}
              </div>
            </div>
            <div className="p-6 bg-surface border-t border-outline-variant flex items-center justify-between">
              <div className="flex-grow mr-4 truncate">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  {mapTarget === "city_location" ? "Selected Location" : "Areas List"}
                </p>
                <p className="font-bold text-on-surface truncate">
                  {mapTarget === "city_location"
                    ? formData.city_location || "No location selected"
                    : formData.service_areas || "No areas added yet"}
                </p>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-md"
              >
                Confirm
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
            <img src={logo} alt="Cosy Content" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="p-8 md:p-12 pt-12 bg-surface-container-low rounded-[2.5rem] border border-outline-variant shadow-lg">
          {/* Progress header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight">
              Your New Website
            </h2>
            <p className="mt-2 text-on-surface-variant font-medium text-sm">
              Tell us about your business
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? "w-8 bg-primary" : "w-4 bg-outline-variant"}`}
                />
              ))}
            </div>
            <p className="mt-2 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              Step {step} of {TOTAL_STEPS}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="text-red-500 text-xs font-bold text-center bg-red-500/5 p-3 rounded-xl border border-red-500/20">
                {error}
              </div>
            )}

            {/* ══ STEP 1 — Business Identity ══════════════════════════ */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                      First Name *
                    </label>
                    <input
                      name="first_name"
                      required
                      placeholder="John"
                      className={inputCls}
                      value={formData.first_name}
                      onChange={handleInput}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                      Last Name *
                    </label>
                    <input
                      name="last_name"
                      required
                      placeholder="Doe"
                      className={inputCls}
                      value={formData.last_name}
                      onChange={handleInput}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                      Company Name *
                    </label>
                    <input
                      name="company_name"
                      required
                      placeholder="e.g. Acme Plumbing"
                      className={inputCls}
                      value={formData.company_name}
                      onChange={handleInput}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                      Phone Number *
                    </label>
                    <input
                      name="phone_number"
                      type="tel"
                      required
                      placeholder="e.g. 0161 123 4567"
                      className={inputCls}
                      value={formData.phone_number}
                      onChange={handleInput}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                    Industry *
                  </label>
                  <select
                    name="industry"
                    required
                    className={`${inputCls} appearance-none`}
                    value={formData.industry}
                    onChange={handleInput}
                  >
                    <option value="">Select an industry…</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                    Tagline / USP <span className="normal-case font-normal">(Optional)</span>
                  </label>
                  <input
                    name="tagline"
                    placeholder="e.g. Manchester's most trusted emergency plumbers"
                    className={inputCls}
                    value={formData.tagline}
                    onChange={handleInput}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className={inputCls}
                      value={formData.email}
                      onChange={handleInput}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                      Current Website <span className="normal-case font-normal">(Optional)</span>
                    </label>
                    <input
                      name="website_url"
                      placeholder="https://example.com"
                      className={inputCls}
                      value={formData.website_url}
                      onChange={handleInput}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-on-surface-variant flex items-center gap-1 ml-1 font-medium -mt-2">
                  <Info size={12} className="text-primary shrink-0" /> Your email is used for
                  account setup and secure payment.
                </p>
                <NavButtons
                  canNext={
                    !!(
                      formData.first_name &&
                      formData.last_name &&
                      formData.company_name &&
                      formData.phone_number &&
                      formData.industry &&
                      formData.email
                    )
                  }
                  onNext={() => setStep(2)}
                />
              </div>
            )}

            {/* ══ STEP 2 — Services & Details ═════════════════════════ */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                    Services Provided *
                  </label>
                  <textarea
                    name="services_list"
                    required
                    rows={3}
                    placeholder="e.g. Emergency Callouts, Boiler Repairs, Drain Unblocking, Bathroom Fitting…"
                    className={inputCls}
                    value={formData.services_list}
                    onChange={handleInput}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                      City / Location *
                    </label>
                    <div className="relative">
                      <input
                        name="city_location"
                        required
                        placeholder="Search or pick on map…"
                        className={`${inputCls} pr-12 truncate`}
                        value={formData.city_location}
                        onChange={handleInput}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMapTarget("city_location");
                          setShowMap(true);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                      >
                        <MapPin size={20} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                      Years of Experience{" "}
                      <span className="normal-case font-normal">(Optional)</span>
                    </label>
                    <input
                      name="years_experience"
                      placeholder="e.g. 15+"
                      className={inputCls}
                      value={formData.years_experience}
                      onChange={handleInput}
                    />
                  </div>
                </div>

                {/* ── Certifications & Trust Badges ── */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                    Certifications &amp; Trust Badges{" "}
                    <span className="normal-case font-normal">(Optional)</span>
                  </label>
                  <input
                    name="trust_badges"
                    placeholder="e.g. Gas Safe Registered, NICEIC Approved, Fully Insured"
                    className={inputCls}
                    value={formData.trust_badges}
                    onChange={handleInput}
                  />
                  <EvidenceBlock
                    label="Or paste links to your accreditation / registration pages"
                    previews={certPreviews}
                    links={certLinks}
                    onFiles={handleCertFiles}
                    onRemoveFile={removeCertFile}
                    onUpdateLink={updateCertLink}
                    onAddLink={addCertLink}
                    onRemoveLink={removeCertLink}
                    linkPlaceholder="https://www.gassaferegister.co.uk/find-an-engineer/…"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                    Service Areas <span className="normal-case font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      name="service_areas"
                      placeholder="e.g. Manchester, Salford, Trafford, Oldham, Bury"
                      className={`${inputCls} pr-12`}
                      value={formData.service_areas}
                      onChange={handleInput}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMapTarget("service_areas");
                        setShowMap(true);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                    >
                      <MapPin size={20} />
                    </button>
                  </div>
                </div>

                {/* ── Customer Testimonials ── */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                    Customer Testimonials{" "}
                    <span className="normal-case font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="testimonials"
                    rows={3}
                    placeholder={'e.g. "Amazing service, very professional" – Sarah T., Manchester'}
                    className={inputCls}
                    value={formData.testimonials}
                    onChange={handleInput}
                  />
                  <EvidenceBlock
                    label="Or paste links to your reviews (Google, Trustpilot, Facebook…)"
                    previews={testiPreviews}
                    links={testiLinks}
                    onFiles={handleTestiFiles}
                    onRemoveFile={removeTestiFile}
                    onUpdateLink={updateTestiLink}
                    onAddLink={addTestiLink}
                    onRemoveLink={removeTestiLink}
                    linkPlaceholder="https://g.page/r/your-google-review-link"
                  />
                </div>

                <NavButtons
                  canNext={!!(formData.services_list && formData.city_location)}
                  onNext={() => setStep(3)}
                />
              </div>
            )}

            {/* ══ STEP 3 — Brand Colours ══════════════════════════════ */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1 ml-1">
                    Brand Colours
                  </p>
                  <p className="text-[11px] text-on-surface-variant font-medium mb-4 ml-1">
                    Click any swatch to open the colour picker, or type a hex code directly. The
                    preview updates live.
                  </p>

                  {/* Colour swatches + hex inputs */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {colorRoles.map(({ key, label, hint }) => {
                      const hexVal = hexDraft[key];
                      const hexValid = isValidHex(hexVal);
                      return (
                        <div key={key} className="flex flex-col gap-2">
                          {/* swatch (click → native picker) */}
                          <label className="cursor-pointer group" title={hint}>
                            <input
                              type="color"
                              className="sr-only"
                              value={brandColors[key]}
                              onChange={(e) => handleColorSwatch(key, e.target.value)}
                            />
                            <div
                              className="rounded-2xl p-4 flex flex-col gap-2 transition-all duration-200 group-hover:scale-[1.03] group-hover:shadow-xl"
                              style={{ backgroundColor: brandColors[key] }}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className="text-[9px] font-black uppercase tracking-widest"
                                  style={{
                                    color: isLight(brandColors[key])
                                      ? "rgba(0,0,0,0.65)"
                                      : "rgba(255,255,255,0.75)",
                                  }}
                                >
                                  {label}
                                </span>
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 bg-white/20 group-hover:bg-white/40 transition-all" />
                              </div>
                              <span
                                className="text-[8px] leading-tight"
                                style={{
                                  color: isLight(brandColors[key])
                                    ? "rgba(0,0,0,0.45)"
                                    : "rgba(255,255,255,0.5)",
                                }}
                              >
                                {hint}
                              </span>
                            </div>
                          </label>
                          {/* hex text input */}
                          <div
                            className={`flex items-center gap-1.5 px-3 py-2 bg-surface border rounded-xl transition-all ${hexValid ? "border-outline-variant focus-within:border-primary" : "border-red-400"}`}
                          >
                            <span className="text-xs font-black text-on-surface-variant font-mono">
                              #
                            </span>
                            <input
                              type="text"
                              maxLength={6}
                              value={hexVal}
                              onChange={(e) => handleHexDraft(key, e.target.value)}
                              className="flex-1 bg-transparent outline-none font-mono text-xs font-bold uppercase text-on-surface tracking-wider w-0 min-w-0"
                              placeholder="2563EB"
                            />
                            {hexValid && (
                              <div
                                className="w-4 h-4 rounded-full border border-outline-variant shrink-0"
                                style={{ backgroundColor: brandColors[key] }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Live mini-site preview */}
                  <div
                    className="rounded-2xl overflow-hidden border border-outline-variant shadow-md select-none"
                    aria-hidden="true"
                  >
                    {/* window chrome */}
                    <div className="px-3 py-2 bg-surface-container-low border-b border-outline-variant flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="h-4 w-40 rounded-full bg-outline-variant/40 flex items-center justify-center">
                          <span className="text-[7px] text-on-surface-variant font-medium">
                            your-website.com
                          </span>
                        </div>
                      </div>
                      <span className="text-[8px] text-on-surface-variant font-black uppercase tracking-widest opacity-50">
                        Live Preview
                      </span>
                    </div>
                    {/* navbar */}
                    <div
                      className="px-4 py-2.5 flex items-center justify-between"
                      style={{ backgroundColor: brandColors.secondary }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-white/30" />
                        <div className="flex flex-col gap-0.5">
                          <div className="h-1.5 w-16 rounded-full bg-white/70" />
                          <div className="h-1 w-10 rounded-full bg-white/40" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex gap-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-1.5 w-7 rounded-full bg-white/30" />
                          ))}
                        </div>
                        <div
                          className="h-6 w-16 rounded-full text-[8px] flex items-center justify-center font-black"
                          style={{
                            backgroundColor: brandColors.accent,
                            color: isLight(brandColors.accent) ? "#111" : "white",
                          }}
                        >
                          Call Now
                        </div>
                      </div>
                    </div>
                    {/* hero */}
                    <div
                      className="px-5 py-8 flex flex-col gap-2.5"
                      style={{
                        background: `linear-gradient(135deg, ${brandColors.primary}f2 0%, ${brandColors.secondary}e8 100%)`,
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-white/50" />
                        <div className="h-1.5 w-20 rounded-full bg-white/50" />
                      </div>
                      <div className="h-5 w-3/4 rounded-lg bg-white/90" />
                      <div className="h-2.5 w-full rounded-lg bg-white/50" />
                      <div className="h-2 w-5/6 rounded-lg bg-white/35" />
                      <div className="flex items-center gap-3 mt-2">
                        <div
                          className="h-8 w-28 rounded-xl text-[9px] flex items-center justify-center font-black shadow-md"
                          style={{
                            backgroundColor: brandColors.accent,
                            color: isLight(brandColors.accent) ? "#111" : "white",
                          }}
                        >
                          Get a Free Quote
                        </div>
                        <div className="h-8 w-20 rounded-xl border border-white/50 flex items-center justify-center text-[9px] font-bold text-white">
                          Learn More
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {[
                          { v: "500+", l: "Jobs Done" },
                          { v: "4.9★", l: "Rating" },
                          { v: "24/7", l: "Available" },
                        ].map((s) => (
                          <div
                            key={s.l}
                            className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl p-2 flex flex-col items-center gap-0.5"
                          >
                            <span className="text-[10px] font-black text-white">{s.v}</span>
                            <span className="text-[7px] text-white/60">{s.l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* services row */}
                    <div className="px-4 py-4 bg-white grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="rounded-xl p-2.5 flex flex-col gap-1.5 border border-gray-100 shadow-sm"
                        >
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${brandColors.primary}25` }}
                          >
                            <div
                              className="w-2.5 h-2.5 rounded"
                              style={{ backgroundColor: brandColors.primary }}
                            />
                          </div>
                          <div className="h-2 w-full rounded bg-gray-200" />
                          <div className="h-1.5 w-3/4 rounded bg-gray-100" />
                        </div>
                      ))}
                    </div>
                    {/* footer strip */}
                    <div
                      className="px-4 py-3 flex items-center justify-between"
                      style={{ backgroundColor: brandColors.secondary }}
                    >
                      <div className="h-1.5 w-20 rounded-full bg-white/30" />
                      <div className="h-1.5 w-16 rounded-full bg-white/20" />
                    </div>
                  </div>

                  <p className="mt-2.5 text-[10px] text-on-surface-variant font-medium ml-1 flex items-center gap-1">
                    <Palette size={11} className="text-primary shrink-0" />
                    Live preview — click any swatch or type a hex code above to update it
                  </p>
                </div>

                <NavButtons onNext={() => setStep(4)} />
              </div>
            )}

            {/* ══ STEP 4 — Media ══════════════════════════════════════ */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Logo */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3 ml-1">
                    Company Logo <span className="normal-case font-normal">(Optional)</span>
                  </label>
                  <div className="flex items-start gap-4">
                    {logoPreview ? (
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border border-outline-variant bg-surface">
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-full h-full object-contain p-2"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCompanyLogo(null);
                            setLogoPreview("");
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-20 h-20 flex-shrink-0 rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                        <Upload size={20} className="text-on-surface-variant" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                          Logo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </label>
                    )}
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed pt-1">
                      Upload your company logo — it&apos;ll appear in the navbar and footer. PNG or
                      SVG with a transparent background works best.
                    </p>
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3 ml-1">
                    Photos &amp; Media <span className="normal-case font-normal">(Optional)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-3">
                    {imagePreviews.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-2xl overflow-hidden border border-outline-variant group"
                      >
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                      <Upload
                        size={24}
                        className="text-on-surface-variant group-hover:text-primary transition-colors"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                        Add Photo
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImagesChange}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-medium">
                    Team photos, premises, work examples — these will appear throughout your site.
                  </p>
                </div>

                <div className="bg-surface p-4 rounded-2xl border border-outline-variant flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] text-on-surface-variant leading-relaxed font-medium">
                    Almost done! After submitting you&apos;ll be taken to our secure checkout to
                    choose your plan and launch your project.
                  </p>
                </div>

                <NavButtons isSubmit />
              </div>
            )}
          </form>

          <div className="mt-10 pt-8 border-t border-outline-variant text-center">
            <p className="text-on-surface-variant font-medium text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-black hover:underline ml-1">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
