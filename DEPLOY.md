# Deploy CadMed

O projeto está preparado para subir no IP estático `34.46.214.234` usando Docker Compose.

## 1. Variáveis

Crie um arquivo `.env` na raiz a partir de `.env.example` e troque as senhas:

```env
MYSQL_ROOT_PASSWORD=troque-esta-senha
API_SECURITY_TOKEN_SECRET=troque-este-segredo-jwt
APP_CORS_ALLOWED_ORIGINS=http://34.46.214.234,http://localhost,http://localhost:4200
```

## 2. Build e subida

```bash
docker compose up -d --build
```

## 3. Acesso

- Frontend: `http://34.46.214.234`
- Backend interno pelo Nginx: `http://34.46.214.234/api` e `http://34.46.214.234/auth`

Por padrão, o backend fica preso ao host em `127.0.0.1:8080` para evitar exposição direta. O tráfego público deve entrar pelo Nginx do frontend.
