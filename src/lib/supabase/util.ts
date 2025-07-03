import React, { Dispatch, SetStateAction } from "react";
import { supabaseClient } from "./client";
import { User } from "@supabase/supabase-js";

export function useAuthStateChange(setUser: Dispatch<SetStateAction<User | undefined>>) {
	return React.useEffect(() => {

		const { data: authListener } = supabaseClient.auth.onAuthStateChange(
			(_, session) => {
				setUser(session?.user);
			}
		);

		return () => authListener.subscription.unsubscribe();
	}, [setUser]);
}

export function useAuthUser() {
	return React.useState<User | undefined>(undefined)
}

export async function getAuthUser() {
	const user = await supabaseClient.auth.getUser()
	return user.data.user
}

export type UserMetadata = Record<
	"avatar_url" | "email" | "full_name" | "name" | "preferred_username" | "user_name",
	string
>

export async function getAuthUserMetaData() {
	const user = await getAuthUser()
	return user?.user_metadata as UserMetadata
}
