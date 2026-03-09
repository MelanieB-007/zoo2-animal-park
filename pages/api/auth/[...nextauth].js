import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import prisma from "../../../lib/generated/client";


export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          // Wir priorisieren den global_name (Display Name) vor dem Usernamen
          name: profile.global_name || profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        // Wir nutzen Prisma upsert: Update falls vorhanden, sonst Create
        await prisma.users.upsert({
          where: { id: user.id },
          update: {
            name: user.name,
            image: user.image,
            // Falls du ein Feld 'last_login' hast, kannst du es hier updaten
          },
          create: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        });
        return true;
      } catch (error) {
        console.error("Datenbank-Fehler beim Login:", error);
        return true;
      }
    },

    async session({ session }) {
      try {
        // Rolle mit Prisma holen
        const dbUser = await prisma.users.findUnique({
          where: { email: session.user.email },
          select: { role: true }
        });

        session.user.role = dbUser?.role || "Besucher";
      } catch (error) {
        console.error("Fehler beim Holen der Rolle:", error);
        session.user.role = "Besucher";
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);