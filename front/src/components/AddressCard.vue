<template>
  <div class="addresscard">
    <table v-for="(address, index) in addresses" :key="address.id">
      <thead>
        <tr>
          <th>{{ address.alias }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {{ address.name }}
          </td>
        </tr>
        <tr>
          <td>{{ address.row1 }} {{ address.row2 }}</td>
        </tr>
        <tr>
          <td>{{ address.city }} - {{ address.PC }}</td>
        </tr>
        <tr>
          <td>
            {{ address.country }}
          </td>
        </tr>
        <tr>
          <td>{{ address.prefix }} - {{ address.phone_number }}</td>
        </tr>
        <tr v-show="showDelete">
          <td>
            <font-awesome-icon
              @click="deleteEvent(address.addressId)"
              class="icon"
              icon="trash-alt"
            />
            <font-awesome-icon
              class="icon"
              @click="editEvent(index)"
              icon="pencil-alt"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
//Importing library
import axios from "axios";

export default {
  name: "AddressCard",

  props: {
    addresses: Array,
    showDelete: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    //Emit edit event
    editEvent(index) {
      this.$emit("edit", index);
    },
    //Emit delete event
    deleteEvent(id) {
      this.$emit("delete", id);
    },
  },
};
</script>

<style scoped>
table {
  background: var(--block-bg-color);
  width: 20rem;

  border: var(--border);
  display: inline-block;
  margin: 1rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

thead {
  background: var(--enf-bg-color);
  width: 100%;
  padding: 0.5rem 1rem;
}

td {
  padding: 0.5rem 1rem;
}

.icon {
  margin: 0 0.5rem;
  cursor: pointer;
}
</style>
