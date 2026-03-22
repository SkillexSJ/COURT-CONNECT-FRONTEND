/**
 * LIBS
 */
import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import { env } from "@/config/env";

export const authService = {
  signUp: async (data: {
    email: string;
    password: string;
    name: string;
    image?: string;
  }) => {
    const res = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      image: data.image,
      callbackURL: `${env.APP_URL}/dashboard`,
    });
    if (res.error) {
      throw res.error;
    }
    return res;
  },

  // TODO: Implement signUpWithImage after backend endpoint is ready
  // This will handle profile image upload during signup
  /* signUpWithImage: async (data: {
    email: string;
    password: string;
    name: string;
    role: string;
    imageFile: File;
  }) => {
    // Implementation pending: POST /users/signup-with-image
  }, */

  signIn: async (data: { email: string; password: string }) => {
    const res = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
    if (res.error) {
      throw res.error;
    }
    return res;
  },

  googleSignIn: async () => {
    return await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  },

  signOut: async () => {
    return await authClient.signOut();
  },
};
