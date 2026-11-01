import React, { useEffect } from 'react';
import { useDevAuth } from '../context/DevAuthContext';
import DevConsoleLogin from '../pages/DevConsoleLogin';
import { ShieldAlert } from 'lucide-react';

const DevRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useDevAuth();

  useEffect(() => {
    // Add robots noindex, nofollow tag dynamically
    let metaTag = document.querySelector('meta[name="robots"]');
    let addedDynamically = false;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      metaTag.content = 'noindex, nofollow';
      document.head.appendChild(metaTag);
      addedDynamically = true;
    } else {
      metaTag.dataset.originalContent = metaTag.content;
      metaTag.content = 'noindex, nofollow';
    }

    return () => {
      if (addedDynamically && metaTag?.parentNode) {
        metaTag.parentNode.removeChild(metaTag);
      } else if (metaTag?.dataset?.originalContent) {
        metaTag.content = metaTag.dataset.originalContent;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <div className="flex items-center space-x-2 text-sm text-slate-400 font-mono">
          <ShieldAlert className="w-4 h-4 text-indigo-400" />
          <span>Verifying Developer Security Credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <DevConsoleLogin />;
  }

  return children;
};

export default DevRoute;
