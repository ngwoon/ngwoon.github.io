---
title: Modern Javascript WeakMap, WeakSet
author: ngwoon
layout: post
categories:
- javascript
tags:
- 자바스크립트
- WeakMap
- WeakSet
- 가비지 콜렉션
---

# [Modern Javascript] WeakMap, WeakSet
- - -

본 내용은 [모던 자바스크립트 위크맵과 위크셋](https://ko.javascript.info/weakmap-weakset)을 보고 공부, 정리한 내용입니다.<br/>

# WeakMap과 WeakSet

지난 시간에 자바스크립트의 Map과 Set에 대해 공부했다.<br/>
이번에는 Map과 Set의 일환인 WeakMap과 WeakSet에 대해 공부해보자.<br/>

Map은 객체를 key로 사용할 수 있다. 자바스크립트의 가비지 콜렉션 정책에 의해 객체가 코드 어딘가에서 참조될 경우 그 객체에 대한 가비지 콜렉션이 수행되지 않는다. 즉, 만약 Map에서 어떤 객체를 key로 사용중인 상태에서, 그 객체를 지우고 싶어서 해당 변수에 null을 덮어씌우더라도  해당 객체는 가비지 콜렉션 되지 않고 메모리에 남아있게 된다. 이렇게 사소한 부분이 쌓이고 쌓여 메모리 초과로 이어질 가능성이 존재하므로 꽤 주의해야 하는 상황이다.

```jsx
let john = { name: "John" };

let array = [ john ];

john = null; // 참조를 null로 덮어씀

// john을 나타내는 객체는 배열의 요소이기 때문에 가비지 컬렉터의 대상이 되지 않습니다.
// array[0]을 이용하면 해당 객체를 얻는 것도 가능합니다.
alert(JSON.stringify(array[0]));
```

---

# WeakMap

Map과 WeakMap의 차이는 크게 아래 3가지이다.
- WeakMap은 **key로 객체만을 사용**한다. (원시형 데이터 불가)
- key로 사용된 객체가 **WeakMap의 key 이외에 그 어디에서도 참조되지 않는다면, 가비지 콜렉션의 대상이 된다.**

    ```jsx
    let temp = new WeakMap();
    let obj = {};

    temp.set(obj, "temp");
    obj = null;
    alert("wait"); // 가비지 컬렉터가 언제 객체를 정리할지 몰라서 대기하는 용도
    console.log(temp);
    ```

    ![weakmap-key-garbage-collection](/assets/images/post/Javascript/WeakMap과%20WeakSet/weakmap-key-garbage-collection.png)

    위 코드에서 obj가 null로 덮어씌워진 이후 temp의 객체 key는 오직 이곳에서만 사용되고 있으므로 가비지 컬렉터에 의해 사라진다.

    만약 WeakMap이 key가 아니라 value로 객체를 참조중이면 어떻게 될까?

    ```jsx
    let temp = new WeakMap();
    let obj = {};

    temp.set(obj, obj2);
    obj2 = null;
    alert("wait"); // 가비지 컬렉터가 언제 객체를 정리할지 몰라서 대기하는 용도
    console.log(temp);
    ```

    ![weakmap-value-garbage-collection](/assets/images/post/Javascript/WeakMap과%20WeakSet/weakmap-value-garbage-collection.png)

    WeakMap이 value로 객체를 참조하는 경우 속성이 사라지지 않는다. 따라서 **객체가 WeakMap의 key로 사용될 때만** 가비지 컬렉터에 의해 메모리 회수가 이루어진다는 것을 확인할 수 있었다.

- WeakMap은 반복 작업, keys(), values(), entries()와 같은 메서드를 지원하지 않는다.
    **WeakMap의 key가 어느 시점에 가비지 컬렉터에 의해 회수될지 알 수 없기 때문에** WeakMap에서는 전체 key나 value를 얻는 작업은 할 수 없다.<br/>
    WeakMap에서 지원하는 메서드는 아래 4개가 전부이다.
    - WeakMap.get(key)
    - WeakMap.set(key, value)
    - WeakMap.delete(key)
    - WeakMap.has(key)

## WeakMap 사용 예시

### 추가 데이터

WeakMap은 부차적인 데이터를 저장할 곳이 필요할 때 유용하다.<br/>
사용자가 방문 횟수를 저장하는 상황을 생각해보자. key는 사용자를 지칭할 수 있는 객체이고, value는 그 사용자의 방문 횟수를 나타낸다.<br/>
만약 Map을 사용한다면, 해당 사용자의 방문 횟수를 더 이상 셀 필요가 없을 때 해당 객체를 null로 덮어씌워도 Map 내부의 key-value값은 사라지지 않아 메모리 누수현상이 발생한다.<br/>
이런 상황에서 WeakMap을 사용하면 더 이상 사용자의 방문 횟수를 셀 필요가 없는 시점에서 그 사용자의 객체 변수만 null로 바꾸어주면 방문 횟수는 자연스럽게 사라진다.

### 캐싱

WeakMap은 어떤 데이터를 일정 시간동안 저장해두는 동작에도 유용하다.<br/>
대표적으로 캐싱은 어떤 연산을 중복 수행하는 것을 막기 위해 사용한다. 연산 결과를 value로, 그 연산 결과에 접근할 수 있는 key를 객체로 하는 WeakMap을 이용하면 동일한 연산을 수행하지 않고 해당 객체를 key로 참조하여 연산 결과를 얻을 수 있다. 이후 해당 연산 결과가 필요하지 않다면 간단히 key로 사용된 객체의 참조를 지워주기만 하면 된다.

---

# WeakSet

WeakSet은 WeakMap과 약간 다른 자료구조이지만, 그 성질은 비슷하다.<br/>
- WeakSet에는 **객체형 데이터만 저장**할 수 있다.
- WeakSet에 저장된 객체가 다른 어느곳에서도 참조되지 않으면, 가비지 컬렉터에 의해 회수된다.

```jsx
let temp = new WeakSet();
let obj = {};

temp.add(obj);
obj = null;
alert("wait");
console.log(temp);
```

![weakset-garbage-collection](/assets/images/post/Javascript/WeakMap과%20WeakSet/weakset-garbage-collection.png)

WeakSet 역시 반복 작업 관련 메서드들은 호출할 수 없다. WeakSet에서 지원하는 메서드는 아래 3가지이다.<br/>
- WeakSet.add(value)
- WeakSet.has(value)
- WeakSet.delete(value)

## WeakSet의 사용 예시

WeakSet 또한 WeakMap과 마찬가지로 부차적인 데이터를 다룰 때 유용하다. 하지만 WeakMap만큼 복잡한 데이터를 다루는 상황에 쓰이기는 어렵다. 아래 예시와 같이 누군가의 방문 여부의 참, 거짓 정도를 판별하는 정도에 쓰일 수 있다.

```jsx
let visitedSet = new WeakSet();

let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };

visitedSet.add(john); // John이 사이트를 방문합니다.
visitedSet.add(pete); // 이어서 Pete가 사이트를 방문합니다.
visitedSet.add(john); // 이어서 John이 다시 사이트를 방문합니다.

// visitedSet엔 두 명의 사용자가 저장될 겁니다.

// John의 방문 여부를 확인해보겠습니다.
alert(visitedSet.has(john)); // true

// Mary의 방문 여부를 확인해보겠습니다.
alert(visitedSet.has(mary)); // false

john = null;

// visitedSet에서 john을 나타내는 객체가 자동으로 삭제됩니다.
```

---

# 정리

WeakMap과 WeakSet 예시를 보면 알겠지만 이들은 **부차적인 데이터**를 다루는 상황에서 유용하고, 그 데이터를 **임시 저장**, 사용하며 **필요에 따라 손쉽게 삭제**할 수 있는 상황에서 주로 사용됨을 알 수 있다.