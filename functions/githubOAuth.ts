import supabaseClient from "@/lib/supabase/client"

export const githubOAuth = async () => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
}
