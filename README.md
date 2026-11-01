This is the repository for [timothyaveni.com](http://timothyaveni.com/).

Everything here, unless otherwise noted, is [MIT licensed](https://github.com/SyntaxBlitz/syntaxblitz.github.io/blob/master/LICENSE).

To build the site into `docs/` for GitHub Pages, run `nix run path:.` from
this directory and commit the resulting files. The command replaces the contents
of `docs/` with the current build. Configure GitHub Pages to deploy from the
`/docs` folder on the publishing branch. `nix build path:.` builds the site into
`result` without changing `docs/`.
