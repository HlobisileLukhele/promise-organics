#!/bin/bash
set -e

echo "=== Promise Organics — Server Deploy Script ==="

# 1. Install Docker if not present
if ! command -v docker &>/dev/null; then
  echo "[1/5] Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker $USER
  echo "Docker installed. You may need to log out and back in if permission errors occur."
else
  echo "[1/5] Docker already installed."
fi

# 2. Install Docker Compose if not present
if ! command -v docker-compose &>/dev/null; then
  echo "[2/5] Installing Docker Compose..."
  sudo apt-get install -y docker-compose 2>/dev/null || \
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose
else
  echo "[2/5] Docker Compose already installed."
fi

# 3. Clone or update the repo
REPO_URL="https://github.com/HlobisileLukhele/promise-organics-ecommerce-.git"
APP_DIR="$HOME/promise-organics"

if [ -d "$APP_DIR/.git" ]; then
  echo "[3/5] Updating existing repo..."
  cd "$APP_DIR"
  git pull origin main
else
  echo "[3/5] Cloning repo..."
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

# 4. Set up backend .env if it doesn't exist
if [ ! -f "$APP_DIR/backend/.env" ]; then
  echo ""
  echo "[4/5] backend/.env not found — creating from example."
  cp "$APP_DIR/backend/.env.example" "$APP_DIR/backend/.env"
  echo ""
  echo "  *** ACTION REQUIRED ***"
  echo "  Fill in your real values in: $APP_DIR/backend/.env"
  echo "  Then re-run this script."
  echo ""
  exit 1
else
  echo "[4/5] backend/.env found."
fi

# 5. Open firewall ports
echo "[5/5] Opening ports 80 and 5000..."
sudo ufw allow 80  2>/dev/null || true
sudo ufw allow 5000 2>/dev/null || true

# 6. Build and start containers
echo ""
echo "=== Building and starting containers (this may take a few minutes) ==="
cd "$APP_DIR"
sudo docker-compose down 2>/dev/null || true
sudo docker-compose up -d --build

echo ""
echo "=== Done! ==="
echo "App is running at: http://$(curl -s ifconfig.me)"
echo "API health check:  http://$(curl -s ifconfig.me):5000/api/health"
