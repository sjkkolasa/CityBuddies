// Vue imports.
import { createRouter, createWebHistory } from 'vue-router'

// Import views and components.
import HomeView from '../views/HomeView.vue'
import NotFoundView from '../views/404View.vue'
import AboutView from '../views/AboutView.vue'
import Disambiguation from '../components/Disambiguation.vue'
import BuddyMatch from '../components/BuddyMatch.vue'
import CityNotFound from '../components/CityNotFound.vue'
import Search from '../components/redirects/Search.vue'
import MatchRedirect from '../components/redirects/MatchRedirect.vue'

// Import composables.
import { useIdToLabel } from '../composables/useIdToLabel.js'

// Extract functions from composables.
let { idToLabel } = useIdToLabel()

// Define routes.
const routes = [
    // Home View: The main landing page for the user.
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            title: 'Home',
            noTitle: false
        },
        children: [
            // Search: Where the user is directed after submitting an input. Searches for cities that match the user's input.
            {
                path: 'search/:targetLabel',
                name: 'search',
                component: Search,
                meta: {
                    noTitle: false
                }
            },
            // Disambiguation: When there are multiple cities with the inputted name, allow the user to choose which city they want.
            {
                path: 'disambiguation/:targetLabel',
                name: 'disambiguation',
                component: Disambiguation,
                meta: {
                    noTitle: false
                },
                children: [
                    // Redirects back to the Seach route if the disambiguation page was access via direct link
                    {
                        path: '',
                        name: 'disambiguation-child',
                        component: Disambiguation,
                        redirect: to => {
                            return { name: 'search', params: { targetLabel: to.params.targetLabel } }
                        },
                        meta: {
                            noTitle: false
                        }
                    }
                ]
            },
            // City Not Found: Informs the user if the inputted value does not match any city
            {
                path: 'city-not-found/:targetLabel',
                name: 'city-not-found',
                component: CityNotFound,
                meta: {
                    noTitle: false
                },
                children: [
                    // Redirects back to the Seach route if the not found page was access via direct link
                    {
                        path: '',
                        name: 'not-found-child',
                        component: CityNotFound,
                        redirect: to => {
                            return { name: 'search', params: { targetLabel: to.params.targetLabel } }
                        },
                        meta: {
                            noTitle: false
                        }
                    }
                ]
            },
            // Match: Displays which city is closesnt in population to the inputted city.
            {
                path: 'match/:targetId',
                name: 'match',
                component: BuddyMatch,
                meta: {
                    noTitle: false
                },
                children: [
                    // Recalculates the city buddy if the match page was access via direct link.
                    {
                        path: '',
                        name: 'match-child',
                        component: BuddyMatch,
                        meta: {
                            noTitle: false
                        },
                        redirect: to => {
                            return { name: 'match-redirect', params: { targetId: to.params.targetId } }
                        }
                    }
                ]
            },
            // Match Redirect: Ensures that the target ID is a valid city and has the correct buddy before showing the Match screen.
            // Used when Match is accessed using a direct link.
            {
                path: 'match-redirect/:targetId',
                name: 'match-redirect',
                component: MatchRedirect,
                meta: {
                    noTitle: true
                },
            },
            
        ]
    },
    // About: Describes what the website is, how to use it, and very generally how it works.
    {
        path: '/about',
        name: 'about',
        component: AboutView,
        meta: {
            title: 'About',
            noTitle: false
        },
    },
    // 404: Landing page for any other routes.
    {
        path: '/:catchAll(.*)*',
        name: '404',
        component: NotFoundView,
        meta: {
            title: '404',
            noTitle: false
        }
    }
]

// Define router.
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

// Determine the title for the routes.
router.beforeEach(async (to, from, next) => {

    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (to.meta.noTitle) {
        document.title = `City Buddies`
    }

    else {

        let title = ''

        if (to.params.targetLabel) {
            title = to.params.targetLabel
        }
        else if (to.params.targetId) {
            title = await idToLabel(to.params.targetId)
        }
        else {
            title = to.meta.title
        }
    
        document.title = `${title} | City Buddies`
        
    }
    
    next()
})

export default router
