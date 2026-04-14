body {
  margin: 0;
  font-family: Consolas, monospace;
  background: linear-gradient(135deg, #0a192f, #1e1e1e);
  color: #d4d4d4;
}

/* LAYOUT */
.workbench {
  display: flex;
  height: 100vh;
}

/* SIDEBAR */
.sidebar {
  width: 220px;
  background: #252526;
  padding: 10px;
}

.file-item {
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.file-item:hover {
  background: #2a2d2e;
}

.file-item.active {
  background: #007acc;
}

/* MAIN */
.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* TABS */
.editor-tabs {
  display: flex;
  background: #2d2d2d;
}

.editor-tab {
  padding: 8px 14px;
  cursor: pointer;
  border-right: 1px solid #3c3c3c;
}

.editor-tab.active {
  background: #1e1e1e;
  border-top: 2px solid #007acc;
}

/* CONTENT */
.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 40px;
}

/* REMOVE EMPTY SPACE */
.panel {
  display: none;
}

.panel.active {
  display: block;
}

/* HERO */
.hero-title {
  font-size: 60px;
}

.hero-title span {
  background: linear-gradient(90deg, #ff00cc, #007acc);
  -webkit-background-clip: text;
  color: transparent;
}

/* CARDS */
.mini-card {
  background: #252526;
  padding: 15px;
  border-radius: 6px;
  transition: 0.3s;
}

.mini-card:hover {
  transform: translateY(-6px);
  border: 1px solid #007acc;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}

/* GRID */
.mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px,1fr));
  gap: 15px;
}

/* TERMINAL */
.terminal {
  height: 100px;
  border-top: 1px solid #333;
}

.terminal-body {
  height: 60px;
  overflow-y: auto;
  padding: 5px;
}
