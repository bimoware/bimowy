import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { supabase } from "./client";
import { User } from "@supabase/supabase-js";

export function useAuthStateChange(setUser: Dispatch<SetStateAction<User | null>>) {
	return useEffect(() => {

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_, session) => {
				setUser(session?.user || null);
			}
		);

		return () => authListener.subscription.unsubscribe();
	}, []);
}

export function useAuthUser() {
	return useState<User | null>(null)
}

export async function getAuthUser() {
	const user = await supabase.auth.getUser()
	return user.data.user
}

export async function getAuthUserMetaData() {
	const user = await getAuthUser()
	return user?.user_metadata
}
