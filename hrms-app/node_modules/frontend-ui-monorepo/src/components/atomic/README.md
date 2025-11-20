Atomic components structure

This folder follows Atomic Design principles:

- atoms: smallest UI elements (Button, Input, Icon)
- molecules: combinations of atoms (SearchBar, CardHeader)
- organisms: groups of molecules/atoms (Navbar, Sidebar)
- templates: page-level layout wrappers (AuthTemplate, DashboardTemplate)
- pages: page-level components composed from templates/organisms

Guidelines:
- Keep atoms purely presentational and highly reusable.
- Prefer creating a small index file in each folder to re-export components.
- Add a single `Logo` component to `atoms` and import it across auth pages to keep logo usage consistent.
