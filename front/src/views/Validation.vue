<template>
  <div class="search">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Validation" description="Validate your account." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- CONTENT -->

    <!-- /CONTENT -->

    <!-- FOOTER -->
    <footercustom></footercustom>
    <!-- /FOOTER -->
  </div>
</template>

<script>
// @ is an alias to /src
//Importing components
import footercustom from "@/components/FooterCustom.vue";

//Importing library
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
    //Validate account function
    validate() {
      var self = this;
      const { code } = self.$route.query;
      let url = "/users/validate?code=" + code;
      axios
        .get(process.env.VUE_APP_API_URL + url)
        //success
        .then(function(response) {
          //Confirmation modal
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
        //error: error modal
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
