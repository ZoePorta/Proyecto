<template>
  <div class="search">
    <!-- CAMBIAR TITULO DE LA PÁGINA -->
    <vue-headful title="Búsqueda" description="Información de la tienda." />
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

    <!-- Search form -->
    <form>
      <!-- By key words -->
      <input
        type="text"
        placeholder="Crystal crown..."
        v-model="search.words"
      />

      <!-- By category -->
      <select name="category" id="category" v-model="search.category">
        <option value>--Category--</option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.category"
          >{{ category.category }}</option
        >
      </select>

      <!-- By type -->
      <select name="type" id="type" v-model="search.type">
        <option value>-- Type --</option>
        <option value="ready">Ready</option>
        <option value="custom">Custom</option>
      </select>

      <!-- By availability -->
      <input
        type="checkbox"
        id="available"
        value="available"
        v-model="search.available"
      />
      <label for="available">Available only</label>

      <!-- By price -->
      <!-- Max -->
      <label for="maxPrice">Max price</label>
      <input
        type="range"
        id="maxPrice"
        name="maxPrice"
        :min="searchDefault.minPrice"
        :max="searchDefault.maxPrice"
        v-model="search.maxPrice"
      />
      {{ search.maxPrice }}€

      <!-- Min -->
      <label for="minPrice">Min price</label>
      <input
        type="range"
        id="minPrice"
        name="minPrice"
        :min="searchDefault.minPrice"
        :max="searchDefault.maxPrice"
        v-model="search.minPrice"
      />
      {{ search.minPrice }}€

      <!-- By rating -->
      <star-rating :increment="0.5" v-model="search.rating"></star-rating>

      <!-- By color -->
      <multiselect
        v-model="search.colors"
        placeholder="Color..."
        label="name"
        track-by="name"
        :multiple="true"
        :options="colors"
        :option-height="104"
        :searchable="false"
        :close-on-select="false"
      >
        <template slot="option" slot-scope="props">
          <div
            class="option__desc"
            :style="{
              background: props.option.color,
            }"
          >
            <!-- <p v-if="props.option.color === 'other'">{{ "?" }}</p> -->
            <p
              :style="{
                visibility:
                  props.option.name === 'other' ? 'visible' : 'hidden',
              }"
            >
              ?
            </p>
          </div>
        </template>
      </multiselect>
    </form>

    <!-- /Formulario de búsqueda -->
    <button @click="resetSearch()">CLEAR</button>

    <!-- Lista de productos -->
    <p v-show="!filterProducts.length">No products to show</p>
    <productcard
      v-for="product in filterProducts"
      :key="product.id"
      :product="product"
    ></productcard>
    <!-- /Lista de productos -->

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

import Multiselect from "vue-multiselect";

//Importando librería
import axios from "axios";

export default {
  name: "Search",
  components: {
    menucustom,
    footercustom,
    productcard,
    Multiselect,
  },
  data() {
    return {
      loading: true,

      //objeto tienda de la bbdd
      products: [],

      //Lista de categorías
      categories: [],

      //Lista de posibles colores
      colors: [
        {
          name: "black",
          color: "black",
          text: " ",
        },
        {
          name: "white",
          color: "white",
          text: " ",
        },
        {
          name: "gray",
          color: "gray",
          text: " ",
        },
        {
          name: "red",
          color: "red",
          text: " ",
        },
        {
          name: "blue",
          color: "blue",
          text: " ",
        },
        {
          name: "green",
          color: "green",
          text: " ",
        },
        {
          name: "yellow",
          color: "yellow",
          text: " ",
        },
        {
          name: "purple",
          color: "purple",
          text: " ",
        },
        {
          name: "orange",
          color: "orange",
          text: " ",
        },
        {
          name: "brown",
          color: "brown",
          text: " ",
        },
        {
          name: "pink",
          color: "pink",
          text: " ",
        },
        {
          name: "multiple",
          color: `linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
            linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
            linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)`,
          text: " ",
        },
        {
          name: "other",
          color: "white",
          text: "?",
        },
      ],

      //Default search object
      searchDefault: {
        available: false,
        words: "",
        maxPrice: 1000,
        minPrice: 0,
        category: "",
        type: "",
        rating: 0,
        colors: [],
      },

      //Search object v-model
      search: {
        available: false,
        words: "",
        maxPrice: 1000,
        minPrice: 0,
        category: "",
        type: "",
        rating: 0,
        colors: [],
      },
    };
  },
  methods: {
    getProducts() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/products")
        //si sale bien
        .then(function(response) {
          console.log(response);
          self.products = response.data.result;
          self.categories = response.data.categories;
          self.loading = false;
        })
        //si sale mal
        .catch((error) => console.log(error));
    },
    customLabel({ name, color }) {
      return name;
    },

    resetSearch() {
      for (const key in this.search) {
        this.search[key] = this.searchDefault[key];
      }
    },
  },
  created() {
    this.getProducts();
    this.resetSearch();
  },

  computed: {
    filterProducts() {
      let result = this.products;
      let search = this.search;

      /* By category */
      if (search.category) {
        result = result.filter(
          (product) => product.category === search.category
        );
      }

      /* By type */
      if (search.type) {
        result = result.filter((product) => product.type === search.type);
        console.log(search.type);
      }

      /* By max price */
      if (Number(search.maxPrice) < this.searchDefault.maxPrice) {
        result = result.filter(
          (product) => Number(product.price) <= Number(search.maxPrice)
        );
      }

      /* By min price */
      if (Number(search.minPrice) > this.searchDefault.minPrice) {
        result = result.filter(
          (product) => Number(product.price) >= Number(search.minPrice)
        );
      }

      /* By key words */
      if (search.words) {
        const wordArray = search.words.split(" ");
        for (const word of wordArray) {
          result = result.filter(
            (product) =>
              product.name.toLowerCase().includes(word.toLowerCase()) ||
              product.description.toLowerCase().includes(word.toLowerCase())
          );
        }
      }

      /* By color */
      if (search.colors.length) {
        let searchColorArray = [];
        for (const color of search.colors) {
          searchColorArray.push(color.name);
        }
        const comparer = (boolean, color) =>
          searchColorArray.includes(color) || boolean;
        result = result.filter((product) => {
          const productColorArray = product.color.split(",");
          return productColorArray.reduce(comparer, false);
        });
      }

      /* By rating */
      if (search.rating) {
        result = result.filter(
          (product) => Number(product.avgRating) >= search.rating
        );
      }

      /* By availability */
      if (search.available) {
        result = result.filter((product) => product.available);
      }

      return result;
    },
  },
};
</script>

<style scoped>
.option__desc {
  height: 2rem;
  width: 2rem;

  color: black;
  border: 1px solid black;
  margin: 0.2rem;

  border-radius: 0.5rem;
}

.option__desc p {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
</style>
