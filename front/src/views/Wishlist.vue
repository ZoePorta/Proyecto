<template>
  <div class="wishlist">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Wishlist" />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->
    <div class="contentContainer">
      <!-- Share link -->
      <!-- Link must be in a shown input in order to use document.execCommand("copy");-->
      <input id="shareLink" type="text" v-model="shareLink" />
      <!-- /Share link -->

      <h2>
        {{ userName }}'s whislist
        <font-awesome-icon
          v-show="isOwner"
          @click="copyShareLink()"
          icon="share"
        />
      </h2>

      <!-- Spinner -->
      <div v-show="loading" class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <!-- /Spinner -->

      <!-- Product list -->
      <div class="productsList">
        <p v-show="!products.length && !loading">No products to show</p>
        <productcard
          v-for="(product, index) in products"
          :key="product.id"
          :product="product"
          :showDelete="isOwner"
          v-on:delete="deleteProduct(index)"
        ></productcard>
      </div>
      <!-- /Product list -->
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
import productcard from "@/components/ProductCard.vue";

//Importing library
import axios from "axios";
import Swal from "sweetalert2";

//Importing function
import { getUserId } from "../api/utils";

export default {
  name: "Wishlist",
  components: {
    menucustom,
    footercustom,
    productcard,
  },
  data() {
    return {
      loading: true,

      //Products array
      products: [],

      //List owner's name
      userName: "User",

      //User is owner of the wishlist
      isOwner: getUserId() === this.$route.params.userId,

      //Wishlist share link
      shareLink: process.env.VUE_APP_BASE_URL + this.$route.fullPath,
    };
  },
  methods: {
    getProducts() {
      var self = this;
      axios
        .get(
          process.env.VUE_APP_API_URL + "/wishlist/" + self.$route.params.userId
        )
        //Success
        .then(function(response) {
          const name = response.data.user[0].first_name;
          self.products = response.data.result;
          if (name) {
            self.userName = name;
          }
          self.loading = false;
        })
        //Error
        .catch((error) => console.log(error));
    },

    //Remove product from wishlist
    deleteProduct(index) {
      const productId = this.products[index].id;
      axios
        .delete(process.env.VUE_APP_API_URL + "/wishlist/" + productId)
        //Success: confirmation modal
        .then(function(response) {
          Swal.fire({
            icon: "success",
            title: "Product removed",

            confirmButtonText: "Ok",
          }).then((result) => {
            //Update list page
            location.reload();
          });
        })
        //error
        .catch((error) => console.log(error));
    },

    //Copy whishlist share link to clipboard
    copyShareLink() {
      const link = document.querySelector("#shareLink");
      link.select();
      document.execCommand("copy");

      //Confirmation modal
      Swal.fire({
        icon: "success",
        title: "Share link copied to clipboard",
        text: "Share this link with whoever you want to see this wishlist.",

        confirmButtonText: "Ok",
      });
    },
  },
  created() {
    this.getProducts();
  },
  watch: {
    //If route params changes, change wishlist page
    $route() {
      this.$router.go();
    },
  },
};
</script>

<style scoped>
/* Hide link input */
#shareLink {
  position: absolute;
  top: -1000px;
}
</style>
