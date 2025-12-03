import { extractUserFromToken } from '../utils/jwt.util.js';

export class AuthApi {
    constructor() {
        this.baseURL = 'https://chambapro-platform-production.up.railway.app';
    }

    async login(email, password, userType) {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/authentication/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Email: email,
                    Password: password,
                    UserType: userType
                })
            });

            if (response.ok) {
                const data = await response.json();

                // Extract user information from JWT token
                const user = extractUserFromToken(data.token);

                if (!user) {
                    return {
                        success: false,
                        message: 'Failed to decode user information from token'
                    };
                }

                return {
                    success: true,
                    token: data.token,
                    user: user
                };
            } else {
                try {
                    const errorData = await response.json();
                    return {
                        success: false,
                        message: errorData.message || 'Login failed'
                    };
                } catch (err) {
                    return {
                        success: false,
                        message: 'Login failed: Server error'
                    };
                }
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error de conexión'
            };
        }
    }

    async register(userData, userType) {
        try {
            const requestData = {
                Name: userData.name,
                Lastname: userData.lastname || '',
                Email: userData.email,
                Password: userData.password,
                Phone: userData.phone || '',
                UserType: userType
            };

            // Add technician-specific fields if registering a technician
            if (userType === 'technician') {
                requestData.Speciality = userData.specialty || ''; // Backend expects Speciality with capital S
                requestData.Description = userData.description || '';
                requestData.Experience = userData.experience || '';
                requestData.HourlyRate = parseFloat(userData.hourlyRate) || 0;
            }

            const response = await fetch(`${this.baseURL}/api/v1/authentication/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                return {
                    success: true,
                    message: 'Usuario registrado exitosamente'
                };
            } else {
                try {
                    const errorData = await response.json();
                    return {
                        success: false,
                        message: errorData.message || 'Error al registrar usuario'
                    };
                } catch (err) {
                    return {
                        success: false,
                        message: 'Error al registrar usuario: Server error'
                    };
                }
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error de conexión'
            };
        }
    }
}
