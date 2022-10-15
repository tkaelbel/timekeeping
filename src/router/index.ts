import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/MainLayout.vue"),
      children: [
        { path: "", component: () => import("@/views/Timekeeping.vue") },
        {
          path: "configuration",
          component: () => import("@/views/Configuration.vue"),
        },
        {
          path: "timecalculator",
          component: () => import("@/views/TimeCalculator.vue"),
        },
        {
          path: "data",
          component: () => import("@/views/Data.vue"),
        },
      ],
    },
  ],
});

export default router;
