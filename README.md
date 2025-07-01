
# Bun + Elysia.js REST API Starter with a Git Submodule Workflow

![Bun Logo](https://bun.sh/logo.svg)

This repository is a starter project for building a REST API using the incredibly fast **Bun** runtime and the **Elysia.js** framework.

More importantly, it serves as a practical example of a clean Git workflow using **Git Submodules** to manage a project within another project. This approach avoids the common "nested Git repository" problem.

---

## 🏛️ Project Structure

This repository uses a submodule to keep the API code separate and independently version-controlled.

```
bun_init/ (Main Repository)\
├── .git/\
├── .gitmodules <-- This file tells Git about the submodule\
├── bun_rest_api/ <-- This is the Git Submodule (a pointer to another repo)\
│ └── (Contents of the bun_rest_api repository)\
└── README.md <-- You are here!
```

*   **`bun_init/`**: The main "container" repository. Its only job is to hold the overall project structure and point to the `bun_rest_api` project.
*   **`bun_rest_api/`**: A completely separate, standalone Git repository that contains the actual Elysia.js API code. It is included here as a submodule.

---

## 🔧 The Git Workflow Journey: From Problem to Solution

When I started, I just created a `bun_rest_api` folder inside my main project. This led to a common problem.

### The Problem: The "Nested Git Repository" Trap

If you run `git init` inside a folder that is already tracked by an outer Git repository, you create a nested repo.

**What happens?**
The outer repository (`bun_init`) does **not** track the files *inside* `bun_rest_api`. It only tracks the existence of that folder and the specific commit hash of its `HEAD`. When you push the outer repo, the inner repo's code is not included! On GitHub, it will just show as a gray, un-clickable folder.

### The Solution: `git submodule`

A Git submodule is the correct way to include another repository within a project. It acts as a **pointer** to a specific commit in another repo.

**Our Workflow:**
1.  Create the main repository (`bun_init`) and push it to GitHub.
2.  Create the API repository (`bun_rest_api`) as a completely separate project and push it to GitHub.
3.  In the local `bun_init` repository, run the command:
    ```bash
    git submodule add https://github.com/DevRizz/bun_rest_api.git
    ```
4.  This command does two things:
    *   Clones the `bun_rest_api` repository into a folder of the same name.
    *   Creates a `.gitmodules` file to track the submodule's path and URL.
5.  Commit and push the changes. Now, the main repo is correctly linked to a specific version of the API repo.

---

## 🧠 Key Git Concepts in This Workflow

Understanding these concepts is key to maintaining a clean and understandable project history.

### Commit History: Your Project's Story
Think of your commit history as the story of your project. Each commit is a chapter. A clean, linear history is easy for you and others to read and understand later.

### Merge vs. Rebase: Two Ways to Combine Work

Let's say you have a `main` branch and a `feature` branch.

*   **`git merge` (The Default):**
    *   This creates a new "merge commit" in your `main` branch that ties the two histories together.
    *   **Pros:** Preserves the exact history of what happened and when. It's non-destructive.
    *   **Cons:** Can lead to a messy, branching history that's hard to read if used frequently for small features.
    *   **Diagram:**
        ```
              A---B---C (feature)
             /         \
        D---E-----------F---G (main, with merge commit F)
        ```

*   **`git rebase` (The Cleaner):**
    *   This takes your `feature` branch commits and **re-plays** them one-by-one on top of the latest `main` branch. It rewrites history to be linear.
    *   **Pros:** Creates a perfectly straight, easy-to-read commit history. No merge commits cluttering the log.
    *   **Cons:** It rewrites commit hashes. **The Golden Rule:** Never rebase a branch that has been pushed and is being used by others (like `main`). Use it only on your local, private feature branches.
    *   **Diagram:**
        ```
        Before Rebase:
              A---B---C (feature)
             /
        D---E---F (main)

        After Rebase (`git rebase main` on `feature` branch):
                      A'--B'--C' (feature)
                     /
        D---E---F (main)
        ```

### Pull Requests (PRs): More Than Just Merging
A Pull Request is a formal request to merge your branch into another (e.g., `feature` -> `main`). Its purpose is to:
1.  **Trigger Code Review:** Allow teammates to review your changes, ask questions, and suggest improvements.
2.  **Run Automated Checks:** Kick off CI/CD pipelines to run tests and linters.
3.  **Provide a Record:** Document a specific change and the discussion around it.

---

## 🚀 Getting Started

To clone this repository and its submodule, you need to use a special flag.

1.  **Clone the repository and initialize the submodule at the same time:**
    ```bash
    git clone --recurse-submodules https://github.com/DevRizz/bun_init.git
    ```
    *If you already cloned it without the flag, run `git submodule update --init --recursive` inside the project.*

2.  **Navigate into the API directory:**
    ```bash
    cd bun_init/bun_rest_api
    ```

3.  **Install dependencies using Bun:**
    ```bash
    npm install --save-dev @types/bun
    ```

4.  **Run the development server:**
    ```bash
    bun run src/index.ts or,
    bun --hot run src/index.ts      # for hot reloading
    ```

5. **To get started with this template, simply paste this command into your terminal:**
    ```bash
    bun create elysia bun_rest_api
    ```

The API will now be running at `http://localhost:3000`.