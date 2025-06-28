<!-- login form -->
 <script lang="ts">
    import { supabase } from "$lib/supabaseBrowserClient";
    import { goto } from "$app/navigation";

    let email = '', password = '', error = '';

    async function submit() {
        const {error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (authError) {
            error = authError.message
        } else {
            goto('/')
        };
    };

 </script>

 <form on:submit|preventDefault={submit}>
    <input type='email' bind:value={email} placeholder="Email" required/>
    <input type='password' bind:value={password} placeholder="Password" required/>
    <button type='submit'>Log in</button>
    {#if error}<p style="color: red">{error}</p>{/if}
 </form>