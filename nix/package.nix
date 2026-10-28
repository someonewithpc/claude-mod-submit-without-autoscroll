{ lib, stdenvNoCC }:

# Claude Code reads the TypeScript itself, so the mod is its folder as is.
stdenvNoCC.mkDerivation {
  pname = "claude-mod-submit-without-autoscroll";
  version = (builtins.fromJSON (builtins.readFile ../.claude-plugin/plugin.json)).version;

  src = lib.fileset.toSource {
    root = ../.;
    fileset = lib.fileset.unions [
      ../.claude-plugin/plugin.json
      ../hooks
      ../README.md
      ../LICENSE
    ];
  };

  installPhase = ''
    runHook preInstall
    cp -r . $out
    runHook postInstall
  '';

  meta = {
    description = "Claude Code mod that submits a prompt without scrolling the transcript to the bottom";
    homepage = "https://github.com/someonewithpc/claude-mod-submit-without-autoscroll";
    license = lib.licenses.mit;
    platforms = lib.platforms.all;
  };
}
