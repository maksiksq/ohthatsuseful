import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

// This slightly weird Supabase SvelteKit example basically:
// https://supabase.com/docs/guides/auth/server-side/sveltekit


const supabase: Handle = async ({ event: e, resolve }) => {
    // @ts-ignore no idea
    e.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => e.cookies.getAll(),
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({name, value, options}) => {
                    e.cookies.set(name, value, {...options, path: '/'});
                })
            }
        }
    })

    e.locals.safeGetSession = async () => {
        const {
            data: { session },
        } = await e.locals.supabase.auth.getSession()
        if (!session) {
            return { session: null, user: null }
        }

        const {
            data: { user },
            error,
        } = await e.locals.supabase.auth.getUser()
        if (error) {
            // JWT validation has failed
            return { session: null, user: null }
        }

        return { session, user }
    }

    return resolve(e, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range' || name === 'x-supabase-api-version'
        },
    })
}

const authGuard: Handle = async ({ event: e, resolve }) => {
    const { session, user } = await e.locals.safeGetSession()
    e.locals.session = session
    e.locals.user = user

    if (!e.locals.session && e.url.pathname.startsWith('/admin')) {
        redirect(303, '/auth')
    }

    if (e.locals.session && e.url.pathname === '/auth') {
        redirect(303, '/admin')
    }

    return resolve(e)
}

export const handle: Handle = sequence(supabase, authGuard)