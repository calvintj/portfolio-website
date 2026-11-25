// Turns the CV link set in admin into the Download CV href.
// A Google Docs link of any shape becomes its PDF export, so pasting the
// browser's /edit link works and visitors always get the latest version.

const GOOGLE_DOC =
  /^https:\/\/docs\.google\.com\/document\/(?:u\/\d+\/)?d\/([\w-]+)/;

/** Null means no button: empty, or a scheme that could run script. */
export function cvHref(url: string | undefined): string | null {
  const link = url?.trim();
  if (!link) return null;
  const doc = link.match(GOOGLE_DOC);
  if (doc)
    return `https://docs.google.com/document/d/${doc[1]}/export?format=pdf`;
  if (link.startsWith("https://")) return link;
  // Same-site path such as an uploaded PDF; "//" would be another host.
  if (link.startsWith("/") && !link.startsWith("//")) return link;
  return null;
}
