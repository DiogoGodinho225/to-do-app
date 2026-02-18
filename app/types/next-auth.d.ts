import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tag?: string | null;
      created_at?: string | null;
      image_url?: string | null;
      first_name?: string | null,
      last_name?: string | null,
      email?: string | null,
    }
  }

  interface User {
    id: string;
    tag?: string | null;
    created_at?: string | null;
    image_url?: string | null;
    first_name?: string | null,
    last_name?: string | null,
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email?: string | null;
    tag?: string | null;
    created_at?: string | null;
    image_url?: string | null;
    first_name?: string | null,
    last_name?: string | null,
  }
}
