import { createRouter, createWebHistory } from 'vue-router'


const AgendaDeReservasPage = () => import('../domains/work/pages/AgendaDeReservasPage.vue')
const HistoryServicePage = () => import('../domains/user/pages/HistoryServicesPage.vue')
const TechnicianSearch = () => import('../domains/user/pages/TechnicianSearchPage.vue')
const TechnicianProfilePage = () => import('../domains/user/pages/TechnicianProfilePage.vue')
const PageNotFound = () => import('../public/pages/page-not-found.component.vue')

const routes = [
    {
        path: '/tech/agenda',
        name: 'AgendaDeReservas',
        component: AgendaDeReservasPage
    },
    {
        path: '/tech/history',
        name: 'HistoryService',
        component: HistoryServicePage
    },
    {
        path: '/client/techsearch',
        name: 'TechnicianSearch',
        component: TechnicianSearch
    },
    {
        path: '/client/:technicianName/profile',
        name: 'TechnicianProfile',
        component: TechnicianProfilePage,
        props: true
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'PageNotFound',
        component: PageNotFound
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.BASE_URL),
    routes: routes,
})

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'ChambaPro';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
});

export default router