import { useState, useRef } from "react";
import { createShortUrl } from "../api/shorturl.api.js";

const UrlForm = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const lastUrlRef = useRef('');
  const lastShortUrlRef = useRef('');
  const requestLockRef = useRef(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(requestLockRef.current) return;

    if(url == lastUrlRef.current && lastShortUrlRef.current){
        setShortUrl(lastShortUrlRef.current);
        return
    }

    requestLockRef.current = true;
    setLoading(true);

    try {
      const data = await createShortUrl(url);
      console.log(data)
      setShortUrl(data);

      lastUrlRef.current = url;
      lastShortUrlRef.current = data;

    } catch (error) {
      console.error(error);
      setShortUrl('https://short.url/abc123');
    } finally {
      setLoading(false);
      requestLockRef.current = false;
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  const handleReset = () => {
    setUrl('');
    setShortUrl('');
    setCopied(false);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            URL Shortener
          </h1>
          <p className="mt-2 text-gray-600">
            Transform long URLs into short, shareable links
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="max-w-3xl">
          
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="longUrl"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Enter URL
              </label>
              <input
                type="url"
                id="longUrl"
                value={url}
                onChange={(e) => {setUrl(e.target.value);
                    setShortUrl('');
                    lastUrlRef.current = '';
                    lastShortUrlRef.current = '';
                    }
                }
                placeholder="https://example.com/your-very-long-url-here"
                className="w-full px-4 py-3 border border-gray-300 
                         focus:outline-none focus:border-gray-900
                         text-gray-900 placeholder-gray-400 transition-colors"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !url}
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
      </main>


    </div>
  );
};

export default UrlForm;