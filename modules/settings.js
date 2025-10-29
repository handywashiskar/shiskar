body {
  font-family: 'Segoe UI', sans-serif;
  background-color: #fdf6e3;
  color: #1e1b18;
  margin: 0;
  padding-bottom: 70px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: linear-gradient(to right, #2c3e50, #1e1b18);
  color: #fdf6e3;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

#footerNav {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to right, #2c3e50, #1e1b18);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  box-shadow: 0 -2px 6px rgba(0,0,0,0.4);
  z-index: 1000;
}

.nav-btn {
  background: #2c3e50;
  color: #fdf6e3;
  border: none;
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
}

.nav-btn span {
  font-size: 0.75em;
  margin-top: 4px;
}

.nav-btn:hover {
  background: #d4af37;
  color: #1e1b18;
  box-shadow: 0 0 12px #ff6f61;
  transform: translateY(-2px);
}

main {
  margin-top: 70px;
  padding: 20px;
}
