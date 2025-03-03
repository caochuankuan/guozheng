import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import StudentList from '../views/StudentList.vue';
import StudentDetail from '../views/StudentDetail.vue';
import StudentForm from '../views/StudentForm.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/students',
    name: 'StudentList',
    component: StudentList,
    meta: { requiresAuth: true }
  },
  {
    path: '/students/:id',
    name: 'StudentDetail',
    component: StudentDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/students/add',
    name: 'AddStudent',
    component: StudentForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/students/edit/:id',
    name: 'EditStudent',
    component: StudentForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;