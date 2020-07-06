<template>
  <div class="product">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful :title="product.name" description="Product page." />
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
      <div class="title">
        <h1>{{ product.name }}</h1>
        <router-link :to="{ name: 'Shop', params: { id: product.shopId } }">
          <h2>{{ product.shopName }}</h2></router-link
        >
      </div>
      <figure>
        <img :src="product.photo" :alt="product.name" />
      </figure>
      <div class="info">
        <p class="description">{{ product.description }}</p>
        <p
          class="availability"
          :style="{
            color: !product.available
              ? red
              : product.type === 'ready'
              ? green
              : orange,
          }"
        >
          ● {{ !product.available ? "Not available" : product.type }}
        </p>

        <p class="ratingStars">
          <image-rating
            :src="icon"
            :rating="+product.avgRating || 0"
            :increment="0.5"
            :read-only="true"
            :item-size="30"
            :show-rating="false"
          ></image-rating>
          | {{ product.votes }}
        </p>

        <p class="price">{{ product.price }}€</p>

        <button
          class="button"
          @click="addToCart()"
          :disabled="!product.available"
        >
          ADD TO CART
        </button>
        <button class="button" @click="addToWishlist()">
          ADD TO WISHLIST
        </button>
      </div>
      <!-- REVIEWS -->

      <div class="reviews">
        <reviewcard v-if="reviews[0]" :reviews="reviews"></reviewcard>
        <p v-else>No reviews to show.</p>
      </div>
      <!-- /REVIEWS -->

      <!-- RELATED PRODUCTS-->
      <div class="productsList">
        <p v-show="!products.length && !loading">No products to show.</p>
        <productcard
          v-for="product in products"
          :key="product.id"
          :product="product"
        ></productcard>
      </div>
      <!-- /RELATED PRODUCTS-->
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
import reviewcard from "@/components/ReviewCard.vue";

//Importing library
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Product",
  components: {
    menucustom,
    footercustom,
    productcard,
    reviewcard,
  },
  data() {
    return {
      loading: true,

      //Product object
      product: {},

      //Reviews array
      reviews: [],

      //Related products array
      products: [],

      /* Availability colors */
      red: "#d1345b",
      green: "#34d1bf",

      orange: "orange",

      //Rating icon
      icon: process.env.VUE_APP_ICON,
    };
  },
  methods: {
    //Get product info function
    getProduct() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/products/" + self.$route.params.id)
        //Success
        .then(function(response) {
          console.log(response);
          self.product = response.data.product;
          self.reviews = response.data.ratings;
          self.products = response.data.relatedProducts;
          self.loading = false;
        })
        //Error
        .catch((error) => console.log(error));
    },

    //Add product to cart function
    addToCart() {
      var self = this;
      axios
        .post(
          process.env.VUE_APP_API_URL + "/orders/cart/" + self.$route.params.id
        )
        .then(function(response) {
          //Success: confirmation modal
          Swal.fire({
            icon: "success",
            title: "Producto añadido",

            showCancelButton: true,

            cancelButtonText: "Seguir comprando",

            confirmButtonText: "Shopping cart",

            buttonsStyling: false,
          }).then((result) => {
            //Go to shopping cart
            if (result.value) {
              self.$router.push("/cart");
            }
          });
        })
        .catch((error) => {
          console.log(error.response.status, error.response.data.message);
          if (error.response.status === 401) {
            //User not logged error
            this.swalLogin();
          }
        });
    },

    //Add product to wishlist function
    addToWishlist() {
      var self = this;

      axios
        .post(
          process.env.VUE_APP_API_URL + "/wishlist/" + self.$route.params.id
        )
        .then(function(response) {
          //Success: confirmation modal
          Swal.fire({
            icon: "success",
            title: "Product added to your wishlist",

            confirmButtonText: "Ok",

            buttonsStyling: false,
          });
        })
        .catch((error) => {
          //Error: error modals
          console.log(error.response.status, error.response.data.message);
          if (error.response.status === 409) {
            //Duplicated product error
            Swal.fire({
              icon: "error",
              title: "Product already in your wishlist",

              confirmButtonText: "Ok",

              buttonsStyling: false,
            });
          } else if (error.response.status === 401) {
            //User not logged error
            this.swalLogin();
          }
        });
    },

    //User not logged modal
    swalLogin() {
      Swal.fire({
        icon: "error",
        title: "You are not logged.",

        showCancelButton: true,

        cancelButtonText: "Later...",

        confirmButtonText: "Login now",

        buttonsStyling: false,
      }).then((result) => {
        //Go to login
        if (result.value) {
          this.$router.push("/login");
        }
      });
    },
  },
  created() {
    this.getProduct();
  },
  watch: {
    //If route params changes, change product page
    $route() {
      this.$router.go();
    },
  },
};
</script>

<style scoped>
img {
  width: 500px;
  max-width: 90vw;
  margin: 1rem;
  border: var(--border);
  box-shadow: var(--shadow);
  border-radius: 1rem;
}

.ratingStars {
  margin: 1rem;
}

.price {
  font-size: 2rem;
}

@media (min-width: 1000px) {
  .contentContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    grid-template-areas:
      "img title"
      "img info";
  }

  figure {
    grid-area: img;
  }

  .title {
    grid-area: title;
    align-self: flex-end;
  }

  .info {
    grid-area: info;
    align-self: flex-start;
  }

  .productsList,
  .reviews {
    grid-column: span 2;
  }
}
</style>
