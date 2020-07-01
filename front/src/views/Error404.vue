<template>
  <div class="error">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Error 404" description="Page not found." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->
    <h1>Are you lost 🙀?</h1>
    <p>There's nothing here.</p>
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
