export function extractHashtags(text: string) {
  // Regular expression to match hashtags
  const hashtagRegex = /#\w+/g;
  // Find all hashtags in the text
  const hashtags = text.match(hashtagRegex);
  // Return hashtags or an empty array if none found
  return hashtags ? hashtags.map((tag) => tag.substring(1)) : [];
}
