interface Grecaptcha {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
}

// global.d.ts
declare global {
  interface Window {
    grecaptcha: Grecaptcha;
  }
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
export {};
