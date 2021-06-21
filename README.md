# Unique ID collision test

Collision simulation based on my blog post https://www.codepasta.com/databases/2020/09/10/shorter-unique-ids.html

```
npm i
node index.js
```

given

p = n^2 / (2 * b^c)

I am testing a theory that 0.001 probability is enough for any pre-determined base and max number of ids being generated.

If theory is true, then one can optimize the length of ID (c) to:

c = log(n^2 / 2p) / log(b)

(this is assuming non-cryptographic purpose, e.g. IDs for a list of items in database)