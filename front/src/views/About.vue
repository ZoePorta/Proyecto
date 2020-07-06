<template>
  <div class="about">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="About" description="About me." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->
    <div class="contentContainer">
      <h1>About</h1>
      <figure>
        <img src="../assets/fotoZoe.jpg" alt="Zoe Porta" />
      </figure>
      <div class="description">
        <p>
          This site was created by
          <a
            href="https://www.linkedin.com/in/zoeporta/"
            target="_blank"
            rel="noopener noreferrer"
            >Zoe Porta</a
          >
          as the final proyect for
          <a
            href="https://hackaboss.com/"
            target="_blank"
            rel="noopener noreferrer"
            >HACK A BOSS</a
          >
          coding bootcamp,
        </p>
        <p>
          using
          <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer"
            >Vue</a
          >
          for the frontend,
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
            >Node</a
          >
          for the backend and
          <a
            href="https://www.mysql.com/"
            target="_blank"
            rel="noopener noreferrer"
            >MySQL</a
          >
          for the database.
        </p>
      </div>
    </div>
    <!-- /CONTENT -->

    <!-- FOOTER -->
    <footercustom></footercustom>
    <!-- /FOOTER -->
  </div>
</template>

<script>
// @ is an alias to /src
//Importing components
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";

//Importing library
import axios from "axios";

export default {
  name: "about",
  components: {
    menucustom,
    footercustom,
  },
};
</script>

<style scoped>
img {
  width: 20rem;
  max-width: 80vw;
  border-radius: 50%;
  border: var(--border);
  box-shadow: var(--shadow);
}
</style>
