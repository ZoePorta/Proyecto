<template>
  <div class="footer">
    <p>Zoe 2020</p>
  </div>
</template>

<script>
import { clearLogin, getName } from "../api/utils";

export default {
  name: "FooterCustom",
};
</script>

<style scoped>
p {
  font-size: 0.7rem;
  padding: 1rem;
}
</style>
