# Installing NodeJS in WSL2

We will install NodeJS using NVM (Node Version Manager)

NodeJS is needed by the OpenApi Generator

The following is a copy of content found in: https://github.com/nvm-sh/nvm#installing-and-updating

### Install & Update Script

To **install** or **update** nvm, you should run the [install script][2]. To do that, you may either download and run the script manually, or use the following cURL or Wget command:
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```
```sh
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

Running either of the above commands downloads a script and runs it. The script clones the nvm repository to `~/.nvm`, and attempts to add the source lines from the snippet below to the correct profile file (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`).

<a id="profile_snippet"></a>
```sh
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

#### Troubleshooting on Linux

On Linux, after running the install script, if you get `nvm: command not found` or see no feedback from your terminal after you type `command -v nvm`, simply close your current terminal, open a new terminal, and try verifying again.
Alternatively, you can run the following commands for the different shells on the command line:

*bash*: `source ~/.bashrc`

*zsh*: `source ~/.zshrc`

*ksh*: `. ~/.profile`

These should pick up the `nvm` command.

### Verify Installation

To verify that nvm has been installed, do:

```sh
command -v nvm
```

For more information, please refer to: https://github.com/nvm-sh/nvm#installing-and-updating

## Installing Node using NVM

```sh
nvm install --lts
```

### Verify NodeJS Installation

```sh
node --version
npm --version
```
