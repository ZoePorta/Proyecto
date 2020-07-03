<template>
  <div id="menu">
    <div id="home">
      <router-link :to="{ name: 'Home' }">Crafty</router-link>
    </div>

    <!-- Menu for logged users only -->
    <div id="user-nav" v-if="logged">
      <router-link :to="{ name: 'Wishlist', params: { userId } }" class="icon"
        ><font-awesome-icon icon="heart"
      /></router-link>
      <!--       <router-link :to="{ name: 'Orders' }" tag="button">Orders</router-link>
 -->
      <router-link :to="{ name: 'Cart' }" class="icon">
        <font-awesome-icon icon="shopping-cart" />
      </router-link>
      <router-link :to="{ name: 'Profile' }" class="icon"
        ><font-awesome-icon icon="user"
      /></router-link>

      <button class="boton" @click="logoutUser()">
        LOGOUT
      </button>
    </div>
    <!-- /Menu for logged users only -->

    <!-- Menu for logged users only -->
    <div id="anon-nav" v-else>
      <router-link :to="{ name: 'Register' }" tag="button" class="button"
        >REGISTER</router-link
      >
      <router-link :to="{ name: 'Login' }" tag="button" class="button"
        >LOGIN</router-link
      >
    </div>
    <!-- /Menu for not logged users only -->
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
  background: var(--block-bg-color);
  border-bottom: var(--border);
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

#home {
  padding: 30px;
  padding-top: 4rem;
}

a {
  font-weight: bold;
  color: var(--text-color);
}

#user-nav {
  position: absolute;
  right: 1rem;
  top: 1rem;
  font-size: 1.2rem;
}

#user-nav button {
  margin: 0 0.2rem;
  padding: 0.1rem;
  cursor: pointer;
}

.icon {
  margin: 0 0.3rem;
}
</style>
