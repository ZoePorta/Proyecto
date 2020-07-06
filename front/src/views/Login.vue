<template>
  <div>
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Login" description="Log in to your account." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->
    <div class="contentContainer">
      <h2>
        Log In 👇
      </h2>

      <div class="form">
        <input type="text" placeholder="Write your email" v-model="email" />
        <input
          type="password"
          placeholder="Write your password"
          v-model="password"
        />
        <button class="button" @click="login()" :disabled="!email || !password">
          LOG IN
        </button>

        <p>
          Don't have an account?
          <router-link :to="{ name: 'Register' }">Register!</router-link>
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
//Importing components
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";

//Importing functions
import { loginUser } from "../api/utils";

//Importing library
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Login",
  components: {
    menucustom,
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
        //TRY LOG IN
        await loginUser(this.email, this.password);

        //Success: go back

        this.$router.go(-1);
      } catch (error) {
        //Error: show error modals
        console.log(error);

        if (error.response.status === 401) {
          //Wrong user or password error
          Swal.fire({
            icon: "error",
            title: "Wrong email or password.",

            confirmButtonText: "Ok",
          });
        } else if (error.response.status === 403) {
          //Account not verified error
          //Modal with option to resend verification mail
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
              this.resendMail();
            }
          });
        } else {
          //Unknown error
          Swal.fire({
            icon: "error",
            title: "Server error",
            text: "Try again later.",

            confirmButtonText: "Ok",
          });
        }
      }
    },

    //Resend verificartion email function
    resendMail() {
      console.log("enviando");
      const self = this;
      axios
        .post(process.env.VUE_APP_API_URL + "/users/resendmail", {
          email: self.email,
        })
        .then(
          //Success: confirmation modal
          Swal.fire({
            icon: "success",
            title: "Email sent.",
            text: "Please, check your spam folder.",
            confirmButtonText: "Go to Home",
          }).then(
            //Go back

            this.$router.go(-1)
          )
        )
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style scooped>
.form {
  padding: 2rem;
  width: 80%;
  max-width: 30rem;
  margin: auto;
  border-radius: 1rem;
  background: var(--block-bg-color);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: var(--border);
  box-shadow: var(--shadow);
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
