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
          logo: "https://pbs.twimg.com/profile_images/1782436521590243328/h5K0ILhG_400x400.jpg",
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