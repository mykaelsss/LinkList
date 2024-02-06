import supabaseServer from "@/lib/supabase/server";
export const fetchData = async () => {
    const { data: { session } } = await supabaseServer.auth.getSession();
    return session;
};
