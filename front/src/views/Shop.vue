<template>
  <div class="shop">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful :title="shop.name" description="Shop page." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->
    <div class="contentContainer">
      <!-- Spinner -->
      <div v-show="loading" class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <!-- /Spinner -->

      <h1>{{ shop.name }}</h1>

      <!-- Social Media -->
      <nav class="social">
        <a
          v-show="shop.twitter"
          class="icon"
          :href="shop.twitter"
          target="_blank"
          rel="noopener noreferrer"
          ><font-awesome-icon :icon="['fab', 'twitter']"
        /></a>

        <a
          v-show="shop.facebook"
          class="icon"
          :href="shop.facebook"
          target="_blank"
          rel="noopener noreferrer"
          ><font-awesome-icon :icon="['fab', 'facebook']"
        /></a>

        <a
          v-show="shop.instagram"
          class="icon"
          :href="shop.instagram"
          target="_blank"
          rel="noopener noreferrer"
          ><font-awesome-icon :icon="['fab', 'instagram']"
        /></a>
      </nav>
      <!-- Social Media -->

      <video :src="shop.video" autoplay loop width="500px">
        Can not play.
      </video>
      <p>{{ shop.description }}</p>

      <!-- Product list -->
      <div class="productsList">
        <p v-show="!products.length && !loading">No products to show</p>
        <productcard
          v-for="product in products"
          :key="product.id"
          :product="product"
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

export default {
  name: "Shop",
  components: {
    menucustom,
    footercustom,
    productcard,
  },
  data() {
    return {
      loading: true,

      //Shop object
      shop: {},

      //Products array
      products: [],
    };
  },
  methods: {
    getShop() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/shops/" + self.$route.params.id)
        //Success
        .then(function(response) {
          console.log(response);
          self.shop = response.data.message;
          self.products = response.data.message.products;
          self.loading = false;
        })
        //Error
        .catch((error) => console.log(error));
    },
  },
  created() {
    this.getShop();
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 1rem;
}

.social {
  margin: 1rem;
}

.icon {
  font-size: 1.5rem;
  margin: 1rem;
}
</style>
