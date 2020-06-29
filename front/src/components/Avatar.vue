<template>
  <div>
    <avataaars
      :circleColor="'#efefef'"
      :clotheColor="'Black'"
      :eyebrowType="'Default'"
      :eyeType="'Side'"
      :accessoriesType="'Blank'"
      :facialHairType="'Blank'"
      :graphicType="'Skull'"
      :mouthType="'Twinkle'"
      :skinColor="'Pale'"
      :topType="'LongHairBigHair'"
      :clotheType="'CollarSweater'"
      :hairColor="'BrownDark'"
    ></avataaars>
  </div>
</template>

<script>
import avataaars from "vuejs-avataaars";
export default {
  name: "Avatar",
  components: {
    avataaars,
  },
};
</script>

<style scoped>
div {
  width: 20rem;
  margin: 2rem auto;
}
</style>
