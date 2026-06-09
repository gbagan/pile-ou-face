export function lzw(coins: (0 | 1)[]) {
  const dictionary = new Set<string>(); 
  dictionary.add("0");
  dictionary.add("1");
  let counter = 0;
  let w = "";
  for (const coin of coins) {
    const wc = w + coin;
    if (dictionary.has(wc)) {
      w = wc;
    } else {
      dictionary.add(wc);
      counter += 1;
      w = "" + coin;
    }
  }
  if (w !== "") {
    counter += 1
  }
  return counter;
}

let arr = [];
for (let i = 0; i < 10000; i++) {
  const random = new Uint32Array(100);
  crypto.getRandomValues(random);
  arr.push(lzw([...random].map(v => v % 2 as 0 | 1)));
}
let t = Object.groupBy(arr, x => ""+x);
for (const x in t) {
  console.log(x, t[x]!.length)
}