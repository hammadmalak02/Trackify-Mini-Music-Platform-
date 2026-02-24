import { useState, useEffect, useRef } from "react";

const API = "http://localhost:3000/api";

// ─── API helpers ────────────────────────────────────────────────────────────
const api = {
  post: (path, body, form = false) =>
    fetch(`${API}${path}`, {
      method: "POST",
      credentials: "include",
      headers: form ? undefined : { "Content-Type": "application/json" },
      body: form ? body : JSON.stringify(body),
    }).then((r) => r.json()),
  get: (path) =>
    fetch(`${API}${path}`, { credentials: "include" }).then((r) => r.json()),
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const injectStyles = () => {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0a0a0f;
      --surface: #12121a;
      --surface2: #1a1a26;
      --border: rgba(255,255,255,0.07);
      --accent1: #ff4d6d;
      --accent2: #7b2fff;
      --accent3: #00d9ff;
      --text: #f0f0fa;
      --muted: #6b6b8a;
      --success: #00e5a0;
      --radius: 16px;
      --font-head: 'Syne', sans-serif;
      --font-body: 'DM Sans', sans-serif;
    }

    body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }

    /* ── Layout ── */
    .app { display: flex; min-height: 100vh; }
    .sidebar {
      width: 240px; min-height: 100vh; background: var(--surface);
      border-right: 1px solid var(--border); display: flex; flex-direction: column;
      padding: 28px 0; position: fixed; top: 0; left: 0; z-index: 100;
    }
    .main { margin-left: 240px; flex: 1; padding: 36px; min-height: 100vh; }

    /* ── Logo ── */
    .logo {
      font-family: var(--font-head); font-size: 22px; font-weight: 800;
      padding: 0 24px 32px;
      background: linear-gradient(135deg, var(--accent1), var(--accent2));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; letter-spacing: -0.5px;
    }
    .logo span { display: block; font-size: 11px; font-weight: 400; color: var(--muted);
      -webkit-text-fill-color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }

    /* ── Nav ── */
    .nav-item {
      display: flex; align-items: center; gap: 12px; padding: 12px 24px;
      cursor: pointer; transition: all .2s; color: var(--muted); font-size: 14px; font-weight: 500;
      border-left: 3px solid transparent; position: relative;
    }
    .nav-item:hover { color: var(--text); background: rgba(255,255,255,0.04); }
    .nav-item.active {
      color: var(--text); border-left-color: var(--accent1);
      background: linear-gradient(90deg, rgba(255,77,109,0.1), transparent);
    }
    .nav-icon { font-size: 18px; }

    /* ── Auth ── */
    .auth-wrap {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: var(--bg);
      background-image: radial-gradient(ellipse 60% 50% at 20% 30%, rgba(123,47,255,0.15) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 60% at 80% 70%, rgba(255,77,109,0.12) 0%, transparent 60%);
    }
    .auth-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 24px; padding: 48px 40px; width: 420px;
      box-shadow: 0 40px 80px rgba(0,0,0,0.5);
    }
    .auth-title { font-family: var(--font-head); font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .auth-sub { color: var(--muted); font-size: 14px; margin-bottom: 32px; }

    /* ── Forms ── */
    .field { margin-bottom: 18px; }
    .field label { display: block; font-size: 12px; font-weight: 500; color: var(--muted);
      text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .field input, .field select {
      width: 100%; background: var(--surface2); border: 1px solid var(--border);
      border-radius: 12px; padding: 12px 16px; color: var(--text); font-size: 14px;
      font-family: var(--font-body); outline: none; transition: border-color .2s;
    }
    .field input:focus, .field select:focus { border-color: var(--accent2); }
    .field select option { background: var(--surface2); }

    /* ── Buttons ── */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 24px; border-radius: 12px; border: none; cursor: pointer;
      font-family: var(--font-body); font-size: 14px; font-weight: 600;
      transition: all .2s; text-decoration: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent1), var(--accent2));
      color: #fff; width: 100%;
    }
    .btn-primary:hover { opacity: .88; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,77,109,.3); }
    .btn-ghost { background: rgba(255,255,255,0.06); color: var(--text); }
    .btn-ghost:hover { background: rgba(255,255,255,0.1); }
    .btn-sm { padding: 8px 16px; font-size: 13px; border-radius: 10px; }
    .btn-danger { background: rgba(255,77,109,0.15); color: var(--accent1); }

    /* ── Page header ── */
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
    .page-title { font-family: var(--font-head); font-size: 32px; font-weight: 800; }
    .page-title span { color: var(--accent1); }

    /* ── Cards ── */
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 20px; transition: all .25s; cursor: pointer;
      position: relative; overflow: hidden;
    }
    .card::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(123,47,255,0.06), rgba(255,77,109,0.06));
      opacity: 0; transition: opacity .25s;
    }
    .card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.15); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
    .card:hover::before { opacity: 1; }

    .card-art {
      width: 100%; aspect-ratio: 1; border-radius: 12px; margin-bottom: 16px;
      display: flex; align-items: center; justify-content: center; font-size: 40px;
      background: linear-gradient(135deg, var(--surface2), rgba(123,47,255,0.2));
      position: relative; overflow: hidden;
    }
    .card-title { font-family: var(--font-head); font-weight: 700; font-size: 15px; margin-bottom: 4px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-sub { color: var(--muted); font-size: 13px; }

    /* ── Music row ── */
    .track-list { display: flex; flex-direction: column; gap: 4px; }
    .track-row {
      display: flex; align-items: center; gap: 16px; padding: 12px 16px;
      border-radius: 12px; transition: background .2s; cursor: pointer;
    }
    .track-row:hover { background: var(--surface2); }
    .track-num { color: var(--muted); font-size: 13px; width: 20px; text-align: center; flex-shrink: 0; }
    .track-icon {
      width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center;
      justify-content: center; font-size: 18px; flex-shrink: 0;
      background: linear-gradient(135deg, rgba(123,47,255,0.3), rgba(255,77,109,0.3));
    }
    .track-info { flex: 1; min-width: 0; }
    .track-name { font-weight: 500; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .track-artist { color: var(--muted); font-size: 12px; margin-top: 2px; }
    .track-badge {
      font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px;
      background: rgba(0,217,255,0.12); color: var(--accent3); flex-shrink: 0;
    }

    /* ── Upload zone ── */
    .upload-zone {
      border: 2px dashed var(--border); border-radius: var(--radius); padding: 40px;
      text-align: center; transition: all .2s; cursor: pointer; background: var(--surface);
    }
    .upload-zone:hover, .upload-zone.drag { border-color: var(--accent2); background: rgba(123,47,255,0.06); }
    .upload-icon { font-size: 48px; margin-bottom: 16px; }
    .upload-text { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
    .upload-hint { color: var(--muted); font-size: 13px; }

    /* ── Tabs ── */
    .tabs { display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--border);
      border-radius: 14px; padding: 4px; margin-bottom: 28px; width: fit-content; }
    .tab {
      padding: 9px 20px; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 500;
      color: var(--muted); transition: all .2s; border: none; background: none; font-family: var(--font-body);
    }
    .tab.active { background: linear-gradient(135deg, var(--accent1), var(--accent2)); color: #fff; }

    /* ── Pill badge ── */
    .pill {
      display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px;
      border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .pill-artist { background: rgba(123,47,255,0.18); color: #b07fff; }
    .pill-user { background: rgba(0,217,255,0.12); color: var(--accent3); }

    /* ── Alert / Toast ── */
    .toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 999;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 14px; padding: 14px 20px; font-size: 14px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 10px;
      animation: slideUp .3s ease;
    }
    .toast.success { border-color: var(--success); }
    .toast.error { border-color: var(--accent1); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* ── Misc ── */
    .divider { text-align: center; color: var(--muted); font-size: 13px; margin: 20px 0;
      position: relative; }
    .divider::before, .divider::after {
      content: ''; position: absolute; top: 50%; width: 40%; height: 1px; background: var(--border);
    }
    .divider::before { left: 0; } .divider::after { right: 0; }

    .empty-state { text-align: center; padding: 80px 20px; color: var(--muted); }
    .empty-icon { font-size: 64px; margin-bottom: 16px; }
    .empty-text { font-size: 16px; font-weight: 500; }

    .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent1);
      border-radius: 50%; animation: spin .6s linear infinite; display: inline-block; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .user-info { margin-top: auto; padding: 16px 20px; border-top: 1px solid var(--border); }
    .user-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
    .user-role { margin-bottom: 12px; }

    .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 2px; color: var(--muted); padding: 0 24px; margin-bottom: 8px; }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
      z-index: 200; display: flex; align-items: center; justify-content: center;
    }
    .modal {
      background: var(--surface); border: 1px solid var(--border); border-radius: 24px;
      padding: 40px; width: 480px; max-width: 95vw;
      box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    }
    .modal-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; margin-bottom: 24px; }

    .album-header {
      display: flex; gap: 28px; align-items: flex-start; margin-bottom: 40px;
      padding: 32px; background: var(--surface); border-radius: 24px; border: 1px solid var(--border);
    }
    .album-cover {
      width: 140px; height: 140px; border-radius: 16px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; font-size: 56px;
      background: linear-gradient(135deg, rgba(123,47,255,0.4), rgba(255,77,109,0.4));
    }
    .album-meta h1 { font-family: var(--font-head); font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .album-meta p { color: var(--muted); font-size: 14px; margin-bottom: 12px; }

    a { color: var(--accent3); cursor: pointer; }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
};

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  if (!msg) return null;
  return (
    <div className={`toast ${type}`}>
      <span>{type === "success" ? "✅" : "❌"}</span>
      {msg}
    </div>
  );
}

