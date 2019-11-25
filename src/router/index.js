import Vue from 'vue'
import Router from 'vue-router'

const Home = resolve => require(['@/views/Home'], resolve)
const Math = resolve => require(['@/views/Math'], resolve)
const SolarSystem = resolve => require(['@/views/SolarSystem'], resolve)
const Moon = resolve => require(['@/views/Moon'], resolve)
const Cube = resolve => require(['@/views/Cube'], resolve)
const Ball = resolve => require(['@/views/Ball'], resolve)
const Help = resolve => require(['@/views/Help'], resolve)
const About = resolve => require(['@/views/About'], resolve)
const World = resolve => require(['@/views/World'], resolve)
const Obj = resolve => require(['@/views/Obj'], resolve)
const Error404 = resolve => require(['@/views/error/Error404'], resolve)

Vue.use(Router)

let routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/math',
        component: Math
    },
    {
        path: '/solar_system',
        component: SolarSystem
    },
    {
        path: '/moon',
        component: Moon
    },
    {
        path: '/world',
        component: World
    },
    {
        path: '/obj',
        component: Obj
    },
    {
        path: '/cube',
        component: Cube
    },
    {
        path: '/ball',
        component: Ball
    },
    {
        path: '/help',
        component: Help
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '*',
        component: Error404
    }
]

let router = new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

export default router
