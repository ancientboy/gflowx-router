# Append to /opt/trading-agent/dashboard/api.py (before static files section)
# Agent profile: SOUL.md + config.json per agent

AGENT_CONFIG_DIR = Path("/opt/trading-agent/config/agents")

AGENT_CONFIG_SCHEMA = {
    "xau": {
        "fields": [
            {"key": "boll_period", "label": "布林带周期", "type": "int", "min": 10, "max": 60},
            {"key": "boll_std", "label": "布林带标准差", "type": "float", "min": 1.0, "max": 3.0, "step": 0.1},
            {"key": "take_profit", "label": "止盈($)", "type": "float", "min": 1, "max": 50},
            {"key": "stop_loss", "label": "止损($)", "type": "float", "min": 1, "max": 50},
            {"key": "max_positions", "label": "最大持仓", "type": "int", "min": 1, "max": 50},
            {"key": "leverage", "label": "杠杆", "type": "int", "min": 1, "max": 500},
            {"key": "srsi_lower", "label": "StochRSI下限", "type": "float", "min": 1, "max": 30},
            {"key": "srsi_upper", "label": "StochRSI上限", "type": "float", "min": 70, "max": 99},
        ]
    },
    "major": {"fields": [{"key": "max_positions", "label": "最大持仓", "type": "int", "min": 1, "max": 10}]},
    "altcoin": {"fields": [{"key": "max_positions", "label": "最大持仓", "type": "int", "min": 1, "max": 10}]},
    "newcoin": {"fields": [{"key": "max_positions", "label": "最大持仓", "type": "int", "min": 1, "max": 5}]},
    "momentum": {"fields": [{"key": "max_positions", "label": "最大持仓", "type": "int", "min": 1, "max": 10}]},
}

DEFAULT_SOUL = {
    "xau": "# XAU Agent\n\n黄金趋势交易 — 结构突破 + EMA 趋势跟踪\n\n## 原则\n- 只做 XAUUSDT\n- 顺势挂单，禁止逆势加仓\n",
    "major": "# Major Agent\n\n主流币 BTC/ETH 趋势跟踪与反转\n",
    "altcoin": "# Altcoin Agent\n\n山寨币波段 + 动量\n",
    "newcoin": "# Newcoin Agent\n\n新币捕获，严格止损\n",
    "momentum": "# Momentum Agent\n\n动量追涨，快进快出\n",
}


def _agent_dir(agent_id: str) -> Path:
    d = AGENT_CONFIG_DIR / agent_id
    d.mkdir(parents=True, exist_ok=True)
    return d


def _load_agent_config(agent_id: str) -> dict:
    meta = AGENTS.get(agent_id, {})
    state_file = DATA_DIR / meta.get("state_file", f"agent_{agent_id}_state.json")
    cfg = {}
    if state_file.exists():
        try:
            cfg = json.loads(state_file.read_text()).get("config", {})
        except Exception:
            pass
    cfg_path = _agent_dir(agent_id) / "config.json"
    if cfg_path.exists():
        try:
            cfg.update(json.loads(cfg_path.read_text()))
        except Exception:
            pass
    return cfg


def _load_agent_soul(agent_id: str) -> str:
    soul_path = _agent_dir(agent_id) / "SOUL.md"
    if soul_path.exists():
        return soul_path.read_text(encoding="utf-8")
    return DEFAULT_SOUL.get(agent_id, f"# {agent_id} Agent\n")


class AgentConfigUpdate(BaseModel):
    config: dict


class AgentSoulUpdate(BaseModel):
    content: str


@app.get("/api/agent/{name}/profile")
async def agent_profile(name: str):
    aid = name.lower()
    if aid not in AGENTS:
        return JSONResponse({"error": f"Unknown agent: {name}"}, status_code=404)
    info = get_agent_full_info(aid)
    return {
        "agent": aid,
        "meta": info,
        "config": _load_agent_config(aid),
        "schema": AGENT_CONFIG_SCHEMA.get(aid, {"fields": []}),
        "soul_md": _load_agent_soul(aid),
    }


@app.put("/api/agent/{name}/config")
async def update_agent_config(name: str, body: AgentConfigUpdate):
    aid = name.lower()
    if aid not in AGENTS:
        return JSONResponse({"error": f"Unknown agent: {name}"}, status_code=404)
    schema = AGENT_CONFIG_SCHEMA.get(aid, {}).get("fields", [])
    allowed = {f["key"] for f in schema}
    clean = {}
    for k, v in (body.config or {}).items():
        if k not in allowed:
            continue
        fdef = next((f for f in schema if f["key"] == k), None)
        if not fdef:
            continue
        if fdef["type"] == "int":
            v = int(v)
            v = max(fdef.get("min", v), min(fdef.get("max", v), v))
        elif fdef["type"] == "float":
            v = float(v)
            v = max(fdef.get("min", v), min(fdef.get("max", v), v))
        clean[k] = v
    cfg_path = _agent_dir(aid) / "config.json"
    existing = {}
    if cfg_path.exists():
        try:
            existing = json.loads(cfg_path.read_text())
        except Exception:
            pass
    existing.update(clean)
    cfg_path.write_text(json.dumps(existing, indent=2, ensure_ascii=False), encoding="utf-8")
    meta = AGENTS[aid]
    state_file = DATA_DIR / meta["state_file"]
    if state_file.exists():
        try:
            state = json.loads(state_file.read_text())
            state.setdefault("config", {}).update(existing)
            state_file.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=500)
    return {"ok": True, "config": existing, "message": "参数已保存，重启 Agent 后完全生效"}


@app.put("/api/agent/{name}/soul")
async def update_agent_soul(name: str, body: AgentSoulUpdate):
    aid = name.lower()
    if aid not in AGENTS:
        return JSONResponse({"error": f"Unknown agent: {name}"}, status_code=404)
    content = (body.content or "").strip()
    if not content:
        return JSONResponse({"error": "SOUL 内容不能为空"}, status_code=400)
    if len(content) > 8000:
        return JSONResponse({"error": "SOUL 内容不能超过 8000 字"}, status_code=400)
    soul_path = _agent_dir(aid) / "SOUL.md"
    soul_path.write_text(content, encoding="utf-8")
    return {"ok": True, "message": "SOUL 已保存"}
