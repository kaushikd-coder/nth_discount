const CLIENT_NAVIGATION_KEY = "uniblox-client-route-navigation";

export function markClientRouteNavigation() {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(CLIENT_NAVIGATION_KEY, "true");
}

export function shouldShowInitialSkeleton() {
    if (typeof window === "undefined") return true;

    const isClientNavigation = window.sessionStorage.getItem(CLIENT_NAVIGATION_KEY) === "true";
    if (isClientNavigation) {
        window.sessionStorage.removeItem(CLIENT_NAVIGATION_KEY);
        return false;
    }

    return true;
}
