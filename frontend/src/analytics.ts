/**
 * 轻量埋点：设置 `VITE_GA_MEASUREMENT_ID`（形如 `G-xxxxxxxx`）后加载 gtag。
 * 未配置时不发起任何外联请求。
 */
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

let analyticsBooted = false
let scriptRequested = false

function loadGtagScript(onload: () => void): void {
  if (!GA_ID || scriptRequested || typeof document === 'undefined') return
  scriptRequested = true
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  s.onload = onload
  document.head.appendChild(s)
}

export function initAnalytics(): void {
  if (analyticsBooted) return
  if (!GA_ID || typeof window === 'undefined') return
  analyticsBooted = true
  const w = window as unknown as { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void }
  w.dataLayer = w.dataLayer || []
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer.push(args)
  }
  w.gtag('js', new Date())
  w.gtag('config', GA_ID, { send_page_view: false })
  loadGtagScript(() => {
    trackPageView(window.location.pathname + window.location.search)
  })
}

export function trackPageView(path: string): void {
  if (!GA_ID || typeof window === 'undefined') return
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (typeof w.gtag !== 'function') return
  w.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  })
}
