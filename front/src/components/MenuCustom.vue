<template>
  <div id="menu">
    <div>
      <router-link id="home" :to="{ name: 'Home' }"
        ><img src="../assets/origami.svg" alt="Crafty logo" />
        <h1>Crafty</h1></router-link
      >
    </div>

    <!-- Menu for logged users only -->
    <div class="user nav" v-if="logged">
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

      <router-link :to="{ name: 'About' }" class="icon"
        ><font-awesome-icon icon="question-circle"
      /></router-link>

      <button class="button" @click="logoutUser()">
        LOGOUT
      </button>
    </div>
    <!-- /Menu for logged users only -->

    <!-- Menu for not logged users only -->
    <div class="anon nav" v-else>
      <router-link :to="{ name: 'About' }" class="icon"
        ><font-awesome-icon icon="question-circle"
      /></router-link>

      <router-link :to="{ name: 'Register' }" tag="button" class="button"
        >REGISTER</router-link
      >
      <router-link :to="{ name: 'Login' }" tag="button" class="button"
        >LOGIN</router-link
      >
    </div>
    <!-- /Menu for not logged users only -->

    <!-- Search input -->
    <div v-show="showSearch" class="search">
      <input type="text" v-model="search" placeholder="Type something..." />
      <router-link
        class="button"
        :to="{ name: 'Search', query: { words: search } }"
        tag="button"
        >Go!</router-link
      >
    </div>
    <!-- /Search input -->
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
      search: "",
    };
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    logoutUser() {
      clearLogin();
      this.$router.push("/").catch((error) => {
        location.reload();
      });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Satisfy&display=swap");

#menu {
  width: 100%;
  background: var(--block-bg-color);
  border-bottom: var(--border);
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 20rem 1fr 20rem;
}

#home {
  display: flex;
  align-items: center;
  padding: 1rem;
}

#home h1 {
  font-size: 3rem;
  display: inline;
  font-family: "Satisfy", cursive;
  font-weight: bold;
}

#home img {
  width: 5rem;
}

a {
  font-weight: bold;
  color: var(--link-color);
}

.nav {
  position: absolute;
  right: 1rem;
  top: 1rem;
  font-size: 1.2rem;
}

.nav button {
  margin-top: 0;
}

.icon {
  margin: 0 0.3rem;
}

.search {
  border: var(--border);
  box-shadow: var(--shadow);
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  width: 15rem;
  height: 2rem;
  align-self: center;
  justify-self: center;
  margin-top: 2rem;
}
.search button,
input {
  margin: 0;
  border: none;
  border-radius: 0;
}

input {
  height: 100%;
  flex-grow: 1;
  padding: 0.5rem;
}
</style>
