#!/usr/bin/env bash
set -euo pipefail
test -e 'public/manifest.webmanifest' && test -e 'src/app/layout.tsx' && test -e 'src/app/page.tsx' && test -e 'src/components/app-shell.tsx' && test -e 'tests/manifest.spec.ts'
test -f README.md
if command -v rg >/dev/null 2>&1; then
  if rg -n -i '(api[_-]?key|\bsecret\b|\bpassword\b|\btoken\b)' --glob '!public-tests/check.sh' --glob '!SKILL.md' --glob '!pwa.md' .; then
    exit 1
  fi
else
  if grep -R -n -i -E 'api[_-]?key|(^|[^[:alnum:]_])(secret|password|token)([^[:alnum:]_]|$)' --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.next --exclude=package-lock.json --exclude=check.sh --exclude=SKILL.md --exclude=pwa.md .; then
    exit 1
  fi
fi
echo PUBLIC_OK
