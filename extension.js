'use strict';

const { Gio, GLib } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;

let showDashToDockTimeoutId;

var enable = () => {
    const dashToDockSettingsSchema = Gio.SettingsSchemaSource.get_default().lookup(
        `org.gnome.shell.extensions.dash-to-dock`,
        true
    );
    if (!dashToDockSettingsSchema) {
        return;
    }
    const dashToDockSettings = new Gio.Settings({
        settings_schema: dashToDockSettingsSchema,
    });
    dashToDockSettings.set_boolean(`dock-fixed`, false);
    showDashToDockTimeoutId = GLib.timeout_add(
        GLib.PRIORITY_DEFAULT,
        ExtensionUtils.getSettings().get_int(`delay`),
        () => {
            dashToDockSettings.set_boolean(`dock-fixed`, true);
            return GLib.SOURCE_REMOVE;
        }
    );
};

var disable = () => {
    if (showDashToDockTimeoutId) {
        GLib.Source.remove(showDashToDockTimeoutId);
        showDashToDockTimeoutId = null;
    }
};
