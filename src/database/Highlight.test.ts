import * as chai from 'chai';
import { Repository } from '../database/repository';
import { HighlightService } from './Highlight';
import { Bookmark, Content, Highlight } from './interfaces';
import moment from 'moment';

describe('HighlightService', async function () {

    describe('Sample Content', async function () {
        
        let service: HighlightService

        before(async function () {
            const repo = <Repository> {}
            repo.getContentByContentId = () => Promise.resolve({
                title: "Chapter Eight: Holden",
                contentId: "file:///mnt/onboard/Corey, James S.A_/Nemesis Games - James S.A. Corey.epub#(12)OEBPS/Text/ch09.html",
                bookTitle: "Nemesis Games",
                chapterIdBookmarked: "true"
            })
            service = new HighlightService(repo)
        })

        describe('Sample Bookmark with no annotation', async function () {
            
            let highlight: Highlight
            let dateCreatedText: string

            before(async function () {
                const dateCreated = new Date(Date.UTC(2022, 7, 5, 20, 46, 41, 0))
                const bookmark: Bookmark = {
                    text: "“I guess I can’t be. How do you prove a negative?”",
                    contentId: "file:///mnt/onboard/Corey, James S.A_/Nemesis Games - James S.A. Corey.epub#(12)OEBPS/Text/ch09.html",
                    note: '',
                    dateCreated
                }
                highlight = await service.createHilightFromBookmark(bookmark)
                dateCreatedText = moment(dateCreated).format("")
            })

            it('fromMaptoMarkdown with date', async function () {
                const map = service
                    .convertToMap([highlight], true, "", false, '[!quote]', '[!note]')
                    .get(highlight.content.bookTitle ?? "")

                if(!map) {
                    chai.assert.isNotNull(map)
                    return
                }

                const markdown = service.fromMapToMarkdown(highlight.content.bookTitle ?? "", map)
                chai.assert.deepEqual(
                    markdown, `# Nemesis Games

## Chapter Eight: Holden

> “I guess I can’t be. How do you prove a negative?”

— [[` + dateCreatedText + `]]`
                )
            })

            it('fromMaptoMarkdown without date', async function () {
                const map = service
                    .convertToMap([highlight], false, "", false, '[!quote]', '[!note]')
                    .get(highlight.content.bookTitle ?? "")

                if(!map) {
                    chai.assert.isNotNull(map)
                    return
                }

                const markdown = service.fromMapToMarkdown(highlight.content.bookTitle ?? "", map)
                chai.assert.deepEqual(
                    markdown, `# Nemesis Games

## Chapter Eight: Holden

> “I guess I can’t be. How do you prove a negative?”`
                )
            })

            it('fromMaptoMarkdown with callouts', async function () {
                const map = service
                    .convertToMap([highlight], false, "", true, 'quote', 'note')
                    .get(highlight.content.bookTitle ?? "")

                if(!map) {
                    chai.assert.isNotNull(map)
                    return
                }

                const markdown = service.fromMapToMarkdown(highlight.content.bookTitle ?? "", map)
                chai.assert.deepEqual(
                    markdown, `# Nemesis Games

## Chapter Eight: Holden

> [!quote]
> “I guess I can’t be. How do you prove a negative?”`
                )
            })

            it('fromMaptoMarkdown with callouts and date', async function () {
                const map = service
                    .convertToMap([highlight], true, "", true, 'quote', 'note')
                    .get(highlight.content.bookTitle ?? "")

                if(!map) {
                    chai.assert.isNotNull(map)
                    return
                }

                const markdown = service.fromMapToMarkdown(highlight.content.bookTitle ?? "", map)
                chai.assert.deepEqual(
                    markdown, `# Nemesis Games

## Chapter Eight: Holden

> [!quote]
> “I guess I can’t be. How do you prove a negative?”

— [[` + dateCreatedText + `]]`
                )
            })
            
            it('fromMaptoMarkdown with custom callouts', async function () {
                const map = service
                    .convertToMap([highlight], false, "", true, 'bug', 'note')
                    .get(highlight.content.bookTitle ?? "")

                if(!map) {
                    chai.assert.isNotNull(map)
                    return
                }

                const markdown = service.fromMapToMarkdown(highlight.content.bookTitle ?? "", map)
                chai.assert.deepEqual(
                    markdown, `# Nemesis Games

## Chapter Eight: Holden

> [!bug]
> “I guess I can’t be. How do you prove a negative?”`
                )
            })

            it('fromMaptoMarkdown with custom callouts and date', async function () {
                const map = service
                    .convertToMap([highlight], true, "", true, 'bug', 'note')
                    .get(highlight.content.bookTitle ?? "")

                if(!map) {
                    chai.assert.isNotNull(map)
                    return
                }

                const markdown = service.fromMapToMarkdown(highlight.content.bookTitle ?? "", map)
                chai.assert.deepEqual(
                    markdown, `# Nemesis Games

## Chapter Eight: Holden

> [!bug]
> “I guess I can’t be. How do you prove a negative?”

— [[` + dateCreatedText + `]]`
                )
            })
        })

        describe('Sample Bookmark with annotation', async function () {
            
            let highlight: Highlight
            let dateCreatedText: string

            before(async function () {
                const dateCreated = new Date(Date.UTC(2022, 7, 5, 20, 46, 41, 0))
                const bookmark: Bookmark = {
                    text: "“I guess I can’t be. How do you prove a negative?”",
                    contentId: "file:///mnt/onboard/Corey, James S.A_/Nemesis Games - James S.A. Corey.epub#(12)OEBPS/Text/ch09.html",
                    note: 'This is a great note!',
                    dateCreated
                }
                highlight = await service.createHilightFromBookmark(bookmark)
                dateCreatedText = moment(dateCreated).format("")
            })

            it('fromMaptoMarkdown with date', async function () {
                const map = service
                    .convertToMap([highlight], true, "", false, '[!quote]', '[!note]')
                    .get(highlight.content.bookTitle ?? "")

                if(!map) {
                    chai.assert.isNotNull(map)
                    return
                }

                const markdown = service.fromMapToMarkdown(highlight.content.bookTitle ?? "", map)
                chai.assert.deepEqual(
                    markdown, `# Nemesis Games

## Chapter Eight: Holden

> “I guess I can’t be. How do you prove a negative?”

> This is a great note!

— [[` + dateCreatedText + `]]`
                )
            })

            it('fromMaptoMarkdown without date', async function () {
                const map = service
                    .convertToMap([highlight], false, "", false, '[!quote]', '[!note]')
                    .get(highlight.content.bookTitle ?? "")

                if(!map) {
                    chai.assert.isNotNull(map)
                    return
                }

                const markdown = service.fromMapToMarkdown(highlight.content.bookTitle ?? "", map)
                chai.assert.deepEqual(
                    markdown, `# Nemesis Games

## Chapter Eight: Holden

> “I guess I can’t be. How do you prove a negative?”

> This is a great note!`
                )
            })

            it('fromMaptoMarkdown with callouts', async function () {
                const map = service
                    .convertToMap([highlight], false, "", true, 'quote', 'note')
                    .get(highlight.content.bookTitle ?? "")

                if(!map) {
                    chai.assert.isNotNull(map)
                    return
                }

                const markdown = service.fromMapToMarkdown(highlight.content.bookTitle ?? "", map)
                chai.assert.deepEqual(
                    markdown, `# Nemesis Games

## Chapter Eight: Holden

> [!quote]
> “I guess I can’t be. How do you prove a negative?”

> [!note]
> This is a great note!`
                )
            })
            
            it('fromMaptoMarkdown with callouts and date', async function () {
                const map = service
                    .convertToMap([highlight], true, "", true, 'quote', 'note')
                    .get(highlight.content.bookTitle ?? "")

                if(!map) {
                    chai.assert.isNotNull(map)
                    return
                }

                const markdown = service.fromMapToMarkdown(highlight.content.bookTitle ?? "", map)
                chai.assert.deepEqual(
                    markdown, `# Nemesis Games

## Chapter Eight: Holden

> [!quote]
> “I guess I can’t be. How do you prove a negative?”

> [!note]
> This is a great note!

— [[` + dateCreatedText + `]]`
                )
            })

            it('fromMaptoMarkdown with custom callouts', async function () {
                const map = service
                    .convertToMap([highlight], false, "", true, 'quote', 'bug')
                    .get(highlight.content.bookTitle ?? "")

                if(!map) {
                    chai.assert.isNotNull(map)
                    return
                }

                const markdown = service.fromMapToMarkdown(highlight.content.bookTitle ?? "", map)
                chai.assert.deepEqual(
                    markdown, `# Nemesis Games

## Chapter Eight: Holden

> [!quote]
> “I guess I can’t be. How do you prove a negative?”

> [!bug]
> This is a great note!`
                )
            })

            it('fromMaptoMarkdown with custom callouts and date', async function () {
                const map = service
                    .convertToMap([highlight], true, "", true, 'quote', 'bug')
                    .get(highlight.content.bookTitle ?? "")

                if(!map) {
                    chai.assert.isNotNull(map)
                    return
                }

                const markdown = service.fromMapToMarkdown(highlight.content.bookTitle ?? "", map)
                chai.assert.deepEqual(
                    markdown, `# Nemesis Games

## Chapter Eight: Holden

> [!quote]
> “I guess I can’t be. How do you prove a negative?”

> [!bug]
> This is a great note!

— [[` + dateCreatedText + `]]`
                )
            })
        })
    })
});
