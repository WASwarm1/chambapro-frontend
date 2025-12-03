/**
 * Decodes a JWT token and extracts the payload
 * @param {string} token - The JWT token to decode
 * @returns {object|null} The decoded payload or null if invalid
 */
export function decodeJWT(token) {
    if (!token) return null;

    try {
        // JWT structure: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        // Decode the payload (second part)
        const payload = parts[1];

        // Base64 decode - handle URL-safe base64
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

/**
 * Extracts user information from JWT token claims
 * @param {string} token - The JWT token
 * @returns {object|null} User object with standardized fields
 */
export function extractUserFromToken(token) {
    const payload = decodeJWT(token);
    if (!payload) return null;

    // Map JWT claims to user object
    return {
        id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub,
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email,
        name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.name,
        userType: payload.UserType || payload.userType,
        // Include any additional claims
        exp: payload.exp,
        iat: payload.iat
    };
}

/**
 * Checks if a JWT token is expired
 * @param {string} token - The JWT token
 * @returns {boolean} True if expired, false otherwise
 */
export function isTokenExpired(token) {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now();
}
