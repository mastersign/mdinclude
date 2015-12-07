# Nested includes with additional references

This contains a CSV table and source code:

| column A | column B | C |
|----------|----------|---|
| 1 | 100 | x,y, z |
| 2 | 101 | äöü |
| 3.0 | 102 | test &lt;text&gt; |
| 4.0 | 103 | some \$money$ no TeX math |
|  | 104 | a&#124;b |


```javascript
/**
 * @param message
 *     A message to print to the console.
 */
function foo(message) {
	console.log('foo: ' + message);
}

// print the message
foo('bar');
```
