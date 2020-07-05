import Vue from "vue";
import VueRouter from "vue-router";
import { isLoggedIn } from "../api/utils";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: {
      //Public route

      allowAnonymous: true,
    },
  },

  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      //Public route

      allowAnonymous: true,
    },
    beforeEnter: (to, from, next) => {
      if (isLoggedIn()) {
        next({
          //Send user lo home
          path: "/",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },

  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: {
      //Public route

      allowAnonymous: true,
    },
    beforeEnter: (to, from, next) => {
      if (isLoggedIn()) {
        next({
          //Send user lo home
          path: "/",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },

  {
    path: "/validate",
    name: "Validation",
    component: () => import("../views/Validation.vue"),
    meta: {
      //Public route

      allowAnonymous: true,
    },
  },

  {
    path: "/search",
    name: "Search",
    component: () => import("../views/Search.vue"),
    meta: {
      //Public route
      allowAnonymous: true,
    },
  },

  {
    path: "/product/:id",
    name: "Product",
    component: () => import("../views/Product.vue"),
    meta: {
      //Public route
      allowAnonymous: true,
    },
  },

  {
    path: "/shop/:id",
    name: "Shop",
    component: () => import("../views/Shop.vue"),
    meta: {
      //Public route
      allowAnonymous: true,
    },
  },

  {
    path: "/wishlist/:userId",
    name: "Wishlist",
    component: () => import("../views/Wishlist.vue"),
    meta: {
      //Public route

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
    path: "/addresses",
    name: "Addresses",
    component: () => import("../views/Addresses.vue"),
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

  {
    path: "/checkout/:addressId",
    name: "Checkout",
    component: () => import("../views/Checkout.vue"),
    meta: {
      //Private route

      allowAnonymous: false,
    },
  },

  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    meta: {
      //Public route

      allowAnonymous: true,
    },
  },

  {
    path: "*",
    name: "Error404",
    component: () => import("../views/Error404.vue"),
    meta: {
      //Public route

      allowAnonymous: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

//CHECK EACH PAGE IF THE PERSON IS LOGGED
router.beforeEach((to, from, next) => {
  // If the route is private and user has no token
  if (!to.meta.allowAnonymous && !isLoggedIn()) {
    next({
      //Send user lo login
      path: "/login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
