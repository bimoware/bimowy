export default function TestPage() {
  return (
    <div className="overflow-x-scroll">
      {
        Array
          .from({ length: 200 })
          .map((_, i) => <img
            key={i}
            width={300}
            height={300}
            alt={"Image"}
            src={`https://skinmc.net/achievement/${i}/Too+curious/Discover+my+easter+egg`}
          />)}
    </div>
  )
}
