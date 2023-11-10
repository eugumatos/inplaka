// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterText(text: any, size = 20) {
  const textCovertedToString = String(text)

  if (textCovertedToString.length < size) {
    return text
  }

  return `${textCovertedToString.substring(0, size)}...`
}
