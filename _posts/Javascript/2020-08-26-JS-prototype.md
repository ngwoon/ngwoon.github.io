---
title: Javascript prototype
author: ngwoon
layout: post
categories:
- Javascript
tags:
- 자바스크립트
- prototype
- prototype object
- constructor
---

# [Javascript] prototype
- - -

## prototype
JS는 프로토타입 기반 언어라고 불릴 만큼 prototype은 중요한 비중을 차지한다.

JS는 다른 객체 지향 언어와 달리 함수로 객체를 만들어 사용하고, 따라서 기본적으로 상속 기능을 지원하지 않는다. 이 때, prototype 속성을 사용하여 상속 기능을 모방할 수 있다.

우선 prototype이 정확히 무엇이고, JS 내에서 어떤 역할을 하는 속성인지 살펴보자.
<br/><br/>

## Prototype Object
함수가 정의될 때, 해당 함수에 대한 Prototype Object가 만들어진다.

이 Prototype Object는 해당 함수명.prototype으로 접근할 수 있다.

**prototype 속성은 함수에만 존재한다.**

```jsx
function test() {}
console.log(test.prototype);
```

![prototype_raw](/assets/images/post/Javascript/prototype/raw_prototype.png)

위 실행 결과를 보면 Prototype Object에는 constructor와 ``````__proto__`````` 속성이 있음을 알 수 있다.
<br/>

### constructor
생성자 함수를 가리키는 함수이다. new 키워드를 사용하여 객체를 생성하는 경우 Prototype Object 에 constructor가 만들어진다. 더 정확히 말하면, new 키워드와 특정 함수 호출이 함께 이루어지면 해당 함수의 constructor 함수가 호출되고, 이는 constructor가 가리키는 생성자 함수의 내용을 복사하여 객체로 만들어 리턴한다.

```jsx
function test() {this.name = "func test";}
test.prototype.name = "proto test";

var f1 = new test();
var f2 = new test();

f1.name = "f1";
f2.name = "f2";

console.log(f1.name);
console.log(f2.name);
console.log(Object.getPrototypeOf(f1));
console.log(Object.getPrototypeOf(f2));
```

![prototype_object](/assets/images/post/Javascript/prototype/prototype_object.png)

test() 생성자 함수를 통해 객체 f1 과 f2를 만들고 이들에게 각기 다른 이름을 부여했다. f1, f2, 그리고 f1과 f2의 Prototype Object를 출력해본 결과가 위 이미지이다.
<br/>

### [[Prototype]] 링크 ( ```__proto__``` )
위 출력 결과 이미지를 보면 f1과 f2의 Prototype Object가 test 함수의 Prototype Object임을 알 수 있다. 즉, 객체가 생성될 때 생성자 함수의 속성이 복사될 뿐만 아니라 그 함수의 Prototype Object의 참조도 함께 복사된다. 객체를 만들 때 사용된 생성자 함수의 Prototype Object의 참조를 가리키는 속성을 **[[Prototype]] 링크**라고 표현한다. 

(구글 크롬의 개발자 도구에선 ```__proto__```라고 표현된다.)

지금까지의 내용을 그림으로 요약하면 아래와 같다.

![summary](/assets/images/post/Javascript/prototype/summary.png)
<br/>

- **여기서 잠깐**

constructor와 [[Prototype]] 링크를 흐름 끊기지 않게 설명하려다 보니 객체가 속성을 찾는 과정을 설명하지 못했다. 인터프리터가 어떻게 속성을 찾는지는 매우 중요한 내용이므로 짧게라도 짚고 넘어가자. 객체 f1이 name 속성을 찾는 과정은 아래와 같다.

1. f1 내에 name 속성이 있는지 찾는다.
2. 만약 없다면, 자신의 Prototype Object에 name 속성이 있는지 찾아본다.
3. Prototype Object가 null일 때까지 탐색을 계속한다.

참고로 최상위 함수인 Object의 Prototype Object가 null이다. 이 예시의 경우 우선순위가 높은 f1 객체에 name 속성이 존재했기 때문에 f1의 [[Prototype]] 링크의 name 속성값이 출력되지 않았다. 만약 어디에도 name 속성이 없었다면, 인터프리터는 name속성을 찾기 위해 Prototype Object를 순서대로 탐색하다가 null을 만난 순간 해당 속성은 없다고 판단했을 것이다.
<br/><br/>

## prototype chain
지금까지 prototype 속성과 [[Prototype]] 링크를 살펴보면서 JS에서 Prototype Object가 서로 연결되는 기법을 통해 객체 간 연관성을 표현할 수 있음을 알았다. 이렇게 prototype 사이 연관되어 있는 상태를 **prototype chain**이라 한다.
<br/><br/>

## 참고
[https://medium.com/@pks2974/javascript-%EC%99%80-prototype-%ED%94%84%EB%A1%9C%ED%86%A0-%ED%83%80%EC%9E%85-515f759bff79](https://medium.com/@pks2974/javascript-%EC%99%80-prototype-%ED%94%84%EB%A1%9C%ED%86%A0-%ED%83%80%EC%9E%85-515f759bff79)
<br/><br/>
[https://velog.io/@adam2/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-Prototype-%EC%99%84%EB%B2%BD-%EC%A0%95%EB%A6%AC](https://velog.io/@adam2/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-Prototype-%EC%99%84%EB%B2%BD-%EC%A0%95%EB%A6%AC)