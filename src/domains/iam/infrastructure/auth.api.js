export class AuthApi {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
    }

    async login(email, password, userType) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email && password) {
                    resolve({
                        success: true,
                        token: 'mock_jwt_token_' + Math.random().toString(36),
                        user: {
                            id: userType === 'client' ? 'client_1' : 'tech_1',
                            email: email,
                            name: userType === 'client' ? 'Cliente Ejemplo' : 'Técnico Ejemplo',
                            type: userType
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Credenciales inválidas'
                    });
                }
            }, 1000);
        });
    }

    async register(userData, userType) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (userData.email && userData.password) {
                    resolve({
                        success: true,
                        message: 'Usuario registrado exitosamente'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Datos de registro inválidos'
                    });
                }
            }, 1000);
        });
    }

    async logout() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 500);
        });
    }
}