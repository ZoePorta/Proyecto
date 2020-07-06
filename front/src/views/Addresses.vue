<template>
  <div class="addresses">
    <!-- CHANGE PAGE HEADER -->
    <vue-headful title="Addresses" description="Manage your addresses." />
    <!-- /CHANGE PAGE HEADER -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- USER MENU -->
    <usermenu></usermenu>
    <!-- /USER MENU -->

    <!-- CONTENT -->
    <div class="contentContainer">
      <h2>
        Your addresses
        <font-awesome-icon class="icon" @click="openNewModal()" icon="plus" />
      </h2>

      <!-- Spinner -->
      <div v-show="loading" class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <!-- /Spinner -->

      <!-- Address list -->
      <p v-show="!addresses && !loading">No addresses to show</p>

      <addresscard
        :addresses="addresses"
        :showDelete="true"
        @delete="deleteAddress"
        @edit="openEditModal"
      ></addresscard>

      <!-- /Address list -->

      <!-- Address form -->
      <div v-show="modal" class="modal animate__animated animate__fadeIn">
        <form class="modalBox animate__animated animate__fadeInDown">
          <label for="alias">Alias:</label>
          <input
            type="text"
            id="alias"
            v-model="address.alias"
            placeholder="Write the address alias here"
          />

          <label for="name ">Name:</label>
          <input
            type="text"
            name="name"
            v-model="address.name"
            placeholder="Write the addresse's full name here"
          />

          <label for="row1">Row 1:</label>
          <input
            type="text"
            name="row1"
            v-model="address.row1"
            placeholder="Write the address here (number, street...)"
          />

          <label for="row2">Row 2:</label>
          <input
            type="text"
            name="row2"
            v-model="address.row2"
            placeholder="Write the address deatils here (floor, door...)"
          />

          <label for="city">City:</label>
          <input
            type="text"
            name="city"
            v-model="address.city"
            placeholder="Write the city here"
          />

          <label for="PC">Postal Code:</label>
          <input
            type="number"
            name="PC"
            v-model="address.PC"
            placeholder="Write the postal code here"
          />

          <label for="county">Country:</label>
          <input
            type="text"
            name="country"
            v-model="address.country"
            placeholder="Write the contry here"
          />

          <label for="prefix">Prefix:</label>
          <input
            type="text"
            name="prefix"
            v-model="address.prefix"
            placeholder="Write the phone prefix here"
          />

          <label for="phone_number">Phone Number::</label>
          <input
            type="number"
            name="phone_number"
            v-model="address.phone_number"
            placeholder="Write the phone number here"
          />

          <div>
            <button class="button" @click.prevent="closeModal()">Close</button>
            <button class="button" @click.prevent="save()">Save</button>
          </div>
        </form>
      </div>
      <!-- /Address form -->
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
import addresscard from "@/components/AddressCard.vue";
import usermenu from "@/components/UserMenu.vue";

//Importing library
import axios from "axios";
import Swal from "sweetalert2";
import "animate.css";

export default {
  name: "Addresses",
  components: {
    menucustom,
    footercustom,
    addresscard,
    usermenu,
  },
  data() {
    return {
      loading: true,

      //Addresses array
      addresses: [],

      //Modal address
      address: {},

      //Modal visibility
      modal: false,

      //Modal function
      newAddress: true,
    };
  },
  methods: {
    getAddresses() {
      var self = this;
      axios
        .get(process.env.VUE_APP_API_URL + "/addresses")
        //Success
        .then(function(response) {
          console.log(response);
          self.addresses = response.data.addresses;

          self.loading = false;
        })
        //Error
        .catch((error) => console.log(error));
    },

    //Function to remove address
    deleteAddress(id) {
      axios
        .delete(process.env.VUE_APP_API_URL + "/addresses/" + id)
        //Success: confirmation modal
        .then(function(response) {
          Swal.fire({
            icon: "success",
            title: "Address removed",

            confirmButtonText: "Ok",

            buttonsStyling: false,
          }).then((result) => {
            location.reload();
          });
        })
        //Error
        .catch((error) => console.log(error));
    },

    //Function to edit address
    editAddress() {
      const self = this;

      axios
        .put(
          process.env.VUE_APP_API_URL + "/addresses/" + self.address.addressId,
          {
            address: self.address,
          }
        )
        //Success: confirmation modal
        .then(function(response) {
          Swal.fire({
            icon: "success",
            title: "Address updated",

            confirmButtonText: "Ok",

            buttonsStyling: false,
          }).then((result) => {
            location.reload();
          });
        })
        //Error
        .catch((error) => console.log(error));
    },

    //Function to add a new address
    addNewAddress() {
      const self = this;

      axios
        .post(process.env.VUE_APP_API_URL + "/addresses/", {
          address: self.address,
        })
        //Success: confirmation modal
        .then(function(response) {
          Swal.fire({
            icon: "success",
            title: "Address added",

            confirmButtonText: "Ok",

            buttonsStyling: false,
          }).then((result) => {
            location.reload();
          });
        })
        //Error
        .catch((error) => console.log(error));
    },

    //Function to open modal with address data
    openEditModal(index) {
      this.address = this.addresses[index];
      this.newAddress = false;
      this.modal = true;
    },

    //Function to open modal with blank address data
    openNewModal(index) {
      this.address = {
        PC: null,

        alias: "",
        city: "",
        country: "",
        name: "",
        phone_number: null,
        prefix: "",
        row1: "",
        row2: "",
      };
      this.newAddress = true;
      this.modal = true;
    },

    closeModal() {
      this.modal = false;
    },

    save() {
      if (this.newAddress) {
        this.addNewAddress();
      } else {
        this.editAddress();
      }
    },
  },
  created() {
    this.getAddresses();
  },
};
</script>

<style scoped>
table {
  width: 90%;
  max-width: 800px;
  margin: 1.5rem auto;
  border: var(--border);
  box-shadow: var(--shadow);
  border-radius: 1rem;
  padding: 1rem;
  background: var(--enf-bg-color);
}

h2 {
  padding: 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;

  background: rgba(0, 0, 0, 0.5);

  width: 100%;
}

/* formulario */
.modalBox {
  padding: 2rem 1rem;
  width: 80%;
  max-width: 30rem;
  margin: 10rem auto;
  border-radius: 1rem;
  border: var(--border);
  box-shadow: var(--shadow);
  background: var(--block-bg-color);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.icon {
  cursor: pointer;
}

@media (max-width: 1000px) {
  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modalBox {
    margin: 0;
    font-size: 0.8rem;
    padding: 0.5rem;
    padding-top: 1rem;
  }

  input {
    height: 1.3rem;
    margin-bottom: 0.5rem;
  }

  .modalBox .button {
    margin: 0.5rem;
  }
}
</style>
