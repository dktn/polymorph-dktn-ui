'use babel';

import { CompositeDisposable } from 'atom';
import { TextEditor } from 'atom';

export default {

    config: {
        treeView: {
            title: 'Tree View',
            type: 'object',
            properties: {
                hideInactiveFiles: {
                    title: "Distraction-Free Mode",
                    description: "Select a setting to minimize the opacity of inactive files",
                    type: "boolean",
                    default: true
                }
            }
        }
    },

    activate: function(state) {
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(atom.workspace.onDidAddPaneItem(this.treeListAddOpen));
        this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(this.treeListRemoveOpen));

        atom.packages.activatePackage('tree-view').then(function(treeViewPkg) {
            this.treeView = treeViewPkg.mainModule.createView();
            var treeListUpdateOpen = function() {
                var items = atom.workspace.getPaneItems();
                for (i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item instanceof TextEditor && this.treeView) {
                        var filePath = item.getPath();
                        var entry = this.treeView.entryForPath(filePath);
                        if (entry) {
                            entry.classList.add('open');
                        }
                    }
                }
            };
            treeListUpdateOpen();
            this.treeView.on('click', '.directory', function() {
                treeListUpdateOpen();
            });
        });

        var Options = require('./options');
        Options.apply();
    },

    treeListAddOpen: function(event) {
        if (event.item instanceof TextEditor && this.treeView) {
            var filePath = event.item.getPath();
            var entry = this.treeView.entryForPath(filePath);
            if (entry) {
                entry.classList.add('open');
            }
        }
    },

    treeListRemoveOpen: function(event){
        if (event.item instanceof TextEditor && this.treeView) {
            var filePath = event.item.getPath();
            var entry = this.treeView.entryForPath(filePath);
            if (entry) {
                entry.classList.remove('open');
            }
        }
    },

    deactivate: function() {
        this.subscriptions.dispose();
    }

};
