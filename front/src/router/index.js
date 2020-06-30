import Vue from "vue";
import VueRouter from "vue-router";
import { isLoggedIn, checkAdmin } from "../api/utils";
import Swal from "sweetalert2";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: {
      //Ruta pública

      allowAnonymous: true,
    },
  },
  {
    path: "/shop/:id",
    name: "Shop",
    component: () => import("../views/Shop.vue"),
    meta: {
      //Ruta privada
      allowAnonymous: false,
    },
  },
  {
    path: "/product/:id",
    name: "Product",
    component: () => import("../views/Product.vue"),
    meta: {
      //Ruta publica
      allowAnonymous: true,
    },
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/Search.vue"),
    meta: {
      //Ruta publica
      allowAnonymous: true,
    },
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    meta: {
      //Ruta privada
      allowAnonymous: false,
    },
  },

  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      //Ruta pública

      allowAnonymous: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: {
      //Ruta pública

      allowAnonymous: true,
    },
  },
  {
    path: "/validate",
    name: "Validation",
    component: () => import("../views/Validation.vue"),
    meta: {
      //Ruta pública

      allowAnonymous: true,
    },
  },
  {
    path: "*",
    name: "Error404",
    component: () => import("../views/Error404.vue"),
    meta: {
      //Ruta pública

      allowAnonymous: true,
    },
  },
  {
    path: "/wishlist/:userId",
    name: "Wishlist",
    component: () => import("../views/Wishlist.vue"),
    meta: {
      //Ruta pública

      allowAnonymous: true,
    },
  },
  {
    path: "/orders",
    name: "Orders",
    component: () => import("../views/Orders.vue"),
    meta: {
      //Private route

      allowAnonymous: false,
    },
  },

  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: {
      //Private route

      allowAnonymous: false,
    },
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/Cart.vue"),
    meta: {
      //Private route

      allowAnonymous: false,
    },
  },
];

const router = new VueRouter({
  routes,
});

//COMPROBANDO CADA PÁGINA POR SI LA PERSONA ESTA LOGUEADA
router.beforeEach((to, from, next) => {
  // Si la ruta es privada y la persona no tiene token
  if (!to.meta.allowAnonymous && !isLoggedIn()) {
    next({
      path: "/",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
