import { getUserFromCookie } from "./cookie";

export function userRole() {
    const user = getUserFromCookie();
    let role = '';
    if (user?.Pro?.company) {
        role = 'company';
    } else if (user?.Pro?.freeTrail) {
        role = 'free trial';
    } else {
        role = 'basic'
    }
    return role;
}