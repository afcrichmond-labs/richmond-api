# Security Patch: jsonwebtoken CVE-2025-XXXXX

## Changes
- Upgraded `jsonwebtoken` from 8.5.1 to 9.2.0
- Pinned algorithm to RS256 in all jwt.verify() calls
- Added explicit rejection of "none" algorithm
- Full regression test of auth flows passed

## Verification
- npm audit: 0 vulnerabilities
- Auth test suite: all 47 tests passing
- Soak test in staging: 24h, no issues
