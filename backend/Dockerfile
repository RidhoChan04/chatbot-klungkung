# Gunakan image Python versi SLIM (Jauh lebih ringan dari default)
FROM python:3.11-slim

# 1. Install Library Sistem Wajib (Untuk PDF, OCR, dan OpenCV)
# libgl1 & libglib2.0 wajib ada agar AI Vision tidak error
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    libmagic1 \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 2. Set folder kerja
WORKDIR /app

# 3. Copy file requirements dulu (agar caching layer bekerja)
COPY requirements.txt .

# 4. Install Library Python
# --no-cache-dir agar tidak menyimpan sampah file instalasi (Hemat space)
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy seluruh kode aplikasi
COPY . .

# 6. Perintah Start (Sama seperti Procfile)
# Pastikan port menggunakan variable environment
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]