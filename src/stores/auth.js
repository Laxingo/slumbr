import { defineStore } from "pinia";

const API_BASE = "http://127.0.0.1:3000";

function makeToken(user) {
  return btoa(`${user.id}:${user.email}`);
}

function decodeToken(token) {
  try {
    const decoded = atob(token);
    const [userId, email] = decoded.split(":");
    return { userId, email };
  } catch {
    return { userId: null, email: null };
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("accessToken"),
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => state.accessToken !== null,

    userId: (state) => {
      if (!state.accessToken) return null;
      return decodeToken(state.accessToken).userId;
    },

    isAdmin: (state) =>
      state.accessToken !== null && Boolean(state.user?.isAdmin),
  },

  actions: {
    setToken(token) {
      this.accessToken = token;
      if (token) localStorage.setItem("accessToken", token);
      else localStorage.removeItem("accessToken");
    },

    logout() {
      this.user = null;
      this.setToken(null);
    },

    async fetchMe() {
      if (!this.accessToken || this.user) return this.user;

      const { userId } = decodeToken(this.accessToken);
      if (!userId) return null;

      const res = await fetch(
        `${API_BASE}/users/${encodeURIComponent(userId)}`,
      );
      if (!res.ok) return null;

      const user = await res.json();
      this.user = user;
      return user;
    },

    async loginUser(email, password) {
      if (!email || !password) return null;

      try {
        const res = await fetch(
          `${API_BASE}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        );
        if (!res.ok) return null;

        const users = await res.json();
        console.log(users);
        if (!users.length) return null;

        const user = users[0];
        this.user = user;
        this.setToken(makeToken(user));
        return user;
      } catch {
        return null;
      }
    },

async signUpUser(email, password, userName) {
  if (!email || !password || !userName) return null;

  // Check if email already exists
  const checkRes = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
  if (!checkRes.ok) throw new Error("Falha a verificar email");
  const existing = await checkRes.json();
  if (existing.length) return null;

  // Create new user
  const newUser = { userName, email, password, level: 1, xp: 0, isAdmin: false };
  const createRes = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });
  if (!createRes.ok) throw new Error("Falha a criar utilizador");

  const createdUser = await createRes.json();
  const userId = createdUser.id;

  // Assign quests safely
  try {
    const questList = await fetch(`${API_BASE}/quests`);
    if (!questList.ok) throw new Error("Falha ao buscar quests");
    const quests = await questList.json();

    for (let i = 0; i < quests.length; i++) {
      const newQuest = { userId, questId: i + 1, progress: 0, completed: false };
      const questRes = await fetch(`${API_BASE}/userQuests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuest),
      });
      if (!questRes.ok) console.warn(`Failed to assign quest ${i + 1}`);
    }
  } catch (e) {
    console.warn("Quest assignment failed, but user was created", e);
  }

  // Set user in store safely
  this.user = createdUser;

  try {
    this.setToken(makeToken(createdUser));
  } catch (e) {
    console.warn("Failed to create token, but user was created", e);
  }
  return createdUser;
}
  },
});
