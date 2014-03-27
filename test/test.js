"use strict"

var tape = require("tape")
var preprocessTree = require("../lca.js")

tape("least-common-ancestor", function(t) {

  function verifyQuery(root, lca) {
    var nodes = []
    function visit(node, parents) {
      parents.push(node)
      nodes.push(parents.slice())
      Object.keys(node).forEach(function(id) {
        var child = node[id]
        if(typeof child === "object") {
          visit(child, parents)
        }
      })
      parents.pop()
    }
    visit(root, [])
    for(var i=0; i<nodes.length; ++i) {
      for(var j=0; j<nodes.length; ++j) {
        var li = nodes[i]
        var lj = nodes[j]
        var bfAncestor = null
        for(var k=0; k<li.length && k<lj.length; ++k) {
          if(li[k] !== lj[k]) {
            break
          }
          bfAncestor = li[k]
        }
        t.equals(lca(li[li.length-1], lj[lj.length-1]), bfAncestor, "checking lca(" + i + "," + j + ")")
      }
    }
  }

  function verifyTree(root) {
    var lca = preprocessTree(root)
    verifyQuery(root, lca)
    lca.rebuild()
    verifyQuery(root, lca)
  }

  verifyTree({
    
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
  })

  verifyTree([[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]])

  t.end()
})