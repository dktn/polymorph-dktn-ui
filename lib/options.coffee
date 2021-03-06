fs = require 'fs'

module.exports =

    apply: () ->
        root = document.documentElement
        styleTimer = null

        packageName = 'resonance-ui'
        themeColorEntry        = packageName + '.colors.theme'
        textColorEntry         = packageName + '.colors.text'
        inactiveTabColorEntry  = packageName + '.colors.inactiveTabColor'
        indentGuideColorEntry  = packageName + '.colors.indentGuide'
        invisiblesColorEntry   = packageName + '.colors.invisibles'
        gutterColorEntry       = packageName + '.colors.gutter'
        gutterCursorColorEntry = packageName + '.colors.gutterCursor'
        fontSizeEntry          = packageName + '.treeView.fontSize'
        lineHeightEntry        = packageName + '.treeView.lineHeight'
        hideInactiveFilesEntry = packageName + '.treeView.hideInactiveFiles'
        ratioNoHoverEntry      = packageName + '.treeView.ratioNoHover'
        ratioHoverEntry        = packageName + '.treeView.ratioHover'
        tabHeightEntry         = packageName + '.tabs.tabHeight'

        isHexCode = (hexCode) ->
            return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test hexCode

        writeCustomStyles = (themeColor,
                            textColor,
                            inactiveTabColor,
                            indentGuideColor,
                            invisiblesColor,
                            gutterColor,
                            gutterCursorColor,
                            fontSize,
                            lineHeight,
                            ratioNoHover,
                            ratioHover,
                            tabHeight,
                            options) ->
            if  isHexCode(themeColor)       and
                isHexCode(textColor)        and
                isHexCode(inactiveTabColor) and
                isHexCode(indentGuideColor) and
                isHexCode(invisiblesColor)  and
                isHexCode(gutterColor)      and
                isHexCode(gutterCursorColor)
                    custom =
                        '@theme-color: '                 + themeColor        +
                        ';\n@text-color: '               + textColor         +
                        ';\n@inactive-tab-color: '       + inactiveTabColor  +
                        ';\n@indent-guide-color: '       + indentGuideColor  +
                        ';\n@invisibles-color: '         + invisiblesColor   +
                        ';\n@gutter-text-color: '        + gutterColor       +
                        ';\n@gutter-text-cursor-color: ' + gutterCursorColor +
                        ';\n@tree-view-font-size: '      + fontSize   + 'px' +
                        ';\n@tree-view-line-height: '    + lineHeight + 'px' +
                        ';\n@tab-height: '               + tabHeight  + 'px' +
                        ';\n@nohover-ratio: '            + ratioNoHover      +
                        ';\n@hover-ratio: '              + ratioHover        +
                        ';\n'
                    fs.writeFile "#{__dirname}/../styles/custom-settings.less", custom, 'utf8', () ->
                        if not (options and options.noReload)
                            themePack = atom.packages.getLoadedPackage packageName
                            if themePack
                                themePack.deactivate()
                                setImmediate () => themePack.activate()

        delay = (ms, func) -> setTimeout func, ms

        saveCustomSettings = () ->
            if styleTimer
                clearTimeout styleTimer
            styleTimer = delay 1000, () ->
                styleTimer = false
                themeColor        = atom.config.get themeColorEntry
                textColor         = atom.config.get textColorEntry
                inactiveTabColor  = atom.config.get inactiveTabColorEntry
                indentGuideColor  = atom.config.get indentGuideColorEntry
                invisiblesColor   = atom.config.get invisiblesColorEntry
                gutterColor       = atom.config.get gutterColorEntry
                gutterCursorColor = atom.config.get gutterCursorColorEntry
                fontSize          = atom.config.get fontSizeEntry
                lineHeight        = atom.config.get lineHeightEntry
                ratioNoHover      = atom.config.get ratioNoHoverEntry
                ratioHover        = atom.config.get ratioHoverEntry
                tabHeight         = atom.config.get tabHeightEntry
                writeCustomStyles themeColor,
                                  textColor,
                                  inactiveTabColor,
                                  indentGuideColor,
                                  invisiblesColor,
                                  gutterColor,
                                  gutterCursorColor,
                                  fontSize,
                                  lineHeight,
                                  ratioNoHover,
                                  ratioHover,
                                  tabHeight

        atom.config.onDidChange themeColorEntry,        saveCustomSettings
        atom.config.onDidChange textColorEntry,         saveCustomSettings
        atom.config.onDidChange inactiveTabColorEntry,  saveCustomSettings
        atom.config.onDidChange indentGuideColorEntry,  saveCustomSettings
        atom.config.onDidChange invisiblesColorEntry,   saveCustomSettings
        atom.config.onDidChange gutterColorEntry,       saveCustomSettings
        atom.config.onDidChange gutterCursorColorEntry, saveCustomSettings
        atom.config.onDidChange fontSizeEntry,          saveCustomSettings
        atom.config.onDidChange lineHeightEntry,        saveCustomSettings
        atom.config.onDidChange hideInactiveFilesEntry, saveCustomSettings
        atom.config.onDidChange ratioNoHoverEntry,      saveCustomSettings
        atom.config.onDidChange ratioHoverEntry,        saveCustomSettings
        atom.config.onDidChange tabHeightEntry,         saveCustomSettings

        hideInactiveFiles = (hideStatus) ->
            if hideStatus == true
                root.classList.add 'hide-idle-tree-items'
            else
                root.classList.remove 'hide-idle-tree-items'

        hideInactiveFiles atom.config.get hideInactiveFilesEntry

        atom.config.onDidChange hideInactiveFilesEntry, () =>
            hideInactiveFiles atom.config.get hideInactiveFilesEntry
