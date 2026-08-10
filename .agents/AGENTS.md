# StratMen Project Guidelines & Rules

## Project Change Log Requirement
- Every time code or feature changes are made in this repository, always update `PROJECT_CHANGE_LOG.txt` at the root of the workspace with details of modified/created files and a summary of implemented changes.

## Code Quality & Anti-Slop Guidelines (`prevent_ai_slop`)
- **No Truncation / Placeholders**: Never output placeholder comments such as `// ... rest of code` or `// TODO`. Always output complete, ready-to-run files.
- **Design System Enforcement**: Adhere strictly to the project color palette (`#0F0F0F` bg, `#1A1A1A` surface, `#A8E63D` lime-green accent) and `Inter` typography. Avoid generic browser defaults or unstyled templates.
- **Error Transparency**: Never swallow errors silently in empty `catch {}` blocks. Surface runtime failures via Sonner toasts or explicit error states.
- **Data Integrity**: Verify database column names and Supabase Row-Level Security (RLS) policies before writing queries.
