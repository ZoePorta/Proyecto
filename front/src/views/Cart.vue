<template>
  <div class="cart">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Shopping cart" description="Your shopping cart." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->
    <div class="contentContainer">
      <h1>Your Shopping Cart</h1>
      <!-- Spinner -->
      <div v-show="loading" class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <!-- /Spinner -->

      <div class="container">
        <!-- Product list -->
        <div class="productsList">
          <p v-show="!products.length && !loading">No products to show</p>
          <productcard
            v-for="(product, index) in products"
            :key="product.id"
            :product="product"
            :showDelete="true"
            v-on:delete="deleteProduct(index)"
          >
          </productcard>
        </div>
        <!-- /Product list -->

        <!-- Addresses -->

        <table class="addresses">
          <thead>
            <tr>
              <th>
                Select address...
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="address in addresses"
              :key="address.id"
              :class="{ selected: address.id === addressId }"
              @click="addressId = address.id"
            >
              <td>{{ address.alias }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- /Addresses -->

      <!-- Checkout button -->
      <router-link
        :to="{ name: 'Checkout', params: { addressId } }"
        tag="button"
        class="button"
        :disabled="!checkAvailability || !products[0]"
        >CHECKOUT</router-link
      >
      <!-- /Checkout button -->

      <!-- Error message -->
      <p v-show="!checkAvailability">
        Some products are not available right now, please remove them from your
        order.
      </p>
      <!-- /Error message -->
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

      //Addresses Aray
      addresses: [],

      //Selected address
      addressId: "",
    };
  },
  methods: {
    getProducts() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/orders/cart")
        //Success
        .then(function(response) {
          self.products = response.data.result;
          self.addresses = response.data.addresses;
          self.addressId = self.addresses[0].id;

          self.loading = false;
        })
        //Error
        .catch((error) => console.log(error));
    },

    deleteProduct(index) {
      const productId = this.products[index].id;
      axios
        .delete(process.env.VUE_APP_API_URL + "/orders/cart/" + productId)
        //Success: confirmtion model
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
    this.getProducts();
  },

  computed: {
    checkAvailability() {
      let available = true;
      for (const product of this.products) {
        available = available && product.available;
      }

      return available;
    },
  },
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 20rem;
  grid-template-areas: "products addresses";
  justify-items: center;
}

.productsList {
  grid-area: products;
}

.addresses {
  grid-area: addresses;
  width: 100%;
  max-width: 90vw;
}

table {
  background: var(--enf-bg-color);
  border: var(--border);
  box-shadow: var(--shadow);

  border-radius: 5px;
  margin-top: 3rem;
  height: 10rem;
}

thead {
  cursor: default;
}

tbody {
  cursor: pointer;
  background: var(--block-bg-color);
}
tr.selected {
  background: var(--main-bg-color);
  font-weight: bold;
}

@media (max-width: 1000px) {
  .container {
    grid-template-areas:
      "products products"
      "addresses addresses";
  }

  table {
    margin: 0;
  }

  .productsList {
    margin: 0;
  }
}
</style>
