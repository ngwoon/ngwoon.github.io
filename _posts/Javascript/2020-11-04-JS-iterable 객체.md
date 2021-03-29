---
title: Modern Javascript iterable 객체
author: ngwoon
layout: post
categories:
- Javascript
tags:
- 자바스크립트
- Symbol.iterator
- next()
- 유사 배열
- Array.from
---

# [Modern Javascript] iterable 객체
- - -

본 내용은 [모던 자바스크립트 iterable 객체](https://ko.javascript.info/iterable)을 보고 공부, 정리한 내용입니다.<br/>

# iterable 객체

반복 가능한 객체는 배열을 일반화한 객체이다.<br/>
반복 가능하지 않은 객체에 이터러블 개념을 적용하면 for..of 반복문을 이용하여 객체를 순회할 수 있다.

---

# Symbol.iterator

객체를 이터러블하게 만드는 방법은 Symbol.iterator를 키로 하는 메서드를 만들어주면 된다.

```jsx
let range = {
  from: 1,
  to: 5
};

// 1. for..of 최초 호출 시, Symbol.iterator가 호출됩니다.
range[Symbol.iterator] = function() {

  // Symbol.iterator는 이터레이터 객체를 반환합니다.
  // 2. 이후 for..of는 반환된 이터레이터 객체만을 대상으로 동작하는데, 이때 다음 값도 정해집니다.
  return {
    current: this.from,
    last: this.to,

    // 3. for..of 반복문에 의해 반복마다 next()가 호출됩니다.
    next() {
      // 4. next()는 값을 객체 {done:.., value :...}형태로 반환해야 합니다.
      if (this.current <= this.last) {
        return { done: false, value: this.current++ };
      } else {
        return { done: true };
      }
    }
  };
};

// 이제 의도한 대로 동작합니다!
for (let num of range) {
  alert(num); // 1, then 2, 3, 4, 5
}
```

for..of 반복문이 동작하는 과정을 정리해보면 아래와 같다.

1. for..of 반복문 시작 시 해당 객체의 Symbol.iterator 메서드를 호출한다.<br/>
    이 메서드는 객체를 반환하는데, 이 객체 안에는 시작 인덱스, 끝 인덱스, next() 메서드가 존재한다. **for..of 반복문은 이 객체를 대상으로 동작한다.**

2. 각 반복이 시작되기 전 next() 메서드가 호출된다. 이 메서드는 객체를 리턴하는데, {done: , value: } 형태를 갖는다.<br/>
    done 속성이 false면 value가 채워져야하고, true이면 done 속성 하나만 있게 된다.<br/>
    **value 속성은 각 반복에서 사용될 수 있는 값이다.** 위 예시의 경우 value가 for..of 문의 num 변수에 할당된다.<br/>
    next() 호출 시 **시작 인덱스의 값을 증가시켜야** 유한한 반복 후 종료되는 이터러블 객체가 될 것이다.

3. 시작 인덱스가 끝 인덱스보다 커지기 전 까지 반복문이 동작한다.

---

# 문자열과 iterator

**문자열과 배열은 가장 대표적인 이터러블 객체이다.**<br/>
서로게이트 쌍으로 구성된 문자열에서도 for..of 문은 잘 동작한다.

```jsx
let str = '𝒳😂';
for (let char of str) {
    alert( char ); // 𝒳와 😂가 차례대로 출력됨
}
```

---

# 이터러블과 유사 배열

이터러블 객체와 유사 배열 객체를 혼동하지 말자. 이 둘은 배열과 비슷한 객체인 점을 제외하고는 다른 개념이다.

## 1. 이터러블 객체

이터러블 객체는 위에서 설명했던 것처럼 <br/>
- Symbol.iterator를 key로 하고
- 시작, 끝 인덱스, next() 메서드를 갖는 객체를 리턴하며
- next() 메서드가 {done: , value: } 형태의 객체를 리턴하는

객체를 의미한다.

## 2. 유사 배열 객체

유사 배열은 **숫자 인덱스와 length 속성을 갖는 객체**를 의미한다.

---

# Array.from

이터러블 객체나 유사 배열 객체는 배열에서 지원하는 push, pop과 같은 메서드를 사용할 수 없다. 이는 때때로 이러한 객체를 사용하기 불편하다고 느끼게 만든다.

**이터러블 객체나 유사 배열 객체를 진짜 배열로 만들어주는 메서드**가 Array.from이다.

```jsx
let arrayLike = {
  0: "Hello",
  1: "World",
  length: 2
};

let arr = Array.from(arrayLike); // (*)
alert(arr.pop()); // World (메서드가 제대로 동작합니다.)
```

Array.from(obj[, mapFn, thisArg]) 메서드는 이전 시간에 공부한 배열 메서드들과 마찬가지로 mapping function과 thisArg 인자를 선택적으로 넘겨줄 수 있다.<br/>
mapping function을 넘겨주게 되면, obj의 각 요소를 mapping function에서 계산한 후의 결과값으로 배열을 구성하여 리턴하게 된다.

```jsx
// range는 위 예시 내용 그대로
let arr = Array.from(range, num => num * num);
alert(arr); // 1,4,9,16,25
```

문자열도 Array.from을 이용하여 배열화할 수 있으며, 특히 서로게이트 쌍으로 이루어진 문자열을 slice할 때 진가를 발휘한다.

```jsx
function slice(str, start, end) {
  return Array.from(str).slice(start, end).join('');
}

let str = '𝒳😂𩷶';

alert( slice(str, 1, 3) ); // 😂𩷶

// 내장 순수 메서드는 서로게이트 쌍을 지원하지 않습니다.
alert( str.slice(1, 3) ); // 쓰레깃값 출력 (영역이 다른 특수 값)
```