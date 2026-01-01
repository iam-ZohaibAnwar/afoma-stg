import { useEffect } from "react";

export default function RedirectPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference"); // e.g. "123" for success

    if (window.opener) {
      // send reference to the parent windo
      const targetOrigin = "https://staging.afomamarketplace.com";
      window.opener.postMessage({ reference }, targetOrigin);

      // close this popup
      window.close();
    } else {
      console.warn("No opener window found");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <p>Redirecting, please wait...</p>
    </div>
  );
}
