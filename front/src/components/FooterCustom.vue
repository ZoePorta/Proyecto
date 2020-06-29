<template>
  <div class="footer">
    <p>Zoe 2020</p>
  </div>
</template>

<script>
import { clearLogin, getName } from "../api/utils";

export default {
  name: "MenuCustom",
  data() {
    return {
      username: getName(),
    };
  },
  methods: {
    logoutUser() {
      this.$router.push("/");
      return clearLogin();
    },
  },
};
</script>

<style scoped>
p {
  font-size: 0.7rem;
  padding: 1rem;
}
</style>
