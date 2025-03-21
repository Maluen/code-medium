Code Medium
=================

Browser extension that simplifies writing code in Medium and Substack posts. Quickly create and edit Github Gists without leaving the editor.

 <p align="center"> 
    <img src="/screenshots/screencast.gif?raw=true" alt="Code Medium">
 </p>

Features
--------

- Adds a button in the text toolbar for creating a new Gist and adding it to the post.
- Gists can be created as either public or secret (unlisted).
- Double click on an existing Gist to edit or delete it.
- Deleting a gist will remove both the embed from the post and the gist from your account.
  To only remove the embed, just click on it and press the delete key as usual.
- Syntax highlighting for the most popular programming languages thanks to [react-ace](https://github.com/securingsincity/react-ace)!
- Fixes the height of the Gists in the editor, to display them without being cut and without the extra padding (https://github.com/Maluen/code-medium/issues/3).
- Shortcuts: press "ALT + SHIFT + 0" while in a new paragraph to quickly open the Gist popup. The key combination can be changed in the browser settings.

Substack specific:
- Fix gist embedding by preventing the fake "hidden unicode warning" messages. See https://github.com/Maluen/code-medium/issues/11#issuecomment-2192327945

Installing from store
--------

- Chrome: https://chrome.google.com/webstore/detail/code-medium/dganoageikmadjocbmklfgaejpkdigbe
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/code-medium/ 

Building manually
--------

- Install dependencies with `yarn`
- To build for development and watch for changes run `yarn start`
- To build for production run `yarn run build`

Files will be generated under `dist/chrome` and `dist/firefox`.

Authorizing the application
--------
This extension uses the [GitHub Gist API](https://developer.github.com/v3/gists/) to create and edit gists,
this means that you'll have to authorize the OAuth application for the "gist" permission.

Once the extension is installed, toggle the extension modal by clicking the toolbar button or by double clicking on an existing gist to
show the login button.

Known Limitations
--------

Gists composed of multiple files aren't fully supported:
- Currently, only single-file gists can be created.
- When double clicking on an existing multi-file gist, only the first file will show up in the modal.
  However, you can still edit that file normally and delete the whole gist.
