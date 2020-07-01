<template>
  <div>
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Register" description="Register a new account." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->
    <h2>
      Register 👇
    </h2>

    <!-- FORM -->
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

      <!-- Password -->
      <label for="password">Password:</label>
      <input
        type="password"
        name="password"
        min="6"
        max="20"
        placeholder="Password..."
        v-model="password"
      />
      <br />

      <!-- Repeat password -->
      <label for="repeatPassword">Password repeat:</label>
      <input
        type="password"
        name="repeatPassword"
        placeholder="Contraseña..."
        v-model="repeatPassword"
      />
      <br />

      <!-- Birthdate -->
      <label for="birthDate">Birthdate:</label>
      <input
        type="date"
        name="birthDate"
        v-model="birthDate"
        :max="getMaxDate()"
      />

      <button class="boton" @click="registerUser(email, password)">
        REGISTER
      </button>
    </div>

    <!-- /CONTENT -->

    <!-- FOOTER -->
    <footercustom></footercustom>
    <!-- /FOOTER -->
  </div>
</template>

<script>
//Importing components
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";

//Importing library
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Register",
  components: {
    menucustom,
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
        this.errorMessage = "You have empty fields left."; //Set error message
        this.correctData = false; //DON'T SEND
      } else if (this.password.length < 6 || this.password.length > 20) {
        this.errorMessage = "Password must be between 6 and 20 characters."; //Set error message
        this.correctData = false; //DON'T SEND
      } else if (this.password !== this.repeatPassword) {
        this.errorMessage = "Passwords don't match."; //Set error message
        this.correctData = false; //DON'T SEND
      } else {
        console.log("send");
        this.correctData = true; //SEND
        this.errorMessage = ""; //DON'T SHOW MESSAGE
      }
    },

    registerUser(email, password) {
      this.validatingData(); //VALIDATING FORM DATA
      if (this.correctData) {
        const self = this;
        axios
          .post(process.env.VUE_APP_API_URL + "/users", {
            email: self.email,
            password: self.password,
            birthDate: self.birthDate,
          })
          .then(function(response) {
            self.emptyFields();

            //Success: confirmation modal
            Swal.fire({
              icon: "success",
              title: "User registered!",
              text:
                "We've sent you a verification email. Please check your spam folder.",
              confirmButtonText: "BACK",
            }).then(
              //Go back
              (result) => self.$router.go(-1)
            );
          })
          .catch((error) => {
            //Error: error modals
            console.log(error.response.status, error.response.data.message);

            if (error.response.status === 409) {
              //Duplicated email error
              Swal.fire({
                icon: "error",
                title: "Invalid email",
                text: "That email is already registered.",

                confirmButtonText: "Ok",
              });
            } else if (error.response.status === 400) {
              //Invalid mail error
              Swal.fire({
                icon: "error",
                title: "Invalid mail",
                text: "Please, enter a valid email.",

                confirmButtonText: "Ok",
              });
            } else {
              //Unknown error
              Swal.fire({
                icon: "error",
                title: "Unknown error",
                text: "Try again later.",

                confirmButtonText: "Ok",
              });
            }
          });
      }
    },

    //Get max bithdate for an adult function
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
