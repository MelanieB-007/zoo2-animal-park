import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import {query} from "../../../lib/db";

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
    async signIn({ user, account, profile }) {
      try {
        // Wir speichern oder aktualisieren den User in der MySQL DB
        // ON DUPLICATE KEY UPDATE sorgt dafür, dass wir den User nicht doppelt anlegen,
        // sondern nur das Bild oder den Namen aktualisieren, falls er sich bei Discord ändert.
        await query({
          query: `
                        INSERT INTO users (id, name, email, image)
                        VALUES (?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE name       = VALUES(name),
                                                image      = VALUES(image),
                                                last_login = CURRENT_TIMESTAMP
                    `,
          values: [user.id, user.name, user.email, user.image],
        });

        return true; // Login erlauben
      } catch (error) {
        console.error("Datenbank-Fehler beim Login:", error);
        return true;
      }
    },

    async session({ session, token }) {
      try {
        const results = await query({
          query: "SELECT role FROM users WHERE email = ? LIMIT 1",
          values: [session.user.email],
        });

        if (results.length > 0) {
          // Wir fügen die Rolle dem session.user Objekt hinzu
          session.user.role = results[0].role;
        } else {
          session.user.role = "Besucher";
        }
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