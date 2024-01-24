'use strict';

const { Gio, GLib } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;

class Extension {
    enable() {
        const dashToDockSettingsSchema = Gio.SettingsSchemaSource.get_default().lookup(
            `org.gnome.shell.extensions.dash-to-dock`,
            true
        );
        if (!dashToDockSettingsSchema) {
            return;
        }

        const values = {
            'animation-time': GLib.Variant.new_double(0),
            'dock-fixed': GLib.Variant.new_boolean(false),
        };

        const dashToDockSettings = new Gio.Settings({
            settings_schema: dashToDockSettingsSchema,
        });

        const snapshot = {};
        for (const key in values) {
            snapshot[key] = dashToDockSettings.get_value(key);
            dashToDockSettings.set_value(key, values[key]);
        }

        this._showDashToDockTimeoutId = GLib.timeout_add(
            GLib.PRIORITY_DEFAULT,
            ExtensionUtils.getSettings().get_int(`delay`),
            () => {
                for (const key in snapshot) {
                    dashToDockSettings.set_value(key, snapshot[key]);
                }
                return GLib.SOURCE_REMOVE;
            }
        );
    }

    disable() {
        if (this._showDashToDockTimeoutId) {
            GLib.Source.remove(this._showDashToDockTimeoutId);
            delete this._showDashToDockTimeoutId;
        }
    }
}

function init() {
    return new Extension();
}
