# Install dependencies

```
PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@9.0.1/install.ts
```

# Run

```
FULL_NAME="John Smith" \
AGE="29" \
STREET="Street 1B" \
ZIP_AND_CITY="1234 Foobar" \
PHONE="12345678" \
LOCATION="Copy from locations.ts file" \
PUPPETEER_PRODUCT=chrome \
deno run -A --unstable main.ts
```

You can also set `DRY_RUN=true` to run without submitting the form. This is
useful when debugging.

# Available locations

Check the `locations.ts` file.
