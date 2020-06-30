<template>
  <div class="Profile">
    <!-- CAMBIAR TITULO DE LA PÁGINA -->
    <vue-headful title="Profile" description="Profile." />
    <!-- /CAMBIAR TITULO DE LA PAGINA -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENIDO -->

    <!-- Spinner -->
    <div v-show="loading" class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <!-- /Spinner -->

    <form>
      <img :src="user.photo" alt="Profile picture" />

      <label for="first_name">First name:</label>
      <input type="text" id="first_name" v-model="user.first_name" />

      <label for="last_name">Last name:</label>
      <input type="text" id="last_name" v-model="user.last_name" />

      <label for="email">Email:</label>
      <input type="text" id="email" v-model="user.email" disabled />

      <label for="birthDate">Birth date:</label>
      <input type="text" id="birthDate" v-model="formattedDate" disabled />
    </form>
    <button @click="saveChanges()">Save</button>

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
import Swal from "sweetalert2";

import { getUserId } from "../api/utils";

export default {
  name: "Profile",
  components: {
    menucustom,
    footercustom,
  },
  data() {
    return {
      loading: true,

      //Profile object
      user: {},
      formattedDate: "",
    };
  },
  methods: {
    getInfo() {
      const self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/users/" + getUserId())
        //Success
        .then(function(response) {
          console.log(response);
          self.user = response.data.data;
          self.formattedDate = self.formatDate(self.user.birthDate);

          self.loading = false;
        })
        //Error
        .catch((error) => console.log(error));
    },
    formatDate(date) {
      date = new Date(date);
      return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    },

    saveChanges() {
      const self = this;

      axios
        .put(process.env.VUE_APP_API_URL + "/users/" + getUserId(), {
          firstName: self.user.first_name,
          lastName: self.user.last_name,
        })
        //Success
        .then(function(response) {
          console.log(response);

          Swal.fire({
            icon: "success",
            title: "Profile updated",

            confirmButtonText: "Ok",
          }).then((result) => {
            location.reload();
          });
        })
        //Error
        .catch((error) => console.log(error));
    },
  },
  created() {
    this.getInfo();
    console.log(this.user);
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
</style>
