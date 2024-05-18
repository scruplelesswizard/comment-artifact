# Add artifact link to Pull Requests

Comment Actions Artifacts from your Workflow Runs.

The action automatically edits Pull Requests' descriptions with link to download
one or more artifacts. This action is heavily inspired by the [ReadTheDocs
action](https://github.com/readthedocs/actions/tree/main/preview) for previewing a
documentation.

## Example

![Example of a description edited with link to download
artifacts](pull-request-example.png)

# Usage


```yaml
- uses: PicoCentauri/comment-artifact@v1
  with:
    # Name of artifact defined using the
    # Default is 'artifact'
    name:

    # Description of link text that should appear in the updated comment of your
    # pull request. Default is 'Download artifact for this pull request'.
    description:

    # The id of the workflow run where the desired download artifact was uploaded from.
    # Optional. Default is ${{ github.run_id }}
    run-id:

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
