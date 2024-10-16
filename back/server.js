const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');  // Importar el módulo 'path' para manejar rutas
const cors = require('cors');  // Importar cors

const app = express();
const PORT = 22333;

// Middleware
app.use(cors({
  origin: '*',  // Permitir todas las orígenes (puedes restringirlo si es necesario)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Permitir estos métodos HTTP
  allowedHeaders: ['Content-Type', 'Authorization']  // Permitir estos headers
}));
app.use(express.json()); // Para parsear JSON
app.use(bodyParser.json());

// Ruta para obtener todas las preguntas
app.get('/api/preguntes', function(req, res) {
    const filePath = path.join(__dirname, 'preguntas.json'); // Usar path.join para asegurar la ruta correcta
    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
            console.error(err);  // Imprimir el error en la consola
            return res.status(500).send({ message: 'Error al leer el archivo' });
        }
        res.send(JSON.parse(data).preguntes);
    });
});
app.get('/api/hola', function(req, res) {
    console.log("Inicio del proceso");
  
    // Iniciar el proceso de Python
    const pythonProcess = spawn('python3', ['./server.py']);
    let pythonOutput = '';  
  
    // Capturar los datos del stdout de Python
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();  
    });
  
    // Capturar los errores del stderr de Python
    pythonProcess.stderr.on('data', (data) => {
        const errorMessage = data.toString().trim();
        console.error('Error en el proceso de Python:', errorMessage);
        res.status(500).json({ error: errorMessage }); // Enviar el error al cliente
    });
  
    // Cuando el proceso de Python se cierra
    pythonProcess.on('close', (code) => {
        console.log(`El proceso de Python se cerró con el código ${code}`);
        if (code === 0) {
            try {
                // Aquí asumimos que la salida es un JSON
                const stats = JSON.parse(pythonOutput.trim());
  
                // Enviar la respuesta al cliente
                res.json({
                    message: 'Estadísticas generadas correctamente',
                    statistics: stats
                });
            } catch (error) {
                console.error('Error al procesar la salida de Python:', error);
                res.status(500).json({ error: 'Error al procesar la salida de Python.' });
            }
        } else {
            res.status(500).json({ error: 'El script de Python no se ejecutó correctamente.' });
        }
    });
  });




// Ruta GET: Obtener una pregunta por ID
app.get('/preguntas/:id', (req, res) => {
  const pregunta = preguntas.find(p => p.id === parseInt(req.params.id));
  if (!pregunta) return res.status(404).send('Pregunta no encontrada');
  res.json(pregunta);
});



app.post('/api/preguntes', function (req, res) {
    const filePath = path.join(__dirname, 'preguntas.json'); 
    const nuevaPregunta = req.body; 
    if (!nuevaPregunta || !nuevaPregunta.pregunta || !nuevaPregunta.respostes || !nuevaPregunta.resposta_correcta || !nuevaPregunta.imatge) {
        return res.status(400).send({ message: 'Faltan datos para la nueva pregunta' });
    }
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return res.status(500).send({ message: 'Error al leer el archivo' });
        }
        const json = JSON.parse(data);
        const nuevoId = json.preguntes.length > 0 ? Math.max(...json.preguntes.map(p => p.id)) + 1 : 1;
        nuevaPregunta.id = nuevoId;
        nuevaPregunta.respostes.forEach((resposta, index) => {
            resposta.id = index + 1;
        });
        json.preguntes.push(nuevaPregunta);
        fs.writeFile(filePath, JSON.stringify(json, null, 2), function (err) {
            if (err) {
                return res.status(500).send({ message: 'Error al guardar la nueva pregunta' });
            }
            res.send({ message: 'Pregunta agregada', pregunta: nuevaPregunta }); // Responder con éxito
        });
    });
});


// Ruta PUT: Actualizar una pregunta existente
app.put('/api/preguntes/:id', function(req, res) {
    const id = parseInt(req.params.id); // Obtener el ID de la pregunta que se va a editar
    const filePath = path.join(__dirname, 'preguntas.json'); // Ruta al archivo JSON
  
    // Verifica si req.body tiene datos
    console.log('Datos recibidos:', req.body);
  
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) return res.status(500).send({ message: 'Error al leer el archivo' });
  
      const json = JSON.parse(data); // Parsear el archivo JSON
      const index = json.preguntes.findIndex(p => p.id === id); // Buscar la pregunta por ID
  
      if (index !== -1) {
        // Actualizar los datos de la pregunta con los datos del cuerpo de la solicitud
        const preguntaEditada = req.body; // Los nuevos datos de la pregunta (se asume que vienen en el cuerpo)
        json.preguntes[index] = { ...json.preguntes[index], ...preguntaEditada }; // Fusionar los datos existentes con los nuevos
  
        // Verifica los datos antes de guardar
        console.log('Datos actualizados:', json.preguntes[index]);
  
        // Guardar el archivo actualizado
        fs.writeFile(filePath, JSON.stringify(json, null, 2), function(err) {
          if (err) return res.status(500).send({ message: 'Error al guardar el archivo' });
          res.send({ message: 'Pregunta actualizada' }); // Responder con éxito
        });
      } else {
        res.status(404).send({ message: 'Pregunta no encontrada' }); // Si no se encuentra la pregunta
      }
    });
  });
  
app.put('/api/estadisticas/:id', (req, res) => {
    const preguntaId = parseInt(req.params.id);
    const { aciertos, fallos } = req.body;

    // Leer el archivo JSON
    fs.readFile('./estadisticas.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo JSON.' });
        }

        let jsonData = JSON.parse(data);
        const pregunta = jsonData.preguntes.find(p => p.id === preguntaId);

        if (!pregunta) {
            return res.status(404).json({ error: 'Pregunta no encontrada.' });
        }

        // Actualizar los aciertos y fallos
        if (aciertos !== undefined) {
            pregunta.aciertos += aciertos; // Aumenta los aciertos
        }
        if (fallos !== undefined) {
            pregunta.fallos += fallos; // Aumenta los fallos
        }

        // Guardar los cambios en el archivo JSON
        fs.writeFile('./estadisticas.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar el archivo JSON.' });
            }
            res.json({ message: 'Pregunta actualizada.', pregunta });
        });
    });
});

// Ruta DELETE: Eliminar una pregunta por ID
app.delete('/api/preguntes/:id', function(req, res) {
    const id = parseInt(req.params.id);
    const filePath = path.join(__dirname, 'preguntas.json');

    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) return res.status(500).send({ message: 'Error al leer el archivo' });

        const json = JSON.parse(data);
        const index = json.preguntes.findIndex(p => p.id === id);

        if (index !== -1) {
            json.preguntes.splice(index, 1); // Elimina la pregunta
            fs.writeFile(filePath, JSON.stringify(json, null, 2), function(err) {
                if (err) return res.status(500).send({ message: 'Error al guardar el archivo' });
                res.send({ message: 'Pregunta eliminada' }); // Responde con éxito
            });
        } else {
            res.status(404).send({ message: 'Pregunta no encontrada' });
        }
    });
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://a23nicposrod.dam.inspedralbes.cat:${PORT}`);

});
