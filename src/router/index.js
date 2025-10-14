import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../domains/iam/stores/auth.store.js'

const AgendaDeReservasPage = () => import('../domains/work/pages/reservation-agenda-page.vue')
const HistoryServicePage = () => import('../domains/user/pages/history-services-page.vue')
const TechnicianSearch = () => import('../domains/user/pages/technician-search-page.vue')
const TechnicianProfilePage = () => import('../domains/user/pages/technician-profile-page.vue')
const PageNotFound = () => import('../public/pages/page-not-found.component.vue')

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
        name: 'AgendaDeReservas',
        component: AgendaDeReservasPage,
        meta: { title: 'Reservation Agenda', requiresAuth: true, userType: 'technician' }
    },
    {
        path: '/client/history',
        name: 'HistoryService',
        component: HistoryServicePage,
        meta: { title: 'Service History', requiresAuth: true, userType: 'client' }
    },
    {
        path: '/client/techsearch',
        name: 'TechnicianSearch',
        component: TechnicianSearch,
        meta: { title: 'Find Technicians', requiresAuth: true, userType: 'client' }
    },
    {
        path: '/client/profile/:id',
        name: 'TechnicianProfile',
        component: TechnicianProfilePage,
        props: true,
        meta: { title: 'Technician Profile', requiresAuth: true, userType: 'client' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'PageNotFound',
        component: PageNotFound,
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
            const defaultRoute = authStore.isClient ? '/client/techsearch' : '/tech/agenda';
            console.log('Wrong user type, redirecting to:', defaultRoute);
            next(defaultRoute);
            return;
        }
    }

    next();
});

export default router