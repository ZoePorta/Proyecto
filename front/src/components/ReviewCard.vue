<template>
  <div class="ratings">
    <h1>Buyer reviews</h1>
    <table class="rating" v-for="(review, index) in reviews" :key="review.id">
      <thead>
        <tr>
          <th>
            <!-- stars -->
            <star-rating
              :rating="+review.rating"
              :increment="0.01"
              :read-only="true"
              :star-size="20"
              :show-rating="false"
            ></star-rating>
            <!-- /starts -->
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {{ review.comment }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "ReviewCard",
  props: {
    reviews: Array,
  },
};
</script>

<style scoped>
.ratings {
  background: cornsilk;
  color: blue;
  margin: 2rem 1rem;
  padding: 1rem;
  border-radius: 1rem;
}

.rating {
  margin-bottom: 1rem;
}
</style>
