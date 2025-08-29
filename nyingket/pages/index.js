// pages/index.js
import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [lastShortUrl, setLastShortUrl] = useState("");
  const [toast, setToast] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const url = e.target.url.value;

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (data.data && data.data.tiny_url) {
        setLastShortUrl(data.data.tiny_url);
      } else {
        showToast("Gagal memendekkan link!");
      }
    } catch (err) {
      console.error(err);
      showToast("Error koneksi ke server");
    }
  }

  function copyUrl() {
    if (!lastShortUrl) return;
    navigator.clipboard.writeText(lastShortUrl).then(() => {
      showToast("Shortlink berhasil disalin!");
    });
  }

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  }

  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  return (
    <>
      <Head>
        <title>Prasetya Studio Shortlink</title>
        <link rel="icon" href="/images/logo.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </Head>

      <main className={darkMode ? "dark" : ""}>
        <div className="container">
          <button className="dark-toggle" onClick={toggleDarkMode}>
            <i
              id="themeIcon"
              className={darkMode ? "bx bx-sun" : "bx bx-moon"}
            ></i>
          </button>

          <img src="/images/link.png" alt="Prasetya Studio" className="logo" />
          <h1>Prasetya Studio Shortlink</h1>

          <form id="shortenForm" className="form-group" onSubmit={handleSubmit}>
            <input
              type="url"
              name="url"
              placeholder="Tempel link panjangmu di sini..."
              required
            />
            <button type="submit">Shorten</button>
          </form>

          {lastShortUrl && (
            <div id="resultBox" className="result">
              <span className="shortlink">
                Shortlink kamu:{" "}
                <a href={lastShortUrl} target="_blank">
                  {lastShortUrl}
                </a>
              </span>
              <button className="copy-btn" onClick={copyUrl} title="Salin">
                <i className="bx bx-copy"></i>
              </button>
            </div>
          )}

          <div className="notes">
            <div className="note-item">
              <i className="bx bx-link"></i> Gunakan hanya link valid (contoh:
              https://…)
            </div>
            <div className="note-item">
              <i className="bx bx-shield"></i> Link yang disingkat tetap mengarah
              ke tujuan asli
            </div>
            <div className="note-item">
              <i className="bx bx-mobile"></i> Desain responsif, bisa dipakai
              dari HP maupun laptop
            </div>
            <div className="note-item">
              <i className="bx bx-time-five"></i> Shortlink ini sementara (dummy),
              belum tersimpan permanen
            </div>
          </div>

          <div className="credits">
            <span>Dipersembahkan oleh:</span>
            <div>
              <img src="/images/yo.designCYN.png" alt="Link Logo" />
            </div>
          </div>
        </div>

        {toast && <div id="toast" className="toast show">{toast}</div>}
      </main>

      <style jsx global>{`
        :root {
          --primary: #3b83f6;
          --bg: #f8fafc;
          --card: #ffffff;
          --text: #1e293b;
          --muted: #64748b;
        }

        body.dark,
        main.dark {
          --bg: #0f172a;
          --card: #1e293b;
          --text: #f1f5f9;
          --muted: #94a3b8;
        }

        body,
        main {
          margin: 0;
          font-family: "Manrope", sans-serif;
          background: var(--bg);
          color: var(--text);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 1rem;
          transition: background 0.3s, color 0.3s;
        }

        .container {
          background: var(--card);
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          transition: background 0.3s, color 0.3s;
          position: relative;
        }

        .logo {
          width: 80px;
          margin-bottom: 1rem;
        }

        h1 {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--primary);
        }

        .form-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        input[type="url"] {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.6rem;
          font-size: 1rem;
          background: #fff;
          color: var(--text);
        }

        body.dark input[type="url"],
        main.dark input[type="url"] {
          background: #334155;
          border: 1px solid #475569;
          color: var(--text);
        }

        input::placeholder {
          color: var(--muted);
        }

        button {
          background: var(--primary);
          color: #fff;
          border: none;
          padding: 0.75rem 1.25rem;
          font-size: 1rem;
          border-radius: 0.6rem;
          cursor: pointer;
          transition: 0.25s;
        }

        button:hover {
          background: #1d4ed8;
        }

        .result {
          margin-top: 1rem;
          font-size: 0.95rem;
          padding: 0.8rem;
          background: #eff6ff;
          border-radius: 0.6rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          word-break: break-all;
          transition: background 0.3s;
        }

        body.dark .result,
        main.dark .result {
          background: #1e3a8a33;
        }

        .shortlink {
          flex: 1;
        }

        .result a {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
        }

        .copy-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          color: var(--primary);
          padding: 0.3rem;
          border-radius: 0.4rem;
          transition: 0.2s;
        }

        .copy-btn:hover {
          background: rgba(37, 99, 235, 0.1);
        }

        .notes {
          text-align: left;
          margin-top: 2rem;
          font-size: 0.9rem;
          color: var(--muted);
        }

        .note-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
        }

        .note-item i {
          font-size: 1.2rem;
          color: var(--primary);
          margin-top: 0.1rem;
        }

        .credits {
          margin-top: 2rem;
          font-size: 0.85rem;
          color: var(--muted);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }

        .credits img {
          height: 28px;
          margin: 0 6px;
          vertical-align: middle;
        }

        /* Toast Notification */
        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary);
          color: #fff;
          padding: 0.7rem 1.2rem;
          border-radius: 0.6rem;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease, transform 0.3s ease;
          z-index: 9999;
        }

        .toast.show {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(-10px);
        }

        /* Dark Mode Toggle */
        .dark-toggle {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          font-size: 1.4rem;
          cursor: pointer;
          color: var(--muted);
          transition: color 0.3s;
        }

        .dark-toggle:hover {
          color: var(--primary);
        }
      `}</style>
    </>
  );
}
