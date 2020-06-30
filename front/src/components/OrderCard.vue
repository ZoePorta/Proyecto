<template>
  <div class="order">
    <table>
      <tbody>
        <tr>
          <td>
            <router-link
              :to="{ name: 'Product', params: { id: product.productId } }"
            >
              <img :src="product.photo" alt="" />
            </router-link>
          </td>
          <td>
            <router-link
              :to="{ name: 'Product', params: { id: product.productId } }"
              tag="h1"
              >{{ product.name }}</router-link
            >
            <p>{{ product.price }}€ x {{ product.quantity }}</p>
            <h2>{{ product.price * product.quantity }}€</h2>
          </td>
          <td>
            <p>Rate it</p>
            <star-rating :increment="0.5" v-model="rating"></star-rating>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
//Importando librería
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
  watch: {
    rating() {
      if (this.rating !== +this.product.rating) {
        Swal.fire({
          icon: "success",
          title: "Add a comment",
          input: "text",
          showCancelButton: true,

          confirmButtonText: "Rate!",
        }).then((result) => {
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
            this.rating = +this.product.rating;
          }
        });
      }
    },
  },
  created() {
    this.rated = this.product.rating !== null;
  },
  methods: {
    newRating(url) {
      const self = this;
      axios
        .post(url, {
          rating: self.rating,
          comment: self.comment,
        })
        //Success
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

    changeRating(url) {
      const self = this;
      axios
        .put(url, {
          rating: self.rating,
          comment: self.comment,
        })
        //Success
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
};
</script>

<style scoped>
img {
  width: 10rem;
}
</style>
