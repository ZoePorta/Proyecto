<template>
  <div class="product">
    <!-- CAMBIAR TITULO DE LA PÁGINA -->
    <vue-headful title="Producto" description="Información del producto." />
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

    <h1>{{ product.name }}</h1>
    <router-link
      :to="{ name: 'Shop', params: { id: product.shopId } }"
      tag="h2"
      >{{ product.shopName }}</router-link
    >
    <p>{{ product.description }}</p>
    <figure>
      <img :src="product.photo" :alt="product.name" />
      <p
        class="disponibilidad"
        :class="{
          green: product.available,
          red: !product.available,
        }"
      >
        ● {{ product.available ? "Disponible" : "No disponible" }}
      </p>
    </figure>

    <star-rating
      :rating="+product.avgRating || 0"
      :increment="0.5"
      :read-only="true"
      :star-size="30"
    ></star-rating>

    <p class="precio">{{ product.price }}€</p>

    <button class="addToCartButton" @click="addToCart()">ADD TO CART</button>
    <button class="wishlistButton" @click="addToWishlist()">
      ADD TO WISHLIST
    </button>

    <!-- Comentarios -->

    <h2>Opiniones de otros clientes</h2>
    <reviewcard v-if="reviews[0]" :reviews="reviews"></reviewcard>
    <p v-else>Aún no hay opiniones.</p>
    <!-- /Comentarios -->

    <!-- Lista de productos relacionados-->
    <productcard :products="products"></productcard>

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
import reviewcard from "@/components/ReviewCard.vue";

//Importando librería
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Shop",
  components: {
    menucustom,
    footercustom,
    productcard,
    reviewcard,
  },
  data() {
    return {
      loading: true,

      //objeto tienda de la bbdd
      product: {},

      //Array de opiniones
      reviews: [],

      //Array de productos relacionados
      products: [],
    };
  },
  methods: {
    //Funcion para obtener la información del producto
    getProduct() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/products/" + self.$route.params.id)
        //si sale bien
        .then(function(response) {
          console.log(response);
          self.product = response.data.product;
          self.reviews = response.data.ratings;
          self.products = response.data.relatedProducts;
          self.loading = false;
        })
        //si sale mal
        .catch((error) => console.log(error));
    },

    //Función para añadir el producto al carrito
    addToCart() {
      var self = this;
      console.log(self.$route.params.id);
      axios
        .post(
          process.env.VUE_APP_API_URL + "/orders/cart/" + self.$route.params.id
        )
        .then(function(response) {
          console.log(response);

          //Lanzar modal de confirmación
          Swal.fire({
            icon: "success",
            title: "Producto añadido",

            showCancelButton: true,

            cancelButtonText: "Seguir comprando",

            confirmButtonText: "Volver al inicio",
          }).then((result) => {
            //Ir a la página de inicio
            if (result.value) {
              self.$router.push("/");
            }
          });
        })
        .catch((error) =>
          console.log(error.response.status, error.response.data.message)
        );
    },

    //Función para añadir el producto a la lista de deseos
    addToWishlist() {
      var self = this;
      console.log(self.$route.params.id);

      axios
        .post(
          process.env.VUE_APP_API_URL + "/wishlist/" + self.$route.params.id
        )
        .then(function(response) {
          //Lanzar modal de confirmación
          Swal.fire({
            icon: "success",
            title: "Producto añadido",

            confirmButtonText: "¡Vale!",
          });
        })
        .catch((error) =>
          console.log(error.response.status, error.response.data.message)
        );
    },
  },
  created() {
    this.getProduct();
  },
  watch: {
    $route() {
      this.$router.go();
    },
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;

  background: rgba(0, 0, 0, 0.5);

  width: 100%;
}

/* formulario */
.modalBox {
  padding: 2rem 1rem;
  width: 80%;
  max-width: 30rem;
  margin: 10rem auto;
  border-radius: 1rem;
  border: 1px solid #888888;
  background: #efefef;
  color: #070707;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

img {
  width: 500px;
}

input {
  width: 80%;
  max-width: 15rem;
  height: 2rem;
  margin-bottom: 1rem;
}

.buttons {
  widows: 100%;
  display: flex;
  justify-content: space-around;
}

button {
  margin: 2rem 1rem;
  margin-bottom: 0;
}
</style>
