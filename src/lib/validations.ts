import z from "zod";

const alphanumericPattern = /^[a-zA-Z0-9]*$/;
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const gameLobbySearchParamsSchema = z.object({
  invite: z.string().regex(objectIdPattern, "Invalid game ID").optional(),
});

export const logInFormSchema = z.object({
  email: z.string().email("Not a valid email").max(100),
  password: z.string().min(4),
  invite: z
    .union([
      z.string().regex(objectIdPattern, "Invalid invite link"),
      z.string().length(0),
    ])
    .optional(),
});

export const signUpFormSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(20)
    .regex(alphanumericPattern, "Interest can't contain special characters"),
  email: z.string().email("Not a valid email").max(100),
  password: z.string().min(4),
  invite: z
    .union([
      z.string().regex(objectIdPattern, "Invalid invite link"),
      z.string().length(0),
    ])
    .optional(),
  // TODO implement join via signup
});

// no special characters
export const interestSchema = z
  .string()
  .min(3)
  .regex(alphanumericPattern, "Interest can't contain special characters");

export type TLogInFormSchema = z.infer<typeof logInFormSchema>;
export type TSignUpFormSchema = z.infer<typeof signUpFormSchema>;
export type TInterestSchema = z.infer<typeof interestSchema>;
export type TGameLobbySearchParamsSchema = z.infer<
  typeof gameLobbySearchParamsSchema
>;
