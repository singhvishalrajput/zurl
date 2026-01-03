import { useState, useEffect } from "react";
import { createShortUrl, checkSlugAvailability } from "../api/shorturl.api";
import { useAuth } from "../utils/authContext";
import { useDebounce } from "../hooks/useDebounce";
import { Check, X, Loader2, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const UrlFormNew = ({ initialCustomSlug = false }) => {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [useCustomSlug, setUseCustomSlug] = useState(initialCustomSlug);
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Slug availability checking
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const debouncedSlug = useDebounce(slug, 500);

  useEffect(() => {
    setUseCustomSlug(initialCustomSlug);
  }, [initialCustomSlug]);

  useEffect(() => {
    if (useCustomSlug && debouncedSlug && debouncedSlug.length >= 3) {
      checkSlug(debouncedSlug);
    } else {
      setSlugAvailable(null);
    }
  }, [debouncedSlug, useCustomSlug]);

  const checkSlug = async (slugValue) => {
    setCheckingSlug(true);
    try {
      const result = await checkSlugAvailability(slugValue);
      setSlugAvailable(result.available);
    } catch (error) {
      console.error('Error checking slug:', error);
      setSlugAvailable(null);
    } finally {
      setCheckingSlug(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!url) return;
    if (useCustomSlug && (!slug || !slugAvailable)) return;

    setLoading(true);

    try {
      const finalSlug = useCustomSlug ? slug : null;
      const data = await createShortUrl(url, finalSlug);
      setShortUrl(data);
    } catch (error) {
      console.error('Error creating short URL:', error);
      alert(error.response?.data?.message || 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setUrl('');
    setSlug('');
    setUseCustomSlug(false);
    setShortUrl('');
    setCopied(false);
    setSlugAvailable(null);
  };

  const getSlugIndicator = () => {
    if (!slug || slug.length < 3) return null;
    if (checkingSlug) return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
    if (slugAvailable) return <Check className="w-4 h-4 text-green-600" />;
    if (slugAvailable === false) return <X className="w-4 h-4 text-red-600" />;
    return null;
  };

  const getSlugMessage = () => {
    if (!slug || slug.length < 3) return null;
    if (checkingSlug) return <span className="text-sm text-gray-500">Checking availability...</span>;
    if (slugAvailable) return <span className="text-sm text-green-600">✓ Available</span>;
    if (slugAvailable === false) return <span className="text-sm text-red-600">✗ Already taken</span>;
    return null;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-6">
        {/* URL Input */}
        <div>
          <label htmlFor="longUrl" className="block text-sm font-medium text-gray-900 mb-2">
            Enter URL
          </label>
          <input
            type="url"
            id="longUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/your-very-long-url-here"
            className="w-full px-4 py-3 border border-gray-300 
                     focus:outline-none focus:border-gray-900
                     text-gray-900 placeholder-gray-400 transition-colors"
          />
        </div>

        {/* Custom Slug Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="customSlug"
            checked={useCustomSlug}
            onChange={(e) => {
              setUseCustomSlug(e.target.checked);
              if (!e.target.checked) {
                setSlug('');
                setSlugAvailable(null);
              }
            }}
            disabled={!user}
            className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
          />
          <label htmlFor="customSlug" className="text-sm font-medium text-gray-900 flex items-center gap-2">
            Use custom slug
            {!user && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Lock className="w-3 h-3" />
                <Link to="/login" className="text-blue-600 hover:text-blue-800 underline">
                  Login required
                </Link>
              </span>
            )}
          </label>
        </div>

        {/* Custom Slug Input */}
        {useCustomSlug && user && (
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-900 mb-2">
              Custom Slug
            </label>
            <div className="relative">
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                placeholder="my-custom-slug"
                className="w-full px-4 py-3 pr-10 border border-gray-300 
                         focus:outline-none focus:border-gray-900
                         text-gray-900 placeholder-gray-400 transition-colors"
                minLength={3}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getSlugIndicator()}
              </div>
            </div>
            <div className="mt-1">
              {getSlugMessage()}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Min 3 characters. Only lowercase letters, numbers, hyphens, and underscores.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !url || (useCustomSlug && (!slug || !slugAvailable))}
          className="px-8 py-3 bg-gray-900 text-white font-medium
                   hover:bg-gray-800 transition-colors
                   disabled:bg-gray-400 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </div>

      {/* Result Section */}
      {shortUrl && (
        <div className="mt-12 pt-12 border-t border-gray-200">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-900">
                  Shortened URL
                </label>
                {copied && (
                  <span className="text-sm text-green-600 font-medium">
                    Copied to clipboard
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                <div className="flex-1 bg-gray-50 px-4 py-3 border border-gray-300">
                  <a 
                    href={shortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium break-all"
                  >
                    {shortUrl}
                  </a>
                </div>
                
                <button
                  onClick={handleCopy}
                  className="px-6 py-3 bg-gray-900 text-white font-medium
                           hover:bg-gray-800 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Original URL
              </label>
              <p className="text-sm text-gray-700 break-all px-4 py-3 bg-gray-50 border border-gray-200">
                {url}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-300 text-gray-900 font-medium
                         hover:bg-gray-50 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Visit Link
              </a>
              
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-900 text-white font-medium
                         hover:bg-gray-800 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Shorten Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlFormNew;
