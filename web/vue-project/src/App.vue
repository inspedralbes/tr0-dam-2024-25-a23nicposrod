<template>
  <div>
    <h1>Lista de preguntas</h1>
    <button @click="obtenerMensaje()">Estadisticas</button>
 
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
          <button @click="abrirModal(pregunta)">Editar</button>  <!-- Cambié de preguntes.id a pregunta.id -->
          <button @click="deletePregunta(pregunta.id)">Eliminar</button> <!-- Cambié de preguntes.id a pregunta.id -->
        </div>
        <br><br>
      </li>
    </ul>
    <button @click="abrirModalNuevaPregunta()" class="floating-button">Nueva Pregunta</button>

    <!--Modal Editar Pregunta-->
    <div v-if="mostrarModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="cerrarModal()">&times;</span>
        <h2>Editar Pregunta</h2>
        <form @submit.prevent="guardarEdicion()">
          <label for="pregunta">Pregunta:</label>
          <input type="text" v-model="preguntaEditada.pregunta" id="pregunta">
          <br><br>

          <label for="respuestas">Respuestas:</label>
          <div v-for="(respuesta, index) in preguntaEditada.respostes" :key="index">
            <input type="text" v-model="respuesta.etiqueta">
          </div>
          <br>

          <label for="respostaCorrecta">Respuesta Correcta: </label>
          <select v-model="preguntaEditada.resposta_correcta">
            <option v-for="(respuesta, index) in preguntaEditada.respostes" :key="index" :value="respuesta.id">
              {{ respuesta.etiqueta }}
            </option>
          </select>
          <br><br>

          <button type="submit">Guardar</button>
        </form>
      </div>
    </div>
    <!--Modal Crear Pregunta-->
    <div v-if="mostrarModalAgregarPregunta" class="modal-agregar-pregunta">
      <div class="modal-content-agregar">
        <span class="close" @click="cerrarModalNuevaPregunta()">&times;</span>
        <h2>Agregar Nueva Pregunta</h2>
        <form @submit.prevent="agregarNuevaPregunta()">
          <label for="pregunta">Pregunta:</label>
          <input type="text" v-model="nuevaPregunta.pregunta" id="pregunta" required>
          <br><br>

          <label for="respuestas">Respuestas:</label>
          <div v-for="(respuesta, index) in nuevaPregunta.respostes" :key="index">
            <input type="text" v-model="respuesta.etiqueta" placeholder="Respuesta" required>
            <button type="button" @click="eliminarRespuesta(index)">Eliminar</button>
          </div>
          <button type="button" @click="agregarRespuesta()">Agregar Respuesta</button>
          <br><br>

          <label for="respostaCorrecta">Respuesta Correcta: </label>
          <select v-model="nuevaPregunta.resposta_correcta" required>
            <option v-for="(respuesta, index) in nuevaPregunta.respostes" :key="index" :value="index">
              {{ respuesta.etiqueta }}
            </option>
          </select>
          <br><br>

          <label for="imagen">Imagen:</label>
          <input type="text" v-model="nuevaPregunta.imatge" id="imagen" placeholder="URL de la imagen">
          <br><br>

          <button type="submit">Guardar Pregunta</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      preguntes: [], // Aquí almacenas las preguntas
      mostrarModal: false, // Controla si el modal se muestra o no
      preguntaEditada: {},
      mostrarModalAgregarPregunta: false, // Controla la visibilidad del modal específico
      nuevaPregunta: {
        pregunta: '',
        respostes: [{ etiqueta: '' }], // Inicializa con una respuesta vacía
        resposta_correcta: null,
        imatge: ''
      }
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
    async obtenerMensaje() {
      try {
        const response = await fetch('http://localhost:3000/api/hola');  // Ajusta la URL según tu servidor
        if (!response.ok) {
          throw new Error('Error al obtener el mensaje');
        }
        const data = await response.json();
        alert(data.message);  // Muestra un alert con el mensaje obtenido del servidor
      } catch (error) {
        console.error('Error al hacer fetch:', error);
        alert('Hubo un problema al obtener el mensaje');  // Muestra un alert si hay un error
      }
    },
    abrirModalNuevaPregunta() {
      this.mostrarModalAgregarPregunta = true; // Abre el modal
    },
    cerrarModalNuevaPregunta() {
      this.mostrarModalAgregarPregunta = false; // Cierra el modal y reinicia los campos
      this.nuevaPregunta = {
        pregunta: '',
        respostes: [{ etiqueta: '' }],
        resposta_correcta: null,
        imatge: ''
      };
    },
    agregarRespuesta() {
      this.nuevaPregunta.respostes.push({ etiqueta: '' }); // Agrega una nueva respuesta vacía
    },
    eliminarRespuesta(index) {
      this.nuevaPregunta.respostes.splice(index, 1); // Elimina una respuesta por índice
    },
    async agregarNuevaPregunta() {
  try {
      const response = await fetch('http://localhost:3000/api/preguntes', {
          method: 'POST', // Método POST para agregar
          headers: {
              'Content-Type': 'application/json' // Tipo de contenido JSON
          },
          body: JSON.stringify(this.nuevaPregunta) // Convertir los datos de la nueva pregunta a JSON
      });

      if (!response.ok) {
          throw new Error('Error al agregar la pregunta');
      }

      const data = await response.json(); // Obtener la respuesta del servidor
      alert(`Pregunta agregada: ${data.pregunta.pregunta}`); // Mostrar una alerta de éxito
      this.cerrarModalNuevaPregunta(); // Cierra el modal después de agregar la pregunta
      await this.obtenerPreguntas(); // Actualiza la lista de preguntas
  } catch (error) {
      console.error('Error al agregar la pregunta:', error);
      alert('No se pudo agregar la pregunta'); // Mostrar una alerta si hay error
  }
}

,
  
    abrirModal(pregunta) {
      // Copia profunda para evitar modificar la original hasta que se guarde
      this.preguntaEditada = JSON.parse(JSON.stringify(pregunta));
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
    async guardarEdicion() {
  try {
    const response = await fetch(`http://localhost:3000/api/preguntes/${this.preguntaEditada.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.preguntaEditada),
    });

    if (!response.ok) throw new Error('Error al guardar la pregunta');

    // Vuelve a obtener la lista de preguntas
    await this.obtenerPreguntas();  // Actualiza la lista de preguntas desde el servidor

    // Cierra el modal después de guardar
    this.cerrarModal();
  } catch (error) {
    console.error('Error al guardar la pregunta editada:', error);
  }
}
,
    async deletePregunta(id) {
      try {
        const response = await fetch(`http://localhost:3000/api/preguntes/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        // Filtra la pregunta eliminada de la lista actual sin necesidad de hacer otra solicitud
        this.preguntes = this.preguntes.filter(pregunta => pregunta.id !== id);

      } catch (error) {
        console.error('Error al eliminar la pregunta:', error);
        alert('No se pudo eliminar la pregunta.'); // Mensaje de error al usuario
      }
  }

  }
};
</script>

<style>
#pregunta {
  width: 400px;
}

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

button:hover {
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

h1 {
  text-align: center;
}

/* Estilos para el modal */
.modal,
.modal-agregar-pregunta {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
}

.modal-content,
.modal-content-agregar {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 10px;
  width: 600px;
  max-height: 80vh; /* Solo para el modal agregar */
  overflow-y: auto; /* Solo para el modal agregar */
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
}

/* Estilos para el botón flotante */
.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 50px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 1000;
}

.floating-button:hover {
  background-color: #218838;
}
</style>
