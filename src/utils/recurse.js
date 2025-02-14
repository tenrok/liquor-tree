export function recurseDown(obj, fn) {
  let res;

  if (Array.isArray(obj)) {
    return obj.map((node) => recurseDown(node, fn));
  }

  res = fn(obj);

  // Recurse children
  if (res !== false && obj.children && obj.children.length) {
    res = recurseDown(obj.children, fn);
  }

  return res;
}
