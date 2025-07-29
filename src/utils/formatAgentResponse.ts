export const formatAgentResponse = (response: string) => {
  if (response.includes('**') || response.includes('*') || response.includes('http')) {
    return response
      .split('\n')
      .map((line, index) => {
        let formattedLine = line

        // Handle URLs
        const urlRegex = /\[([^\]]+)\]\(([^)]+)\)|(?:https?:\/\/[^\s]+)/g
        formattedLine = formattedLine.replace(urlRegex, (match, text, url) => {
          if (text && url) {
            // Handle markdown style links: [text](url)
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${text}</a>`
          } else {
            // Handle plain URLs
            return `<a href="${match}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${match}</a>`
          }
        })

        // Handle double asterisk bold text
        const doubleBoldMatches = formattedLine.match(/\*\*(.*?)\*\*/g)
        if (doubleBoldMatches) {
          doubleBoldMatches.forEach((match) => {
            const text = match.slice(2, -2)
            formattedLine = formattedLine.replace(match, `<strong>${text}</strong>`)
          })
        }

        // Handle single asterisk bold text
        const singleBoldMatches = formattedLine.match(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g)
        if (singleBoldMatches) {
          singleBoldMatches.forEach((match) => {
            const text = match.slice(1, -1)
            formattedLine = formattedLine.replace(match, `<strong>${text}</strong>`)
          })
        }

        // Handle bullet points
        if (formattedLine.trim().startsWith('*')) {
          const text = formattedLine.trim().substring(1).trim()
          return `<li class="ml-4">${text}</li>`
        }

        // Regular text
        return formattedLine ? `<p>${formattedLine}</p>` : ''
      })
      .join('')
  }
  return response
}
