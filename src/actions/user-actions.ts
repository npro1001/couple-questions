"use server";

import { signIn, signOut } from "@/lib/auth";
import {
  serverAddUserInterest,
  serverCreateUser,
  serverGetAuthedUserInfo,
  serverGetUserActiveGameId,
  serverGetUserInfo,
  serverRemoveUserInterest,
  serverUseQCoin,
} from "@/lib/server-utils";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { logInFormSchema, signUpFormSchema } from "@/lib/validations";

export async function actionLogIn(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data 1" };
  }

  const validatedFormDataObject = logInFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validatedFormDataObject.success) {
    const errors = validatedFormDataObject.error.format();
    console.log(errors);
    if (errors.invite !== undefined) {
      return { message: "Invite link is invalid" };
    } else {
      return { message: "Invalid form data" };
    }
  }

  const { invite: gameId } = validatedFormDataObject.data;
  let callbackUrl;
  if (gameId && gameId !== "") {
    callbackUrl = `/app/game-lobby?invite=${gameId}`;
  } else {
    callbackUrl = "/app/dashboard";
  }

  try {
    await signIn("credentials", {
      ...validatedFormDataObject.data,
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

export async function actionCreateUser(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data" };
  }

  const validatedFormDataObject = signUpFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validatedFormDataObject.success) {
    const errors = validatedFormDataObject.error.format();
    console.log(errors);
    if (errors.invite !== undefined) {
      return { message: "Invite link is invalid" };
    } else {
      return { message: `Invalid form data` };
    }
  }

  const { name, email, password } = validatedFormDataObject.data;
  const hashedPassword = await bcrypt.hash(password, 10);

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
export async function actionGetAuthedUserInfo() {
  const user = await serverGetAuthedUserInfo();
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

export async function actionUseQCoin() {
  return await serverUseQCoin();
}
