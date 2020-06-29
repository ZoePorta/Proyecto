<template>
  <div class="clientes">
    <table v-for="(cliente, index) in clientes" :key="cliente.id">
      <thead>
        <tr>
          <th colspan="2">Cliente #{{ cliente.id }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>
            Nombre:
          </th>
          <td>
            {{ cliente.nombre }}
          </td>
        </tr>
        <tr>
          <th>
            Apellido:
          </th>
          <td>
            {{ cliente.apellido }}
          </td>
        </tr>
        <tr>
          <th>
            Ciudad:
          </th>
          <td>
            {{ cliente.ciudad }}
          </td>
        </tr>
        <tr>
          <th>
            Empresa:
          </th>

          <td>
            {{ cliente.empresa }}
          </td>
        </tr>
        <tr class="buttons">
          <td>
            <button class="boton" @click="deleteClientEvent(index)">
              BORRAR
            </button>
          </td>
          <td>
            <button class="boton" @click="editClientEvent(index)">
              EDITAR
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "ClienteCard",
  props: {
    clientes: Array,
  },

  methods: {
    editClientEvent(index) {
      //Enviando el index del cliente a la vista
      this.$emit("editar", index);
    },

    //Funcion que emite un evento para borrar una nota
    deleteClientEvent(index) {
      //Guardando la información del cliente seleccionado
      let data = this.clientes[index].id;

      //Enviando la info del cliente a la vista
      this.$emit("borrar", data);
    },
  },
  mounted() {
    console.log(this.name);
  },
};
</script>

<style scoped>
.clientes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
table {
  width: 80%;
  max-width: 20rem;
  height: 20rem;
  border-radius: 1rem;
  background: #efefef;
  color: #070707;
  margin: 1rem;
  padding: 1rem;
}

thead {
  font-size: 1.5rem;
}

tr > * {
  padding: 0.5rem;
}

table td {
  width: 50%;
  text-align: left;
}

tbody th {
  width: 50%;
  text-align: right;
}

.buttons td {
  text-align: center;
}
</style>
