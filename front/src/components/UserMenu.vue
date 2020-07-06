<template>
  <div id="menu">
    <h1>Account</h1>
    <p class="description">
      Here you can edit your profile, manage your addresses and check and rate
      your orders!
    </p>
    <div id="nav">
      <router-link :to="{ name: 'Profile' }">Profile</router-link> ●

      <router-link :to="{ name: 'Orders' }">Orders</router-link> ●
      <router-link :to="{ name: 'Addresses' }">Addresses</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "userMenu",
};
</script>

<style scoped>
#nav {
  width: 18rem;
  background: var(--block-bg-color);
  border-bottom: var(--border);
  box-shadow: var(--shadow);
  margin: 0 auto;
  margin-bottom: 2rem;
  padding: 0.5rem 1rem;
  border: var(--border);
  box-shadow: var(--shadow);
  border-radius: 0.5rem;
}

a {
  font-weight: bold;
  color: var(--text-color);
}

a.router-link-exact-active {
  color: var(--link-color);
}
</style>
