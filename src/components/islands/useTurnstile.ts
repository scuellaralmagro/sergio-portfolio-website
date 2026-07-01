import { useCallback, useEffect, useRef } from 'react';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileApi {
  render(
    el: HTMLElement,
    opts: {
      sitekey: string;
      size?: 'invisible' | 'normal' | 'compact';
      callback?: (token: string) => void;
      'error-callback'?: () => void;
      'expired-callback'?: () => void;
    },
  ): string;
  execute(id: string): void;
  reset(id: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.turnstile) return resolve();
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Renders an invisible Turnstile widget into `containerRef` and returns
 * `getToken()`, which mints a fresh single-use token per call.
 */
export function useTurnstile(sitekey: string) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);
  const pending = useRef<{ resolve: (t: string) => void; reject: (e: unknown) => void } | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile || widgetId.current) return;
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey,
          size: 'invisible',
          callback: (token) => {
            pending.current?.resolve(token);
            pending.current = null;
          },
          'error-callback': () => {
            pending.current?.reject(new Error('Turnstile error'));
            pending.current = null;
          },
          'expired-callback': () => {
            pending.current = null;
          },
        });
      })
      .catch(() => {
        /* surfaced to the user when getToken rejects */
      });
    return () => {
      cancelled = true;
    };
  }, [sitekey]);

  const getToken = useCallback(() => {
    return new Promise<string>((resolve, reject) => {
      const t = window.turnstile;
      if (!t || !widgetId.current) {
        reject(new Error('Turnstile not ready'));
        return;
      }
      pending.current = { resolve, reject };
      t.reset(widgetId.current);
      t.execute(widgetId.current);
    });
  }, []);

  return { containerRef, getToken };
}
