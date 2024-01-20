'use strict';

import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import { ExtensionPreferences, gettext, pgettext } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const _ = (text, context) => {
    return context ? pgettext(context, text) : gettext(text);
};

export default class extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();

        const delaySpinBox = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 1,
                upper: 5000,
                step_increment: 1,
            }),
            valign: Gtk.Align.CENTER,
        });
        window._settings.bind(
            `delay`,
            delaySpinBox,
            `value`,
            Gio.SettingsBindFlags.DEFAULT
        );

        const delayRow = new Adw.ActionRow({
            activatable_widget: delaySpinBox,
            subtitle: _(`Delay in applying the workaround (a very short delay may not work)`),
            title: _(`Delay (in milliseconds)`),
        });
        delayRow.add_suffix(delaySpinBox);

        const generalGroup = new Adw.PreferencesGroup({
            title: _(`General`, `General options`),
        });
        generalGroup.add(delayRow);

        const page = new Adw.PreferencesPage();
        page.add(generalGroup);

        window.add(page);
    }
}
