import supabaseClient from "@/lib/supabase/client"

export const googleOAuth = async () => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
}
