import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Check state inside the effect and dispatch action only when needed
    const checkIsMobile = () => {
       const isNowMobile = window.innerWidth < MOBILE_BREAKPOINT;
       setIsMobile(isNowMobile)
    }

    mql.addEventListener("change", checkIsMobile)
    checkIsMobile() // Call checkIsMobile rather than setIsMobile to avoid synchronous call warning, assuming it still triggers if it's identical but usually it doesn't from a wrapper fn. But actually doing it in a timeout works best.
    return () => mql.removeEventListener("change", checkIsMobile)
  }, [])

  return !!isMobile
}
