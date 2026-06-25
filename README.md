# DevEnvMgr

DevEnvMgr (Developer Environment Manager) is a small local CLI tool for managing development configuration files and project templates between a trusted physical host and its virtual development machines.

The project is intentionally narrow in scope:

- Git synchronizes the physical host's central dotfiles directory with a remote repository.
- DevEnvMgr distributes, compares, and synchronizes those resources between the physical host, virtual-machine dotfiles directories, and the configuration files currently used inside a VM.
- Virtual machines do not need direct access to the remote Git repository and therefore do not need to retain GitHub SSH keys or other remote credentials.

> Git manages **remote ↔ physical host**.
> DevEnvMgr manages **physical host ↔ virtual machines**.

---

## Motivation

A new or temporary development VM often needs the same configuration and project templates as the physical host.

Using Git directly inside every VM would require additional setup:

- installing and configuring Git;
- configuring remote access;
- copying or generating SSH keys or tokens;
- remembering to remove credentials before a VM is exported, cloned, archived, or deleted.

DevEnvMgr keeps the remote credentials on the trusted physical host.

The physical host uses Git normally:

```text
Remote Git repository
        ↕ Git
Physical host dotfiles
```

DevEnvMgr then manages local development resources:

```text
Physical host dotfiles
        ↕ sync
Virtual-machine dotfiles
        ↕ pull / push
VM active configuration
```

Project templates stored in dotfiles can additionally be used to create new projects:

```text
Dotfiles template
        ↓ create
New project
```

---

## Resource Model

DevEnvMgr manages predefined resources described in configuration files.

A resource can be:

- a single configuration file;
- a complete project-template directory.

Examples:

```text
.gitconfig
.bashrc
VS Code settings.json
VS Code snippets
Node.js TypeScript template
React TypeScript template
Full-stack TypeScript template
```

DevEnvMgr is not a general file manager. It only operates on configured development resources.

---

## Path Model

All managed paths are based on the current user's home directory.

### User home

Node.js resolves the current user home through `os.homedir()`.

Examples:

```text
Linux:   /home/qian
Windows: C:\Users\Qian
```

### Dotfiles root

The DevEnvMgr dotfiles root is:

```text
<UserHome>/Workspace/dotfiles
```

Examples:

```text
/home/qian/Workspace/dotfiles
C:\Users\Qian\Workspace\dotfiles
```

Configured `dotfilesPath` values are relative to this directory.

For example:

```json
{
  "dotfilesPath": "templates/node-ts"
}
```

resolves to:

```text
<UserHome>/Workspace/dotfiles/templates/node-ts
```

### Active user resources

Paths for configuration files currently used by the operating system or an application are resolved relative to `UserHome`, unless an absolute path is explicitly supported.

Examples:

```text
<UserHome>/.gitconfig
<UserHome>/.bashrc
<UserHome>/.config/Code/User/settings.json
```

---

## The Three Relevant Layers

For ordinary configuration management, DevEnvMgr distinguishes three layers.

```text
Physical host dotfiles
        ↕
Virtual-machine dotfiles
        ↕
VM active configuration
```

### Physical host dotfiles

The trusted central copy maintained on the physical host and synchronized with the remote Git repository.

### Virtual-machine dotfiles

The VM-side copy of the managed dotfiles resources. It is synchronized with the physical host through `sync`.

### VM active configuration

The files currently used by the VM, shell, editor, or another development tool.

Examples:

```text
~/.bashrc
~/.gitconfig
~/.config/Code/User/settings.json
```

This distinction is important because the commands do not all operate on the same two layers.

---

## Commands

DevEnvMgr provides five operations:

```text
create
diff
pull
push
sync
```

The command names follow Git-like direction semantics where possible.

---

## `create`

Creates a new project from a configured project-template directory.

Example:

```bash
npm run dev -- create node ts my-api

dem create node ts Workspace/my-api
```

The `framework` and `language` arguments form the template ID:

```text
node + ts → node-ts
```

DevEnvMgr then:

1. loads and validates `templates.paths.json`;
2. finds the template whose ID is `node-ts`;
3. resolves its directory under the dotfiles root;
4. resolves the requested target under `UserHome`;
5. copies the contents of the template directory into the new project directory.

Example:

```text
<UserHome>/Workspace/dotfiles/templates/node-ts/
        ↓
<UserHome>/Workspace/my-api/
```

The template directory itself is not nested into the target. Its contents become the project root.

### Safety behavior

The initial safe behavior is:

- target does not exist → create it and copy;
- target exists and is empty → copy;
- target exists and is not empty → stop with an error;
- template does not exist → stop with an error;
- configured template ID does not exist → stop with an error.

`create` is a one-time initialization operation. The newly created project is not automatically synchronized with its source template afterward.

---

## `diff`

Compares relevant versions of a configured resource.

For configuration files, `diff` is a diagnostic operation covering:

```text
VM active configuration
VM dotfiles
Physical host dotfiles
```

It should help answer questions such as:

