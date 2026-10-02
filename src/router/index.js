import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/src/stores/auth';

const routes = [
  {
    path: '/',
    component: () => import('@/src/layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/src/views/HomePage.vue') },
      { path: 'produits', name: 'products', component: () => import('@/src/views/ProductsPage.vue') },
      {
        path: 'produits/:slug',
        name: 'product-detail',
        component: () => import('@/src/views/ProductDetailPage.vue'),
      },
      { path: 'blog', name: 'blog', component: () => import('@/src/views/BlogPage.vue') },
      {
        path: 'blog/:slug',
        name: 'blog-post',
        component: () => import('@/src/views/BlogPostPage.vue'),
      },
      { path: 'a-propos', name: 'about', component: () => import('@/src/views/AboutPage.vue') },
      { path: 'contact', name: 'contact', component: () => import('@/src/views/ContactPage.vue') },
    ],
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/src/views/admin/AdminLoginPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/admin',
    component: () => import('@/src/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('@/src/views/admin/AdminDashboard.vue') },
      { path: 'produits', name: 'admin-products', component: () => import('@/src/views/admin/AdminProducts.vue') },
      { path: 'articles', name: 'admin-articles', component: () => import('@/src/views/admin/AdminArticles.vue') },
      { path: 'publicites', name: 'admin-ads', component: () => import('@/src/views/admin/AdminAds.vue') },
      { path: 'messages', name: 'admin-messages', component: () => import('@/src/views/admin/AdminMessages.vue') },
      { path: 'supabase', name: 'admin-supabase', component: () => import('@/src/views/admin/AdminSupabaseGuide.vue') },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/src/layouts/PublicLayout.vue'),
    children: [
      { path: '', component: () => import('@/src/views/NotFoundPage.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (auth.isLoading) {
    auth.init();
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'admin-login', query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'admin-dashboard' };
  }

  return true;
});

export default router;
