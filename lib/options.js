'use babel';

import fs from 'fs';

export default {
    apply: function() {
        root = document.documentElement;
        styleTimer = null;

        var packageName = 'polymorph-dktn-ui';
        var themeColorEntry        = packageName + '.colors.themeColor';
        var fontSizeEntry          = packageName + '.treeView.fontSize';
        var lineHeightEntry        = packageName + '.treeView.lineHeight';
        var hideInactiveFilesEntry = packageName + '.treeView.hideInactiveFiles';
        var ratioNoHoverEntry      = packageName + '.treeView.ratioNoHover';
        var ratioHoverEntry        = packageName + '.treeView.ratioHover';
        var tabHeightEntry         = packageName + '.tabs.tabHeight';

        var isHexCode = function(hexCode) {
            return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(hexCode);
        };

        var writeCustomStyles = function(color, fontSize, lineHeight, ratioNoHover, ratioHover, tabHeight, options){
            if (isHexCode(color)) {
                var custom =
                       '@theme-color: '           + color +
                    ';\n@tree-view-font-size: '   + fontSize +   'px' +
                    ';\n@tree-view-line-height: ' + lineHeight + 'px' +
                    ';\n@nohover-ratio: '         + ratioNoHover +
                    ';\n@hover-ratio: '           + ratioHover +
                    ';\n@tab-height: '            + tabHeight + 'px' +
                    ';\n';

                fs.writeFile(`${__dirname}/../styles/custom-settings.less`, custom, 'utf8', () => {
                    if (!options || !options.noReload) {
                        var themePack = atom.packages.getLoadedPackage(packageName);

                        if (themePack) {
                            themePack.deactivate();
                            setImmediate(() => themePack.activate());
                        }
                    }
                });
            }
        };

        var saveCustomSettings = function() {
            if (styleTimer) {
                clearTimeout(styleTimer);
            }
            styleTimer = setTimeout(function() {
                styleTimer = false;
                var themeColor   = atom.config.get(themeColorEntry);
                var fontSize     = atom.config.get(fontSizeEntry);
                var lineHeight   = atom.config.get(lineHeightEntry);
                var ratioNoHover = atom.config.get(ratioNoHoverEntry);
                var ratioHover   = atom.config.get(ratioHoverEntry);
                var tabHeight    = atom.config.get(tabHeightEntry);
                writeCustomStyles(themeColor, fontSize, lineHeight, ratioNoHover, ratioHover, tabHeight);
            }, 1000);
        };

        atom.config.onDidChange(themeColorEntry,        saveCustomSettings);
        atom.config.onDidChange(fontSizeEntry,          saveCustomSettings);
        atom.config.onDidChange(lineHeightEntry,        saveCustomSettings);
        atom.config.onDidChange(hideInactiveFilesEntry, saveCustomSettings);
        atom.config.onDidChange(ratioNoHoverEntry,      saveCustomSettings);
        atom.config.onDidChange(ratioHoverEntry,        saveCustomSettings);
        atom.config.onDidChange(tabHeightEntry,         saveCustomSettings);

        var hideInactiveFiles = function(hideStatus) {
            if (hideStatus === true) {
                root.classList.add('hide-idle-tree-items');
            }
            else {
                root.classList.remove('hide-idle-tree-items');
            }
        };

        hideInactiveFiles(atom.config.get(hideInactiveFilesEntry));

        atom.config.onDidChange(hideInactiveFilesEntry, function() {
            hideInactiveFiles(atom.config.get(hideInactiveFilesEntry));
        });

    }
};
