const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Aether",
  appDescription:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    "Art Gallery built with Next.js 13 and Tailwind CSS",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  stripeKey: process.env.NEXT_PUBLIC_STRIPE_KEY || "",
  khaltiKey: process.env.NEXT_PUBLIC_KHALTI_KEY || "",
};

export default config;
