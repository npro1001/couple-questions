"use server";

import { signIn, signOut } from "@/lib/auth";
import {
  serverAddUserInterest,
  serverCreateUser,
  serverGetUserActiveGameId,
  serverGetUserInfo,
  serverRemoveUserInterest,
} from "@/lib/server-utils";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

// export async actionfunction logIn(prevState: unknown, formData: unknown) {
export async function actionLogIn(formData: FormData, callbackUrl: string) {
  if (!(formData instanceof FormData)) {
    console.log("Invalid form data");
    return { message: "Invalid form data" };
  }

  const formDataObject = Object.fromEntries(formData.entries());

  console.log("CALLBACK URL ", callbackUrl);

  try {
    await signIn("credentials", {
      ...formDataObject,
      callbackUrl,
      redirect: false,
    });

    redirect(callbackUrl);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { message: "Invalid credentials" };
        }
        default: {
          return { message: "Error. Could not sign in" };
        }
      }
    }
    throw error; //! nextjs redirect throws an error, so we need to rethrow it
  }
}

export async function actionLogOut() {
  await signOut({ redirectTo: "/login", redirect: true });
}

// export async actionfunction signUp(prevState: unknown, formData: unknown) {
export async function actionCreateUser(formData: FormData) {
  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );

  const user = await serverCreateUser(name, email, hashedPassword);
  if (!user) {
    return { message: "Failed to create user" };
  }

  await signIn("credentials", formData);
}

export async function actionGetUserActiveGameId() {
  const activeGameId = await serverGetUserActiveGameId();
  if (!activeGameId) {
    return null;
  }
  return activeGameId;
}
export async function actionGetUserInfo(userId: string) {
  const user = await serverGetUserInfo(userId);
  return user;
}
export async function actionAddUserInterest(userId: string, interest: string) {
  return await serverAddUserInterest(userId, interest);
}

export async function actionRemoveUserInterest(
  userId: string,
  interest: string
) {
  return await serverRemoveUserInterest(userId, interest);
}
