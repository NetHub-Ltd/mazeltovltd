// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import type { NextAuth } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//     expires?: Date | string; // ISO string
//     user: {
//       id: number | string;
//       name: string;
//       email: string;
//       accessToken;
//       exp: number;
//       // include other fields returned by your backend...
//     };
//   }

//   interface User {
//     accessToken: string;
//   }

//   interface JWT {
//     accessToken?: string;
//     user?: Session["user"];
//   }
// }


// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { NextAuth } from "next-auth";
import type { AppUser } from "@/schemas/UserSchema"; // adjust import path

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    expires?: Date | string; // default is ISO string
    user: AppUser & {
      accessToken?: string;
      exp?: number; // JWT expiry timestamp if you want to carry it
    };
  }

  interface User extends AppUser {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends AppUser {
    accessToken?: string;
    exp?: number;
  }
}