- Does the active VM file differ from the VM dotfiles copy?
- Does the VM dotfiles copy differ from the physical host?
- Is the active file already identical to the trusted host version?
- Is a resource missing on one side?
- Is a path a file on one side and a directory on the other?

For directories, `diff` recursively compares the complete directory trees.

Expected categories include:

```text
identical
modified
only on source
only on target
missing
type mismatch
```

Text files should later support understandable line-level output:

```text
- removed line
+ added line
? changed line
```

Binary files should not receive meaningless line diffs. They should be compared through metadata and hashes.

`diff` is a prerequisite for safe `push` and `sync`, and an optional safety step for `pull`.

---

## `pull`

Restores or installs a managed resource from VM dotfiles into the VM's active environment.

Direction:

```text
VM dotfiles
    ↓ pull
VM active configuration
```

Example:

```text
<UserHome>/Workspace/dotfiles/user/linux/.bashrc
        ↓
<UserHome>/.bashrc
```

Typical use cases:

- an active VM configuration file was damaged;
- an experimental change should be discarded;
- a newly created VM needs the known configuration;
- the user wants to restore the trusted dotfiles version.

Because `pull` may overwrite an active file, it should eventually support:

- optional comparison before copying;
- backup before destructive overwrite;
- dry-run output;
- clear reporting of source and target;
- explicit handling of missing source files.

---

## `push`

Copies a configuration resource that has been tested in the VM back into the VM dotfiles directory.

Direction:

```text
VM active configuration
    ↓ push
VM dotfiles
```

Example:

```text
<UserHome>/.bashrc
        ↓
<UserHome>/Workspace/dotfiles/user/linux/.bashrc
```

Typical use case:

1. modify a configuration file inside the VM;
2. test it in the real development environment;
3. verify the change with `diff`;
4. use `push` to accept it into VM dotfiles;
5. use `sync` to synchronize the VM dotfiles copy with the physical host;
6. commit and push the physical host dotfiles with Git.

Because `push` changes a managed copy, it should not silently overwrite unresolved differences.

---

## `sync`

Synchronizes the virtual-machine dotfiles directory with the physical host dotfiles directory.

Direction:

```text
VM dotfiles
    ↕ sync
Physical host dotfiles
```

Unlike `pull` and `push`, `sync` does not primarily manage the VM's active configuration. It manages the two dotfiles workspaces.

It may include:

- individual configuration files;
- snippets;
- scripts;
- project-template directories;
- other configured development resources.

### Conservative synchronization

`sync` must not guess when both sides contain conflicting changes.

A safe initial strategy is:

```text
identical
→ no action

resource exists on only one side
→ report it; copy only under an explicit safe rule

different on both sides
→ report conflict

file/directory type mismatch
→ report conflict
```

Reliable two-way synchronization may later require stored last-sync hashes or metadata. Modification timestamps alone are not a safe source of truth.

No automatic merge behavior should be introduced without an explicit design.

---

## Complete Workflow

```text
                         GitHub
                            ↕ Git
                    Host dotfiles
                            ↕ sync
                     VM dotfiles
                      ↙          ↘
                 pull              push
                  ↓                  ↑
             VM active configuration

VM/Host dotfiles template
             ↓ create
        New project
```

### Remote changes to a VM

```text
Remote Git repository
        ↓ git pull
Physical host dotfiles
        ↓ dem sync
VM dotfiles
        ↓ dem pull
VM active configuration
```

### Tested VM changes to the remote repository

```text
VM active configuration
        ↓ dem push
VM dotfiles
        ↓ dem sync
Physical host dotfiles
        ↓ git commit / git push
Remote Git repository
```

### New project from a template

```text
VM or host dotfiles template
        ↓ dem create
New project directory
```

---

## Configuration

DevEnvMgr currently uses two configuration files.

```text
src/config/
├── templates.paths.json
└── user-settings.paths.json
```

Both files should be validated with Zod before use.

### Template configuration

A template entry represents a directory.

Example:

```json
{
  "id": "node-ts",
  "framework": "node",
  "language": "ts",
  "type": "production",
  "dotfilesPath": "templates/node-ts"
}
```

The expected template ID is:

```text
<framework>-<language>
```

For example:

```text
node-ts
react-ts
cli-ts
```

### User-settings configuration

A user-settings entry represents a managed configuration file and its platform-specific active paths.

Conceptual example:

```json
{
  "id": "gitconfig",
  "description": "Git configuration",
  "dotfilesPath": "user/common/.gitconfig",
  "targets": {
    "windows": ".gitconfig",
    "linux": ".gitconfig"
  }
}
```

The dotfiles path is relative to:

```text
<UserHome>/Workspace/dotfiles
```

The target path is resolved relative to:

```text
<UserHome>
```

---

## Platform Support

Platform detection is centralized and currently distinguishes:

```text
windows
linux
macos
```

Unsupported platforms should fail explicitly instead of continuing with an ambiguous fallback.

