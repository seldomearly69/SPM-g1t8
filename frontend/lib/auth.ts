import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("credentials", credentials)
        if (credentials.email === "liawjunyi5000@gmail.com" && credentials.password === "asdf") {
          console.log("credentials", credentials)
          return { id: "1", name: "User", email: "user@example.com" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
    console.log(token, session)
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },

    async jwt({ token, user }) {
   
      // const dbUser = await db.user.findFirst({
      //   where: {
      //     email: token.email,
      //   },
      // });
 
     
      
        if (user) {
          token.id = user?.id;
          
    
        
        return token;
      }

      return {
        id: 1,
        name: "User",
        email: "liawjunyi5000@gmail.com",
        picture: "https://avatars.githubusercontent.com/u/1234567890?v=4",
      };
    },
  },
};
