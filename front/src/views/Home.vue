<template>
  <div class="home">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Home" description="Crafty home page." />
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

      <!-- WEB DESCRIPTION -->
      <div class="description">
        <h1>Welcome to Crafty!</h1>
        <p>
          If you are searching for a unique item, this is your site!
        </p>
        <p>
          Here you can find lots of different handmade products, already
          searching for a forever home or made custom just for you!
        </p>
        <p>
          Are you an artist yourself? Great! You can find handmade art supplies
          too!
        </p>
        <router-link class="button" :to="{ name: 'Search' }" tag="button"
          >EXPLORE</router-link
        >
      </div>

      <!-- /WEB DESCRIPTION -->

      <!-- PROMOTED SHOP -->
      <div class="shop">
        <router-link :to="{ name: 'Shop', params: { id: shop.shopId } }">
          <span> Discover: </span>
          <h2>{{ shop.name }}</h2></router-link
        >
        <video :src="shop.video" autoplay loop>
          Can not play.
        </video>
        <p>
          <router-link
            tag="button"
            class="button"
            :to="{ name: 'Shop', params: { id: shop.shopId } }"
          >
            Visit Shop</router-link
          >
        </p>
      </div>
      <!-- /PROMOTED SHOP -->

      <!-- Products -->
      <div class="productsList">
        <p v-show="!products.length && !loading">No products to show</p>
        <productcard
          v-for="product in products"
          :key="product.id"
          :product="product"
        ></productcard>
      </div>
      <!-- /Products -->
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

export default {
  name: "Home",
  components: {
    menucustom,
    footercustom,
    productcard,
  },
  data() {
    return {
      //Promoted shop object
      shop: {},

      //Products array
      products: [],
      loading: true,
    };
  },
  methods: {
    getIndex() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL)
        //Success
        .then(function(response) {
          self.products = response.data.message.products;
          self.shop = response.data.message.promotedShop;
          self.loading = false;
        })
        //Error
        .catch((error) => console.log(error));
    },

    goToShop(id) {
      this.$router.push("/shop/" + id);
    },
  },
  created() {
    this.getIndex();
  },
};
</script>

<style scoped>
.shop {
  background: var(--block-bg-color);

  width: 90vw;
  max-width: 600px;
  padding: 1rem;
  border: var(--border);
  box-shadow: var(--shadow);
  border-radius: 1rem;
  margin: 1rem auto;
}

video {
  width: 100%;
}

.shop h2 {
  display: inline-block;
  margin-left: 0;
  padding: 0;
}

@media (min-width: 1000px) {
  .contentContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }

  .productsList {
    grid-column: span 2;
  }
}
</style>
