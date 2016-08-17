'use babel';

import fs from 'fs';

export default {
    apply: function() {
        root = document.documentElement;
        styleTimer = null;

        var hideInactiveFiles = function(hideStatus) {
            if (hideStatus === true) {
                root.classList.add('hide-idle-tree-items');
            }
            else {
                root.classList.remove('hide-idle-tree-items');
            }
        }

        var hideInactiveFilesEntry = 'polymorph-dktn-ui.treeView.hideInactiveFiles';

        hideInactiveFiles(atom.config.get(hideInactiveFilesEntry));

        atom.config.onDidChange(hideInactiveFilesEntry, function() {
            hideInactiveFiles(atom.config.get(hideInactiveFilesEntry));
        });

    }
};
