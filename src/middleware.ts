import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/profile/:path*",
    "/practice-interviews/:path*",
    "/resume-analyzer/:path*",
    "/industry-insights/:path*",
    "/cover-letter/:path*",
  ],
};
