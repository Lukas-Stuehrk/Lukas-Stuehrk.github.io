{
  description = "Lukas Ehlers Stührk's personal website";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      packages = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.buildNpmPackage {
            pname = "ehlster-website";
            version = "0.0.1";

            src = let
              fs = nixpkgs.lib.fileset;
            in fs.toSource {
              root = ./.;
              fileset = fs.difference ./. (fs.maybeMissing ./docs);
            };

            nodejs = pkgs.nodejs_22;

            nativeBuildInputs = [ pkgs.validator-nu ];

            npmDepsHash = "sha256-KjQiKTkZayiryBY5Oi2mHdXPyhhC8qdfavdRJf1KA0s=";

            dontNpmInstall = true;

            installPhase = ''
              cp -r docs/. $out/
            '';
          };
        });

      devShells = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            buildInputs = [
              pkgs.nodejs_22
              pkgs.validator-nu
              pkgs.git
            ];
          };
        });
    };
}
