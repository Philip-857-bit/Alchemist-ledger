// app/providers.tsx
"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Add the provider directly using the 'privy:<provider_app_id>' format
        loginMethodsAndOrder: {
          primary: ["privy:cmd8euall0037le0my79qpz42"],
        },
        appearance: {
          theme: "dark",
          accentColor: "#8A2BE2",
          logo: "./logo.png",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}