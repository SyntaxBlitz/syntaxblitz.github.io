{
  description = "Build timothyaveni.com for GitHub Pages";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs, ... }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
      siteFiles = [
        ".nojekyll" ".well-known" "360" "CNAME" "avl" "bolt" "cubing"
        "files" "fluff" "images" "index.html" "keybase.txt" "mining-lear"
        "playground" "portfolio" "projects" "rainbowCrosshair" "research"
        "resume.pdf" "style.css" "undertow" "vesuvius" "water_timer_privacy"
      ];
      source = builtins.path {
        path = ./.;
        name = "site-source";
        filter = path: _type:
          let relative = nixpkgs.lib.removePrefix (toString ./. + "/") (toString path);
              topLevel = builtins.head (nixpkgs.lib.splitString "/" relative);
          in path == toString ./. || builtins.elem topLevel siteFiles;
      };
    in {
      packages = forAllSystems (system:
        let pkgs = nixpkgs.legacyPackages.${system};
        in {
          default = pkgs.runCommand "timothyaveni-site" {} ''
            mkdir -p "$out"
            cp -R ${source}/. "$out/"
          '';
        });

      apps = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          site = self.packages.${system}.default;
        in {
          default = {
            type = "app";
            program = toString (pkgs.writeShellScript "build-site-to-docs" ''
              mkdir -p docs
              ${pkgs.rsync}/bin/rsync -r --delete --chmod=Du+w,Fu+w ${site}/ docs/
            '');
          };
        });
    };
}
