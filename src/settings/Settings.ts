import { App, PluginSettingTab, Setting } from "obsidian";
import KoboHighlightsImporter from "src/main";
import { FileSuggestor } from "./suggestors/FileSuggestor";
import { FolderSuggestor } from "./suggestors/FolderSuggestor";

export const DEFAULT_SETTINGS: KoboHighlightsImporterSettings = {
    storageFolder: '',
    includeCreatedDate: false,
    dateFormat: "YYYY-MM-DD",
    templatePath: "",
    includeCallouts: true,
    highlightCallout: "quote",
    annotationCallout: "note",
}

export interface KoboHighlightsImporterSettings {
    storageFolder: string;
    includeCreatedDate: boolean;
    dateFormat: string;
    templatePath: string;
    includeCallouts: boolean,
    highlightCallout: string,
    annotationCallout: string,
}

export class KoboHighlightsImporterSettingsTab extends PluginSettingTab {
    constructor(public app: App, private plugin: KoboHighlightsImporter) {
        super(app, plugin);
    }

    display(): void {
        this.containerEl.empty();
        this.containerEl.createEl('h2', { text: this.plugin.manifest.name });

        this.add_destination_folder();
        this.add_enable_creation_date();
        this.add_date_fromat();
        this.add_temaplte_path();
        this.add_enable_callouts();
        this.add_highlight_callouts_format();
        this.add_annotation_callouts_format();
    }

    add_destination_folder(): void {
        new Setting(this.containerEl)
            .setName('Destination folder')
            .setDesc('Where to save your imported highlights')
            .addSearch((cb) => {
                new FolderSuggestor(this.app, cb.inputEl);
                cb.setPlaceholder("Example: folder1/folder2")
                    .setValue(this.plugin.settings.storageFolder)
                    .onChange((newFolder) => {
                        this.plugin.settings.storageFolder = newFolder;
                        this.plugin.saveSettings();
                    });
            });
    }

    add_temaplte_path(): void {
        new Setting(this.containerEl)
            .setName('Tempalte Path')
            .setDesc('Which tempalte to use for extracted highlights')
            .addSearch((cb) => {
                new FileSuggestor(this.app, cb.inputEl);
                cb.setPlaceholder("Example: folder1/template")
                    .setValue(this.plugin.settings.templatePath)
                    .onChange((newTemplatePath) => {
                        this.plugin.settings.templatePath = newTemplatePath;
                        this.plugin.saveSettings();
                    });
            });
    }

    add_enable_creation_date(): void {
        new Setting(this.containerEl)
            .setName("Add creation date")
            .setDesc(`If the exported higlights should include '- [[${this.plugin.settings.dateFormat}]]'`)
            .addToggle((cb) => {
                cb.setValue(this.plugin.settings.includeCreatedDate)
                    .onChange((toggle) => {
                        this.plugin.settings.includeCreatedDate = toggle;
                        this.plugin.saveSettings();
                    })
            })
    }

    add_date_fromat(): void {
        new Setting(this.containerEl)
            .setName("Date format")
            .setDesc("The format of date to use")
            .addMomentFormat((cb) => {
                cb.setPlaceholder("YYYY-MM-DD")
                    .setValue(this.plugin.settings.dateFormat)
                    .onChange((format) => {
                        this.plugin.settings.dateFormat = format;
                        this.plugin.saveSettings();
                    })
            })
    }

    add_enable_callouts(): void {
        const desc = document.createDocumentFragment();
        desc.append("When enabled Kobo highlights importer will make use of Obsidian callouts for highlights and annotations.",
        desc.createEl("br"),
        "When disabled standard markdown block quotes will be used for highlights only.",
          desc.createEl("br"),
          "Check the ",
          desc.createEl("a", {
            href: "https://help.obsidian.md/How+to/Use+callouts",
            text: "documentation"
          }),
        " to get a list of all available callouts that obsidian offers.");

        new Setting(this.containerEl)
            .setName("Use Callouts")
            .setDesc(desc)
            .addToggle((cb) => {
                cb.setValue(this.plugin.settings.includeCallouts)
                    .onChange((toggle) => {
                        this.plugin.settings.includeCallouts = toggle;
                        this.plugin.saveSettings();
                    });
            });
    }

    add_highlight_callouts_format(): void {
        new Setting(this.containerEl)
            .setName("Highlight callout format")
            .setDesc(`The callout to use for highlights.`)
            .addText((cb) => {
                cb.setPlaceholder("quote")
                    .setValue(this.plugin.settings.highlightCallout)
                    .onChange(async (toggle) => {
                        this.plugin.settings.highlightCallout = toggle;
                        await this.plugin.saveSettings();
                    });
            });
    }

    add_annotation_callouts_format(): void {
        new Setting(this.containerEl)
            .setName("Annotation callout format")
            .setDesc(`The callout to use for annotations.`)
            .addText((cb) => {
                cb.setPlaceholder("note")
                    .setValue(this.plugin.settings.annotationCallout)
                    .onChange(async (toggle) => {
                        this.plugin.settings.annotationCallout = toggle;
                        await this.plugin.saveSettings();
                    });
            });
    }
}
