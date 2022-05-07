export function replaceLinebreaksAndLinks(markdown: string): string {
  // replace line breaks with <br>
  markdown = markdown.replace(/(?:\r\n|\r|\n)/g, '<br>')

  // replace links
  const linkElements = markdown.match(/!?\[([^\]]*)\]\(([^\)]+)\)/gm)
  if (!linkElements || !linkElements.length) {
    return markdown
  }

  for (const linkElement of linkElements) {
    const text = linkElement.match(/\[(.*?)\]/)
    const url = linkElement.match(/\]\((.*?)\)/)
    if (text && text.length > 1 && url && url.length > 1) {
      markdown = markdown.replace(linkElement, `<a href="${url[1]}" target="_blank">${text[1]}</a>`)
    }
  }
  return markdown
}