Platform-specific paths must use Node.js path utilities. Paths must not be manually concatenated with `/` or `\`.

---

## Architecture

The CLI should remain an adapter. Core file behavior should be implemented in testable services and utilities.

Recommended dependency direction:

```text
CLI
 ↓
services / use cases
 ↓
config, platform, path, diff, and file utilities
```

A possible structure is:

```text
src/
├── cli/
│   └── commands/
│
├── config/
│   ├── templates.paths.json
│   ├── user-settings.paths.json
│   ├── templates.schema.ts
│   ├── user-settings.schema.ts
│   └── config.loader.ts
│
├── services/
│   ├── create.service.ts
│   ├── diff.service.ts
│   ├── pull.service.ts
│   ├── push.service.ts
│   ├── sync.service.ts
│   ├── platform.service.ts
│   └── path.service.ts
│
├── file/
│   ├── copy-file.ts
│   ├── copy-directory.ts
│   ├── walk-directory.ts
│   ├── ensure-directory.ts
│   ├── calculate-hash.ts
│   └── backup-resource.ts
│
├── diff/
│   ├── compare-file.ts
│   ├── compare-directory.ts
│   ├── format-diff.ts
│   └── diff.types.ts
│
├── errors/
│   └── app-error.ts
│
└── main.ts
```

```
src/
├── config/
│   ├── templates.paths.json
│   ├── user-settings.paths.json
│   └── config.loader.ts
│
├── schemas/
│   ├── template.schema.ts
│   └── user-setting.schema.ts
│
├── services/
│   ├── create.service.ts
│   ├── diff.service.ts
│   ├── pull.service.ts
│   ├── push.service.ts
│   ├── sync.service.ts
│   ├── path.service.ts
│   └── platform.service.ts
│
├── types/
│   ├── config.type.ts
│   ├── platform.type.ts
│   └── diff.type.ts
│
├── utils/
│   ├── copy-file.util.ts
│   ├── copy-directory.util.ts
│   └── calculate-hash.util.ts
│
└── main.ts
```

This structure may change. The important rule is separation of responsibilities.

---

## Development Order

The planned implementation order is:

1. inspect and correct configuration files;
2. validate configuration with Zod;
3. complete platform detection;
4. complete UserHome and dotfiles path resolution;
5. implement `create`;
6. implement file and directory `diff`;
7. implement `pull`;
8. implement `push`;
9. implement conservative `sync`;
10. add backups, dry-run behavior, logs, and tests where needed.

The dependency relationship is:

```text
config / platform / path
          ↓
        create
          ↓
         diff
          ↓
     pull + push
          ↓
         sync
```

---

## Current Status

The project is under active development.

Current focus:

- configuration validation;
- platform detection;
- path resolution;
- safe template creation.

Planned next:

- recursive directory walking;
- hashes;
- file comparison;
- directory comparison;
- formatted diff output.

The README describes the agreed project behavior. Individual commands should only be marked as complete after they are implemented and tested.

---

## Safety Principles

DevEnvMgr should follow these rules:

- no silent data loss;
- no automatic conflict resolution without a defined rule;
- compare before destructive operations where appropriate;
- back up files before destructive overwrite;
- support dry-run for write operations;
- validate source existence;
- create target directories only when safe;
- detect file-versus-directory mismatches;
- do not treat modification time as authoritative;
- do not expose GitHub credentials to temporary VMs;
- keep all behavior local and predictable.

---

## Explicitly Out of Scope

DevEnvMgr is not intended to become a general platform.

The following do not belong in this project:

- AI integration;
- prompt management;
- Lebenslauf or Anschreiben processing;
- PDF or DOCX parsing;
- document generation;
- CareerProfile management;
- MongoDB;
- REST APIs;
- React frontend;
- user accounts;
- cloud document storage;
- general server provisioning;
- package installation;
- firewall or service management.

Those belong to other projects, such as the later Local Content Management System.

---

## Relationship to Local Content Management

A future Local Content Management System may reuse generic local file utilities, such as:

```text
copy file
copy directory
walk directory
calculate hash
compare resources
create backup
resolve path below UserHome
```

However, the responsibilities remain separate.

DevEnvMgr manages predefined development resources, primarily under:

```text
<UserHome>/Workspace
```

A Local Content Management System may manage personal content under locations such as:

```text
<UserHome>/Documents/Lebenslauf
<UserHome>/Documents/Anschreiben
<UserHome>/Documents/Zeugnisse
```

The two CLIs should not execute each other. Reusable logic should later be extracted into shared functions or a shared package.

---

## Definition of Done

DevEnvMgr v1 is complete when the configured resources can be managed reliably through:

```bash
dem create ...
dem diff ...
dem pull ...
dem push ...
dem sync ...
```

with:

- predictable behavior;
- clear source and target semantics;
- useful logs;
- no silent data loss;
- safe handling of missing resources;
- safe handling of conflicts;
- documented configuration;
- basic automated tests;
- a usable CLI and README.

After that, the project should move into maintenance mode instead of expanding into a general-purpose platform.
