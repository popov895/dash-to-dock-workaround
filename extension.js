'use strict';

import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class extends Extension {
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
            this.getSettings().get_int(`delay`),
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
