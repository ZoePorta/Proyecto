<template>
  <div class="checkout">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Checkout" />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->

    <!-- Spinner -->
    <div v-show="loading" class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <!-- /Spinner -->

    <!-- Address info -->
    <table>
      <thead>
        <tr>
          <th>Shipping to {{ address.alias }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {{ address.name }}
          </td>
        </tr>
        <tr>
          <td>{{ address.row1 }} {{ address.row2 }}</td>
        </tr>
        <tr>
          <td>{{ address.city }} - {{ address.PC }}</td>
        </tr>
        <tr>
          <td>
            {{ address.country }}
          </td>
        </tr>
        <tr>
          <td>{{ address.prefix }} - {{ address.phone_number }}</td>
        </tr>
      </tbody>
    </table>
    <!-- /Address info -->

    <button @click="payOrder()">PAY {{ price }}€</button>

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
import Swal from "sweetalert2";

export default {
  name: "Shop",
  components: {
    menucustom,
    footercustom,
  },
  data() {
    return {
      loading: true,

      //Address info
      address: {},

      //Total price
      price: null,
    };
  },
  methods: {
    //Proceed to checkout function
    checkoutOrder() {
      var self = this;
      axios
        .put(process.env.VUE_APP_API_URL + "/orders/cart/checkout", {
          addressId: self.$route.params.addressId,
        })
        //Success
        .then(function(response) {
          self.address = response.data.address;
          self.price = response.data.total.toFixed(2);
          self.loading = false;
        })
        //Error
        .catch((error) => console.log(error));
    },

    //Function to pay order
    payOrder() {
      /* This should call the payment method */

      //Assume order is paid and finish it
      var self = this;
      axios
        .put(process.env.VUE_APP_API_URL + "/orders/cart/finish")
        //Success: confirmation modal
        .then(function(response) {
          Swal.fire({
            icon: "success",
            title: "Thankyou!",
            text: "You will receive a confirmation email.",

            confirmButtonText: "Ok",
          }).then((result) => {
            //Go to Home

            self.$router.push("/");
          });
        })
        //Error
        .catch((error) => console.log(error));
    },
  },
  created() {
    this.checkoutOrder();
  },
};
</script>

<style scoped>
table {
  background: var(--block-bg-color);
  border: var(--border);
  box-shadow: var(--shadow);
  border-radius: 5%;
  margin: auto;
  padding: 1rem;
}
</style>
