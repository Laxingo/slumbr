import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "@/stores/auth";


describe("Auth Store - signUpUser", () => {
  let authStore;

  beforeEach(() => {
    // tem que ter isto ou não consegue aceder ao localstorage por causa do access token
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
    setActivePinia(createPinia());
    authStore = useAuthStore();
    vi.restoreAllMocks();
  });

  it("creates a new user successfully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (url.includes("/users?email="))
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        if (url.includes("/users"))
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: "1", email: "new@example.com" }),
          }); // create user
        if (url.includes("/quests"))
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 1 }]),
          }); // quests
        if (url.includes("/userQuests")) return Promise.resolve({ ok: true }); // assign quest
        return Promise.resolve({ ok: false });
      }),
    );

    const user = await authStore.signUpUser(
      "new@example.com",
      "pass",
      "NewUser",
    );

    expect(user).toBeTruthy();
    expect(authStore.user).toEqual(user);
    expect(authStore.accessToken).toBeTruthy();
  });

//   quando o email existe
  it("returns null if email already exists", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (url.includes("/users?email="))
          return Promise.resolve({
            ok: true,
            // simula que existe um utilizador logo devolve um objeto não vazio
            json: () => Promise.resolve([{ id: "1" }]),
          });
        return Promise.resolve({ ok: false });
      }),
    );

    const user = await authStore.signUpUser(
      "exist@example.com",
      "pass",
      "User",
    );
    // como o email existe n vai dar sign up por isso n vai guardar o utilizador
    expect(user).toBeNull();
    expect(authStore.user).toBeNull();
  });
});
