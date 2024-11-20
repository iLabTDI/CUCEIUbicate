import csv
import os

def txt_to_csv(input_file, output_file):
    with open(input_file, 'r') as txt_file, open(output_file, 'w', newline='') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(["video_name", "link"])  # Encabezados del CSV
        
        for line in txt_file:
            # Dividimos la línea en módulo y enlace utilizando el último espacio
            parts = line.rsplit(" ", 1)
            modulo = parts[0].strip()
            enlace = parts[1].strip()
            
            # Elimina la extensión del archivo de video
            modulo = os.path.splitext(modulo)[0]
            
            writer.writerow([modulo, enlace])

# Especifica los nombres de tus archivos de entrada y salida
input_file = 'videos.txt'  # Archivo de entrada (txt)
output_file = 'videos.csv'  # Archivo de salida (csv)

txt_to_csv(input_file, output_file)
