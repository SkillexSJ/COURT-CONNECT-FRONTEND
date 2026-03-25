import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/response";
import type {
  SignInPayload,
  SignUpPayload,
  SignUpWithImagePayload,
  UserProfileImageResponse,
} from "@/types/auth.types";
import { env } from "@/config/env";
import { organizerService } from "./organizer.service";

const formatCodeAsMessage = (code: string) =>
  code
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const resolveAuthErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  if (error && typeof error === "object") {
    const maybeError = error as {
      message?: unknown;
      code?: unknown;
      statusText?: unknown;
    };

    if (
      typeof maybeError.message === "string" &&
      maybeError.message.trim().length > 0
    ) {
      return maybeError.message;
    }

    if (
      typeof maybeError.code === "string" &&
      maybeError.code.trim().length > 0
    ) {
      return formatCodeAsMessage(maybeError.code);
    }

    if (
      typeof maybeError.statusText === "string" &&
      maybeError.statusText.trim().length > 0
    ) {
      return maybeError.statusText;
    }
  }

  return "Authentication failed. Please try again.";
};

export const authService = {
  signUp: async (data: SignUpPayload) => {
    const res = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      image: data.image,
      callbackURL: `${env.APP_URL}/dashboard`,
    });
    if (res.error) {
      throw new Error(resolveAuthErrorMessage(res.error));
    }
    return res;
  },

  uploadProfileImage: async (imageFile: File) => {
    const formData = new FormData();
    formData.append("avatar", imageFile);

    const res = await apiClient.patch<ApiResponse<UserProfileImageResponse>>(
      "users/me/avatar",
      formData,
    );

    return res.data.avatarUrl;
  },

  signUpWithImage: async (data: SignUpWithImagePayload) => {
    const res = await authService.signUp({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (data.imageFile) {
      await authService.uploadProfileImage(data.imageFile);
    }

    if (data.role === "ORGANIZER") {
      await organizerService.createProfile({
        businessName: data.businessName?.trim() || "Organizer",
        phoneNumber: data.phoneNumber?.trim() || undefined,
      });

      // Refresh auth session so role changes are reflected immediately.
      await authService.signOut();
      await authService.signIn({
        email: data.email,
        password: data.password,
      });
    }

    return res;
  },

  signIn: async (data: SignInPayload) => {
    const res = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
    if (res.error) {
      throw new Error(resolveAuthErrorMessage(res.error));
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
