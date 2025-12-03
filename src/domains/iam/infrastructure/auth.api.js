export class AuthApi {
    constructor() {
        this.baseURL = 'https://wa-swarm-2025-20-d3hac9guatdxfyby.brazilsouth-01.azurewebsites.net';
    }

    async login(email, password, userType) {
        try {
            const response = await fetch(`${this.baseURL}/api/v1/authentication/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    userType: userType
                })
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    token: data.token,
                    user: data.user
                };
            } else {
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Login failed'
                };
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
                name: userData.name,
                lastname: userData.lastname || '',
                email: userData.email,
                password: userData.password,
                phone: userData.phone || '',
                userType: userType
            };

            // Add technician-specific fields if registering a technician
            if (userType === 'technician') {
                requestData.specialty = userData.specialty || '';
                requestData.description = userData.description || '';
                requestData.experience = userData.experience || '';
                requestData.hourlyRate = userData.hourlyRate || 0;
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
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Error al registrar usuario'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error de conexión'
            };
        }
    }
}
