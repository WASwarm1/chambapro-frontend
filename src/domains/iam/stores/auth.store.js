import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AuthApi } from '../infrastructure/auth.api.js';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const token = ref(localStorage.getItem('auth_token'));
    const userType = ref(localStorage.getItem('user_type'));
    const loading = ref(false);
    const error = ref(null);

    const api = new AuthApi();

    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const isClient = computed(() => userType.value === 'client');
    const isTechnician = computed(() => userType.value === 'technician');
    const currentUser = computed(() => user.value);

    async function login(email, password, type) {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.login(email, password, type);

            if (response.success) {
                user.value = response.user;
                token.value = response.token;
                userType.value = type;

                localStorage.setItem('auth_token', response.token);
                localStorage.setItem('user_type', type);
                localStorage.setItem('user_data', JSON.stringify(response.user));

                return { success: true };
            } else {
                error.value = response.message;
                return { success: false, error: response.message };
            }
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    }

    async function register(userData, type) {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.register(userData, type);

            if (response.success) {
                return await login(userData.email, userData.password, type);
            } else {
                error.value = response.message;
                return { success: false, error: response.message };
            }
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    }

    function logout() {
        user.value = null;
        token.value = null;
        userType.value = null;

        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_data');
    }

    function initialize() {
        const storedToken = localStorage.getItem('auth_token');
        const storedType = localStorage.getItem('user_type');
        const storedUser = localStorage.getItem('user_data');

        if (storedToken && storedType && storedUser) {
            token.value = storedToken;
            userType.value = storedType;
            user.value = JSON.parse(storedUser);
        }
    }

    function updateUser(updatedUser) {
        user.value = { ...user.value, ...updatedUser };
        localStorage.setItem('user_data', JSON.stringify(user.value));
    }

    return {
        user,
        token,
        userType,
        loading,
        error,
        isAuthenticated,
        isClient,
        isTechnician,
        currentUser,
        login,
        register,
        logout,
        initialize,
        updateUser
    };
});