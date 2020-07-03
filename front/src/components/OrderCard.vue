<template>
  <div class="ordercard">
    <table>
      <tbody>
        <tr>
          <td>
            <router-link
              :to="{ name: 'Product', params: { id: product.productId } }"
            >
              <figure><img :src="product.photo" alt="" /></figure
            ></router-link>
          </td>
          <td>
            <router-link
              :to="{ name: 'Product', params: { id: product.productId } }"
              tag="h1"
              >{{ product.name }}</router-link
            >
            <p>{{ product.price }}€ x {{ product.quantity }}</p>
            <h2>{{ (product.price * product.quantity).toFixed(2) }}€</h2>
          </td>
          <td>
            <p>Rate it!</p>
            <star-rating
              class="ratingStars"
              :increment="0.5"
              :star-size="30"
              v-model="rating"
              :show-rating="false"
            ></star-rating>
          </td>
        </tr>
      </tbody>
    </table>
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
img {
  width: 10rem;
}

table {
  background: var(--block-bg-color);
  width: 100%;
  margin: auto;
  padding: 1rem;
  border: var(--border);
}

table {
  border-radius: 1rem;
  margin: 1rem auto;
}
tr {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 1.5rem;
}

figure {
  width: 100%;
  min-width: 10rem;

  height: 15rem;
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}
</style>
