<template>
  <div class="error">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="My shop" description="Manage your shop." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->

    <div class="contentContainer">
      <!-- CONSTRUCTION -->
      <figure v-show="false">
        <img src="../assets/construction.svg" alt="Page under construction." />
      </figure>

      <!-- REGULAR USER -->
      <p>You don't have a shop yet.</p>
      <button @click="openModal()">Start selling your art now!</button>
      <!-- /REGULAR USER -->

      <!-- /CONSTRUCTION -->

      <!-- FORM -->
      <shopform
        :shop="shop"
        :show="showModal"
        @close="closeModal()"
        @save="saveShop()"
        :vendor="vendor"
      ></shopform>
    </div>
    <!-- /FORM -->
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
import shopform from "@/components/ShopForm.vue";

//Importing library
import axios from "axios";
import Swal from "sweetalert2";
import "animate.css";

import { isLoggedIn, getRole } from "../api/utils";

export default {
  name: "UShop",
  components: {
    menucustom,
    footercustom,
    shopform,
  },

  data() {
    return {
      vendor: getRole() === "vendor",
      showModal: false,
      shop: {},
    };
  },

  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    getShop() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/shops/" + self.$route.params.id)
        //Success
        .then(function(response) {
          console.log(response);
          self.shop = response.data.message;
          /*  self.loading = false; */
        })
        //Error
        .catch((error) => console.log(error));
    },

    saveShop() {
      this.closeModal();
      if (this.vendor) {
        console.log("vendor");
      } else {
        this.createShop();
      }
    },

    //Function to create a shop
    createShop() {
      const self = this;
      const shop = self.shop;

      axios
        .post(process.env.VUE_APP_API_URL + "/shops/", {
          ...{ shop },
        })
        //Success: confirmation modal
        .then(function(response) {
          Swal.fire({
            icon: "success",
            title: "Shop crated successfully",

            confirmButtonText: "Ok",

            buttonsStyling: false,
          }).then((result) => {
            location.reload();
          });
        })
        //Error
        .catch((error) => console.log(error));
    },
  },
};

console.log(getRole());
</script>

<style scoped>
img {
  width: 90%;
  min-width: 10rem;
  max-width: 800px;
  max-height: 70vh;
}
</style>
