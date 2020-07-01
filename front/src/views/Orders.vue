<template>
  <div class="orders">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Orders" description="Your finished orders." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->

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
    <p v-show="!orders && !loading">No orders to show</p>

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
import ordercard from "@/components/OrderCard.vue";

//Importing library
import axios from "axios";
import Swal from "sweetalert2";

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
    getOrders() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/orders")
        //Success
        .then(function(response) {
          self.orders = response.data.result;

          self.loading = false;
        })
        //Error
        .catch((error) => console.log(error));
    },

    //Function to remove item from order
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
            location.reload();
          });
        })
        //Error
        .catch((error) => console.log(error));
    },
  },
  created() {
    this.getOrders();
  },
};
</script>

<style scoped>
table {
  width: 90%;
  margin: 1rem auto;
  background: grey;
}
</style>
