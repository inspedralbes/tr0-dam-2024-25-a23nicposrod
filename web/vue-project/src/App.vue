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

export default {
  data() {
    return {
      preguntas: [] // Inicializamos el array de preguntas
    };
  },
  mounted() {
    this.getPreguntes(); // Llamamos al método fetch cuando el componente se monta
  },
  methods: {
    async getPreguntes() {
      try {
        const response = await fetch('http://localhost:3000/api/preguntes');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        this.preguntes = data;
        this.maxRespostes = data.length > 0 ? data[0].respostes.length - 1 : 0; // Definir el maxRespostes
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        alert('No es va poder carregar les preguntes.'); // Mensaje de error al usuario
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
