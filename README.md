# Install dependencies

```
PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@9.0.1/install.ts
```

# Run

```
FULL_NAME="John Smith" \
AGE="29" \
STREET="Street 1B" \
ZIP_AND_CITY="1234 Copenhagen" \
PHONE="12345678" \
LOCATION="Copy from locations.ts file" \
PUPPETEER_PRODUCT=chrome \
deno run -A --unstable main.ts
```

You can also set `DRY_RUN=true` to run without submitting the form. This is
useful when debugging.

# Available locations

Check the `locations.ts` file.

# Github Actions for automating the process

You can create a private Github repository and run Github actions against this repository.

The example below will run at 7am UTC every day. Make sure you update the the `env` section, as well as setting up the appropriate locations (find list in `locations.ts`). Please also make sure to set `DRY_RUN` to `false` (or remove it) once you're done configuring and ready to submit the forms.

```yaml
name: Daily run

on:
  workflow_dispatch:
  schedule:
    - cron: "0 7 * * *"

jobs:
  main:
    runs-on: ubuntu-latest

    env:
      DRY_RUN: true # NOTE: Change this to `false` to actually submit the form!
      FULL_NAME: John Smith
      AGE: 29
      STREET: Street 1B
      ZIP_AND_CITY: 1234 Copenhagen
      PHONE: 12345678

    steps:
      - name: Setup repo
        uses: actions/checkout@v2
        with:
          repository: mikfoo/overskudsvaccine
          ref: main

      - name: Setup Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Setup Puppeteer
        run: PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@9.0.1/install.ts

      #
      # You can add as many locations as you want. Example with different 3 locations:
      #
      - name: Run location 1
        run: deno run -A --unstable main.ts
        env:
          LOCATION: Ballerup, Baltorpvej 18
          
      - name: Run location 2
        run: deno run -A --unstable main.ts
        env:
          LOCATION: Ishøj, Vejledalen 17

      - name: Run location 3
        run: deno run -A --unstable main.ts
        env:
          LOCATION: Bella Center, Ørestad Boulevard/Martha Christensens Vej, København S
```
