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
      <h1>About the creator</h1>
      <figure>
        <img src="../assets/fotoZoe.jpg" alt="Zoe Porta" />
      </figure>
      <div class="description">
        <p>
          Hi! I'm
          <a
            href="https://www.linkedin.com/in/zoeporta/"
            target="_blank"
            rel="noopener noreferrer"
            >Zoe Porta</a
          >
          and I love programming, but my hobby is to create things on different
          mediums. Currently I'm experimenting with clear resin.
        </p>

        <p>
          This site was created as the final proyect for
          <a
            href="https://hackaboss.com/"
            target="_blank"
            rel="noopener noreferrer"
            >HACK A BOSS</a
          >
          coding bootcamp, using
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

        <div class="tools">
          <ul class="resources">
            <h2>Resources:</h2>
            <li>
              <strong>Product pictures</strong> →
              <a
                href="https://unsplash.com/"
                target="_blank"
                rel="noopener noreferrer"
                >Unsplash</a
              >
              &&
              <a
                href="https://www.freepik.es/"
                target="_blank"
                rel="noopener noreferrer"
                >Freepik</a
              >.
            </li>
            <li>
              <strong>Videos</strong> →
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                >YouTube</a
              >.
            </li>
            <li>
              <strong>User photos</strong> →
              <a
                href="https://randomuser.me/"
                target="_blank"
                rel="noopener noreferrer"
                >Random User Generator</a
              >.
            </li>
            <li>
              <strong>Icons</strong> →
              <a
                href="https://fontawesome.com/"
                target="_blank"
                rel="noopener noreferrer"
                >Font Awesome</a
              >.
            </li>
            <li>
              <strong>Origami icon (logo)</strong> →
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                >Flaticon</a
              >.
            </li>
            <li>
              <strong>Error 404 illustration</strong> →
              <a
                href="https://stories.freepik.com/"
                target="_blank"
                rel="noopener noreferrer"
                >Stories by Freepik</a
              >.
            </li>
            <li>
              <strong>Fonts</strong> →
              <a
                href="https://fonts.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                >Google Fonts</a
              >.
            </li>
          </ul>

          <ul class="front">
            <h2>Front</h2>
            <li>
              <a
                href="https://vuejs.org/"
                target="_blank"
                rel="noopener noreferrer"
                >Vue</a
              >
            </li>
            <li>
              <a
                href="https://github.com/FortAwesome/vue-fontawesome"
                target="_blank"
                rel="noopener noreferrer"
                >Vue Font Awesome</a
              >
            </li>
            <li>
              <a
                href="https://github.com/axios/axios"
                target="_blank"
                rel="noopener noreferrer"
                >Axios</a
              >
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/dotenv"
                target="_blank"
                rel="noopener noreferrer"
                >Dotenv</a
              >
            </li>
            <li>
              <a
                href="https://github.com/auth0/jwt-decode#readme"
                target="_blank"
                rel="noopener noreferrer"
                >jwt-decode</a
              >
            </li>
            <li>
              <a
                href="https://sweetalert2.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                >SweetAlert2</a
              >
            </li>
            <li>
              <a
                href="https://github.com/troxler/vue-headful"
                target="_blank"
                rel="noopener noreferrer"
                >Vue-Headful</a
              >
            </li>
            <li>
              <a
                href="https://vue-multiselect.js.org/"
                target="_blank"
                rel="noopener noreferrer"
                >Vue-Multiselect</a
              >
            </li>
            <li>
              <a
                href="https://github.com/craigh411/vue-rate-it"
                target="_blank"
                rel="noopener noreferrer"
                >Vue-rate-it</a
              >
            </li>
            <li>
              <a
                href="https://animate.style/"
                target="_blank"
                rel="noopener noreferrer"
                >Animate.css</a
              >
            </li>
            <li>
              <a
                href="https://loading.io/css/"
                target="_blank"
                rel="noopener noreferrer"
                >Pure CSS Loader</a
              >
            </li>
          </ul>

          <ul class="back">
            <h2>Back</h2>
            <li>
              <a
                href="https://nodejs.org/"
                target="_blank"
                rel="noopener noreferrer"
                >Node</a
              >
            </li>
            <li>
              <a
                href="https://expressjs.com/es/"
                target="_blank"
                rel="noopener noreferrer"
                >Express</a
              >
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/mysql2"
                target="_blank"
                rel="noopener noreferrer"
                >MySQL2</a
              >
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/@hapi/joi"
                target="_blank"
                rel="noopener noreferrer"
                >Joi</a
              >
            </li>
            <li>
              <a
                href="https://sendgrid.com/"
                target="_blank"
                rel="noopener noreferrer"
                >SendGrid</a
              >
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/body-parser"
                target="_blank"
                rel="noopener noreferrer"
                >Body-Parser</a
              >
            </li>
            <li>
              <a
                href="https://expressjs.com/en/resources/middleware/cors.html"
                target="_blank"
                rel="noopener noreferrer"
                >CORS</a
              >
            </li>
            <li>
              <a
                href="https://date-fns.org/"
                target="_blank"
                rel="noopener noreferrer"
                >Date-fns</a
              >
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/dotenv"
                target="_blank"
                rel="noopener noreferrer"
                >Dotenv</a
              >
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/fs-extra"
                target="_blank"
                rel="noopener noreferrer"
                >fs-extra</a
              >
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/jsonwebtoken"
                target="_blank"
                rel="noopener noreferrer"
                >jsonwebtoken</a
              >
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/morgan"
                target="_blank"
                rel="noopener noreferrer"
                >Morgan</a
              >
            </li>
            <li>
              <a
                href="https://github.com/lovell/sharp"
                target="_blank"
                rel="noopener noreferrer"
                >Sharp</a
              >
            </li>
            <li>
              <a
                href="https://github.com/uuidjs/uuid"
                target="_blank"
                rel="noopener noreferrer"
                >uuid</a
              >
            </li>
            <li>
              <a
                href="https://github.com/marak/Faker.js/"
                target="_blank"
                rel="noopener noreferrer"
                >Faker</a
              >
            </li>
            <li>
              <a
                href="https://lodash.com/"
                target="_blank"
                rel="noopener noreferrer"
                >Lodash</a
              >
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/nodemon"
                target="_blank"
                rel="noopener noreferrer"
                >Nodemon</a
              >
            </li>
          </ul>
        </div>
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
p {
  margin: 1rem;
}

ul {
  width: fit-content;
  text-align: left;
  display: grid;
  margin: 1rem;
}

.tools {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
}

@media (max-width: 800px) {
  .tools {
    grid-template-columns: repeat(2, 1fr);
  }

  .resources {
    grid-column: span 2;
  }
}
</style>
