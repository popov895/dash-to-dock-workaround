'use strict';

import GLib from 'gi://GLib';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class extends Extension {
    enable() {
        this._applyWorkaround();
    }

    disable() {
        if (this._workaroundTimeoutId) {
            GLib.Source.remove(this._workaroundTimeoutId);
            delete this._workaroundTimeoutId;
        }
    }

    async _applyWorkaround() {
        const extension = Main.extensionManager.lookup(`ubuntu-dock@ubuntu.com`);
        if (!extension) {
            return;
        }

        const { dockManager } = await import(extension.dir.get_child(`extension.js`).get_uri());
        if (!dockManager || !dockManager.settings.dockFixed) {
            return;
        }

        const mainDock = dockManager.mainDock;
        if (!mainDock) {
            return;
        }

        this._workaroundTimeoutId = GLib.timeout_add(
            GLib.PRIORITY_DEFAULT,
            this.getSettings().get_int(`delay`),
            () => {
                mainDock._animateOut(0, 0);
                mainDock._animateIn(dockManager.settings.animationTime, 0);
                return GLib.SOURCE_REMOVE;
            }
        );
    }
}
