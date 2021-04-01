<template>
  <div id="menu">
    <router-link id="home" title="Home" :to="{ name: 'Home' }"
      ><img src="../assets/origami.svg" alt="Crafty logo" />
      <h1>Crafty</h1></router-link
    >

    <!-- Menu for logged users only -->
    <div class="user nav" v-if="logged">
      <router-link
        title="Wishlist"
        :to="{ name: 'Wishlist', params: { userId } }"
        class="icon"
        ><font-awesome-icon icon="heart"
      /></router-link>
      <!--       <router-link :to="{ name: 'Orders' }" tag="button">Orders</router-link>
 -->
      <router-link title="Cart" :to="{ name: 'Cart' }" class="icon">
        <font-awesome-icon icon="shopping-cart" />
      </router-link>
      <router-link title="Profile" :to="{ name: 'Profile' }" class="icon"
        ><font-awesome-icon icon="user"
      /></router-link>

      <router-link title="My shop" :to="{ name: 'UShop' }" class="icon"
        ><font-awesome-icon icon="store"
      /></router-link>

      <router-link title="About" :to="{ name: 'About' }" class="icon"
        ><font-awesome-icon icon="question-circle"
      /></router-link>

      <button title="log out" class="button" @click="logoutUser()">
        LOGOUT
      </button>
    </div>
    <!-- /Menu for logged users only -->

    <!-- Menu for not logged users only -->
    <div class="anon nav" v-else>
      <router-link title="about" :to="{ name: 'About' }" class="icon"
        ><font-awesome-icon icon="question-circle"
      /></router-link>

      <router-link
        title="Register"
        :to="{ name: 'Register' }"
        tag="button"
        class="button"
        >REGISTER</router-link
      >
      <router-link
        title="Login"
        :to="{ name: 'Login' }"
        tag="button"
        class="button"
        >LOGIN</router-link
      >
    </div>
    <!-- /Menu for not logged users only -->

    <!-- Search input -->
    <div v-show="showSearch" class="search">
      <input type="text" v-model="search" placeholder="Type something..." />
      <router-link
        title="search"
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
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    "logo search nav"
    "logo search nav"
    "logo search nav";
}

#home {
  display: flex;
  align-items: center;
  margin: 1rem;
  grid-area: logo;
  max-width: 100vw;
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
  font-size: 1.2rem;
  margin: 1rem;
  grid-area: nav;
  display: flex;
  height: min-content;
  justify-self: end;
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
  max-width: 15rem;
  height: 2rem;
  align-self: flex-end;
  justify-self: center;
  margin-bottom: 2rem;
  grid-area: search;
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

@media (max-width: 800px) {
  #menu {
    grid-template-areas:
      "nav nav nav"
      "logo logo logo"
      "search search search";
    justify-content: center;
  }

  #home {
    justify-content: center;
    margin: 0;
  }

  .button {
    margin-right: 0;
  }

  .nav {
    justify-self: center;
    margin-bottom: 0;
  }
}
</style>
