<template>
  <div class="shop">
    <!-- CAMBIAR TITULO DE LA PÁGINA -->
    <vue-headful title="Tienda" description="Información de la tienda." />
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

    <h1>{{ shop.name }}</h1>
    <video :src="shop.video" autoplay width="500px">
      No se puede reproducir.
    </video>
    <p>{{ shop.description }}</p>

    <!-- Lista de productos -->
    <productcard :products="shop.products"></productcard>

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

      //objeto tienda de la bbdd
      shop: {},
    };
  },
  methods: {
    getShop() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/shops/" + self.$route.params.id)
        //si sale bien
        .then(function(response) {
          console.log(response);
          self.shop = response.data.message;
          self.loading = false;
        })
        //si sale mal
        .catch((error) => console.log(error));
    },
  },
  created() {
    this.getShop();
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
