'use strict';

const { GLib } = imports.gi;

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;

class Extension {
    enable() {
        this._applyWorkaround();
    }

    disable() {
        if (this._workaroundTimeoutId) {
            GLib.Source.remove(this._workaroundTimeoutId);
            delete this._workaroundTimeoutId;
        }
    }

    _applyWorkaround() {
        const extension = Main.extensionManager.lookup(`ubuntu-dock@ubuntu.com`);
        if (!extension) {
            return;
        }

        const dockManager = extension.imports.extension.dockManager;
        if (!dockManager || !dockManager.settings.dockFixed) {
            return;
        }

        const mainDock = dockManager.mainDock;
        if (!mainDock) {
            return;
        }

        this._workaroundTimeoutId = GLib.timeout_add(
            GLib.PRIORITY_DEFAULT,
            ExtensionUtils.getSettings().get_int(`delay`),
            () => {
                mainDock._animateOut(0, 0);
                mainDock._animateIn(dockManager.settings.animationTime, 0);
                return GLib.SOURCE_REMOVE;
            }
        );
    }
}

function init() {
    return new Extension();
}
