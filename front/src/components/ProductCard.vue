<template>
  <div id="productcard">
    <div class="container">
      <!-- Overlay to darken not available products -->
      <div
        class="products overlay"
        v-show="!product.available"
        @click="goToProduct(product.id)"
      ></div>
      <!-- /Overlay to darken not available products -->

      <div class="products">
        <article @click="goToProduct(product.id)">
          <figure>
            <img class="productImg" :src="product.photo" :alt="product.name" />

            <!-- Colored dot showing availability -->
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
            <!-- /Colored dot showing availability -->
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

          <!-- Rating -->
          <p class="ratingStars">
            <star-rating
              :rating="+product.avgRating || 0"
              :increment="0.01"
              :read-only="true"
              :star-size="20"
              :show-rating="false"
            ></star-rating>
            | {{ product.votes }}
          </p>
          <!-- /Rating -->

          <p class="price">{{ product.price }}€</p>
        </article>
      </div>
      <p class="delete" @click="deleteEvent()" v-show="showDelete">
        <font-awesome-icon icon="trash-alt" />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: Object,
    showDelete: {
      type: Boolean,
      default: false,
    },
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
    //Buy event emiting function
    deleteEvent() {
      //Sending product index to view
      this.$emit("delete");
    },

    //Go to product page function
    goToProduct(id) {
      this.$router.push({ name: "Product", params: { id: id } });
    },
  },
};
</script>

<style scoped>
/* Card */
.container {
  border-radius: 1rem;
  max-width: 800px;
  width: 15rem;
  height: 20rem;
  margin-bottom: 2rem;
  padding: 1rem;
  position: relative;
  background: var(--block-bg-color);

  overflow: hidden;

  border: var(--border);
  box-shadow: var(--shadow);
}

.products {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}

/* Availability overlay */
.overlay {
  opacity: 0.2;
  z-index: 1;

  background: rgb(0, 0, 0);
}
/* /Availability overlay */
/* /Card */

/* Color swatches */
.colorDiv {
  height: 1rem;
  width: 1rem;
  display: inline-block;
  color: var(--text-color);
  border: 1px solid var(--text-color);

  margin: 0.2rem;
  border-radius: 0.2rem;
}

.colorDiv p {
  height: 100%;
  width: 100%;
  margin: 0;
  font-size: 0.8rem;
}
/* /Color swatches */

/* Availability dot */
.availability {
  height: 0.8rem;
  width: 0.8rem;
  position: absolute;
  top: 8px;
  right: 10px;
  border: 1px solid var(--text-color);
  border-radius: 50%;
}
/* /Availability dot */

/* Product name */
h1 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
}
/* /Product name */

/* Product photo */
figure {
  width: 100%;

  height: 10rem;
  overflow: hidden;

  top: 0;
  left: 0;
  text-align: center;
  margin-bottom: 0.5rem;
}

img.productImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* Product photo */

.price {
  font-size: 1rem;
}

/* Delete button */
.delete {
  z-index: 2;
  position: absolute;
  bottom: 8px;
  width: 1rem;
  cursor: pointer;
}
/* /Delete button */
</style>
