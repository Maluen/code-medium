Code Medium
=================

Browser extension that simplifies writing code in Medium posts. Quickly create and edit Github Gists without leaving the editor.

Features
--------
* Adds a button in the text toolbar for creating a new Gist and adding it to the post.
* Gists can be created as either public or secret (unlisted).
* Double click on an existing Gist to edit or delete it.
* Deleting a gist will remove both the embed from the post and the gist from your account.
  To only remove the embed, just click on it and press the delete key as usual.
* Syntax highlighting for most programming languages thanks to [react-ace](https://github.com/securingsincity/react-ace)!

Authorizing the application
--------
This extension uses the [GitHub Gist API](https://developer.github.com/v3/gists/) to create and edit gists,
this means that you'll have to authorize the OAuth application for the "gist" permission.

Once the extension is installed, just click the toolbar button or double click on an existing gist to
show the login button.

Known Limitations
--------

Gists composed of multiple files aren't fully supported:
- Currently, only single-file gists can be created.
- When double clicking on an existing multi-file gist, only the first file will show up in the modal.
  However, you can still edit that file normally and delete the whole gist.
