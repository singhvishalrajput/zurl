import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import UrlFormNew from '../components/UrlFormNew';

const CreateUrlPage = () => {
  const location = useLocation();
  const [enableCustomSlug, setEnableCustomSlug] = useState(false);

  useEffect(() => {
    if (location.state?.enableCustomSlug) {
      setEnableCustomSlug(true);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {enableCustomSlug ? 'Create Custom Short URL' : 'Shorten Your URLs'}
          </h1>
          <p className="text-lg text-gray-600">
            {enableCustomSlug 
              ? 'Create a personalized short URL with your own custom slug.'
              : 'Create short, memorable links in seconds. Custom slugs available for registered users.'}
          </p>
        </div>
        <UrlFormNew initialCustomSlug={enableCustomSlug} />
      </main>
    </div>
  );
};

export default CreateUrlPage;
