<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Alice&family=Galada&family=Montserrat:wght@500&display=swap");
* {
  /* Variables */
  --main-bg-color: #e3f6f5;
  --block-bg-color: #ffffff;
  --text-color: #272343;
  --enf-bg-color: #80ced0;
  --link-color: #009a95ff;
  --border: 1px solid #80ced0;
  --shadow: 2px 2px 5px #80ced075, -2px -2px 5px #80ced075;
  --title-font: "Galada", cursive;
  --subtitle-font: Alice, serif;
  --text-font: "Montserrat", Avenir, Helvetica, Arial, sans-serif;

  /* /Variables */

  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h1 {
  font-family: var(--title-font);
  font-weight: 300;
  margin: 1rem;
}

h2 {
  margin: 1rem;
  font-family: var(--subtitle-font);
  padding: 0;
}

.description {
  margin: 1rem;
}

.contentContainer {
  max-width: 1200px;
  margin: 0 auto;
}

li.multiselect__element {
  display: inline-block;
}

#app {
  font-family: var(--text-font);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
  background: var(--main-bg-color);
  min-height: 100vh;
  max-width: 100vw;
}

a {
  text-decoration: none;
  color: var(--link-color);
}

.productsList {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
}

.ratingStars {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem;
}

.ratingStars div {
  display: flex !important;
}

.button {
  padding: 0.2rem 0.5rem;
  margin: 1rem;
  background: rgb(30, 197, 189);
  background: linear-gradient(
    0deg,
    rgba(0, 90, 87, 1) 0%,
    rgba(30, 197, 189, 1) 100%
  );
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  border: var(--border);
  border-radius: 3px;
}

.button:disabled {
  cursor: initial;
  background: #95cbc9ff;
}

button:active {
  background: var(--text-color);
  background: rgb(0, 90, 87);
  background: linear-gradient(
    180deg,
    rgba(0, 90, 87, 1) 0%,
    rgba(30, 197, 189, 1) 100%
  );
}

button:focus {
  outline: none;
}

video {
  border-radius: 1rem;
  border: var(--border);
  box-shadow: var(--shadow);
  max-width: 500px;
}

/* Spinner */
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
/* /Spinner */
</style>
