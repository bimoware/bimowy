<<<<<<< Updated upstream:src/db/util.ts
<<<<<<< Updated upstream:src/db/util.ts
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { supabase } from "./client";
=======
=======
>>>>>>> Stashed changes:src/lib/supabase/util.ts
import React, { Dispatch, SetStateAction } from "react";
import { supabaseClient } from "./client";
>>>>>>> Stashed changes:src/lib/supabase/util.ts
import { User } from "@supabase/supabase-js";

export function useAuthStateChange(setUser: Dispatch<SetStateAction<User | undefined>>) {
	return React.useEffect(() => {

		const { data: authListener } = supabase.auth.onAuthStateChange(
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
	const user = await supabase.auth.getUser()
	return user.data.user
}

export async function getAuthUserMetaData() {
	const user = await getAuthUser()
	return user?.user_metadata
}
