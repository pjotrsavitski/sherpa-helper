export default class ReCaptchaService {
  private key: string;
  private scriptId: string;

  constructor(key: string) {
    this.key = key;
    this.scriptId = "recaptcha-script";
  }

  load() {
    if (!document.getElementById(this.scriptId)) {
      const script = document.createElement("script");
      script.id = this.scriptId;
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.key}`;
      script.async = true;
      script.defer = true;

      document.head.appendChild(script);
    }
  }

  execute(action: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).grecaptcha.execute(this.key, {
      action: action
    });
  }
}

const meta = document.querySelector(
  'meta[name="recaptcha-key"]'
) as HTMLMetaElement;

// A singleton instance
export const recaptchaService = new ReCaptchaService(meta ? meta.content : "");
