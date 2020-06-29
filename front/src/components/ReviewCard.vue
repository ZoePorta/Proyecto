<template>
  <div class="clientes">
    <table v-for="(review, index) in reviews" :key="review.id">
      <thead>
        <tr>
          <th>{{ review.rating }}</th>
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

<style scoped></style>
