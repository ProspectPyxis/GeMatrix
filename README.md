# GeMatrix Documentation

*This branch contains the Github Pages files and raw documentation for GeMatrix. Do not clone this branch unless you want to edit the files yourself!*

## Testing locally

If you want to test this site locally, first ensure you have Jekyll installed (please look up the installation instructions yourself), then do the following:

1. Open the terminal, CD into a folder of your choice, then clone this branch by running the following:
```
$ git clone --single-branch -b gh-pages https://github.com/ProspectPyxis/GeMatrix.git .
```
2. Run this command to package all the necessary plugins:
```
$ bundle
```
3. Edit `.env.example` and add your Github access token, then rename it to `.env`. This is not a necessary step, but if you wish to test out certain features connecting to Github then you must provide your own token.

Now, simply run `bundle exec jekyll serve`, and the site should be available to you at `localhost:4000`.
