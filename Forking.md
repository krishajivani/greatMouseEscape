# Forking & Syncing a Repo

Directions for forking an assignment repo and keeping it properly synced.

## 1. Fork the Repo

![Fork Button](https://github-images.s3.amazonaws.com/help/bootcamp/Bootcamp-Fork.png)

Click the fork button in the upper right corner of the assignment repo.

## 2. Create a Local Clone of your Fork

![Clone](https://docs.github.com/assets/images/help/repository/code-button.png)

Navigate to your newly forked repo, and clone the fork as you normally would by clicking on the green "Code" button and
selecting your preferred method of cloning.

## 3. Configure Git to Sync your fork

1. Navigate to the location of your local clone of the fork
2. Type `git remote -v` You should see the current configured remote repository for your fork which will look something
   like this:

```
$ git remote -v
> origin  https://github.coecis.cornell.edu/YOUR_USERNAME/assignment2.git (fetch)
> origin  https://github.coecis.cornell.edu/YOUR_USERNAME/assignment2.git (push)
```

3. Type `$ git remote add upstream https://github.coecis.cornell.edu/CS4620-F2021/[assignment#].git`
   where `[assignment#]` is replaced with the number of the specific assignment. Do double check that the URL which
   follows `upstream` is the URL you would copy when cloning the **original** assignment repo.
4. To verify the new upstream repository you've specified for your fork, type `git remote -v` again. You should see the
   URL for your fork as `origin`, and the URL for the original repository as `upstream`. It will look something like
   this:

```
$ git remote -v
> origin    https://github.coecis.cornell.edu/YOUR_USERNAME/assignment2.git (fetch)
> origin    https://github.coecis.cornell.edu/YOUR_USERNAME/assignment2.git (push)
> upstream  https://github.coecis.cornell.edu/CS4620-F2021/assignment2.git (fetch)
> upstream  https://github.coecis.cornell.edu/CS4620-F2021/assignment2.git (push)
```

## 4. Syncing your Fork

If their are changes to the original repository, you will want to sync your fork with this repo by following these
steps:

1. Navigate to the location of your local clone of the fork
2. Type `git fetch upstream` which will fetch the new commits from the upstream repository
3. Type `git checkout master` to ensure you are on the master branch of your local repo
4. Type `git merge upstream/master` to merge any changes from the original assignment repo into your local fork

## 5. Push your Changes (Optional)

Syncing your fork only updates your local copy of the repository. If you want to update your fork on GitHub make sure to
push your changes!
