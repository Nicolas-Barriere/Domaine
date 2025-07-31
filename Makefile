# Makefile

# 📍 Variables de base
FRONTEND_DIR=frontend
BACKEND_DIR=backend
PYTHON=backend/env/bin/python

# 👨‍💻 Local dev
dev-back:
	ENV_FILE=.env.dev $(PYTHON) -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 --app-dir $(BACKEND_DIR)
dev-front:
	cd $(FRONTEND_DIR) && cp .env.local .env && npm run dev

# 🛠️ Build frontend en prod
build-frontend:
	@echo "🧱 Build du frontend Next.js pour la prod..."
	cd $(FRONTEND_DIR) && cp .env.production .env && npm install && npm run build

# 🧪 Lancer le backend en local avec env de prod
run-backend-prod:
	@echo "🚀 Lancement du backend avec .env.production..."
	cd $(BACKEND_DIR) && ENV_FILE=.env.production uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 🐳 Docker en prod
prod:
	@echo "📦 Build + lancement de la stack en prod via Docker Compose..."
	docker-compose up --build -d

# 🔄 Clean
down:
	docker-compose down

logs:
	docker-compose logs -f

