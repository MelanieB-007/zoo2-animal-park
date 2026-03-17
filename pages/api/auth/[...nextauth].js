import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaClient } from "@prisma/client";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export { prisma };

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id,
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
        await prisma.users.upsert({
          where: { id: user.id },
          update: {
            name: user.name,
            image: user.image,
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
        const dbUser = await prisma.users.findFirst({
          where: { email: session.user.email },
          select: { role: true }
        });

        console.log("DB User gefunden:", dbUser);
        session.user.role = dbUser?.role || "Besucher";
      } catch (error) {
        console.error("Prisma Fehler in Session:", error);
        session.user.role = "Besucher";
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);