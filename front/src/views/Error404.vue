<template>
  <div class="error">
    <!-- CAMBIAR TITULO DE LA PÁGINA -->
    <vue-headful title="Error 404" description="Página no encontrada." />
    <!-- /CAMBIAR TITULO DE LA PAGINA -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENIDO -->
    <h1>¿Te has perdido 🙀?</h1>
    <p>Esta página no existe, son los padres.</p>
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

//Importando librería
import axios from "axios";

export default {
  name: "Error404",
  components: {
    menucustom,
    footercustom,
  },
};
</script>
