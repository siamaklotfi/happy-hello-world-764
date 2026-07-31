import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "student" | "researcher" | "admin";

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadRoles = async (uid: string) => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      if (active) setRoles((data ?? []).map((r) => r.role as AppRole));
    };

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user ?? null);
      if (data.user) void loadRoles(data.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      if (session?.user && (event === "SIGNED_IN" || event === "USER_UPDATED")) {
        void loadRoles(session.user.id);
      }
      if (event === "SIGNED_OUT") setRoles([]);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const isAdmin = roles.includes("admin");
  const isResearcher = roles.includes("researcher");

  return {
    user,
    roles,
    loading,
    isAdmin,
    isResearcher,
    homePath: isAdmin ? "/admin" : isResearcher ? "/researcher-panel" : "/dashboard",
  };
}
