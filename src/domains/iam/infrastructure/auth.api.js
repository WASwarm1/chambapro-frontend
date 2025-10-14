export class AuthApi {
    constructor() {
        this.baseURL = 'http://localhost:3001';
    }

    async login(email, password, userType) {
        try {
            const response = await fetch(`${this.baseURL}/users?email=${email}&type=${userType}`);
            const users = await response.json();

            if (users.length === 0) {
                return {
                    success: false,
                    message: 'Usuario no encontrado'
                };
            }

            const user = users[0];

            if (user.password === password) {
                const { password: _, ...userWithoutPassword } = user;

                return {
                    success: true,
                    token: `jwt_token_${user.id}`,
                    user: userWithoutPassword
                };
            } else {
                return {
                    success: false,
                    message: 'Contraseña incorrecta'
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
            const checkResponse = await fetch(`${this.baseURL}/users?email=${userData.email}`);
            const existingUsers = await checkResponse.json();

            if (existingUsers.length > 0) {
                return {
                    success: false,
                    message: 'El usuario ya existe'
                };
            }

            const newUser = {
                id: Date.now(),
                type: userType,
                email: userData.email,
                password: userData.password,
                name: userData.name,
                lastname: userData.lastname || '',
                phone: userData.phone || '',
                avatar: `/avatars/default-${userType}.jpg`,
                createdAt: new Date().toISOString()
            };

            if (userType === 'technician') {
                newUser.speciality = userData.specialty || '';
                newUser.description = userData.description || '';
                newUser.experience = userData.experience || '';
                newUser.rating = 0;
                newUser.reviewsCount = 0;
                newUser.hourlyRate = 0;
                newUser.isAvailable = true;
            }

            const response = await fetch(`${this.baseURL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                return {
                    success: true,
                    message: 'Usuario registrado exitosamente'
                };
            } else {
                return {
                    success: false,
                    message: 'Error al registrar usuario'
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