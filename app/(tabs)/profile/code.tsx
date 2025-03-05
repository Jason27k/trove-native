import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { router } from "expo-router";
import { save, getValueFor } from "@/lib/secureStore";
import ThemedView from "@/components/ThemedView";

const ANILIST_CLIENT_ID = process.env.EXPO_PUBLIC_ANILIST_CLIENT_ID;
const REDIRECT_URI = "https://animetrove.com/oauth";
const ANILIST_CLIENT_SECRET = process.env.EXPO_PUBLIC_ANILIST_CLIENT_SECRET;
const AUTH_URL = `https://anilist.co/api/v2/oauth/authorize?client_id=${ANILIST_CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&response_type=code`;

const AniListLogin = () => {
  const [code, setCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCode = async () => {
      const code = await getValueFor("code");
      if (code) setCode(code);
    };
    fetchCode();
  }, []);

  useEffect(() => {
    async function fetchTokens() {
      if (!code) return;

      setIsLoading(true);
      try {
        console.log("Fetching tokens with code:", code);

        const response = await fetch("https://anilist.co/api/v2/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: ANILIST_CLIENT_ID,
            client_secret: ANILIST_CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: code,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          await save("access_token", data.access_token);
          await save("refresh_token", data.refresh_token);
          // Clear the code after successful token fetch
          await save("code", "");
          // Only navigate after successfully saving tokens
          router.replace("/profile");
        } else {
          console.error("Token fetch error:", data);
          // If there was an error, clear the code to prevent infinite loops
          await save("code", "");
        }
      } catch (error) {
        console.error("Error in fetchTokens:", error);
        // Clear code on error to prevent loops
        await save("code", "");
      } finally {
        setIsLoading(false);
      }
    }

    if (code) {
      fetchTokens();
    }
  }, [code]);

  const handleNavigation = (event: WebViewNavigation) => {
    if (event.url.startsWith(REDIRECT_URI)) {
      const codeMatch = event.url.match(/code=([^&]+)/);
      if (codeMatch) {
        const authCode = codeMatch[1];
        console.log("Authorization Code:", authCode);
        save("code", authCode);
        setCode(authCode);
      }
    }
  };

  if (isLoading) {
    return (
      <ThemedView>
        <Text className="text-3xl text-black dark:text-white">
          Authenticating with AniList...
        </Text>
      </ThemedView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: AUTH_URL }}
        onNavigationStateChange={handleNavigation}
        incognito={true}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default AniListLogin;
