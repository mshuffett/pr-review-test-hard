export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>PR Review Test App</h1>
      <p>This is the home page. Navigate to /dashboard to see the dashboard.</p>
      <a href="/dashboard" style={{ color: "#0070f3" }}>
        Go to Dashboard
      </a>
    </main>
  );
}
