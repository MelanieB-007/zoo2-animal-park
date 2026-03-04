import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

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
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);