<template>
  <div class="search">
    <!-- CAMBIAR TITULO DE LA PÁGINA -->
    <vue-headful title="Validation" description="Validate your account." />
    <!-- /CAMBIAR TITULO DE LA PAGINA -->

    <!-- CONTENIDO -->

    <!-- /CONTENIDO -->

    <!-- FOOTER -->
    <footercustom></footercustom>
    <!-- /FOOTER -->
  </div>
</template>

<script>
// @ is an alias to /src
//Importando componentes
import footercustom from "@/components/FooterCustom.vue";

//Importando librería
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Validation",
  components: {
    footercustom,
  },
  data() {
    return {
      loading: true,
    };
  },
  methods: {
    validate() {
      var self = this;
      const { code } = self.$route.query;
      let url = "/users/validate?code=" + code;
      axios
        .get(process.env.VUE_APP_API_URL + url)
        //si sale bien
        .then(function(response) {
          console.log(response);
          //Confirmation pop-up
          Swal.fire({
            icon: "success",
            title: "Account verified",
            text: "You can login now.",
            confirmButtonText: "Go to login",
          }).then(
            //Go to login page
            (result) => self.$router.push("/login")
          );
        })
        //si sale mal
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Unknown error",
            text: "Try again later.",

            confirmButtonText: "Ok",
          }).then(
            //Go to index page
            (result) => self.$router.push("/")
          );
        });
    },
  },
  created() {
    this.validate();
  },
};
</script>

<style scoped></style>
