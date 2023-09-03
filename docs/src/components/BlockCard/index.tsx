export default function ({
  children,
  endCover,
}: {
  children: React.ReactNode
  endCover?: React.ReactNode
}) {
  return (
    <div className="block-card">
      {children}
      {endCover && <div className="block-card-end-cover">{endCover}</div>}
    </div>
  )
}
