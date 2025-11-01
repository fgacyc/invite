# FGACYC Link Project

This is base project for FGACYC Link Project where we handle connect group functionality and users.

### Package Manager

- [pnpm](https://pnpm.io/installation)

To install pnpm, use one of these commands based on your operating system:

**Using npm:**

```bash
npm install -g pnpm
```

**Using Homebrew (macOS):**

```bash
brew install pnpm
```

**Using Windows (PowerShell):**

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### Run Project

```bash
pnpm dev
```

### Install Dependencies

```bash
pnpm install
```

### Documentations

- [Project Specs](https://docs.google.com/document/d/1MMZ08RJsG-2SiCgW0y-vSbHEX0P1tGy6IyCyHxQlA9Q/edit?tab=t.0#heading=h.k045dnqx8f31)
- [Figma](https://www.figma.com/design/SgeqYpNEDRt21xTYfDjl85/FGA-MobileApp-Connect)

### Project Structure

```
src/
├── components/ <-- Shared components
├── graphql/ <-- GraphQL queries and mutations
├── pages/ <-- Pages
├── modules/ <-- Modules (most of where our work will be)
├── providers/ <-- Providers / Contexts etc.
├── routes/ <-- Routes
│
...
```

### React Query & GraphQL

- [React Query](https://tanstack.com/query)
- [GraphQL Playground](https://graphql-playground.development.fgacyc.com/)
  _You can use this playground to test your GraphQL queries and mutations._

React Query is used to manage all data fetching and caching.
The GraphQL usage is simplified to use `useGraphQL` hook.

**Simple Example:**

```typescript
const { query, ready } = useGraphQL();
const { data, refetch } = useQuery({
  queryKey: ["person"],
  queryFn: async () => {
    const data = await query(fetchSinglePerson, {
      name: "fga.tech@gmail.com",
    });
    return data;
  },
  enabled: ready,
});
```

### Design System

- [Tailwind CSS](https://tailwindcss.com/)
  We will be using Tailwind CSS for styling.

_PS: If you want to use third-party libraries, please check with the team first. It will mostly be fine, the only thing we need to ensure is the design is consistent and aligned with the designs._

### Contributing

- Recommended to use [Cursor](https://www.cursor.com/) or [VS Code](https://code.visualstudio.com/) for coding.
- Install the recommended extensions, there should be a prompt to install them.
  If not, go to extensions tab and search `@recommended` for all the recommended extensions.

There will be 3 long evergreen branches:

- `prod` - **PRODUCTION**, protected, only PRs from `preprod` will be merged into `prod`.
- `dev` - Branch out from here for development and merge back into `dev`.
- `preprod` - Protected, only PRs from `dev` will be merged into `preprod`, this will be done for each pre-release. This is where we will do testing and QA.

Try to have your branch name as `feature/your-feature-name` or `fix/your-fix-name` and provide meaningful commit messages.

We will be trying to record all the changes in the `CHANGELOG.md` file.
