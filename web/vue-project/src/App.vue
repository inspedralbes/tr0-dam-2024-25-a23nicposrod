<template>
  <div>
    <h1>Lista de preguntas</h1>
    <br>
    <ul>
      
      <li v-for="pregunta in preguntas1" :key="pregunta.id">
        <!-- Muestra la pregunta -->
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
          <button @click="editarPregunta(pregunta.id)">Editar</button>
          <button @click="omitirPregunta(pregunta.id)">Eliminar</button>
        </div>
        <br>
        <br>
      </li>
    </ul>

  </div>
</template>


<script>

import preguntes from "./assets/preguntas.json"

export default {
  name: 'App',
  data() {
    return {
      preguntas1: preguntes.preguntes 
    }
  },
   methods: {
    editarPregunta(id) {
      alert(`Has seleccionado la pregunta con ID: ${id}`);
      // Lógica adicional para cuando seleccionas la pregunta
    },
    omitirPregunta(id) {
      this.preguntas1.splice(id-1,1); // Elimina la pregunta del array
  }
}
}
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

</style>
