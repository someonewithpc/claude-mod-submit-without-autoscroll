self: { config, lib, pkgs, ... }:
let
  cfg = config.programs.claude-mod-submit-without-autoscroll;
in
{
  options.programs.claude-mod-submit-without-autoscroll = import ./options.nix self { inherit lib pkgs; };

  config = lib.mkIf cfg.enable {
    # A list, so other mods' folders join it instead of conflicting.
    environment.sessionVariables.CLAUDE_CODE_PLUGIN_DIRS = [ "${cfg.package}" ];
  };
}
