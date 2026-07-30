import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserSchema, AppUser } from "@/schemas";
import { jwtDecode } from "jwt-decode"; // Recommended library for Edge-compatible decoding

/** ----------------------------------------------------
 * CONFIGURATION VARIABLES (MUST BE SET ON VERCEL)
 * ---------------------------------------------------- */
const backendBaseUrl = process.env.API_BASE_URL;
const authSecret = process.env.AUTH_SECRET;

// --- Helper to decode JWT expiration safely ---
// NOTE: Install 'jwt-decode' if you haven't (npm install jwt-decode)
function decodeJwtExp(token?: string): number | null {
  if (!token) return null;
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    return typeof decoded?.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

/** ----------------------------------------------------
 * MAIN NEXTAUTH CONFIG
 * ---------------------------------------------------- */
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!backendBaseUrl) {
          console.error("❌ API_BASE_URL is not configured.");
          throw new Error("Server configuration error. Base URL missing.");
        }

        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!username || !password) {
          throw new Error("Email and password are required.");
        }

        /* -------------------- LOGIN REQUEST -------------------- */
        console.log(
          `🔵 Calling Login API: ${backendBaseUrl}/auth/access-token`
        );

        const loginRes = await fetch(`${backendBaseUrl}/auth/access-token`, {
          method: "POST",
          // The default runtime fetch is usually more reliable than a custom implementation
          // URLSearchParams bodies are standard for application/x-www-form-urlencoded
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ username, password }).toString(),
          // No custom timeout required, use default for simplicity
        });

        if (!loginRes.ok) {
          const errorJson = await loginRes.json().catch(() => ({}));
          console.error("❌ Login failed:", loginRes.status, errorJson);
          const msg =
            errorJson.detail || loginRes.statusText || "Authentication failed.";
          throw new Error(msg);
        }

        const loginJson = await loginRes.json();
        const accessToken = (loginJson as Record<string, string>).access_token;

        if (typeof accessToken !== "string") {
          throw new Error("No access token received from login.");
        }

        /* -------------------- FETCH /me -------------------- */
        console.log(`🔵 Calling /me API: ${backendBaseUrl}/auth/me`);

        const meRes = await fetch(`${backendBaseUrl}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!meRes.ok) {
          const errorJson = await meRes.json().catch(() => ({}));
          console.error("❌ /me failed:", meRes.status, errorJson);
          const msg =
            errorJson.detail ||
            meRes.statusText ||
            "Failed to fetch user profile.";
          throw new Error(msg);
        }

        const meJson = await meRes.json();

        /* -------------------- ZOD VALIDATION -------------------- */
        const parsed = UserSchema.safeParse(meJson);
        if (!parsed.success) {
          console.error("❌ User schema invalid:", parsed.error);
          throw new Error("Invalid user data format.");
        }

        const user: AppUser = parsed.data;

        return {
          ...user,
          name: user.name, // NextAuth requires 'name' property
          accessToken, // Attach access token to user object for JWT callback
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = { ...user };
        token.accessToken = (user as { accessToken: string }).accessToken;
        // Decode and set expiration
        const exp = decodeJwtExp((user as { accessToken: string }).accessToken);
        if (exp) token.exp = exp;
      }
      // Set the token expiration based on the decoded JWT 'exp'
      if (token.exp && token.exp * 1000 < Date.now()) {
        console.warn("⚠️ Token is expired.");
        return {}; // Return empty token to force re-auth
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as AppUser;
      session.accessToken = token.accessToken as string | undefined;

      if (typeof token.exp === "number") {
        // session.expires = new Date(token.exp * 1000).toISOString();
        session.expires = new Date(token.exp * 1000) as Date;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: authSecret,
});
