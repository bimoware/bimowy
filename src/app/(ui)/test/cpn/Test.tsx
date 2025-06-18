"use client"
import { getAuthUser } from "@/db/util";
import { useEffect } from "react";

export default function Test() {
	useEffect(() => { getAuthUser().then(console.log) }, [])
	return <></>
}