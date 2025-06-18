"use client"
import { getAuthUser } from "@/db/util";
import { useEffect } from "react";

export default function Test() {
	useEffect(() => {
		console.log('okkk')
		getAuthUser()
			.then(user => console.log(user))
	})
	return <></>
}