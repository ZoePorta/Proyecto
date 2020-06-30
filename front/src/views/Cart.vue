<template>
  <div class="cart">
    <!-- CAMBIAR TITULO DE LA PÁGINA -->
    <vue-headful title="Shopping cart" description="Your shopping cart." />
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

    <!-- Lista de productos -->
    <p v-show="!products.length && !loading">No products to show</p>
    <productcard
      v-for="(product, index) in products"
      :key="product.id"
      :product="product"
      :showDelete="true"
      v-on:delete="deleteProduct(index)"
    >
    </productcard>

    <!-- /Lista de productos -->

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
import productcard from "@/components/ProductCard.vue";

//Importando librería
import axios from "axios";
import Swal from "sweetalert2";

import { getUserId } from "../api/utils";

export default {
  name: "Cart",
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
    };
  },
  methods: {
    getProducts() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/orders/cart")
        //si sale bien
        .then(function(response) {
          console.log(response);
          self.products = response.data.message;

          self.loading = false;
        })
        //si sale mal
        .catch((error) => console.log(error));
    },

    deleteProduct(index) {
      const productId = this.products[index].id;
      axios
        .delete(process.env.VUE_APP_API_URL + "/orders/cart/" + productId)
        //si sale bien
        .then(function(response) {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Product removed",

            confirmButtonText: "Ok",
          }).then((result) => {
            location.reload();
          });
        })
        //si sale mal
        .catch((error) => console.log(error));
    },
  },
  created() {
    this.getProducts();
  },
  watch: {
    $route() {
      this.$router.go();
    },
  },
};
</script>

<style scoped></style>
