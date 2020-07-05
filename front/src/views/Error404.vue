<template>
  <div class="error">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Error 404" description="Page not found." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->
    <div class="contentContainer">
      <figure>
        <img src="../assets/404.svg" alt="Error 404: Page not found." />
      </figure>
    </div>
    <!-- /CONTENT -->

    <!-- FOOTER -->
    <footercustom></footercustom>
    <!-- /FOOTER -->
  </div>
</template>

<script>
// @ is an alias to /src
//Importing components
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";

//Importing library
import axios from "axios";

export default {
  name: "Error404",
  components: {
    menucustom,
    footercustom,
  },
};
</script>

<style scoped>
img {
  width: 90%;
  min-width: 10rem;
  max-width: 800px;
  max-height: 70vh;
}
</style>
