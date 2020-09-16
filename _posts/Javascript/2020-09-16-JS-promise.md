---
title: Javascript Promise
author: ngwoon
layout: post
categories:
- javascript
tags:
- 자바스크립트
- promise
- then
- catch
- resolve
- reject
- async
- await
---

# [Javascript] Promise
- - -

## Promise

sync + async 프로그래밍 느낌.

비동기 함수 간 순서를 정하는 프로그래밍이 가능하다.

```jsx
// util 패키지의 promisify를 이용한 Promise 객체 만들기 예시
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

var promiseObj1 = readFile("./data.txt", "utf8");

// do something else

promiseObj1.then(function(text) { console.log('Then', text); })
		.catch(function(err) {console.log('Error', err); });
```

### Promise 객체 생성

util 패키지의 promisify 함수 이용. promisify함수에는 실행할 비동기 함수를 인자로 전달한다.

또는 new Promise(function(resolve, reject) { ... } ) 로 가능.

### Promise 객체의 상태

Promise 객체는 3가지 상태를 갖는다.

- 대기 (pending) → 이행 또는 거부되지 않은 초기 상태.
- 이행 (fulfilled) → 연산이 성공적으로 완료됨.
- 거부 (rejected) → 연산이 실패함.

이행, 혹은 거부 상태를 묶어 settled 상태라고도 말한다.

기본적으로 Promise 객체의 인자로 전달된 함수는 resolve와 reject 둘 중 하나를 반드시 실행해야 하며, resolve함수에는 성공적으로 처리된 데이터가, reject함수에는 에러 원인이 인자로 전달된다. 

resolve (reject) 함수는 아래와 같은 기준으로 동작한다.

1. 해당 Promise객체 (이하 A) 의 로직이 성공적으로 끝마치면 결과값 (이하 value) 을 인자로 받는다.
2. 만약 A가 then을 갖고 있다면, resolve 함수는 value와 함께 새로운 Promise 객체를 리턴한다.
3. 만약 A 뒤에 then 혹은 catch가 없다면, resolve 함수는 value 자체를 리턴한다.

### then, catch

then은 promisify에 넘겨준 비동기 함수가 성공적으로 끝났을 때의 콜백 함수를, catch는 에러 발생 시 처리 로직을 담당하는 콜백 함수를 전달한다.

Promise 객체의 매개변수인 resolve와 reject는 JS에서 제공되는 콜백 함수이다. 비동기 함수 처리 성공 시 resolve, 에러 발생 시 reject 함수가 수행된다.

then, catch로 전달된 콜백 함수는 resolve, reject 함수 내부에서 실행된다.

- Promise 내부에 구현한 연산 로직과 then, catch에 넘겨준 콜백 함수는 순서 관계가 명확하다. Promise 내부 로직의 실행이 정상적이든, 비정상적이든 끝나야지만 콜백 함수가 실행된다.

then, catch문이 Promise와 콜백의 차이점을 명확히 보여주는 요소라 할 수 있다.

then, catch문을 이용하여 비동기 함수 간 **순서**를 정할 수 있기 때문이다!!
<br/><br/>

## async와 await

async와 await 키워드를 이용해서 비동기적인 nodejs 환경에서 동기적 프로그래밍 흉내(?)를 낼 수 있다.

흉내낸다고 표현한 이유는, 내부적으로는 비동기적으로 처리되기 때문이다.

await 키워드는 Promise 객체 앞에 사용된다. await 키워드가 Promise 객체 앞에 붙으면 해당 객체가 처리될 때 까지 (settled 상태) 그 자리에서 block 된다.

async 키워드는 function 키워드 앞에 붙으며, async가 붙은 함수는 항상 Promise 객체를 반환하게 된다. 만약 해당 함수가 다른 자료형을 리턴하더라도, Promise 객체로 해당 값을 감싸서 반환하도록 내부 작업이 진행된다.

```jsx
function fetchItems() {
  return new Promise(function(resolve, reject) {
    var items = [1,2,3];
    resolve(items)
  });
}
  
async function logItems() {
  var resultItems = await fetchItems();
  console.log(resultItems); // [1,2,3]
}

// logItems가 async 함수이므로 Promise가 반환됨.
// 따라서 뒤에 then을 사용한 콜백 함수를 붙여줄 수 있음.
logItems().then(() => console.log("item fetched"));

// 출력 결과
[1, 2, 3]
item fetched
```