<template>
  <div>
    <h1>Lista de preguntas</h1>
    <br>
    <ul>
      <li v-for="pregunta in preguntes" :key="pregunta.id">
        <!-- Muestra  la pregunta -->
        <h3>{{ pregunta.pregunta }}</h3>

        <div>
          <img :src="pregunta.imatge" alt="Imagen de la pregunta" class="imagen-pregunta" />
        </div>
        <!-- Muestra las respuestas -->
        <ul>
          <li 
            v-for="respuesta in pregunta.respostes" 
            :key="respuesta.id"
            :class="{ 'correct-answer': respuesta.id === pregunta.resposta_correcta }"
          >
            {{ respuesta.etiqueta }}
          </li>
        </ul>

        <!-- Añade los botones debajo de las respuestas -->
        <div class="buttons">
          <button @click="editarPregunta(pregunta.id)">Editar</button>  <!-- Cambié de preguntes.id a pregunta.id -->
          <button @click="eliminarPregunta(pregunta.id)">Eliminar</button> <!-- Cambié de preguntes.id a pregunta.id -->
        </div>
        <br><br>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      preguntes: [] // Aquí almacenas las preguntas
    };
  },
  mounted() {
    this.obtenerPreguntas();
  },
  methods: {
    async obtenerPreguntas() {
      try {
        const response = await fetch('http://localhost:3000/api/preguntes');  // Asegúrate de que la URL sea correcta
        if (!response.ok) {
          throw new Error('Error al obtener las preguntas');
        }
        const data = await response.json();
        this.preguntes = data;  // Asigna correctamente los datos a `preguntes`
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    editarPregunta(id) {
      alert('Editar pregunta con ID:'+ id);
      // Implementa la lógica para editar una pregunta
    },
    async deletePregunta(id) {
      try {
        alert('parte 1')
        const response = await fetch(`http://localhost:3000/api/preguntes/${id}`, {
          method: 'DELETE'
        });
        alert('parte 2')
        if (!response.ok) throw new Error('Network response was not ok');
        this.getPreguntes(); // Recarga la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar la pregunta:', error);
        alert('No es va poder eliminar la pregunta.'); // Mensaje de error al usuario
      }
    }
  }
};
</script>

<style>
.buttons {
  margin-top: 10px;
}

.buttons button {
  margin-right: 10px;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #878c85;
}
button:hover{
  background-color: #babbba;
}
.correct-answer {
  color: green;
  font-weight: bold;
}
img {
  max-width: 300px; 
  height: auto;
}
h1{
  text-align: center;
}
</style>
