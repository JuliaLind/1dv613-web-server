import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

export const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (About.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   // component: () => import('../views/AboutView.vue'),
  // },
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/**
 * Checks if the user should be redirected to the login page
 *
 * @param {string} path - the path to check
 * @param {object} token - the access token
 * @returns {boolean} - true if the user should be redirected to the login page
 */
function redirectToLogin(path, token) {
  const pages = ['/login', '/register']

  return !pages.includes(path) && !token
}

/**
 * Checks if the user should be redirected to the home page
 *
 * @param {string} path - the path to check
 * @param {object} token - the access token
 * @returns {boolean} - true if the user should be redirected to the home page
 */
function redirectToHome(path, token) {
  const pages = ['/login', '/register'] // keep separate, might be a subset of publicPages in the future
  return pages.includes(path) && token
}

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('accessToken')

  if (redirectToLogin(to.path, accessToken)) {
    return next('/login')
  }

  if (redirectToHome(to.path, accessToken)) {
    return next('/')
  }

  next()
})

export default router
