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
        const dashToDockSettings = new Gio.Settings({
            settings_schema: dashToDockSettingsSchema,
        });
        dashToDockSettings.set_boolean(`dock-fixed`, false);
        GLib.timeout_add(
            GLib.PRIORITY_DEFAULT,
            this.getSettings().get_int(`delay`),
            () => {
                dashToDockSettings.set_boolean(`dock-fixed`, true);
                return GLib.SOURCE_REMOVE;
            }
        );
    }
}
