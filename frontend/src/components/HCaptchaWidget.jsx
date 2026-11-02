import { useEffect, useRef } from 'react';

const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;

const HCaptchaWidget = ({ onToken, onError }) => {
  const containerRef = useRef(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  onTokenRef.current = onToken;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!siteKey || siteKey.startsWith('YOUR_') || !containerRef.current) return undefined;

    let widgetId;
    let cancelled = false;
    const renderCaptcha = () => {
      if (cancelled || !window.hcaptcha || !containerRef.current) return;
      widgetId = window.hcaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => onTokenRef.current(token),
        'error-callback': () => onErrorRef.current('CAPTCHA could not load. Please try again.'),
        'expired-callback': () => onErrorRef.current('CAPTCHA expired. Complete it again.'),
      });
    };

    const existingScript = document.querySelector('script[data-shopgenie-hcaptcha]');
    if (window.hcaptcha) {
      renderCaptcha();
    } else if (existingScript) {
      existingScript.addEventListener('load', renderCaptcha, { once: true });
    } else {
      const script = document.createElement('script');
      script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.shopgenieHcaptcha = 'true';
      script.addEventListener('load', renderCaptcha, { once: true });
      script.addEventListener('error', () => onErrorRef.current('CAPTCHA could not load. Please try again.'), { once: true });
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (widgetId !== undefined && window.hcaptcha) {
        window.hcaptcha.remove(widgetId);
      }
    };
  }, []);

  if (!siteKey || siteKey.startsWith('YOUR_')) {
    return <p role="alert">CAPTCHA is not configured for this website build.</p>;
  }

  return <div ref={containerRef} />;
};

export default HCaptchaWidget;
