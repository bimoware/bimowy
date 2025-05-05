export default function TestPage() {
  return <></>
}

// "use client";

// import Image from "next/image";
// import { useState } from "react";

// const tabs = [
//   { id: "custom", name: "Personalization", icon: '/svgs/tune.svg' },
//   { id: "privacy", name: 'Privacy', icon: '/svgs/privacy.svg' }
// ]

// export default function TestPage() {
//   const [selectedTabID, setSelectedTabID] = useState<string | false>(false)
//   return <div className="p-4 w-full h-full flex gap-8">
//     <div className="h-full w-56 rounded-2xl flex flex-col gap-1">
//       {
//         tabs.map(tab => <div key={tab.id} className={`rounded-md
//           flex items-center p-1 px-3 gap-2
//           cursor-pointer
//           duration-150
//           select-none
//           ${selectedTabID == tab.id
//             ? "bg-neutral-900 translate-x-1 scale-105"
//             : "hover:bg-neutral-900 hover:translate-x-1 hover:scale-105"
//           }`}
//           onClick={() => setSelectedTabID(prevTabID => prevTabID != tab.id && tab.id)}>
//           <Image src={tab.icon} width={20} height={20} alt={tab.name}
//             className="" />
//           <span>{tab.name}</span>
//         </div>)
//       }
//     </div>
//     <section>
//       {selectedTabID}
//     </section>
//   </div>
// }
