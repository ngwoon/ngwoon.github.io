---
title: Javascript arguments
author: ngwoon
layout: post
categories:
- javascript
tags:
- 자바스크립트
- arguments
---

# [Javascript] arguments
- - -

javascript 함수에는 arguments 라고 하는 **Array 형태**의 변수가 존재한다.

이는 해당 함수를 호출할 때 넣어준 인자를 저장하고 있다.
```jsx
function test() {
    for(var i=0; i<arguments.length; ++i)
        console.log(arguments[i]);
}

test(1,2,3,4);

// 출력 결과
1
2
3
4
```
arguments를 **Array 형태** 라고 언급한 이유는, Array 처럼 인덱스 접근 및 length는 지원하지만, 그 외 forEach, map 등과 같은 내장 함수는 지원하지 않기 때문이다.
<br/><br/>

## 함수명.length와 arguments.length

### 함수명.length
이는 함수에서 정의하고 있는 매개변수의 개수를 리턴한다.

### arguments.length
이는 실제 함수 호출 시 전달한 인자의 개수를 리턴한다.

예시코드
```jsx
function test(arg) {
		console.log(test.length);
		console.log(arguments.length);
}
test('myname', 'is');

// 실행결과
1
2
```