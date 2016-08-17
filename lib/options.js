'use babel';

import fs from 'fs';

export default {
    apply: function() {
        root = document.documentElement;
        styleTimer = null;

        var packageName = 'polymorph-dktn-ui';
        var hideInactiveFilesEntry = packageName + '.treeView.hideInactiveFiles';
        var noHoverRatioEntry      = packageName + '.treeView.noHoverRatio';
        var hoverRatioEntry        = packageName + '.treeView.hoverRatio';
        var themeColorEntry        = packageName + '.colors.themeColor';

        var isHexCode = function(hexCode) {
            return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(hexCode);
        };

        var writeCustomStyles = function(color, noHoverRatio, hoverRatio, options){
            if (isHexCode(color)) {
                var custom = '@theme-color: ' + color + ';\n@nohover-ratio: ' + noHoverRatio + ';\n@hover-ratio: ' + hoverRatio + ';\n';

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
                var themeColor   = atom.config.get(themeColorEntry)
                var noHoverRatio = atom.config.get(noHoverRatioEntry)
                var hoverRatio   = atom.config.get(hoverRatioEntry)
                writeCustomStyles(themeColor, noHoverRatio, hoverRatio);
            }, 1000);
        };

        atom.config.onDidChange(noHoverRatioEntry, saveCustomSettings);
        atom.config.onDidChange(hoverRatioEntry,   saveCustomSettings);
        atom.config.onDidChange(themeColorEntry,   saveCustomSettings);

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
