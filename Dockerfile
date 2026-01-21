FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    git-lfs \
    && rm -rf /var/lib/apt/lists/*

# Initialize Git LFS
RUN git lfs install

# Copy entire project first
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Set working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE 7860

# Start server (Hugging Face Spaces uses port 7860)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
