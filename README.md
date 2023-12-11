# nestjs sparta sailing 99 concert reservation
## install
```
git clone 
pnpm i
cp .env.example .env.develop
or
cp .env.example .env.prod

pnpm run start:dev
or
pnpm run start:prod
```

## swagger
- http://localhost:3000/docs
- port 3000 is maybe need to reset by your setting

## dev
- git branch
  - yyyymmdd-{middlename}/type-task
- git commit
  - https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716
  - feat: (new feature for the user, not a new feature for build script)
    fix: (bug fix for the user, not a fix to a build script)
    docs: (changes to the documentation)
    style: (formatting, missing semi colons, etc; no production code change)
    refactor: (refactoring production code, eg. renaming a variable)
    test: (adding missing tests, refactoring tests; no production code change)
    chore: (updating grunt tasks etc; no production code change)

### docker
```
  cp .env.docker.example .env.docker
  docker compose --env-file .env.docker up -d
```
