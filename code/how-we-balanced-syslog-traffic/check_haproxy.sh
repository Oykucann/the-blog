#!/bin/bash
#
# Health check for keepalived's vrrp_script (see keepalived.conf).
# Exit 0 = healthy. Exit 1 = failed; after two consecutive failures
# keepalived moves the VIP to the other node.
#
# Only checks that HAProxy itself is alive and accepting traffic -
# not backend/HF health. If every HF is down, both nodes fail this
# identically, which is correct: there's no healthy node to hand
# the VIP to anyway.

LOG_TAG="check_haproxy"

fail() {
    logger -t "$LOG_TAG" "FAIL: $1"
    exit 1
}

# Is the service actually running?
systemctl is-active --quiet haproxy || fail "haproxy service not active"

# Are the critical ports really owned by haproxy - not just open?
# (Guards against a crashed process leaving a stale/zombie socket.)
LISTENING=$(ss -tulnp 2>/dev/null)

for p in 514 8088; do
    echo "$LISTENING" | grep -E "[:.]$p[[:space:]]" | grep -q "haproxy" \
        || fail "port $p not held by haproxy"
done

# Is the runtime socket responsive, and actually HAProxy's?
# (Guards against a hung/deadlocked process behind an empty
# or bogus response.)
INFO=$(echo "show info" | timeout 0.5 socat -t 0.3 stdio /run/haproxy/admin.sock 2>/dev/null)

[ -n "$INFO" ] || fail "runtime socket empty/unresponsive"
echo "$INFO" | grep -q "^Name: HAProxy" || fail "runtime socket returned unexpected response"

exit 0
