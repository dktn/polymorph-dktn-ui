'use babel';

import { CompositeDisposable } from 'atom';
import { TextEditor } from 'atom';

export default {

    config: {
        colors: {
            title: 'Colors',
            type: 'object',
            properties: {
                themeColor: {
                    title: 'Theme Colors',
                    description: 'Basic theme color',
                    type: 'string',
                    // default: '#282d33'
                    default: '#a0b4cc'
                }
            }
        },
        treeView: {
            title: 'Tree View',
            type: 'object',
            properties: {
                hideInactiveFiles: {
                    title: 'Hide inactive files',
                    description: 'Turns on/off diminishing the opacity of inactive files',
                    type: 'boolean',
                    default: true
                },
                fontSize: {
                    title: 'Font size',
                    description: 'Font size in px',
                    type: 'integer',
                    default: 12
                },
                lineHeight: {
                    title: 'Line height',
                    description: 'Line height in px',
                    type: 'integer',
                    default: 16
                },
                ratioNoHover: {
                    title: 'Diminution ratio',
                    description: 'Opacity of inactive files',
                    type: 'number',
                    minimum: 0.0,
                    maximum: 1.0,
                    default: 0.3
                },
                ratioHover: {
                    title: 'Diminution ratio on mouse hover',
                    description: 'Opacity of inactive files while browsing tree view',
                    type: 'number',
                    minimum: 0.0,
                    maximum: 1.0,
                    default: 0.6
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
