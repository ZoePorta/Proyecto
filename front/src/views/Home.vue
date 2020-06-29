<template>
  <div class="home">
    <!-- CAMBIAR TITULO DE LA PÁGINA -->
    <vue-headful title="Home" description="Home." />
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

    <!-- Tienda promocionada -->
    <div @click="goToShop(shop.shopId)" class="shop">
      <h2>{{ shop.name }}</h2>
      <video :src="shop.video" autoplay width="500px">
        No se puede reproducir.
      </video>
    </div>
    <!-- /Tienda promocionada -->

    <!-- Presentación de la web -->
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nobis enim
      itaque porro impedit iste dicta, dolores, a ut blanditiis consequuntur
      excepturi pariatur delectus sunt cum iusto! Praesentium dolor nihil
      voluptatibus!
    </p>
    <!-- /Presentación de la web -->

    <router-link :to="{ name: 'Search' }" tag="button">EXPLORA</router-link>

    <!-- Productos destacados -->
    <h3>Productos destacados</h3>
    <productcard :products="products" v-on:buy="buyProduct"></productcard>
    <!-- Productos destacados -->

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

export default {
  name: "Home",
  components: {
    menucustom,
    footercustom,
    productcard,
  },
  data() {
    return {
      //Objeto de la tienda promocionada
      shop: {},

      //array de los productos de la bbdd
      products: [],
      loading: true,
    };
  },
  methods: {
    getIndex() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL)
        //si sale bien
        .then(function(response) {
          console.log(response);
          self.products = response.data.message.products;
          self.shop = response.data.message.promotedShop;
          self.loading = false;
        })
        //si sale mal
        .catch((error) => console.log(error));
    },

    goToShop(id) {
      this.$router.push("/shop/" + id);
    },

    buyProduct(index) {
      let product = this.products[index];

      Swal.fire({
        icon: "success",
        title: "¡Hecho!",
        text: `Has comprado ${product.nombre} por ${product.precio}€. En breve lo recibirás en tu casa.`,
      });

      console.log(product);
    },
  },
  created() {
    this.getIndex();
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
</style>
