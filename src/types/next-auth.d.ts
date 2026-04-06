import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Wird zurückgegeben, wenn du `useSession`, `getSession`
   * oder `getServerSession` aufrufst.
   */
  interface Session {
    user: {
      /** Die Rolle des Nutzers aus der Datenbank (z.B. "Direktor"). */
      role?: string;
      id?: string;
    } & DefaultSession["user"];
  }

  /**
   * Die Struktur des Users in der Datenbank
   */
  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  /** Wird zurückgegeben, wenn du das JWT-Callback nutzt. */
  interface JWT {
    role?: string;
  }
}
