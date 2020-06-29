<template>
  <div class="about">
    <!-- CAMBIAR TITULO DE LA PÁGINA -->
    <vue-headful title="About" description="Información sobre esta web." />
    <!-- /CAMBIAR TITULO DE LA PAGINA -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENIDO -->
    <h1>Esta página...</h1>
    <avatar></avatar>
    <p>
      ha sido creada por
      <a href="https://www.linkedin.com/in/zoeporta/">Zoe</a>,
    </p>
    <p>
      usando
      <a href="">Vue.js</a>, <a href="https://github.com/axios/axios">Axios</a>,
      <a href="https://sweetalert2.github.io/">Sweet Alert 2</a>,
      <a href="https://github.com/troxler/vue-headful">Vue-Headful</a>,
      <a href="https://github.com/orgordin/vuejs-avataaars">Vuejs-Avataaars</a>,
      <a href="https://animate.style/">Animate.css</a> y
      <a href="https://loading.io/css/">Pure CSS Loader</a>.
    </p>
    <!-- /CONTENIDO -->

    <!-- FOOTER -->
    <footercustom></footercustom>
    <!-- /FOOTER -->
  </div>
</template>

<script>
// @ is an alias to /src
//Importando componentes
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";
import avatar from "@/components/Avatar.vue";

//Importando librería
import axios from "axios";

export default {
  name: "About",
  components: {
    menucustom,
    footercustom,
    avatar,
  },
};
</script>

<style scoped>
p {
  max-width: 25rem;
  margin: 0 auto;
}

a {
  color: rgb(149, 255, 181);
  text-decoration: none;
}

a:visited {
  color: #34d1bf;
}
</style>
