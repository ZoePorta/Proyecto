<template>
  <div>
    <!-- CAMBIAR TITULO DE LA PÁGINA -->
    <vue-headful title="Registro" description="Página de registro." />
    <!-- /CAMBIAR TITULO DE LA PAGINA -->

    <!-- CONTENIDO -->
    <h2>
      Regístrate 👇
    </h2>

    <!-- FORMULARIO -->
    <div class="form">
      <p class="error" v-show="errorMessage">{{ errorMessage }}</p>

      <!-- Email -->
      <label for="email">Email:</label>
      <input
        type="text"
        name="email"
        placeholder="Tu email..."
        v-model="email"
      />
      <br />

      <!-- Contraseña -->
      <label for="password">Contraseña:</label>
      <input
        type="password"
        name="password"
        min="6"
        max="20"
        placeholder="Contraseña..."
        v-model="password"
      />
      <br />

      <!-- Repetir contraseña -->
      <label for="repeatPassword">Repite la contraseña:</label>
      <input
        type="password"
        name="repeatPassword"
        placeholder="Contraseña..."
        v-model="repeatPassword"
      />
      <br />

      <!-- Fecha de nacimiento -->
      <label for="birthDate">Fecha de nacimiento:</label>
      <input
        type="date"
        name="birthDate"
        v-model="birthDate"
        :max="getMaxDate()"
      />

      <button class="boton" @click="registerUser(email, password)">
        REGISTRAR
      </button>
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

//Importando librería
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Register",
  components: {
    footercustom,
  },
  data() {
    return {
      email: "",
      password: "",
      repeatPassword: "",
      birthDate: "",

      errorMessage: "",
      correctData: false,
    };
  },
  methods: {
    validatingData() {
      if (
        !this.email ||
        !this.password ||
        !this.repeatPassword ||
        !this.birthDate
      ) {
        this.errorMessage = "Tienes datos aún por rellenar."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else if (this.password.length < 6 || this.password.length > 20) {
        this.errorMessage =
          "La contraseña debe tener entre 6 y 20 caracteres.."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else if (this.password !== this.repeatPassword) {
        this.errorMessage = "Las contraseñas no coinciden."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else {
        console.log("enviar");
        this.correctData = true; //ENVIAR
        this.errorMessage = ""; //NO SE MUESTRA EL MENSAJE
      }
    },

    registerUser(email, password) {
      this.validatingData(); //VALIDANDO DATOS DEL FORMULARIO
      if (this.correctData) {
        var self = this;
        axios
          .post(process.env.VUE_APP_API_URL + "/users", {
            email: self.email,
            password: self.password,
            birthDate: self.birthDate,
          })
          .then(function(response) {
            self.emptyFields();
            console.log(response);

            //Lanzar modal de confirmación
            Swal.fire({
              icon: "success",
              title: "Usuario registrado",
              text:
                "Hemos enviado un enlace de verificación a tu email. Si no lo encuentras, revisa la carpeta de spam.",
              confirmButtonText: "Volver al inicio",
            }).then(
              //Ir a la página de inicio
              (result) => self.$router.push("/")
            );
          })
          .catch((error) => {
            console.log(error.response.status, error.response.data.message);

            if (error.response.status === 409) {
              Swal.fire({
                icon: "error",
                title: "Email inválido",
                text:
                  "El email introducido ya está registrado en nuestra base de datos.",

                confirmButtonText: "Ok",
              });
            } else if (error.response.status === 400) {
              Swal.fire({
                icon: "error",
                title: "Email inválido",
                text: "Por favor, introduce un email existente.",

                confirmButtonText: "Ok",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error desconocido",
                text: "Inténtalo de nuevo más tarde.",

                confirmButtonText: "Ok",
              });
            }
          });
      }
    },

    //Funcion para obtener la fecha de nacimiento máxima de alguien mayor de edad
    getMaxDate() {
      const year = new Date().getFullYear() - 18;

      let month = new Date().getMonth();
      if (month.toString().length < 2) {
        month = "0" + month;
      }

      let day = new Date().getDate();
      if (day.toString().length < 2) {
        day = "0" + day;
      }

      return year + "-" + month + "-" + day;
    },

    emptyFields() {
      this.email = "";
      this.password = "";
      this.repeatPassword = "";
      this.birthDate = "";
    },
  },
};
</script>

<style scoped>
h2 {
  padding: 2rem;
}

/* Mensaje de error */
p {
  color: #d1345b;
  padding-bottom: 1rem;
}

/* formulario */
.form {
  padding: 1rem;
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
</style>
