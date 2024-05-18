# Add artifact link to Pull Requests

Comment Actions Artifacts from your Workflow Runs.

The action automatically edits Pull Requests' descriptions with link to download
one or more artifacts. This action is heavily inspired by the [ReadTheDocs
action](https://github.com/readthedocs/actions/tree/main/preview) for previewing a
documentation.

## Example

![Example of a description edited with link to download
artifacts](pull-request-example.png)

## How to use it

Add a new action after the upload-artifact action in an already existing [GitHub
Action](https://docs.github.com/en/actions) in your repository where you uploaded an
artifact using the [upload-artifact](https://github.com/actions/upload-artifact).

```yaml
- uses: PicoCentauri/comment-artifact@v1
  with:
    name: "ARTIFACT_NAME"
```

To allow to update the comment update the
[permissions](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs)
of your job to

```yaml
permissions:
    pull-requests: write
```

Once you added this to your repository, next time anybody opens a Pull
Request, the description will be edited to include the link to one or more artifacts.

> Note that **_you have to_ replace `ARTIFACT_NAME` the correct name of your uploaded
> artifact.**.

You can as many comments as you like. They will be stacked within the comment section of
the pull request.

## Configuration

These are all the parameters this action supports:
* `name` (_optional_): Name of artifact you defined using the
  [upload-artifact](https://github.com/actions/upload-artifact) action. (default:
  `artifact`)
* `description` (_optional_): Description of link text that should appear in the updated comment
  of your pull request. (default: `Download artifact for this pull request`)
