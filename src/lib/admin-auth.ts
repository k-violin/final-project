import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const ADMIN_SESSION_KEY = "wisein-admin-session";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        username: z.string().trim().min(1),
        password: z.string().min(1),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const username = process.env["ADMIN_USERNAME"] ?? "wisein";
    const password = process.env["ADMIN_PASSWORD"] ?? "wise1004!@";
    if (data.username !== username || data.password !== password) {
      return { ok: false as const };
    }
    const { setCookie } = await import("@tanstack/react-start/server");
    setCookie(ADMIN_SESSION_KEY, "ok", COOKIE_OPTIONS);
    return { ok: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { deleteCookie } = await import("@tanstack/react-start/server");
  deleteCookie(ADMIN_SESSION_KEY, { path: "/" });
  return { ok: true as const };
});
