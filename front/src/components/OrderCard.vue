<template>
  <div class="ordercard">
    <router-link
      class="img"
      tag="figure"
      :to="{ name: 'Product', params: { id: product.productId } }"
    >
      <img :src="product.photo" :alt="product.name"
    /></router-link>
    <router-link
      class="name"
      :to="{ name: 'Product', params: { id: product.productId } }"
      tag="h1"
      >{{ product.name }}</router-link
    >
    <div class="info">
      <p>{{ product.price }}€ x {{ product.quantity }}</p>
      <h2>{{ (product.price * product.quantity).toFixed(2) }}€</h2>
    </div>
    <div class="rate">
      <p>Rate it!</p>
      <image-rating
        :src="icon"
        class="ratingStars"
        :increment="0.5"
        :item-size="30"
        v-model="rating"
        :show-rating="false"
      ></image-rating>
    </div>
  </div>
</template>

<script>
//Importing library
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "OrderCard",
  components: {},
  props: {
    product: Object,
  },

  data() {
    return {
      //Current user's rating for this product
      rating: +this.product.rating,
      comment: "",

      //User has voted this product
      rated: false,

      //Rating url
      url:
        process.env.VUE_APP_API_URL +
        "/products/" +
        this.product.productId +
        "/rate",

      //Rating icon
      icon: process.env.VUE_APP_ICON,
    };
  },

  methods: {
    //Save new rating to DB
    newRating(url) {
      const self = this;
      axios
        .post(url, {
          rating: self.rating,
          comment: self.comment,
        })
        //Success: confirmation modal
        .then(function(response) {
          Swal.fire({
            icon: "success",
            title: "Thank you!",
            text: `You have rated ${self.product.name} with ${self.rating}/5!`,

            confirmButtonText: "Ok",
          });
        })
        //Error
        .catch((error) => console.log(error));
    },

    //Update DB rating
    changeRating(url) {
      const self = this;
      axios
        .put(url, {
          rating: self.rating,
          comment: self.comment,
        })
        //Success: confirmation modal
        .then(function(response) {
          Swal.fire({
            icon: "success",
            title: "Thank you!",
            text: `You changed ${self.product.name} rating to ${self.rating}/5!`,

            confirmButtonText: "Ok",
          });
        })
        //Error
        .catch((error) => console.log(error));
    },
  },

  watch: {
    rating() {
      //If rating changes, save change
      if (this.rating !== +this.product.rating) {
        Swal.fire({
          //Open modal with text input
          icon: "success",
          title: "Add a comment",
          input: "text",
          inputPlaceholder: "Write your opinion",
          showCancelButton: true,

          confirmButtonText: "Rate!",
        }).then((result) => {
          //User press save
          if (result.isConfirmed) {
            //Set comment
            this.comment = result.value || " ";

            //Send rating
            if (this.rated) {
              //If user alrady rated it
              this.changeRating(this.url);
            } else {
              //If user didn't rate it before
              this.newRating(this.url);
            }
            location.reload();
          } else {
            //User press cancel
            this.rating = +this.product.rating;
          }
        });
      }
    },
  },

  created() {
    this.rated = this.product.rating !== null;
  },
};
</script>

<style scoped>
.ordercard {
  background: var(--block-bg-color);

  padding: 1rem;
  border: var(--border);
  border-radius: 1rem;
  margin: 1rem auto;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  grid-template-areas:
    "img name rate"
    "img info rate";
}

h1 {
  font-size: 1.5rem;
}

figure {
  width: 100%;
  /*   min-width: 10rem; */

  height: 15rem;
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}

.name {
  grid-area: name;
}

.img {
  grid-area: img;
  height: 10rem;
}

.info {
  grid-area: info;
}

.rate {
  grid-area: rate;
}

@media (max-width: 800px) {
  .ordercard {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas:
      "name"
      "img "
      "info"
      "rate ";
    align-items: center;
    justify-items: center;
  }
}
</style>
