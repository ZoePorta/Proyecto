<template>
  <div id="list">
    <p v-show="!products.length">No hay productos que mostrar.</p>
    <article
      class="products"
      v-for="(product, index) in products"
      :key="product.id"
      @click="goToProduct(index)"
    >
      <figure>
        <img :src="product.photo" :alt="product.name" />
        <div
          class="availability"
          :style="{
            background: !product.available
              ? red
              : product.type === 'ready'
              ? green
              : orange,
          }"
        ></div>
      </figure>

      <!-- Color swatches -->
      <div
        v-for="color in product.color.split(',')"
        :key="color.id"
        class="colorDiv"
        :style="{
          background:
            color === 'other'
              ? `white`
              : color === 'multiple'
              ? `linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
            linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
            linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)`
              : color,
        }"
      >
        <p
          :style="{
            visibility: color === 'other' ? 'visible' : 'hidden',
          }"
        >
          ?
        </p>
      </div>
      <!-- /Color swatches -->

      <h1>{{ product.name }}</h1>

      <star-rating
        :rating="+product.avgRating || 0"
        :increment="0.5"
        :read-only="true"
        :star-size="20"
      ></star-rating>
      <p class="precio">{{ product.price }}€</p>
    </article>
  </div>
</template>

<script>
export default {
  name: "ClienteCard",
  props: {
    products: Array,
  },
  data() {
    return {
      /* Availability colors */
      red: "#d1345b",
      green: "#34d1bf",

      orange: "orange",
    };
  },
  methods: {
    //Funcion que emite un evento para comprar un producto
    buyEvent(index) {
      //Enviando el índice del producto a la vista
      this.$emit("buy", index);
    },

    //Función para ir a la página del producto
    goToProduct(index) {
      const id = this.products[index].id;
      this.$router.push({ name: "Product", params: { id: id } });
    },
  },
};
</script>

<style scoped>
.colorDiv {
  height: 1rem;
  width: 1rem;
  display: inline-block;
  color: black;
  border: 1px solid black;
  margin: 0.2rem;
  border-radius: 0.2rem;
}

.availability {
  height: 0.8rem;
  width: 0.8rem;
  position: absolute;
  top: 8px;
  right: 10px;
  border: 1px solid black;
  border-radius: 50%;
}

#list {
  display: grid;
}

.products {
  display: inline-block;
  background: #efefef;
  color: #070707;
  border-radius: 1rem;
  max-width: 800px;
  width: 15rem;
  height: 20rem;
  margin: 1rem;
  padding: 1rem;
  /*   display: grid;
  grid-template-columns: 1fr 8rem;
  grid-template-rows: repeat(6, minmax(min-content, auto));
  grid-template-areas:
    "nombre  id"
    "imagen imagen"
    "precio precio"
    "descripcion descripcion"
    "stock disponibilidad"
    "comprar comprar";
  align-items: center;
  justify-items: center; */
}

.products:hover {
  cursor: pointer;
}

/* h1 {
  grid-area: nombre;
  position: relative;
  left: 4rem;
  margin-bottom: 1rem;
} */

figure {
  grid-area: imagen;

  width: 100%;

  height: 10rem;
  overflow: hidden;

  position: relative;
  text-align: center;
  color: white;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5%;
}

/* .precio {
  grid-area: precio;
  font-size: 5rem;
  align-self: flex-start;
} */

/* MEDIA QUERIES */
/* @media (min-width: 700px) {
  .products {
    height: 25rem;

    grid-template-columns: 1fr 1fr 8rem;
    grid-template-rows: 3rem 3rem 1fr 3rem;
    grid-template-areas:
      "nombre nombre id"
      "imagen precio disponibilidad"
      "imagen descripcion descripcion"
      "imagen stock comprar";
  }

  figure {
    height: 100%;

    min-width: 20rem;
  }

  .stock {
    justify-self: center;
  }
} */
</style>
