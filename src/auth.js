import { reactive, watch } from "vue";
// Estado reativo do usuário
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
  }
);
// Retorna token atual
export function getAccessToken() {
  return auth.accessToken;
}
// Verifica se usuário está logado
export function isAuthenticated() {
  return auth.accessToken !== null;
}
// Faz login com token
export function login(token) {
  auth.accessToken = token;
}
// Logout
export function logout() {
  auth.accessToken = null;
}
export async function loginUser(email, password) {
  if(!email || !password) {
    return null;
  }
  const res = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
  const users = await res.json();
  console.log(users);
  if (users.length > 0) {
    const user = users[0];
    // Criando token fictício (para teste)
    const token = btoa(`${user.id}:${user.email}`);
    login(token);
    return user;
  } else {
    return null;
  }
}
export async function signUpUser(email, password,userName) {
  if(!email || !password || !userName) {
    return null;
  }
  const res = await fetch(`http://localhost:3000/users?email=${email}`);
  const users = await res.json();
  if (users.length > 0) {
    return null;
  } else {
    const newUser = {
      userName,
      email,
      password,
      level: 1,
      xp: 0
    };
    const createRes = await fetch(`http://localhost:3000/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    const createdUser = await createRes.json();
    const token = btoa(`${createdUser.id}:${createdUser.email}`);
    login(token);
    return createdUser;
  }
}
// Retorna o ID do usuário logado (ou null se não estiver logado)
export function getUserId() {
  if (!auth.accessToken) return null;

  try {
    const decoded = atob(auth.accessToken); // transforma Base64 de volta em "id:email"
    const [userId] = decoded.split(":");     // pega só o id
    return userId;
  } catch (err) {
    console.error("Erro ao decodificar token:", err);
    return null;
  }
}

