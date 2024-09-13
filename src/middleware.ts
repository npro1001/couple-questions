import { auth } from "./lib/auth";

export default auth;

// Exceptions
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
