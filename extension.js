'use strict';

const { Gio, GLib } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;

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
    GLib.timeout_add(
        GLib.PRIORITY_DEFAULT,
        ExtensionUtils.getSettings().get_int(`delay`),
        () => {
            dashToDockSettings.set_boolean(`dock-fixed`, true);
            return GLib.SOURCE_REMOVE;
        }
    );
};

var disable = () => {
    // do nothing
};
