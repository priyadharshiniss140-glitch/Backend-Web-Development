# Threadbase Toast System

React + TanStack Query exercise using a mock API. No separate backend or toast library is needed.

## Run

From this directory:

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Try it

- Create a new thread title: green `Thread posted!` toast.
- Create `Welcome to Threadbase`: red duplicate-title error toast.
- Log in with `ada` / `password`: green `Welcome back!` toast.
- Use invalid credentials: red login error toast.
- Click any toast to dismiss it immediately; otherwise it dismisses after 3 seconds.

## Implementation

- `src/context/ToastContext.jsx`: stable callbacks, UUIDs, updater-based state, and timeout-based auto-dismiss.
- `src/components/ToastContainer.jsx`: corner stack, type-based classes, accessible status, and click-to-dismiss.
- Both form mutations trigger success and error notifications based on mock API outcomes.
