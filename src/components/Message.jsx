export function Message({ text }) {
  if (!text) {
    return null
  }

  return <div className="message">{text}</div>
}
