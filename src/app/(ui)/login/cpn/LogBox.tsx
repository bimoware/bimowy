"use client"
import { supabase } from "@/db/client"
import Logout from "./Logout"
import Login from "./Login"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"

export default function LogBox() {
	const [user, setUser] = useState<User | null>()

	useEffect(() => {
		supabase.auth.getUser()
			.then(res => setUser(res.data.user))

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_, session) => {
				setUser(session?.user);
			}
		);

		return () => authListener.subscription.unsubscribe();
	}, []);


	return (
		<div className="w-full h-full flex justify-center items-center">
			{
				!user
					? <Login />
					: <Logout {...{ user }} />
			}
		</div>
	)
}