import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Cargar datos desde un archivo JSON
with open('estadisticas.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Crear un DataFrame a partir de las preguntas
df = pd.DataFrame(data['preguntes'])

# Verificar la estructura del DataFrame
print("Estructura del DataFrame:")
print(df.head())

# Agregar una nueva columna con el total de respuestas
df['total_respuestas'] = df['aciertos'] + df['fallos']

# Estadísticas básicas
total_preguntas = len(df)
total_aciertos = np.sum(df['aciertos'])
total_fallos = np.sum(df['fallos'])
media_aciertos = np.mean(df['aciertos'])
media_fallos = np.mean(df['fallos'])

# Imprimir estadísticas
print("\nEstadísticas:")
print(f"Total de preguntas: {total_preguntas}")
print(f"Total de aciertos: {total_aciertos}")
print(f"Total de fallos: {total_fallos}")
print(f"Media de aciertos por pregunta: {media_aciertos:.2f}")
print(f"Media de fallos por pregunta: {media_fallos:.2f}")

# Estilo de la gráfica (sin seaborn)
plt.style.use('ggplot')  # Cambiar a un estilo de matplotlib disponible

# Visualización de aciertos y fallos
plt.figure(figsize=(12, 6))
bar_width = 0.35  # Ancho de las barras
index = np.arange(total_preguntas)  # Índices para las barras

# Crear barras de aciertos y fallos
bars1 = plt.bar(index, df['aciertos'], bar_width, color='green', alpha=0.5, label='Aciertos')  # 50% transparente
bars2 = plt.bar(index + bar_width, df['fallos'], bar_width, color='red', alpha=0.5, label='Fallos')  # 50% transparente

# Etiquetas y título
plt.xlabel('ID de Pregunta', fontsize=14)
plt.ylabel('Cantidad', fontsize=14)
plt.title('Estadísticas de Aciertos y Fallos', fontsize=16)
plt.xticks(index + bar_width / 2, df['id'], fontsize=12)
plt.yticks(fontsize=12)
plt.legend(fontsize=12)

# Ajustar diseño
plt.tight_layout()

# Mostrar el gráfico
plt.show()

# Guardar estadísticas en un nuevo archivo CSV
df.to_csv('estadisticas_preguntas.csv', index=False)
print("\nLas estadísticas se han guardado en 'estadisticas_preguntas.csv'")
