<template>
  <div id="menu">
    <div id="home">
      <router-link :to="{ name: 'Home' }">Crafty</router-link>
    </div>

    <div id="user-nav" v-if="logged">
      <router-link :to="{ name: 'Wishlist', params: { userId } }" tag="button"
        >Wishlist</router-link
      >
      <router-link :to="{ name: 'Orders' }" tag="button">Orders</router-link>
      <router-link :to="{ name: 'Profile' }" tag="button">Profile</router-link>
      <router-link :to="{ name: 'Cart' }" tag="button">Cart</router-link>
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
      this.$router.push("/").catch((error) => {
        location.reload();
      });
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

#home {
  padding: 30px;
  padding-top: 4rem;
}

#home a {
  font-weight: bold;
  color: #3454d1;
}

#home a.router-link-exact-active {
  color: #34d1bf;
}

#user-nav {
  position: absolute;
  right: 1rem;
  top: 1rem;
}

#user-nav button {
  margin: 0 0.2rem;
  padding: 0.1rem;
  cursor: pointer;
}
</style>
