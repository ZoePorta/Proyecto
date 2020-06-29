<template>
  <div>
    <!-- CAMBIAR TITULO DE LA PÁGINA -->
    <vue-headful title="Login" description="Formulario de acceso." />
    <!-- /CAMBIAR TITULO DE LA PAGINA -->

    <!-- CONTENIDO -->
    <h2>
      Haz login 👇
    </h2>

    <div class="form">
      <input type="text" placeholder="Escribe tu email" v-model="email" />
      <input
        type="password"
        placeholder="Escribe tu contraseña"
        v-model="password"
      />
      <button class="boton" @click="login()">
        ENTRAR
      </button>

      <p>
        ¿Aún no tienes cuenta?
        <router-link :to="{ name: 'Register' }">¡Regístrate!</router-link>
      </p>
    </div>
    <!-- /CONTENIDO -->

    <!-- FOOTER -->
    <footercustom></footercustom>
    <!-- /FOOTER -->
  </div>
</template>

<script>
//Importando componentes
import footercustom from "@/components/FooterCustom.vue";

//Importando funciones
import { loginUser } from "../api/utils";

import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Login",
  components: {
    footercustom,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        //INTENTO HACER LOGIN
        await loginUser(this.email, this.password);
        //SI HAY LOGIN, QUE ME LLEVE AL LANDING
        this.$router.push("/");
      } catch (error) {
        if (error.response.status === 500) {
          Swal.fire({
            icon: "error",
            title: "Server error",
            text: "Try again later.",

            confirmButtonText: "Ok",
          });
        } else if (error.response.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Account not verified",
            text:
              "Please verify your account. Verification email may be in the spam folder.",

            showCancelButton: true,
            cancelButtonText: "Ok",
            confirmButtonText: "Resend email",
          }).then((result) => {
            if (result.value) {
              console.log("ok");
              this.resendMail();
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Wrong email or password.",

            confirmButtonText: "Ok",
          });
        }
      }
    },

    resendMail() {
      console.log("enviando");
      const self = this;
      axios
        .post(process.env.VUE_APP_API_URL + "/users/resendmail", {
          email: self.email,
        })
        .then(
          Swal.fire({
            icon: "success",
            title: "Email sent.",
            text: "Please, check your spam folder.",
            confirmButtonText: "Go to Home",
          }).then(
            //Go to the index page
            (result) => self.$router.push("/")
          )
        )
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style scooped>
h2 {
  padding: 2rem;
}

.form {
  padding: 2rem;
  width: 80%;
  max-width: 30rem;
  margin: auto;
  border-radius: 1rem;
  background: #efefef;
  color: #070707;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

input {
  width: 80%;
  max-width: 15rem;
  height: 2rem;
  margin-bottom: 1rem;
}

p {
  margin-top: 1rem;
}
</style>
