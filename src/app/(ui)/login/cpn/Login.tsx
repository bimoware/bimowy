"use client"
import { supabase } from "@/db/client";
import Image from "next/image";
import { FormEvent } from "react";

export default function Login() {
	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		await supabase.auth.signInWithOAuth({
			provider: "github"
		})
	}

	return <form {...{ onSubmit }}>
		<button className="flex items-center justify-center gap-3
	rounded-xl
	outline-2 outline-white/20
	hover:outline-white/50 hover:scale-[102%] transition-all cursor-pointer
	p-1.5 px-3
	w-fit
	h-fit">
			<Image src={"/svgs/github.svg"} alt={"Github"} width={50} height={50}
				className="h-5 w-5 aspect-square" />
			<span>Login with Github</span>
		</button>
	</form>
}