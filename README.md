# nrsv-haiku

🍃 Expressing the NRSV Bible translation in haiku form.

>The NRSV stands out among the many translations because it is "as literal as possible" in adhering to the ancient texts and only "as free as necessary" to make the meaning clear in graceful, understandable English. It draws on newly available sources that increase our understanding of many previously obscure biblical passages. These sources include new-found manuscripts, the Dead Sea Scrolls, other texts, inscriptions, and archaeological finds from the ancient Near East, and new understandings of Greek and Hebrew grammar.
>
>_— [New Revised Standard Version (NRSV) - Version Information - BibleGateway.com](https://www.biblegateway.com/versions/New-Revised-Standard-Version-NRSV-Bible/#vinfo)_

## Getting Started

Just `yarn install` and run the following to invoke locally:

```
yarn invoke

{
  id: '1d01c377fa0b9b1157b9eaf3a2b868e1',
  lines: [
    'Blessed are those who wash',
    'their robes, so that they will have',
    'the right to the tree'
  ],
  metadata: {
    ...
  }
}
```

### Invoke Options

By default, `yarn invoke` generates a haiku object from a random verse. The `--book`, `--chapter`, and/or `--verse` options may be used to invoke a specific verse; or a random verse of a specific book and/or chapter. The following is an example of a specific verse:

```
yarn invoke --book gen --chapter 1 --verse 10

{
  id: '0ce484c45320d049b98b13dc7fbc621c',
  lines: [
    'God called the dry land',
    'Earth, and the waters that were',
    'gathered together'
  ],
  metadata: {
    ...
  }
}
```