// ─── Auth Pages ───────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login"
        ? { username: form.username, password: form.password }
        : form;
      const res = await api.post(endpoint, payload);
      if (res.user) {
        setToast({ msg: res.message, type: "success" });
        setTimeout(() => onLogin(res.user), 800);
      } else {
        setToast({ msg: res.message || "Something went wrong", type: "error" });
      }
    } catch {
      setToast({ msg: "Network error", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="auth-card">
        <div className="auth-title">
          {mode === "login" ? "Welcome back 🎵" : "Join the music 🎧"}
        </div>
        <div className="auth-sub">
          {mode === "login" ? "Sign in to your account" : "Create a free account"}
        </div>

        <div className="tabs">
          <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Login</button>
          <button className={`tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Register</button>
        </div>

        <div className="field">
          <label>Username</label>
          <input placeholder="your_username" value={form.username} onChange={set("username")} />
        </div>
        {mode === "register" && (
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
          </div>
        )}
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
        </div>
        {mode === "register" && (
          <div className="field">
            <label>Role</label>
            <select value={form.role} onChange={set("role")}>
              <option value="user">🎧 Listener</option>
              <option value="artist">🎤 Artist</option>
            </select>
          </div>
        )}

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <span className="spinner" /> : (mode === "login" ? "Sign In" : "Create Account")}
        </button>
      </div>
    </div>
  );
}

// ─── Upload Music Modal ───────────────────────────────────────────────────────
function UploadModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleUpload = async () => {
    if (!title || !file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("music", file);
    const res = await api.post("/music/upload", fd, true);
    setLoading(false);
    if (res.music) onSuccess(res.music);
    else alert(res.message);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">🎵 Upload a Track</div>
        <div className="field">
          <label>Track Title</label>
          <input placeholder="Song name..." value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div
          className={`upload-zone ${drag ? "drag" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}
        >
          <div className="upload-icon">{file ? "🎵" : "📁"}</div>
          <div className="upload-text">{file ? file.name : "Drop your audio file here"}</div>
          <div className="upload-hint">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "MP3, WAV, FLAC supported"}</div>
          <input ref={fileRef} type="file" accept="audio/*" style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleUpload} disabled={loading || !title || !file}>
            {loading ? <span className="spinner" /> : "Upload Track"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Album Modal ───────────────────────────────────────────────────────
function CreateAlbumModal({ musics, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const handleCreate = async () => {
    if (!title) return;
    setLoading(true);
    const res = await api.post("/music/album", { title, musics: selected });
    setLoading(false);
    if (res.album) onSuccess(res.album);
    else alert(res.message);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">📀 Create Album</div>
        <div className="field">
          <label>Album Title</label>
          <input placeholder="Album name..." value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div style={{ marginBottom: 8, fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Select Tracks</div>
        <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          {musics.map((m) => (
            <div key={m._id} className="track-row" style={{ background: selected.includes(m._id) ? "rgba(123,47,255,0.15)" : undefined }}
              onClick={() => toggle(m._id)}>
              <span style={{ fontSize: 18 }}>{selected.includes(m._id) ? "✅" : "⬜"}</span>
              <div className="track-icon">🎵</div>
              <div className="track-info">
                <div className="track-name">{m.title}</div>
              </div>
            </div>
          ))}
          {musics.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13, padding: 12 }}>Upload some tracks first</div>}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleCreate} disabled={loading || !title}>
            {loading ? <span className="spinner" /> : "Create Album"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ user, page, setPage, onLogout }) {
  const isArtist = user?.role === "artist";
  const navItems = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "music", icon: "🎵", label: "Browse Music" },
    { id: "albums", icon: "📀", label: "Albums" },
    ...(isArtist ? [
      { id: "upload", icon: "⬆️", label: "Upload Track" },
      { id: "create-album", icon: "➕", label: "Create Album" },
    ] : []),
  ];

  return (
    <aside className="sidebar">
      <div className="logo">Trackify<span>Music Platform</span></div>
      <div className="section-label">Menu</div>
      {navItems.map((n) => (
        <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
          <span className="nav-icon">{n.icon}</span>
          {n.label}
        </div>
      ))}
      <div className="user-info">
        <div className="user-name">{user?.username}</div>
        <div className="user-role">
          <span className={`pill ${isArtist ? "pill-artist" : "pill-user"}`}>
            {isArtist ? "🎤 Artist" : "🎧 Listener"}
          </span>
        </div>
        <button className="btn btn-danger btn-sm" style={{ width: "100%" }} onClick={onLogout}>Sign Out</button>
      </div>
    </aside>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ user, setPage }) {
  const isArtist = user?.role === "artist";
  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontFamily: "var(--font-head)", fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 12 }}>
          Good vibes,<br /><span style={{ background: "linear-gradient(135deg, var(--accent1), var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{user?.username} 👋</span>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 16 }}>
          {isArtist ? "Share your music with the world." : "Discover amazing music from talented artists."}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {[
          { icon: "🎵", label: "Browse Music", sub: "Explore all tracks", page: "music", grad: "rgba(255,77,109,0.15)" },
          { icon: "📀", label: "Albums", sub: "Curated collections", page: "albums", grad: "rgba(123,47,255,0.15)" },
          ...(isArtist ? [
            { icon: "⬆️", label: "Upload Track", sub: "Share your art", page: "upload", grad: "rgba(0,217,255,0.1)" },
            { icon: "➕", label: "Create Album", sub: "Organize your work", page: "create-album", grad: "rgba(0,229,160,0.1)" },
          ] : []),
        ].map((item) => (
          <div key={item.page} className="card" onClick={() => setPage(item.page)}
            style={{ background: `linear-gradient(135deg, var(--surface), ${item.grad})` }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{item.label}</div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Music Page ───────────────────────────────────────────────────────────────
function MusicPage() {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/music/").then((r) => {
      setMusics(r.musicsc || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: "center", paddingTop: 80 }}><span className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Browse <span>Music</span></h1>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>{musics.length} tracks</span>
      </div>
      {musics.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🎵</div><div className="empty-text">No tracks yet</div></div>
      ) : (
        <div className="track-list">
          {musics.map((m, i) => (
            <div key={m._id} className="track-row">
              <div className="track-num">{i + 1}</div>
              <div className="track-icon">🎵</div>
              <div className="track-info">
                <div className="track-name">{m.title}</div>
                <div className="track-artist">{m.artist?.username || "Unknown Artist"}</div>
              </div>
              <a href={m.uri} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"
                onClick={(e) => e.stopPropagation()}>▶ Play</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Albums Page ──────────────────────────────────────────────────────────────
function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/music/albums").then((r) => { setAlbums(r.albums || []); setLoading(false); });
  }, []);

  const openAlbum = async (album) => {
    setSelected(album);
    const res = await api.get(`/music/albums/${album._id}`);
    setDetail(res.album);
  };

  if (loading) return <div style={{ textAlign: "center", paddingTop: 80 }}><span className="spinner" /></div>;

  if (selected) {
    const a = detail || selected;
    return (
      <div>
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }} onClick={() => { setSelected(null); setDetail(null); }}>
          ← Back to Albums
        </button>
        <div className="album-header">
          <div className="album-cover">📀</div>
          <div className="album-meta">
            <h1>{a.title}</h1>
            <p>by {a.artist?.username || "Unknown Artist"}</p>
            <p style={{ color: "var(--muted)" }}>{a.musics?.length || 0} tracks</p>
          </div>
        </div>
        {detail?.musics?.length > 0 ? (
          <div className="track-list">
            {detail.musics.map((m, i) => (
              <div key={m._id} className="track-row">
                <div className="track-num">{i + 1}</div>
                <div className="track-icon">🎵</div>
                <div className="track-info">
                  <div className="track-name">{m.title}</div>
                </div>
                <a href={m.uri} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">▶ Play</a>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state"><div className="empty-icon">🎵</div><div className="empty-text">No tracks in album</div></div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">All <span>Albums</span></h1>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>{albums.length} albums</span>
      </div>
      {albums.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📀</div><div className="empty-text">No albums yet</div></div>
      ) : (
        <div className="grid">
          {albums.map((a) => (
            <div key={a._id} className="card" onClick={() => openAlbum(a)}>
              <div className="card-art">📀</div>
              <div className="card-title">{a.title}</div>
              <div className="card-sub">{a.artist?.username || "Unknown Artist"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Upload Page ──────────────────────────────────────────────────────────────
function UploadPage() {
  const [showModal, setShowModal] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const [toast, setToast] = useState(null);

  const onSuccess = (music) => {
    setShowModal(false);
    setUploaded((u) => [music, ...u]);
    setToast({ msg: "Track uploaded successfully!", type: "success" });
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <h1 className="page-title">Upload <span>Tracks</span></h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ New Upload</button>
      </div>

      <div className="upload-zone" onClick={() => setShowModal(true)}>
        <div className="upload-icon">🎵</div>
        <div className="upload-text">Click to upload a new track</div>
        <div className="upload-hint">MP3, WAV, FLAC — powered by ImageKit</div>
      </div>

      {uploaded.length > 0 && (
        <>
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 700, margin: "32px 0 16px" }}>Just Uploaded</h2>
          <div className="track-list">
            {uploaded.map((m, i) => (
              <div key={m.id || i} className="track-row">
                <div className="track-icon">🎵</div>
                <div className="track-info">
                  <div className="track-name">{m.title}</div>
                  <div className="track-artist">Uploaded just now</div>
                </div>
                <span className="track-badge">NEW</span>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && <UploadModal onClose={() => setShowModal(false)} onSuccess={onSuccess} />}
    </div>
  );
}

// ─── Create Album Page ────────────────────────────────────────────────────────
function CreateAlbumPage() {
  const [showModal, setShowModal] = useState(false);
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get("/music/").then((r) => setMusics(r.musicsc || []));
    api.get("/music/albums").then((r) => setAlbums(r.albums || []));
  }, []);

  const onSuccess = (album) => {
    setShowModal(false);
    setAlbums((a) => [album, ...a]);
    setToast({ msg: "Album created!", type: "success" });
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <h1 className="page-title">Your <span>Albums</span></h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ New Album</button>
      </div>

      {albums.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📀</div>
          <div className="empty-text">No albums yet — create your first!</div>
        </div>
      ) : (
        <div className="grid">
          {albums.map((a) => (
            <div key={a._id} className="card">
              <div className="card-art">📀</div>
              <div className="card-title">{a.title}</div>
              <div className="card-sub">{a.musics?.length || 0} tracks</div>
            </div>
          ))}
        </div>
      )}

      {showModal && <CreateAlbumModal musics={musics} onClose={() => setShowModal(false)} onSuccess={onSuccess} />}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(injectStyles, []);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);

  const handleLogin = (u) => setUser(u);

  const handleLogout = async () => {
    await api.post("/auth/logout", {});
    setUser(null);
    setPage("home");
    setToast({ msg: "Logged out!", type: "success" });
  };

  if (!user) return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <AuthPage onLogin={handleLogin} />
    </>
  );

  const isArtist = user.role === "artist";

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage user={user} setPage={setPage} />;
      case "music": return <MusicPage />;
      case "albums": return <AlbumsPage />;
      case "upload": return isArtist ? <UploadPage /> : <MusicPage />;
      case "create-album": return isArtist ? <CreateAlbumPage /> : <AlbumsPage />;
      default: return <HomePage user={user} setPage={setPage} />;
    }
  };

  return (
    <div className="app">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Sidebar user={user} page={page} setPage={setPage} onLogout={handleLogout} />
      <main className="main">{renderPage()}</main>
    </div>
  );
}