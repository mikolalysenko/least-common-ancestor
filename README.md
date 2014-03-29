least-common-ancestor
=====================
Preprocesses a tree encoded as some generic JSON object so that least common ancestor queries can be answered in O(1) time and O(n log(n)) space.  This is a static operation, so if you modify the tree you will need to rebuild the data structure.

# Example

```javascript
var preprocessTree = require("least-common-ancestor")

//Create some random tree
var tree = {
    bar: { name: "bar" },
    baz: {
      name: "baz",
      zardoz: {
        golub: {},
        potato: {
          x: 1,
          y: 2,
          z: 3,
          f: {
            p: 1,
            q: {},
            xx: [
              {},
              {},
              {},
              [ [], [], [] ]
            ]
          }
        }
      }
    }
  }

//Preprocess tree to answer least common ancestor queries
var lca = preprocessTree(tree)

//Now we get constant time least common ancestor queries!
var assert = require("assert")

assert.ok(lca(tree.baz.zardoz.potato, tree.bar) === tree)
assert.ok(lca(tree.baz.zardoz.potato, tree.baz.zardoz.golub) === tree.baz.zardoz)
```

# Install

```
npm install least-common-ancestor
```

# API

### `var lca = require("least-common-ancestor")(root[,filter(node,child)])`
Preprocesses a tree to answer least common ancestor queries

* `root` is the root of a JSON object tree
* `filter(node,child)` is an optional function, which if passed determines which subtrees the augmentation is applied to.  The interpretation of these arguments is:

    + `node` is the subtree node
    + `child` is a string representing the child property of node

    `filter` should return a truthy value if `node[child]` should be augmented, or a falsey value if it should be skipped.

**Returns** A function, `lca`, which computes the least common ancestor of any two nodes of the tree.

### `lca(a, b)`
Computes the least common ancestor of two nodes in a tree

* `a` and `b` are objects which are subnodes of the tree

**Returns** The object in the tree which is the least common ancestor of `a` and `b`

### `lca.rebuild()`
Rebuilds the data structure from scratch.  This is necessary if the structure of the tree changes.

# Credits
(c) 2014 Mikola Lysenko. MIT License