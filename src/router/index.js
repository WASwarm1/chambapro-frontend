import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../domains/iam/stores/auth.store.js'

const routes = [
    {
        path: '/',
        redirect: '/client/auth'
    },
    {
        path: '/client/auth',
        name: 'client-auth',
        component: () => import('../domains/iam/pages/client-auth-page.vue'),
        meta: { title: 'Client Login', requiresAuth: false }
    },
    {
        path: '/tech/auth',
        name: 'technician-auth',
        component: () => import('../domains/iam/pages/technician-auth-page.vue'),
        meta: { title: 'Technician Login', requiresAuth: false }
    },
    {
        path: '/tech/agenda',
        name: 'reservation-agenda',
        component: () => import('../domains/service/pages/reservation-agenda-page.vue'),
        meta: { title: 'Reservation Agenda', requiresAuth: true, userType: 'technician' }
    },
    {
        path: '/tech/reservation/:id',
        name: 'reservation-details',
        component: () => import('../domains/service/pages/reservation-details-page.vue'),
        props: true,
        meta: { title: 'Reservation Details', requiresAuth: true, userType: 'technician' }
    },
    {
        path: '/tech/statistics',
        name: 'technician-statistics',
        component: () => import('../domains/analytics/pages/statistics-page.vue'),
        meta: { title: 'Statistics', requiresAuth: true, userType: 'technician' }
    },
    {
        path: '/client/history',
        name: 'history-service',
        component: () => import('../domains/user/pages/history-services-page.vue'),
        meta: { title: 'Service History', requiresAuth: true, userType: 'client' }
    },
    {
        path: '/client/tech-search',
        name: 'technician-search',
        component: () => import('../domains/user/pages/technician-search-page.vue'),
        meta: { title: 'Find Technicians', requiresAuth: true, userType: 'client' }
    },
    {
        path: '/client/profile/:id',
        name: 'technician-profile',
        component: () => import('../domains/user/pages/technician-profile-page.vue'),
        props: true,
        meta: { title: 'Technician Profile', requiresAuth: true, userType: 'client' }
    },
    {
        path: '/client/hire/:id',
        name: 'hire-technician',
        component: () => import('../domains/service/pages/hire-technician-page.vue'),
        meta: { title: 'Hire Technician', requiresAuth: true, userType: 'client' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'page-not-found',
        component: () => import('../public/pages/page-not-found.component.vue'),
        meta: { title: 'Page Not Found' }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.BASE_URL),
    routes: routes,
})

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);

    let baseTitle = 'ChambaPro';
    document.title = to.meta.title ? `${baseTitle} | ${to.meta.title}` : baseTitle;
    if (to.meta.requiresAuth) {
        const authStore = useAuthStore();

        if (!authStore.isAuthenticated && localStorage.getItem('auth_token')) {
            authStore.initialize();
        }

        if (!authStore.isAuthenticated) {
            const loginRoute = to.meta.userType === 'technician' ? '/tech/auth' : '/client/auth';
            console.log('Not authenticated, redirecting to:', loginRoute);
            next(loginRoute);
            return;
        }

        if (to.meta.userType && authStore.userType !== to.meta.userType) {
            const defaultRoute = authStore.isClient ? '/client/tech-search' : '/tech/agenda';
            console.log('Wrong user type, redirecting to:', defaultRoute);
            next(defaultRoute);
            return;
        }
    }

    next();
});

export default router
