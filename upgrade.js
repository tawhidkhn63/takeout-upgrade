const API_URL = "https://zvyzniwpmgpisvemyxge.functions.supabase.co/create-checkout-session";

const statusEl = document.getElementById("status");
const mainEl = document.getElementById("main");
const successEl = document.getElementById("success");

async function startCheckout(plan) {
  if (!plan) {
    alert("Missing plan type.");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (!token) {
    statusEl.textContent = "Missing Supabase token. Please reopen from the app.";
    return;
  }

  statusEl.textContent = "Creating checkout session...";

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

    statusEl.textContent = "Redirecting to Stripe...";
    window.location.href = data.url; // ✅ Send user straight to Stripe
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error creating session. Check console.";
    alert(err.message);
  }
}

// Manual plan buttons (for fallback testing)
document.getElementById("weekly").addEventListener("click", () => startCheckout("weekly"));
document.getElementById("monthly").addEventListener("click", () => startCheckout("monthly"));
document.getElementById("annual").addEventListener("click", () => startCheckout("annual"));

// ✅ Auto-start checkout or show success screen if returning
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get("plan");
  const token = urlParams.get("token");
  const success = urlParams.get("success");

  if (success === "true") {
    mainEl.style.display = "none";
    successEl.style.display = "block";
    return;
  }

  if (plan && token) {
    startCheckout(plan);
  } else {
    statusEl.textContent = "Select a plan to begin.";
  }
});
