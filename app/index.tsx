import { supabase } from "@/lib/supabase";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type AppRoute = "/dashboard" | "/signin";

export default function Index() {
  const [initialRoute, setInitialRoute] = useState<AppRoute | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setInitialRoute("/dashboard" as AppRoute);
      } else {
        setInitialRoute("/signin" as AppRoute);
      }
    } catch (error) {
      setInitialRoute("/signin" as AppRoute);
    }
  };

  // Eğer initialRoute henüz belirlenmemişse loading göster
  if (!initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1A1A1A",
        }}
      >
        <ActivityIndicator size="large" color="#ffa07d" />
      </View>
    );
  }

  return <Redirect href={initialRoute} />;
}
