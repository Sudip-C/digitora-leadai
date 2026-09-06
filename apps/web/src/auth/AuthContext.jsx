import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getSupabaseClient } from "../lib/supabase.js";

const AuthContext = createContext(undefined);

export function AuthProvider({ children, client }) {
  const supabase = useMemo(() => client ?? getSupabaseClient(), [client]);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initializationError, setInitializationError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let receivedAuthEvent = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      receivedAuthEvent = true;

      if (!isMounted) {
        return;
      }

      setSession(nextSession);
      setInitializationError(null);
      setIsLoading(false);
    });

    async function restoreSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (isMounted && !receivedAuthEvent) {
          setSession(data.session ?? null);
        }
      } catch (error) {
        if (isMounted && !receivedAuthEvent) {
          setSession(null);
          setInitializationError(error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signUp = useCallback(
    async ({ email, password, fullName }) => {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      return data;
    },
    [supabase],
  );

  const signIn = useCallback(
    async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }, [supabase]);

  const value = useMemo(
    () => ({
      initializationError,
      isAuthenticated: Boolean(session?.user),
      isLoading,
      session,
      signIn,
      signOut,
      signUp,
      user: session?.user ?? null,
    }),
    [initializationError, isLoading, session, signIn, signOut, signUp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
