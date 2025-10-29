const API_URL = "https://zvyzniwpmgpisvemyxge.functions.supabase.co/create-checkout-session";

async function startCheckout(plan) {
  const statusEl = document.getElementById("status");
  statusEl.textContent = "Processing checkout...";

  // Read ?token= from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  if (!token) {
    statusEl.textContent = "Missing access token.";
    alert("Missing access token in URL.");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plan }),
    });

    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error || "Failed to create checkout session");

    window.location.href = data.url; // Redirect to Stripe Checkout
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error starting checkout. Check console.";
    alert(err.message);
  }
}

document.getElementById("weekly").addEventListener("click", () => startCheckout("weekly"));
document.getElementById("monthly").addEventListener("click", () => startCheckout("monthly"));
document.getElementById("annual").addEventListener("click", () => startCheckout("annual"));
