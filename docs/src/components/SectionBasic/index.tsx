export default function ({
  id,
  heading,
  children,
}: {
  id?: string
  heading?: string
  children: React.ReactNode
}) {
  return (
    <section className="section-basic" id={id}>
      <div className="section-basic-inner">
        {heading && <h2 className="section-basic-heading">{heading}</h2>}
        {children}
      </div>
    </section>
  )
}
