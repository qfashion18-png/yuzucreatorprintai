# Print Rendering

MVP rendering is intentionally conservative:

1. Browser editor saves Fabric.js design JSON.
2. Synchronous renderer creates a proof image/PDF placeholder.
3. Preflight flags low resolution, unsupported file types, transparency, and safe-zone issues.
4. Future worker path renders commercial proof PDFs and print-ready PDFs before provider submission.

Full commercial validation still requires final 4over specs, color/profile requirements, accepted PDF settings, bleed rules, and product option mapping.
