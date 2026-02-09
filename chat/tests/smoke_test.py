"""
Smoke test para o backend do chat widget.

Uso:
  python tests/smoke_test.py [BASE_URL]

Requer: requests (pip install requests)
Lê CLIENT_HEADER_VALUE do .env automaticamente (se existir).
"""

import sys
import os
from pathlib import Path
import requests

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000"

# Try to read CLIENT_HEADER_VALUE from .env
CLIENT_HEADER = ""
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line.startswith("CLIENT_HEADER_VALUE") and "=" in line:
            val = line.split("=", 1)[1].strip().strip('"').strip("'")
            if val:
                CLIENT_HEADER = val
            break

passed = 0
failed = 0


def test(name, fn):
    global passed, failed
    try:
        ok, detail = fn()
        if ok:
            print(f"  PASS  {name}")
            passed += 1
        else:
            print(f"  FAIL  {name} -- {detail}")
            failed += 1
    except Exception as e:
        print(f"  FAIL  {name} -- {e}")
        failed += 1


# ── Tests ────────────────────────────────────────────────────────────

def test_health():
    r = requests.get(f"{BASE}/health", timeout=5)
    ok = r.status_code == 200 and r.json().get("ok") is True
    return ok, f"status={r.status_code} body={r.text[:100]}"


def test_options_204():
    r = requests.options(f"{BASE}/chat", timeout=5)
    ok = r.status_code == 204
    return ok, f"status={r.status_code}"


def test_options_cors_headers():
    r = requests.options(
        f"{BASE}/chat",
        headers={"Origin": "https://engdaniel.org"},
        timeout=5,
    )
    acao = r.headers.get("Access-Control-Allow-Origin", "")
    acam = r.headers.get("Access-Control-Allow-Methods", "")
    acah = r.headers.get("Access-Control-Allow-Headers", "")
    ok = (
        acao == "https://engdaniel.org"
        and "POST" in acam
        and "X-Session-Id" in acah
    )
    return ok, f"ACAO={acao} ACAM={acam} ACAH={acah}"


def test_options_no_403():
    """OPTIONS must NEVER return 403, even without X-Client header."""
    r = requests.options(f"{BASE}/chat", timeout=5)
    ok = r.status_code != 403
    return ok, f"status={r.status_code} (403 = CORS preflight blocked!)"


def _post_headers():
    h = {}
    if CLIENT_HEADER:
        h["X-Client"] = CLIENT_HEADER
    return h


def test_chat_empty_message():
    r = requests.post(
        f"{BASE}/chat",
        json={"message": ""},
        headers=_post_headers(),
        timeout=5,
    )
    ok = r.status_code == 400
    return ok, f"status={r.status_code}"


def test_chat_invalid_payload():
    r = requests.post(
        f"{BASE}/chat",
        json={"message": 12345},
        headers=_post_headers(),
        timeout=5,
    )
    ok = r.status_code == 400
    return ok, f"status={r.status_code}"


def test_chat_oversized():
    huge = "a" * 20000
    r = requests.post(
        f"{BASE}/chat",
        data=huge,
        headers={"Content-Type": "application/json"},
        timeout=5,
    )
    ok = r.status_code == 413
    return ok, f"status={r.status_code}"


def test_cors_bad_origin():
    """Non-allowed origin should not get ACAO header."""
    r = requests.get(
        f"{BASE}/health",
        headers={"Origin": "https://evil.com"},
        timeout=5,
    )
    acao = r.headers.get("Access-Control-Allow-Origin", "")
    ok = acao == ""
    return ok, f"ACAO={acao} (should be empty for bad origin)"


def test_chat_valid_request():
    """POST /chat with a valid message (will fail if OpenAI key is invalid, but should not 500)."""
    h = _post_headers()
    h["X-Session-Id"] = "smoke-test-session"
    r = requests.post(
        f"{BASE}/chat",
        json={
            "message": "ola",
            "mode": "geral",
            "history": [],
        },
        headers=h,
        timeout=60,
    )
    ok = r.status_code in (200, 502, 504)  # 200 = success, 502/504 = OpenAI issue (still valid)
    return ok, f"status={r.status_code} body={r.text[:200]}"


def test_chat_soft_secret_rejected():
    """POST /chat without X-Client should be rejected when CLIENT_HEADER_VALUE is set."""
    if not CLIENT_HEADER:
        return True, "skipped (no CLIENT_HEADER_VALUE)"
    r = requests.post(
        f"{BASE}/chat",
        json={"message": "teste"},
        timeout=5,
    )
    ok = r.status_code == 403
    return ok, f"status={r.status_code} (expected 403)"


def test_admin_no_password():
    r = requests.get(f"{BASE}/admin", timeout=5)
    ok = r.status_code == 401
    return ok, f"status={r.status_code}"


# ── Run ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print(f"\n=== Smoke Test: {BASE} ===\n")

    test("GET /health -> 200 + ok:true", test_health)
    test("OPTIONS /chat -> 204", test_options_204)
    test("OPTIONS /chat -> CORS headers", test_options_cors_headers)
    test("OPTIONS /chat -> no 403", test_options_no_403)
    test("POST /chat empty -> 400", test_chat_empty_message)
    test("POST /chat invalid type -> 400", test_chat_invalid_payload)
    test("POST /chat oversized -> 413", test_chat_oversized)
    test("CORS bad origin -> no ACAO", test_cors_bad_origin)
    test("POST /chat valid request", test_chat_valid_request)
    test("POST /chat soft-secret rejected", test_chat_soft_secret_rejected)
    test("GET /admin without pw -> 401", test_admin_no_password)

    print(f"\n=== Result: {passed} passed, {failed} failed ===\n")
    sys.exit(0 if failed == 0 else 1)
