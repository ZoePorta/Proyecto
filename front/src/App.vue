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
* {
  /* Variables */
  --main-bg-color: #e3f6f5;
  --block-bg-color: #ffffff;
  --text-color: #272343;
  --enf-bg-color: #bae8e8;
  --link-color: #0a7c86;
  --border: 1px solid #bae8e8;
  --shadow: 2px 2px 5px #bae8e875, -2px -2px 5px #bae8e875;

  /* /Variables */

  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

li.multiselect__element {
  display: inline-block;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
  background: var(--main-bg-color);
  min-height: 100vh;
}

a {
  text-decoration: none;
  color: var(--link-color);
}

.productsList {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
}

.ratingStars {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  padding: 0.2rem 0.5rem;
  margin: 1rem;
  background: rgb(39, 35, 67);
  background: rgb(2, 64, 74);
  background: linear-gradient(
    0deg,
    rgba(2, 64, 74, 1) 0%,
    rgba(18, 172, 187, 1) 100%
  );
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  border: var(--border);
  box-shadow: var(--shador);
  border-radius: 3px;
}

video {
  border-radius: 1rem;
  border: var(--border);
  box-shadow: var(--shadow);
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
