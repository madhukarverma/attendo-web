export function Raw({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Picture() {
  return <img src="/mascot.png" />;
}
