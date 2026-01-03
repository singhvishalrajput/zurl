import { useState, useEffect } from 'react';
import { useAuth } from '../utils/authContext';
import { getMyUrls } from '../api/shorturl.api';
import { ExternalLink, Copy, Check, Loader2, Plus, LinkIcon, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (user) {
      loadUrls();
    }
  }, [user]);

  const loadUrls = async (cursor = null) => {
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const data = await getMyUrls(cursor);
      
      if (cursor) {
        setUrls(prev => [...prev, ...data.urls]);
      } else {
        setUrls(data.urls);
      }
      
      setNextCursor(data.pagination.nextCursor);
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      console.error('Error loading URLs:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleCopy = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">
            Welcome back, <span className="font-semibold text-gray-900">{user?.username || user?.email}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-900">Total URLs</h3>
              <LinkIcon className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <div className="text-3xl font-bold">{urls.length}</div>
              <p className="text-xs text-gray-500 mt-1">Shortened links created</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-900">Total Clicks</h3>
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <div className="text-3xl font-bold">{totalClicks}</div>
              <p className="text-xs text-gray-500 mt-1">Across all links</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-900">Avg Clicks/Link</h3>
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <div className="text-3xl font-bold">{urls.length ? Math.round(totalClicks / urls.length) : 0}</div>
              <p className="text-xs text-gray-500 mt-1">Per shortened URL</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Your Short URLs</h2>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
            <Plus className="w-4 h-4" />
            Create New URL
          </Link>
        </div>

        {urls.length === 0 ? (
          <div className="bg-white border border-gray-200">
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-4">
                <LinkIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No URLs yet</h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                You haven't created any short URLs yet. Start by creating your first one!
              </p>
              <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                <Plus className="w-4 h-4" />
                Create Your First URL
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="w-[30%] px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Short URL</th>
                      <th className="w-[40%] px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Original URL</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Clicks</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {urls.map((url) => (
                      <tr key={url._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 font-medium">
                          <a
                            href={`http://localhost:3000/${url.shortUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 group"
                          >
                            <span className="truncate max-w-[200px]">
                              localhost:3000/{url.shortUrl}
                            </span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600 truncate block max-w-[300px]" title={url.fullUrl}>
                            {url.fullUrl}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800">
                            {url.clicks || 0}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-gray-600">
                          {url.createdAt ? formatDate(url.createdAt) : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => handleCopy(`http://localhost:3000/${url.shortUrl}`, url._id)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-transparent hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                          >
                            {copiedId === url._id ? (
                              <>
                                <Check className="w-4 h-4" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => loadUrls(nextCursor)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-medium border border-gray-300 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
