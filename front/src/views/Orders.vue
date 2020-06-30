<template>
  <div class="orders">
    <!-- CAMBIAR TITULO DE LA PÁGINA -->
    <vue-headful title="Orders" description="Orders page." />
    <!-- /CAMBIAR TITULO DE LA PAGINA -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENIDO -->

    <h2>Finished orders</h2>

    <!-- Spinner -->
    <div v-show="loading" class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <!-- /Spinner -->

    <!-- Order list -->
    <p v-show="!orders">No orders to show</p>

    <table v-for="order in orders" :key="order.id">
      <thead>
        <tr>
          <th>{{ order.sell_date }}</th>
          <td>Shipped to {{ order.alias }}</td>
          <td>Total price: {{ order.price }}€</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="3">
            <ordercard
              v-for="product in order.products"
              :key="product.id"
              :product="product"
            ></ordercard>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- /Order list -->

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
import ordercard from "@/components/OrderCard.vue";

//Importando librería
import axios from "axios";
import Swal from "sweetalert2";

import { getUserId } from "../api/utils";

export default {
  name: "Orders",
  components: {
    menucustom,
    footercustom,
    ordercard,
  },
  data() {
    return {
      loading: true,

      //Orders array
      orders: [],
    };
  },
  methods: {
    getProducts() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/orders")
        //si sale bien
        .then(function(response) {
          console.log(response);
          self.orders = response.data.result;

          self.loading = false;
        })
        //si sale mal
        .catch((error) => console.log(error));
    },

    deleteProduct(index) {
      const productId = this.products[index].id;
      axios
        .delete(process.env.VUE_APP_API_URL + "/wishlist/" + productId)
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

<style scoped>
img {
  width: 10rem;
}
</style>
