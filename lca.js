"use strict"

module.exports = preprocessTree

var dup = require("dup")
var bits = require("bit-twiddle")
var weakMap = typeof WeakMap === "undefined" ? require("weakmap") : WeakMap

function buildIntervals(depths, nodes) {
  var n = depths.length
  var maxHeight = bits.log2(n)+1
  var result = dup([n, maxHeight], 0)
  for(var i=n-1; i>=0; --i) {
    var levels = result[i]
    levels[0] = i
    var h = depths[i]
    for(var j=1; j<maxHeight; ++j) {
      var d = i + (1<<(j-1))
      if(d >= n) {
        for(; j<maxHeight; ++j) {
          levels[j] = levels[j-1]
        }
        break
      }
      var x = result[d][j-1]
      var hx = depths[x]
      if(hx < h) {
        h = hx
        levels[j] = x
      } else {
        levels[j] = levels[j-1]
      }
    }
  }
  return result
}

function preprocessTree(root, filter) {
  var depths, intervals, nodes, lcaData

  function rebuildDataStructure() {
    depths = []
    nodes = []
    if(lcaData && lcaData.clear) {
      lcaData.clear()
    } else {
      lcaData = new weakMap()
    }
    function visit(node, depth) {
      lcaData.set(node, depths.length)
      depths.push(depth)
      nodes.push(node)
      var keys = Object.keys(node)
      for(var i=0; i<keys.length; ++i) {
        var child = node[keys[i]]
        if((typeof child === "object") && (child !== null)) {
          if(filter && !filter(node, keys[i])) {
            continue
          }
          visit(child, depth+1)
          depths.push(depth)
          nodes.push(node)
        }
      }
    }
    visit(root, 0)
    intervals = buildIntervals(depths, nodes)
  }

  function leastCommonAncestor(a, b) {
    var aIndex = lcaData.get(a)
    var bIndex = lcaData.get(b)
    var lo = Math.min(aIndex, bIndex)
    var hi = Math.max(aIndex, bIndex)
    var d = hi - lo
    if(d === 0) {
      return a
    }
    var l = bits.log2(d)
    var x = intervals[lo][l]
    var y = intervals[hi - (1<<l) + 1][l]
    if(depths[x] < depths[y]) {
      return nodes[x]
    } else {
      return nodes[y]
    }
  }
  leastCommonAncestor.rebuild = rebuildDataStructure

  rebuildDataStructure()
  return leastCommonAncestor
}