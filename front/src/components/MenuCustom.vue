<template>
  <div id="menu">
    <div id="nav">
      <router-link :to="{ name: 'Home' }">Home</router-link> |
      <router-link :to="{ name: 'About' }">About</router-link>
    </div>

    <div id="user-nav" v-if="logged">
      <router-link :to="{ name: 'Wishlist', params: { userId } }"
        >Wishlist</router-link
      >
      <router-link :to="{ name: 'Orders' }">Orders</router-link>
      <router-link :to="{ name: 'Profile' }">Profile</router-link>
      <router-link :to="{ name: 'Cart' }">Cart</router-link>
      <button class="boton" @click="logoutUser()">
        LOGOUT
      </button>
    </div>

    <div id="user-nav" v-else>
      <router-link :to="{ name: 'Register' }" tag="button"
        >REGISTER</router-link
      >
      <router-link :to="{ name: 'Login' }" tag="button">LOGIN</router-link>
    </div>
  </div>
</template>

<script>
import { clearLogin, getUserId, isLoggedIn } from "../api/utils";

export default {
  name: "MenuCustom",
  data() {
    return {
      userId: getUserId(),
      logged: isLoggedIn(),
    };
  },
  methods: {
    logoutUser() {
      this.$router.push("/login");
      return clearLogin();
    },
  },
};
</script>

<style scoped>
#menu {
  width: 100%;
  background: #efefef;
  margin-bottom: 2rem;
  color: #070707;
}

div {
  display: inline-block;
}

p {
  display: inline;
  margin-right: 1rem;
}

#nav {
  padding: 30px;
  width: 100%;
  padding-top: 4rem;
}

#nav a {
  font-weight: bold;
  color: #3454d1;
}

#nav a.router-link-exact-active {
  color: #34d1bf;
}

#user-nav {
  position: absolute;
  right: 1rem;
  top: 1rem;
}
</style>
