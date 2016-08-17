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

        var showOpenFiles = function(openFileStatus) {
            if (openFileStatus === true) {
                root.classList.add('always-show-open-files-in-tree-view');
            }
            else {
                root.classList.remove('always-show-open-files-in-tree-view');
            }
        }

        var hideInactiveFilesEntry = 'polymorph-dktn-ui.treeView.hideInactiveFiles';
        var showOpenFilesEntry     = 'polymorph-dktn-ui.treeView.showOpenFiles';

        hideInactiveFiles(atom.config.get(hideInactiveFilesEntry));
        showOpenFiles(atom.config.get(showOpenFilesEntry));

        atom.config.onDidChange(hideInactiveFilesEntry, function() {
            hideInactiveFiles(atom.config.get(hideInactiveFilesEntry));
        });
        atom.config.onDidChange(showOpenFilesEntry, function() {
            showOpenFiles(atom.config.get(showOpenFilesEntry));
        });

    }
};
