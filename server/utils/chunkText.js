export function chunkText(text, chunkSize = 1000) {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    let end = start + chunkSize;
    // Avoid splitting mid-word
    while (end < text.length && text[end] !== ' ' && text[end] !== '\n') {
      end++;
    }
    chunks.push(text.substring(start, end).trim());
    start = end;
  }

  return chunks;
}