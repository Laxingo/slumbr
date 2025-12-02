import { reactive, watch } from "vue";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || "YOUR_GITHUB_CLIENT_ID";
const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET || "YOUR_GITHUB_CLIENT_SECRET";

const auth = reactive({
  accessToken: localStorage.getItem("accessToken"),
});

// Sincroniza token com localStorage
watch(
  () => auth.accessToken,
  (newAccessToken) => {
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  },
);

// Retorna o token atual
export function getAccessToken() {
  return auth.accessToken;
}

// Verifica se o usuário está autenticado
export function isAuthenticated() {
  console.log("Slumbr isAuthenticated:", auth.accessToken !== null);
  return auth.accessToken !== null;
}

// Redireciona para login do GitHub
export function loginWithGitHub() {
  const redirect_uri = import.meta.env.PROD
    ? "https://slumbr.example.com/auth/callback" // placeholder de produção
    : "http://localhost:5173/auth/callback";     // desenvolvimento

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri,
    scope: "read:user,user:email", // acesso básico para login
  });

  const url = `https://github.com/login/oauth/authorize?${params.toString()}`;
  window.location.href = url;
}

// Troca o código recebido do GitHub por um token (usa proxy placeholder)
export async function exchangeCodeForToken(code) {
  const PROXY_URL = "https://slumbr-oauth-proxy.example.com/"; // placeholder proxy

  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const authToken = await res.json();
  auth.accessToken = authToken.access_token;
  return authToken;
}

// Logout do usuário
export function logout() {
  auth.accessToken = null;
  localStorage.removeItem("accessToken");
}
