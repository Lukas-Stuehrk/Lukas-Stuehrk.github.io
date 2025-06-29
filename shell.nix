let
  pkgs = import <nixpkgs> {};
in
pkgs.stdenv.mkDerivation {
  name = "website-env";

  buildInputs =
    [
      pkgs.nodejs_22
      pkgs.validator-nu
      pkgs.git
    ];
}
