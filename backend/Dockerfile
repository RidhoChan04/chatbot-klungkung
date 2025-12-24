# Gunakan Python Slim yang sangat kecil (Debian Bookworm)
FROM python:3.11-slim-bookworm

# 1. Install Library Sistem (Hanya yang wajib untuk PDF & Gambar)
# --no-install-recommends agar tidak install sampah dokumentasi linux
RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils \
    tesseract-ocr \
    libmagic1 \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Set folder kerja
WORKDIR /app

# 3. Copy requirements.txt
COPY requirements.txt .

# ======================================================
# BAGIAN KRUSIAL: INSTALL TORCH CPU-ONLY
# ======================================================
# Kita install ini DULUAN agar saat install requirements, 
# dia tidak mendownload versi NVIDIA yang 4GB+.
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# 4. Install sisa library dari requirements.txt
# Kita tambah --no-cache-dir agar tidak menyimpan file mentahan (.whl) di image
RUN pip install --no-cache-dir -r requirements.txt

# 5. Hapus sampah NVIDIA jika tidak sengaja terinstall (Safety Net)
RUN pip uninstall -y nvidia-cublas-cu12 nvidia-cudnn-cu12 nvidia-cuda-runtime-cu12 || true

# 6. Copy kode aplikasi
COPY . .

# 7. Jalankan
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT