<template>
  <div class="ratings">
    <h1>Buyer reviews</h1>
    <table class="rating" v-for="review in reviews" :key="review.id">
      <thead>
        <tr>
          <th>
            <!-- stars -->
            <image-rating
              :src="icon"
              :rating="+review.rating"
              :increment="0.01"
              :read-only="true"
              :item-size="20"
              :show-rating="false"
            ></image-rating>
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
  data() {
    return {
      //Rating icon
      icon: process.env.VUE_APP_ICON,
    };
  },
};
</script>

<style scoped>
.ratings {
  background: var(--block-bg-color);

  margin: 2rem 1rem;
  padding: 1rem;
  border-radius: 1rem;
  border: var(--border);
  box-shadow: var(--shadow);
}

.rating {
  margin-bottom: 1rem;
}
</style>
