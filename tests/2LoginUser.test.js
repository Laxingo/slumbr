import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "@/stores/auth";

describe("Auth Store - loginUser", () => {
  let authStore;

  beforeEach(() => {
    // tem que ter isto ou não consegue aceder ao local storage por causa do access token
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });

    setActivePinia(createPinia());
    authStore = useAuthStore();
    vi.restoreAllMocks();
  });

  it("returns the user and sets the token when login is successful", async () => {
    // simula o fetch para devolver um utilizador válido
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (url.includes("/users?email="))
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve([
                { id: "u1", email: "test@example.com", password: "hashedPassword" },
              ]),
          });
        return Promise.resolve({ ok: false });
      }),
    );

    const user = await authStore.loginUser("test@example.com", "password");
// ver se deu login com sucesso
    expect(user).toEqual({ id: "u1", email: "test@example.com", password: "hashedPassword" });
    expect(authStore.user).toEqual(user);
    expect(authStore.accessToken).toBe(btoa("u1:test@example.com"));
  });
});
