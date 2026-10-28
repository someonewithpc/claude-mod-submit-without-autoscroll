self: { lib, pkgs }:
{
  enable = lib.mkEnableOption "submit-without-autoscroll, the Claude Code mod that submits a prompt without scrolling to the bottom";

  package = lib.mkOption {
    type = lib.types.package;
    default = self.packages.${pkgs.stdenv.hostPlatform.system}.default;
    defaultText = lib.literalExpression "claude-mod-submit-without-autoscroll.packages.\${system}.default";
    description = "The mod's folder, loaded through CLAUDE_CODE_PLUGIN_DIRS.";
  };
}
