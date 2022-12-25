# Setting up your coding environment

This will get you set up to code in TypeScript.

First, some definitions:

- **JavaScript**: Think of this as the programming language of Internet browsers. If you want to write an application
  that runs in someone's browser, its logic will probably have to be turned into JavaScript at some point. JavaScript
  has some weirdness to it, and many of its quirks have something to do with unusual demands of running things in
  browsers... One thing to know about JavaScript is that it doesn't have types (e.g., `int`, `float`, `double`...) and
  this can make it tricky at times.
- **[TypeScript](https://www.typescriptlang.org/docs/)**: Basically, JavaScript with Types... In practice, TypeScript
  code is "transpiled" into JavaScript before it runs; that means that JavaScript code is generated from the TypeScript
  you write, and that JavaScript is what actually runs in a browser. Check
  out [typescriptlang.org](https://www.typescriptlang.org/docs/) for some useful documentation on TypeScript,
  and [this link](https://www.typescriptlang.org/play) for a playground where you can quickly test out snippets of
  TypeScript code.
- **Node.js**: A Javascript interpreter. If we use a python analogy, Node would be analogous to the numbered Python
  instance you use to run a python script.
- **npm**: Short for "Node Package Manager", a JavaScript package manager that comes with Node. npm is basically the
  Node equivalent of `pip` for python---it allows users to install (and publish) packages from the npm registry using
  commands like `npm install xxx`.
- **nvm**: "Node Version Manager", which lets users switch between different versions of node and npm. It also allows
  for node to be easily installed, which is why we will install it first.
- **yarn**: A layer of fanciness that sits on top of npm, allowing for additional fanciness that is desireable. Here in
  CS4620, we are oh so fancy... But you already know...

### Installing nvm

#### \*\*UPDATE install `nvm install --lts`... need to update instructions to reflect this

- Linux and mac users can follow the installation
  instructions [here](https://github.com/nvm-sh/nvm#install--update-script). Mac users can also install nvm
  using [homebrew](https://formulae.brew.sh/formula/nvm), but BEWARE that some recent changes have made installing via
  homebrew a bit less straightforward. For more details on that, you can call `brew info nvm` and look at the text
  under `==>Caveats` that gets printed in your terminal.

- Windows users should follow the instructions [here](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-windows).
  Specifically, you will use the windows-nvm repository.

## Node and npm

As the name implies, in order to use npm, Node.js needs to be installed. For Mac and Linux users, run `nvm install node`
in the terminal. By default, the OS should begin using the node version installed.

Windows users can run `nvm install latest` in the powershell as stated in the instructions linked for nvm installation.
You need to then tell the powershell to use the version of node installed with `nvm use <version number>`. The
powershell will tell you what version of node was installed.

#### Checking installation

Run `node -v` in the command prompt. If the version of node displays, Node.js has been succesfully installed.

#### Installing [`yarn`](https://github.com/yarnpkg/yarn)

In your command line, once you have installed npm, install yarn by calling

```
npm install --global yarn
```

Now you are officially fancy.

# Running commands with [`yarn`](https://github.com/yarnpkg/yarn)

While in the directory of a project (typically, whatever directory contains a `package.json` file) in command line, you
will find the following commands useful.

| Command           | Purpose                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `yarn install`    | Installs the project dependencies. Can also use `npm install package.json`                        |
| ` yarn run start` | Runs the webserver locally on your machine. It should typically default to http://localhost:3000/ |
| `yarn run build`  | Builds a static version of everything                                                             |
| `yarn run test`   | Runs all the tests for the project.                                                               |

# Installing WebStorm

Although you can use any IDE or editor you like for this class, we recommend WebStorm and will use it in our demos.
It's a commercial IDE but JetBrains provides a free educational license.

## Getting the license

Before installing Webstorm, head to the JetBrains website to get
the [free educational license](https://www.jetbrains.com/community/education/#students). Follow the instructions to
activate your license. You will also create an account with JetBrains.

Once the free educational license has been activated, install WebStorm. There are two ways to install WebStorm.

#### Option 1: Manually installing the IDE from the JetBrains website

Head to your account located [here](https://account.jetbrains.com/licenses). If the license has been activated
correctly, there should be an item titled **JetBrains Product Pack for Students**. From here, click on **WebStorm** to
download the installer.

#### Option 2: Installing WebStorm using JetBrains ToolBox

**JetBrains Toolbox** is an application that allows users to handle and update different tools and IDEs created by
JetBrains. Some of you may already have this installed if you've used other IDEs created by JetBrains such as IntellIJ.
If you don't have JetBrains ToolBox, you can install it [here](https://www.jetbrains.com/toolbox-app/).

To install WebStorm, open JetBrains ToolBox and scroll down the list of available tools until you see the listing for
WebStorm and press **install**.

## Activating WebStorm

Upon opening WebStorm for the first time, you will be asked to set up your UI environment preferences. It will also
suggest packages to download but none are needed at this time.

Next, you will be prompted to activate WebStorm. Enter your username and password to activate WebStorm.

# Creating WebStorm configurations for a project

WebStorm allows you to create run/debug configurations. We will use the configurations as shortcuts to run the yarn
commands from inside WebStorm. It's easiest to create these configurations after you have imported/created a project.

To create an yarn configuration, go to `Run -> Edit Configuration`. Press `+` button at the top left of the pop left
menu. From here, select `npm` from the `Templates` dropdown menu. Next, follow the steps below.

1. Give the configuration an appropriate `name`.
2. Set `package.json` to the location of the **package.json** file of the project.
3. Set `Command` to the appropriate yarn command.
4. Set `Scripts` to the name of the script to run.
5. Set `Node Interpreter` to the location of **node.exe** on your system.
6. Set `project manager` to the file location of the **yarn** folder.

## Example Configurations

Below are a few examples of yarn configurations to get you started.

### yarn run start

| Item               | Value                                                                              |
| ------------------ | ---------------------------------------------------------------------------------- |
| `package.json`     | [path-to-cs4620]\assignment0\package.json                                          |
| `Command`          | run                                                                                |
| `Scripts`          | start                                                                              |
| `Node interpreter` | e.g. C:\Program Files\nodejs\node.exe or /usr/local/bin/node                       |
| `Package manager`  | e.g. C:\Program Files\nodejs\node_modules\yarn or /usr/local/lib/node_modules/yarn |

### yarn run build

| Item               | Value                                                                              |
| ------------------ | ---------------------------------------------------------------------------------- |
| `package.json`     | [path-to-cs4620]\assignment0\package.json                                          |
| `Command`          | run                                                                                |
| `Scripts`          | build                                                                              |
| `Node interpreter` | e.g. C:\Program Files\nodejs\node.exe or /usr/local/bin/node                       |
| `Package manager`  | e.g. C:\Program Files\nodejs\node_modules\yarn or /usr/local/lib/node_modules/yarn |

## Running a configuration

Run configurations from the configurations toolbar. This should be under the top toolbar. Look for the green play button
icon to find the configurations toolbar options.

Once you have located the toolbar, select a configuration from the dropdown menu and select the appropriate action (run,
debug, etc.)
If you meet any trouble opening the https://localhost:3000 after you run yarn run start, try run `yarn install`
or `npm install package.json`.

## Adding NodeJS to Path (Windows)

When you try to run a configuration, the terminal may say:

> '"node"' is not recognized as an internal or external command, operable program or batch file.

This means `node` is not part your Path in Windows so you will need to add it.

Open the Start Menu and search `environment` and click on **Edit the system environment variables**. Near the bottom,
click **Environment Variables...**. In the table labeled **System variables**, select the row with the Variable
name `Path` and click **Edit...**.

On the right, click **Browse** and then select the directory where NodeJS is installed. This will most likely
be `C:\Program Files\nodejs\`. Click **OK** until you close all the windows. Restart WebStorm so that the IDE recognizes
the new variable.

# Debugging with WebStorm

Debugging efficiently will be crucial when working on the projects. Luckily, WebStorm has a built in debugger that makes
debugging much easier. The debugger will allow you to add breakpoints, step through your code, check variable values,
etc.

To use the debugger, we will create another configuration. Under `Run -> Edit Configurations`, select `JavaScript Debug`
under `Templates`. Select `create configuration` and give the configuration an appropriate name. Set the `URL`
to **http://localhost:3000/**. When you fill out the URL, the box under `Remote URLs of local files` should populate.
Save this configuration.

Select this configuration from the dropdown menu in the configurations toolbar. Next, press **debug** instead of **run**
. This will open the debugger. From here, you can add breakpoints in your code and step through your code line by line.
Make sure you have the code already running using yarn run start **before** you start the debugger.

## Testing (ignore for now)

We will be using Jest for testing your code. Tru running `yarn test` to run some of the provided automatic tests that
can be found in [./src/tests/assignment1/](./src/tests/assignment1/). When you finish the assignment, all of these tests
should pass. Note that **we will be using additional tests that are not included in the starter code to evaluate your
submissions**. With this in mind, we strongly suggest writing some of your own tests to help debug your code. Check out
the files in [./src/tests/assignment1/](./src/tests/assignment1/) for examples of how to do this.
