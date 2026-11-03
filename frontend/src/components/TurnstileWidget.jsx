import { useEffect, useRef, useState } from 'react';
import { authAPI } from '../services/api';

const TurnstileWidget = ({ action, onToken, onError }) => {
  const containerRef = useRef(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  const [siteKey, setSiteKey] = useState('');
  const [loadError, setLoadError] = useState('');
  onTokenRef.current = onToken;
  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;
    authAPI.getCaptchaConfig()
      .then(({ data }) => {
        if (!data?.site_key) {
          throw new Error('CAPTCHA is not configured for this service.');
        }
        if (!cancelled) setSiteKey(data.site_key);
      })
      .catch(() => {
        if (cancelled) return;
        const message = 'CAPTCHA configuration could not be loaded.';
        setLoadError(message);
        onErrorRef.current(message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return undefined;

    let widgetId;
    let cancelled = false;
    const renderWidget = () => {
      if (cancelled || !window.turnstile || !containerRef.current) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        callback: (token) => onTokenRef.current(token),
        'error-callback': () => onErrorRef.current('CAPTCHA could not load. Please try again.'),
        'expired-callback': () => onErrorRef.current('CAPTCHA expired. Complete it again.'),
        'timeout-callback': () => onErrorRef.current('CAPTCHA timed out. Complete it again.'),
      });
    };

    const existingScript = document.querySelector('script[data-shopgenie-turnstile]');
    if (window.turnstile) {
      renderWidget();
    } else if (existingScript) {
      existingScript.addEventListener('load', renderWidget, { once: true });
    } else {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.shopgenieTurnstile = 'true';
      script.addEventListener('load', renderWidget, { once: true });
      script.addEventListener(
        'error',
        () => onErrorRef.current('CAPTCHA could not load. Please check your connection.'),
        { once: true }
      );
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (widgetId !== undefined && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [action, siteKey]);

  if (loadError) {
    return <p role="alert" className="text-sm text-red-600">{loadError}</p>;
  }
  if (!siteKey) {
    return <p role="status" className="text-sm text-text-muted">Loading verification…</p>;
  }
  return <div ref={containerRef} />;
};

export default TurnstileWidget;
