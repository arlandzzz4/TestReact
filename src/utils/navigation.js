
//리다이렉트
export const handleLoginRedirect = (navigate, location, defaultPath = "/dashboard") => {
    const from = location.state?.from || { pathname: defaultPath, search: "" };
    let destination = from.pathname + (from.search || "");

    if (destination.includes("/login") || destination.includes("/signup") || destination.includes("/register")) {
        destination = defaultPath;
    }

    console.log("리다이렉트 실행 목적지:", destination);
    
    navigate(destination, { replace: true });
};