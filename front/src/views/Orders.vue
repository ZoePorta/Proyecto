<template>
  <div class="orders">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Orders" description="Your finished orders." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->
    <div class="contentContainer">
      <!-- USER MENU -->
      <usermenu></usermenu>
      <!-- /USER MENU -->

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

      <div class="order" v-for="order in orders" :key="order.id">
        <div class="header">
          <p>
            <strong>{{ new Date(order.sell_date).toLocaleString() }}</strong>
          </p>
          <p>Shipped to {{ order.alias }}</p>
          <p>Total price: {{ order.price }}€</p>
        </div>
        <ordercard
          v-for="product in order.products"
          :key="product.id"
          :product="product"
        ></ordercard>
      </div>
      <!-- /Order list -->
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
import ordercard from "@/components/OrderCard.vue";
import usermenu from "@/components/UserMenu.vue";

//Importing library
import axios from "axios";

export default {
  name: "Orders",
  components: {
    menucustom,
    footercustom,
    ordercard,
    usermenu,
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
  },
  created() {
    this.getOrders();
  },
};
</script>

<style scoped>
.order {
  width: 90vw;
  max-width: 800px;
  margin: 1.5rem auto;
  border: var(--border);
  box-shadow: var(--shadow);
  border-radius: 1rem;
  padding: 1rem;
  background: var(--enf-bg-color);
}

.header {
  width: 100%;
  justify-content: space-evenly;
  display: flex;
}

@media (max-width: 800px) {
  .header {
    flex-direction: column;
  }
}
</style>
