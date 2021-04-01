<template>
  <div class="shopform">
    <div v-show="show" class="modal animate__animated animate__fadeIn">
      <form class="modalBox animate__animated animate__fadeInDown">
        <h2>{{ vendor ? "Edit your shop" : "Create your shop" }}</h2>
        <label for="name">Name:</label>
        <input
          type="text"
          id="name"
          v-model="shop.name"
          placeholder="Write your shop name here"
          required
        />

        <label for="description ">Description:</label>
        <input
          type="text"
          name="description"
          v-model="shop.description"
          placeholder="Write your shop description here"
          required
        />

        <label for="video">Video:</label>
        <!-- IMPORTANTE EDITAR BACK PARA GESTIONAR CAMBIO DE VIDEO -->
        <input type="file" name="video" accept="video/.mp4" />

        <label for="facebook ">Facebook:</label>
        <input
          type="text"
          name="facebook"
          v-model="shop.facebook"
          placeholder="Write the facebook page url for your shop"
        />

        <label for="twitter ">Twitter:</label>
        <input
          type="text"
          name="twitter"
          v-model="shop.twitter"
          placeholder="Write the twitter url for your shop"
        />

        <label for="instagram ">Instagram:</label>
        <input
          type="text"
          name="instagram"
          v-model="shop.instagram"
          placeholder="Write the Instagram url for your shop"
        />

        <div>
          <button class="button" @click.prevent="closeEvent()">Close</button>
          <button class="button" @click.prevent="saveEvent()">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "shopform",

  props: {
    shop: Object,
    show: Boolean,
    vendor: Boolean,
  },

  methods: {
    //Emit edit event
    saveEvent(index) {
      this.$emit("save");
    },

    closeEvent(index) {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
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
