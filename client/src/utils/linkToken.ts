export function readSensitiveLinkToken(): string | null {
  const hashParams = new URLSearchParams(
    window.location.hash.replace(/^#/, "")
  );

  return (
    hashParams.get("token") ??
    new URLSearchParams(window.location.search).get("token")
  );
}

export function removeSensitiveLinkTokenFromAddressBar() {
  const url = new URL(window.location.href);

  url.searchParams.delete("token");

  const hashParams = new URLSearchParams(
    url.hash.replace(/^#/, "")
  );

  hashParams.delete("token");
  url.hash = hashParams.toString() ? `#${hashParams.toString()}` : "";

  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`
  );
}
