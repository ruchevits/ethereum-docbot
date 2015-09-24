# Ethereum Documentation Generator

## Available parsers

- `jsdoc` for JSDoc comments
- `doxygen` for C/C++ projects
- `marked` for GitHub flavoured Markdown

## Installation
- Clone the repository
- Install node packages: `npm install`
- Configure environment:
  - **mongoUrl** (ex. `mongodb://mongouser:mongopass@10.20.30.40:27017/ethereum-docs`)
  - **port** (ex. `3001`)
  - **projects** (ex. `$(cat ~/projects.json)`)
  - **wikis** (ex. `$(cat ~/wikis.json)`)
- Install required CLI tools
  - doxygen
  - xsltproc
- Run application: `node main.js`

#### Example `~/projects.json`
```
{
  "libweb3jsonrpc": {
    "secret": "1wRsEGIQeMEIKTr8",
    "parser": "jsdoc",
    "summary": {
      "name": "Web3 JSON RPC"
    }
  },
  "libweb3core": {
    "secret": "JFwSGnXeSvDmhV9I",
    "parser": "doxygen",
    "summary": {
      "name": "Web3 Core"
    }
  }
}
```

#### Example `~/wikis.json`
```
{
  "ethereum-wiki": {
    "secret": "uDwnQQStuj6IOsnj",
    "parser": "marked",
    "summary": {
      "name": "Ethereum Wiki"
    }
  }
}
```
