<template>
  <div class="Profile">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Profile" description="Update your profile." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENT -->
    <div class="contentContainer">
      <!-- USER MENU -->
      <usermenu></usermenu>
      <!-- /USER MENU -->

      <!-- Spinner -->
      <div v-show="loading" class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <!-- /Spinner -->

      <form class="profile">
        <img :src="user.photo" alt="Profile picture" />

        <label for="first_name">First name:</label>
        <input
          name="first name"
          placeholder="Write your first name"
          type="text"
          id="first_name"
          v-model="user.first_name"
        />

        <label for="last_name">Last name:</label>
        <input
          name="last name"
          placeholder="Write your last name"
          type="text"
          id="last_name"
          v-model="user.last_name"
        />

        <label for="email">Email:</label>
        <input
          name="email"
          type="text"
          id="email"
          v-model="user.email"
          placeholder="Here goes your email"
          disabled
        />

        <label for="birthDate">Birth date:</label>
        <input
          name="birthdate"
          type="text"
          id="birthDate"
          v-model="formattedDate"
          placeholder="Here goues your birthdate"
          disabled
        />
        <button class="button" @click.prevent="saveChanges()">Save</button>
      </form>
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
import usermenu from "@/components/UserMenu.vue";

//Importing library
import axios from "axios";
import Swal from "sweetalert2";

import { getUserId } from "../api/utils";

export default {
  name: "Profile",
  components: {
    menucustom,
    footercustom,
    usermenu,
  },
  data() {
    return {
      loading: true,

      //Profile object
      user: {},

      //Correctly formatted date
      formattedDate: "",
    };
  },

  methods: {
    getInfo() {
      const self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/users/" + getUserId())
        //Success
        .then(function(response) {
          self.user = response.data.data;
          self.formattedDate = self.formatDate(self.user.birthDate);

          self.loading = false;
        })
        //Error
        .catch((error) => console.log(error));
    },
    formatDate(date) {
      date = new Date(date);
      return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    },

    //Update user info function
    saveChanges() {
      const self = this;

      axios
        .put(process.env.VUE_APP_API_URL + "/users/" + getUserId(), {
          firstName: self.user.first_name,
          lastName: self.user.last_name,
        })
        //Success: confirmation modal
        .then(function(response) {
          Swal.fire({
            icon: "success",
            title: "Profile updated",

            confirmButtonText: "Ok",
          }).then((result) => {
            location.reload();
          });
        })
        //Error
        .catch((error) => console.log(error));
    },
  },
  created() {
    this.getInfo();
  },
};
</script>

<style scoped>
.profile {
  background: var(--block-bg-color);
  border: var(--border);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  min-width: 300px;
  width: 50%;
  margin: auto;
  border-radius: 1rem;
}
img {
  width: 10rem;
  border-radius: 50%;
  border: var(--border);
  box-shadow: var(--shadow);
  margin: 1rem;
}
</style>
