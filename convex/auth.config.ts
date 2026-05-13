export default {
  providers: [
    {
      // Replace YOUR_CLERK_FRONTEND_API with your Clerk frontend API domain
      // Found in: Clerk Dashboard → API Keys → Frontend API
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN ?? "",
      applicationID: "convex",
    },
  ],
};
